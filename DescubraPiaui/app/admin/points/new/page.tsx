'use client';
import { useState } from 'react';
import { createPoint } from '@/lib/pointsServer';
import { useRouter } from 'next/navigation';
import { TouristPoint, CATEGORIES } from '@/types';

// Define as propriedades que terão tipos diferentes no estado do formulário
type FormSpecificFields = {
  imageIds: string; // O input será uma string de IDs separados por vírgula
  latitude?: number | string; // O input pode ser uma string vazia ou um número
  longitude?: number | string; // O input pode ser uma string vazia ou um número
  cep?: string; // O input será uma string
};

// Cria o PointFormState omitindo os campos que terão tipos diferentes ou que não são relevantes para o formulário,
// e adiciona os tipos específicos do formulário.
type PointFormState = Omit<
  TouristPoint,
  'id' | 'createdAt' | 'updatedAt' | 'imageIds' | 'latitude' | 'longitude' | 'cep'
> & FormSpecificFields;

export default function NewPointPage() {
  const [form, setForm] = useState<PointFormState>({
    title: '',
    subtitle: '',
    description: '',
    descriptionLong: '',
    category: '',
    address: '',
    neighborhood: '',
    cep: '', // Inicializado como string vazia para o formulário
    latitude: '', // Inicializado como string vazia para o formulário
    longitude: '', // Inicializado como string vazia para o formulário
    imageIds: '', // Inicializado como string vazia para o formulário
    phone: '',
    schedule: '',
    published: true,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Transforma os dados do formulário para o formato esperado por TouristPoint
      const dataToCreate: Partial<TouristPoint> = {
        ...form, // Copia as propriedades que são compatíveis diretamente
        imageIds: form.imageIds.split(',').map((s: string) => s.trim()).filter(Boolean), // Converte string para array de strings, garantindo tipagem de 's'
        // Converte latitude/longitude de string para number, ou undefined se for string vazia
        latitude: typeof form.latitude === 'string' && form.latitude !== '' ? parseFloat(form.latitude) : (form.latitude as number | undefined),
        longitude: typeof form.longitude === 'string' && form.longitude !== '' ? parseFloat(form.longitude) : (form.longitude as number | undefined),
      };

      await createPoint(dataToCreate);
      setSuccess('Ponto criado com sucesso!');
      setTimeout(() => {
        router.push('/admin/points');
      }, 1500);
    } catch (err: any) {
      setError('Erro ao criar ponto: ' + (err.message || ''));
    }
  };

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">Novo Ponto Turístico</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-2xl mx-auto">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-3 mb-4 rounded" role="alert">
            <p className="font-bold">Erro!</p>
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 text-green-700 p-3 mb-4 rounded" role="alert">
            <p className="font-bold">Sucesso!</p>
            <p>{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
            <input name="title" id="title" placeholder="Título do Ponto" value={form.title || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">Subtítulo</label>
            <input name="subtitle" id="subtitle" placeholder="Subtítulo ou descrição curta" value={form.subtitle || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição Curta</label>
            <textarea name="description" id="description" placeholder="Descrição breve para o mapa" value={form.description || ''} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required></textarea>
          </div>

          <div className="col-span-1 md:col-span-2">
            <label htmlFor="descriptionLong" className="block text-sm font-medium text-gray-700">Descrição Longa</label>
            <textarea name="descriptionLong" id="descriptionLong" placeholder="Descrição completa para página de detalhes (opcional)" value={form.descriptionLong || ''} onChange={handleChange} rows={5} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoria</label>
            <select name="category" id="category" value={form.category || ''} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" required>
              <option value="">Selecione uma categoria</option>
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Endereço</label>
            <input name="address" id="address" placeholder="Endereço completo" value={form.address || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
          </div>

          <div>
            <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">Bairro</label>
            <input name="neighborhood" id="neighborhood" placeholder="Bairro" value={form.neighborhood || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>

          <div>
            <label htmlFor="cep" className="block text-sm font-medium text-gray-700">CEP</label>
            <input name="cep" id="cep" placeholder="CEP" value={form.cep || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone</label>
            <input name="phone" id="phone" placeholder="(XX) XXXX-XXXX" value={form.phone || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>

          <div>
            <label htmlFor="schedule" className="block text-sm font-medium text-gray-700">Horário de Funcionamento</label>
            <input name="schedule" id="schedule" placeholder="Ex: Seg-Sex, 9h-18h" value={form.schedule || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>

          <div>
            <label htmlFor="imageIds" className="block text-sm font-medium text-gray-700">IDs do Google Drive (separados por vírgula)</label>
            <input name="imageIds" id="imageIds" placeholder="ID1, ID2, ID3..." value={form.imageIds || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>

          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">Latitude</label>
            <input type="number" step="any" name="latitude" id="latitude" placeholder="-5.0892" value={form.latitude || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>

          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">Longitude</label>
            <input type="number" step="any" name="longitude" id="longitude" placeholder="-42.8019" value={form.longitude || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>

          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <input type="checkbox" name="published" id="published" checked={form.published} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label htmlFor="published" className="ml-2 block text-sm font-medium text-gray-700">Publicado</label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/points')}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Criar Ponto
          </button>
        </div>
      </form>
    </div>
  );
}