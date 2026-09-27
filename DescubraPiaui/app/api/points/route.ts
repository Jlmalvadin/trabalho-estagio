import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { TouristPoint } from '@/types';
import { geocodeAddress } from '@/lib/geocode';

const DATA_FILE = path.join(process.cwd(), 'data', 'points.json');

// Helper para ler pontos do arquivo JSON
async function readPoints(): Promise<TouristPoint[]> {
  try {
    const fileContent = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Erro ao ler pontos:', error);
    return [];
  }
}

// Helper para escrever pontos no arquivo JSON
async function writePoints(points: TouristPoint[]): Promise<void> {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(points, null, 2), 'utf-8');
  } catch (error) {
    console.error('Erro ao escrever pontos:', error);
    throw error;
  }
}

// GET - Listar pontos turísticos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';
    const query = searchParams.get('q')?.toLowerCase();
    const category = searchParams.get('category');
    
    let points = await readPoints();
    
    // Filtrar apenas pontos publicados (exceto se all=true)
    if (!all) {
      points = points.filter(point => point.published);
    }
    
    // Filtrar por busca
    if (query) {
      points = points.filter(point =>
        point.title.toLowerCase().includes(query) ||
        point.description.toLowerCase().includes(query) ||
        point.neighborhood?.toLowerCase().includes(query) ||
        point.address.toLowerCase().includes(query)
      );
    }
    
    // Filtrar por categoria
    if (category) {
      points = points.filter(point => point.category === category);
    }
    
    return NextResponse.json(points);
  } catch (error) {
    console.error('Erro ao buscar pontos:', error);
    return NextResponse.json({ error: 'Erro ao buscar pontos' }, { status: 500 });
  }
}

// POST - Criar novo ponto turístico
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let points = await readPoints();
    
    // Tenta geocodificar se lat/lng não forem fornecidas
    if (body.address && (body.latitude === undefined || body.longitude === undefined)) {
      const geoResult = await geocodeAddress(body.address, body.cep, body.neighborhood, body.city);
      if (geoResult) {
        body.latitude = geoResult.lat;
        body.longitude = geoResult.lng;
      } else {
        console.warn(`Não foi possível geocodificar o endereço para: ${body.address}`);
      }
    }

    const newPoint: TouristPoint = {
      ...body,
      id: Date.now().toString(), // ID simples baseado em timestamp
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    points.push(newPoint);
    await writePoints(points);
    
    return NextResponse.json(newPoint, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar ponto:', error);
    return NextResponse.json({ error: 'Erro ao criar ponto' }, { status: 500 });
  }
}

// PUT - Atualizar ponto turístico
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }
    
    let points = await readPoints();
    const index = points.findIndex(p => p.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Ponto não encontrado' }, { status: 404 });
    }

    // Tenta geocodificar se endereço for atualizado e lat/lng estiverem ausentes
    if (updateData.address && (updateData.latitude === undefined || updateData.longitude === undefined)) {
      const geoResult = await geocodeAddress(updateData.address, updateData.cep, updateData.neighborhood, updateData.city);
      if (geoResult) {
        updateData.latitude = geoResult.lat;
        updateData.longitude = geoResult.lng;
      } else {
        console.warn(`Não foi possível geocodificar o endereço atualizado para: ${updateData.address}`);
      }
    }
    
    points[index] = {
      ...points[index],
      ...updateData,
      id, // Manter o ID original
      updatedAt: new Date(),
    };
    
    await writePoints(points);
    
    return NextResponse.json(points[index]);
  } catch (error) {
    console.error('Erro ao atualizar ponto:', error);
    return NextResponse.json({ error: 'Erro ao atualizar ponto' }, { status: 500 });
  }
}

// DELETE - Remover ponto turístico
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }
    
    let points = await readPoints();
    const filteredPoints = points.filter(p => p.id !== id);
    
    if (filteredPoints.length === points.length) {
      return NextResponse.json({ error: 'Ponto não encontrado' }, { status: 404 });
    }
    
    await writePoints(filteredPoints);
    
    return NextResponse.json({ message: 'Ponto removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover ponto:', error);
    return NextResponse.json({ error: 'Erro ao remover ponto' }, { status: 500 });
  }
}