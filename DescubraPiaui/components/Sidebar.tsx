'use client';

import { useState, useMemo } from 'react';
import { TouristPoint, CATEGORIES, RegionScope, getPointCity } from '@/types';
import { getDriveImageUrl } from '@/lib/driveUtils'; // Importe a função para obter URLs de imagem

interface SidebarProps {
  points: TouristPoint[];
  selectedPoint?: string | null;
  onPointSelect: (pointId: string) => void;
  scope: RegionScope;
  onScopeChange: (scope: RegionScope) => void;
}

const SCOPE_TABS: { value: RegionScope; label: string }[] = [
  { value: 'teresina', label: 'Teresina' },
  { value: 'piaui', label: 'Explore o Piauí' },
];

export default function Sidebar({ points, selectedPoint, onPointSelect, scope, onScopeChange }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Filtrar pontos baseado na busca e categoria
  const filteredPoints = useMemo(() => {
    return points.filter(point => {
      const matchesSearch = searchQuery === '' || 
        point.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        point.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        point.neighborhood?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getPointCity(point).toLowerCase().includes(searchQuery.toLowerCase()) ||
        point.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === '' || point.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [points, searchQuery, selectedCategory]);

  // Agrupar por categoria
  const pointsByCategory = useMemo(() => {
    const grouped: { [key: string]: number } = {};
    points.forEach(point => {
      grouped[point.category] = (grouped[point.category] || 0) + 1;
    });
    return grouped;
  }, [points]);

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header com gradiente */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg">
        <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c-4.418 0-8 3.582-8 8 0 4.218 5.61 10.592 7.234 12.38.384.41.986.41 1.37 0 1.624-1.788 7.234-8.162 7.234-12.38 0-4.418-3.582-8-8-8zm0 11.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>
          Descubra Piauí
        </h2>
        <p className="text-sm opacity-90 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0 18c4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8 3.589 8 8 8zm0-16c-3.309 0-6 2.691-6 6s2.691 6 6 6 6-2.691 6-6-2.691-6-6-6zm0 10c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z"/></svg>
          {scope === 'teresina' ? 'Capital do Piauí' : 'Pontos turísticos pelo estado'}
        </p>
        <div className="mt-3 flex gap-2 text-xs">
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="font-semibold">{points.length}</span> locais
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            Interativo
          </div>
        </div>

        {/* Alternar entre a capital e o restante do estado */}
        <div className="mt-3 grid grid-cols-2 gap-1 p-1 bg-white/20 rounded-lg text-sm">
          {SCOPE_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => {
                if (tab.value === scope) return;
                setSelectedCategory('');
                onScopeChange(tab.value);
              }}
              className={`py-1.5 rounded-md font-semibold transition-all ${
                scope === tab.value
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Campo de busca aprimorado */}
      <div className="p-4 border-b border-gray-200 bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar ponto turístico..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 text-sm"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          )}
        </div>
      </div>

      {/* Filtro de categorias com pills e alternância de visualização */}
      <div className="p-4 border-b border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Categorias:
          </label>
          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            className="text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1 rounded-md transition-colors text-gray-600 dark:text-gray-200"
            title={viewMode === 'list' ? 'Ver em grade' : 'Ver em lista'}
          >
            {viewMode === 'list' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg> // Ícone de lista
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg> // Ícone de grade
            )}
          </button>
        </div>
        
        {/* Quick Category Pills */}
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              selectedCategory === ''
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Todos ({points.length})
          </button>
          {CATEGORIES.filter(cat => pointsByCategory[cat.value] > 0).map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(selectedCategory === cat.value ? '' : cat.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                selectedCategory === cat.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {cat.icon} {cat.label} ({pointsByCategory[cat.value]})
            </button>
          ))}
        </div>
      </div>

      {/* Estatísticas de busca */}
      <div className="p-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <p className="font-bold text-blue-600 flex items-center gap-2">
            <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0 18c4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8 3.589 8 8 8zm0-16c-3.309 0-6 2.691-6 6s2.691 6 6 6 6-2.691 6-6-2.691-6-6-6zm0 10c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z"/></svg>
            {filteredPoints.length} {filteredPoints.length === 1 ? 'ponto encontrado' : 'pontos encontrados'}
          </p>
          {searchQuery && (
            <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
              Buscando: &quot;{searchQuery}&quot;
            </p>
          )}
        </div>
      </div>

      {/* Lista de Pontos */}
      <div className="flex-1 overflow-y-auto p-3">
        {filteredPoints.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">😔</div>
            <p className="text-lg font-semibold mb-2 dark:text-gray-300">Nenhum resultado encontrado</p>
            <p className="text-sm dark:text-gray-400">Tente ajustar os filtros de busca.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3' : 'space-y-3'}>
            {filteredPoints.map((point, index) => {
              const category = CATEGORIES.find(c => c.value === point.category);
              const isSelected = point.id === selectedPoint;
              const imageUrl = point.imageIds && point.imageIds.length > 0
                ? getDriveImageUrl(point.imageIds[0], 'small')
                : null;

              return (
                <div
                  key={point.id}
                  onClick={() => onPointSelect(point.id)}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className={`
                    group p-4 bg-white dark:bg-gray-800 rounded-xl cursor-pointer transition-all duration-300
                    border shadow-sm hover:shadow-lg animate-fadeIn
                    ${isSelected
                      ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900 transform scale-[1.02] shadow-md'
                      : 'border-gray-200 hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-600'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    {imageUrl && (
                      <img src={imageUrl} alt={point.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0 shadow-sm" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 dark:text-gray-100 text-base mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {point.title}
                      </h4>
                      {point.subtitle && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">
                          {point.subtitle}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-x-3 gap-y-1 items-center text-sm text-gray-600 dark:text-gray-400">
                        {(scope === 'piaui' || point.neighborhood) && (
                          <span className="inline-flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0 18c4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8 3.589 8 8 8zm0-14c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zm-4 4h8v2h-8v-2z"/></svg>
                            {scope === 'piaui' ? getPointCity(point) : point.neighborhood}
                          </span>
                        )}
                        {point.category && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full dark:bg-blue-900 dark:text-blue-200">
                            {category?.icon} {category?.label}
                          </span>
                        )}
                        {point.phone && (
                          <span className="inline-flex items-center gap-1 text-blue-500">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M20 22.621l-3.521-6.795c-.098-.21-.316-.35-.558-.35-1.583 0-1.787-.723-4.148-3.084-2.361-2.361-3.084-2.565-3.084-4.148 0-.242-.14-.46-.35-.558l-6.795-3.521c-.219-.113-.483-.113-.702 0l-1.636.848c-.071.037-.142.062-.213.083-1.071.306-1.758 1.401-1.758 2.621 0 5.484 2.148 10.323 5.467 13.642 3.319 3.319 8.158 5.467 13.642 5.467 1.22 0 2.315-.687 2.621-1.758.02-.07.046-.141.083-.213l.848-1.636c.113-.219.113-.483 0-.702z"/></svg>
                          </span>
                        )}
                      </div>
                      {point.description && viewMode === 'list' && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                          {point.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer com estatísticas */}
      <div className="p-4 bg-gray-800 dark:bg-gray-900 text-white text-center text-sm">
        <p className="mb-1 opacity-80">
          {scope === 'teresina' ? 'Descubra Piauí • Teresina' : 'Descubra Piauí • Explore o estado'}
        </p>
        <div className="flex justify-center gap-3 opacity-70">
          <span>{points.length} Pontos</span>
          <span>•</span>
          <span>{Object.keys(pointsByCategory).length} Categorias</span>
        </div>
      </div>
    </div>
  );
}