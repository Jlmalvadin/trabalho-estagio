// Funções CRUD e estatísticas para pontos turísticos (server-side)
import fs from 'fs';
import path from 'path';
import { TouristPoint, CategoryType, CATEGORIES } from '@/types';
import { geocodeAddress } from './geocode'; // Importar a função de geocodificação

const DATA_PATH = path.resolve(process.cwd(), 'data/points.json');

function readPoints(): TouristPoint[] {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error("Erro ao ler points.json, retornando array vazio.", error);
    return [];
  }
}

function writePoints(points: TouristPoint[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(points, null, 2), 'utf-8');
}

export function getPoints({ all = false } = {}): TouristPoint[] {
  const points = readPoints();
  return all ? points : points.filter(p => p.published);
}

export function getPointById(id: string): TouristPoint | undefined {
  return readPoints().find(p => p.id === id);
}

export async function createPoint(data: Partial<TouristPoint>): Promise<TouristPoint> {
  const points = readPoints();
  const id = (Math.max(...points.map(p => Number(p.id || 0)), 0) + 1).toString(); // Garantir ID único e numérico
  const now = new Date();

  // Tentar geocodificar se lat/lng não forem fornecidas
  if (data.address && (data.latitude === undefined || data.longitude === undefined)) {
    const geoResult = await geocodeAddress(data.address, data.cep, data.neighborhood, data.city);
    if (geoResult) {
      data.latitude = geoResult.lat;
      data.longitude = geoResult.lng;
    } else {
      console.warn(`Não foi possível geocodificar o endereço para: ${data.address}`);
    }
  }

  const point: TouristPoint = {
    id,
    title: data.title || 'Novo Ponto',
    subtitle: data.subtitle || '',
    description: data.description || '',
    descriptionLong: data.descriptionLong || '',
    category: data.category || 'outro',
    address: data.address || '',
    neighborhood: data.neighborhood || '',
    cep: data.cep || '', // Adicionar CEP aqui
    latitude: data.latitude,
    longitude: data.longitude,
    imageIds: data.imageIds || [],
    phone: data.phone || '',
    schedule: data.schedule || '',
    published: data.published ?? false, // Padrão para não publicado ao criar, para revisão
    createdAt: now,
    updatedAt: now,
  };
  points.push(point);
  writePoints(points);
  return point;
}

export async function updatePoint(id: string, data: Partial<TouristPoint>): Promise<TouristPoint | undefined> {
  const points = readPoints();
  const idx = points.findIndex(p => p.id === id);
  if (idx === -1) return undefined;
  const now = new Date();

  // Tentar geocodificar se endereço for atualizado e lat/lng estiverem ausentes
  if (data.address && (data.latitude === undefined || data.longitude === undefined)) {
    const geoResult = await geocodeAddress(data.address, data.cep, data.neighborhood, data.city);
    if (geoResult) {
      data.latitude = geoResult.lat;
      data.longitude = geoResult.lng;
    } else {
      console.warn(`Não foi possível geocodificar o endereço atualizado para: ${data.address}`);
    }
  }

  points[idx] = {
    ...points[idx],
    ...data,
    updatedAt: now,
    imageIds: Array.isArray(data.imageIds) ? data.imageIds : points[idx].imageIds,
  };
  writePoints(points);
  return points[idx];
}

export function deletePoint(id: string): boolean {
  const points = readPoints();
  const filtered = points.filter(p => p.id !== id);
  if (filtered.length === points.length) return false; // Não encontrou o ponto
  writePoints(filtered);
  return true;
}

export function getPointsStats() {
  const points = readPoints();
  const total = points.length;
  const categories = CATEGORIES.map(cat => ({
    value: cat.value,
    label: cat.label,
    count: points.filter(p => p.category === cat.value).length,
  }));
  return { total, categories };
}