// Tipos principais da aplicação

export interface TouristPoint {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  descriptionLong?: string;
  category: string;
  address: string;
  neighborhood?: string;
  city?: string; // Município (ausente = Teresina)
  cep?: string; // Adicionado campo CEP para geocodificação
  latitude?: number;
  longitude?: number;
  imageIds: string[]; // Array de file IDs do Google Drive
  phone?: string;
  schedule?: string;
  published: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MapCenter {
  lat: number;
  lng: number;
}

export interface GeocodingResult {
  lat: number;
  lng: number;
}

export interface FilterOptions {
  query?: string;
  category?: string;
  neighborhood?: string;
}

export type CategoryType = 
  | 'museu'
  | 'parque'
  | 'monumento'
  | 'igreja'
  | 'praça'
  | 'centro-cultural'
  | 'praia'
  | 'natureza'
  | 'sitio-arqueologico'
  | 'centro-historico'
  | 'outro';

export const CATEGORIES: { value: CategoryType; label: string; icon: string }[] = [
  { value: 'museu', label: 'Museu', icon: '🏛️' },
  { value: 'parque', label: 'Parque', icon: '🌳' },
  { value: 'monumento', label: 'Monumento', icon: '🗿' },
  { value: 'igreja', label: 'Igreja', icon: '⛪' },
  { value: 'praça', label: 'Praça', icon: '🏞️' },
  { value: 'centro-cultural', label: 'Centro Cultural', icon: '🎭' },
  { value: 'praia', label: 'Praia', icon: '🏖️' },
  { value: 'natureza', label: 'Natureza', icon: '⛰️' },
  { value: 'sitio-arqueologico', label: 'Sítio Arqueológico', icon: '🦴' },
  { value: 'centro-historico', label: 'Centro Histórico', icon: '🏘️' },
  { value: 'outro', label: 'Outro', icon: '📍' },
];

export const TERESINA_CENTER: MapCenter = {
  lat: -5.0892,
  lng: -42.8019,
};

export const DEFAULT_ZOOM = 12;

export const DEFAULT_CITY = 'Teresina';

export function getPointCity(point: Pick<TouristPoint, 'city'>): string {
  return point.city || DEFAULT_CITY;
}

// Recorte do mapa: só a capital ou o restante do estado
export type RegionScope = 'teresina' | 'piaui';

export function isInScope(point: Pick<TouristPoint, 'city'>, scope: RegionScope): boolean {
  const inTeresina = getPointCity(point) === DEFAULT_CITY;
  return scope === 'teresina' ? inTeresina : !inTeresina;
}
export const GEOCODING_DELAY = 1200; // ms