import { GeocodingResult, DEFAULT_CITY } from '@/types';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const USER_AGENT = 'DescubraPiaui/1.0 (joaolucas.m.s.carvalho@gmail.com)'; // É importante usar um user-agent único e com contato
const GEOCODING_DELAY = 1200; // Respeitar limite da API (1 requisição por segundo, com margem)

// Extrai o nome da rua do endereço completo
export function extractStreetName(address: string): string {
  if (!address) return '';
  
  let street = address.split(',')[0];
  street = street.replace(/\s*-\s*S\/N/gi, '');
  street = street.replace(/\s*N°?\s*\d+/gi, '');
  street = street.replace(/\s*,.*$/g, '');
  
  return street.trim();
}

// Função auxiliar para delay (respeita limites da API)
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Estratégia 1: Buscar por endereço completo
async function geocodeByAddress(address: string, city: string): Promise<GeocodingResult | null> {
  try {
    const street = extractStreetName(address);
    const query = `${street}, ${city}, Piauí, Brasil`;
    
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(query)}&limit=3&countrycodes=br`,
      {
        headers: {
          'User-Agent': USER_AGENT,
        },
      }
    );
    
    if (!response.ok) {
        console.error(`Erro na requisição Nominatim por endereço: ${response.status} ${response.statusText}`);
        return null;
    }
    
    const data = await response.json();
    
    // Filtrar resultados que realmente são da cidade (ou ao menos do Piauí)
    const filtered = data.filter((item: any) =>
      (item.display_name?.includes(city) || item.display_name?.includes('Piauí'))
    );
    
    if (filtered && filtered.length > 0) {
      return {
        lat: parseFloat(filtered[0].lat),
        lng: parseFloat(filtered[0].lon),
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao geocodificar por endereço:', error);
    return null;
  }
}

// Estratégia 2: Buscar por CEP
async function geocodeByCep(cep: string, city: string): Promise<GeocodingResult | null> {
  try {
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length < 8) return null;
    
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/search?format=json&postalcode=${cleanCep}&city=${encodeURIComponent(city)}&country=Brazil&limit=1`,
      {
        headers: {
          'User-Agent': USER_AGENT,
        },
      }
    );
    
    if (!response.ok) {
        console.error(`Erro na requisição Nominatim por CEP: ${response.status} ${response.statusText}`);
        return null;
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      // Adiciona pequena variação aleatória para evitar sobreposição de marcadores
      const randomLat = (Math.random() - 0.5) * 0.002;
      const randomLng = (Math.random() - 0.5) * 0.002;
      
      return {
        lat: parseFloat(data[0].lat) + randomLat,
        lng: parseFloat(data[0].lon) + randomLng,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao geocodificar por CEP:', error);
    return null;
  }
}

// Estratégia 3: Buscar por bairro
async function geocodeByNeighborhood(neighborhood: string, city: string): Promise<GeocodingResult | null> {
  try {
    const query = `${neighborhood}, ${city}, PI, Brasil`;
    
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
      {
        headers: {
          'User-Agent': USER_AGENT,
        },
      }
    );
    
    if (!response.ok) {
        console.error(`Erro na requisição Nominatim por bairro: ${response.status} ${response.statusText}`);
        return null;
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      // Adiciona maior variação aleatória para bairros
      const randomLat = (Math.random() - 0.5) * 0.01;
      const randomLng = (Math.random() - 0.5) * 0.01;
      
      return {
        lat: parseFloat(data[0].lat) + randomLat,
        lng: parseFloat(data[0].lon) + randomLng,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao geocodificar por bairro:', error);
    return null;
  }
}

// Função principal de geocodificação com múltiplas estratégias e fallback
export async function geocodeAddress(
  address?: string,
  cep?: string,
  neighborhood?: string,
  cityName?: string
): Promise<GeocodingResult | null> {
  const city = cityName || DEFAULT_CITY;
  try {
    // Estratégia 1: Tentar por endereço completo
    if (address) {
      console.log(`Tentando geocodificar por endereço: ${address}`);
      const result = await geocodeByAddress(address, city);
      if (result) {
        console.log('✓ Sucesso com endereço');
        return result;
      }
      await delay(GEOCODING_DELAY);
    }
    
    // Estratégia 2: Tentar por CEP
    if (cep) {
      console.log(`Tentando geocodificar por CEP: ${cep}`);
      const result = await geocodeByCep(cep, city);
      if (result) {
        console.log('✓ Sucesso com CEP');
        return result;
      }
      await delay(GEOCODING_DELAY);
    }
    
    // Estratégia 3: Tentar por bairro
    if (neighborhood) {
      console.log(`Tentando geocodificar por bairro: ${neighborhood}`);
      const result = await geocodeByNeighborhood(neighborhood, city);
      if (result) {
        console.log('✓ Sucesso com bairro');
        return result;
      }
    }
    
    console.log('✗ Falha em todas as estratégias de geocodificação');
    return null;
  } catch (error) {
    console.error('Erro geral na geocodificação:', error);
    return null;
  }
}

// Geocodificação em lote com controle de taxa
export async function geocodeBatch(
  points: Array<{ address?: string; cep?: string; neighborhood?: string; city?: string }>,
  onProgress?: (current: number, total: number) => void
): Promise<Array<GeocodingResult | null>> {
  const results: Array<GeocodingResult | null> = [];
  
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const result = await geocodeAddress(point.address, point.cep, point.neighborhood, point.city);
    results.push(result);
    
    if (onProgress) {
      onProgress(i + 1, points.length);
    }
    
    // Delay entre requisições (exceto na última)
    if (i < points.length - 1) {
      await delay(GEOCODING_DELAY);
    }
  }
  
  return results;
}