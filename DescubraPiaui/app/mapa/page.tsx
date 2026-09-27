'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { TouristPoint, RegionScope, isInScope } from '@/types';
import Sidebar from '@/components/Sidebar';

// Importar Map dinamicamente para evitar problemas de SSR
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Carregando mapa...</p>
      </div>
    </div>
  ),
});

export default function MapaPage() {
  const [points, setPoints] = useState<TouristPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [scope, setScope] = useState<RegionScope>('teresina');

  // Permite abrir direto no recorte do estado via /mapa?regiao=piaui
  useEffect(() => {
    const regiao = new URLSearchParams(window.location.search).get('regiao');
    if (regiao === 'piaui') setScope('piaui');
  }, []);

  const scopedPoints = useMemo(
    () => points.filter(point => isInScope(point, scope)),
    [points, scope]
  );

  const handleScopeChange = (newScope: RegionScope) => {
    setScope(newScope);
    setSelectedPoint(null);
    const url = new URL(window.location.href);
    if (newScope === 'piaui') url.searchParams.set('regiao', 'piaui');
    else url.searchParams.delete('regiao');
    window.history.replaceState(null, '', url);
  };

  // Carregar pontos turísticos
  useEffect(() => {
    async function loadPoints() {
      try {
        const response = await fetch('/api/points');
        if (!response.ok) throw new Error('Erro ao carregar pontos');
        
        const data = await response.json();
        setPoints(data);
      } catch (error) {
        console.error('Erro ao carregar pontos:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPoints();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-green-600 to-yellow-500">
        <div className="text-center text-white">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Carregando Pontos Turísticos</h2>
          <p className="text-blue-100">Descubra Piauí</p>
        </div>
      </div>
    );
  }

  return (
    <main className="h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar - Responsivo */}
      <div className="w-full md:w-96 h-1/2 md:h-full flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-200 bg-white shadow-lg overflow-hidden">
        <Sidebar
          points={scopedPoints}
          selectedPoint={selectedPoint}
          onPointSelect={setSelectedPoint}
          scope={scope}
          onScopeChange={handleScopeChange}
        />
      </div>

      {/* Map */}
      <div className="flex-1 h-1/2 md:h-full">
        <Map
          points={scopedPoints}
          scope={scope}
          selectedPoint={selectedPoint}
          onMarkerClick={setSelectedPoint}
        />
      </div>
    </main>
  );
}