'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { TouristPoint, TERESINA_CENTER, DEFAULT_ZOOM, CATEGORIES, RegionScope, getPointCity } from '@/types';
import { getDriveImageUrl } from '@/lib/driveUtils';

interface MapComponentProps {
  points: TouristPoint[];
  scope?: RegionScope;
  selectedPoint?: string | null;
  onMarkerClick?: (pointId: string) => void;
}

export default function MapComponent({ points, scope = 'teresina', selectedPoint, onMarkerClick }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.MarkerClusterGroup | null>(null);
  const markerMapRef = useRef<Map<string, L.Marker>>(new Map());
  const [mapLoaded, setMapLoaded] = useState(false);

  // Inicializar mapa
  useEffect(() => {
    if (typeof window === 'undefined' || mapLoaded) return;

    const map = L.map('map', {
      center: [TERESINA_CENTER.lat, TERESINA_CENTER.lng],
      zoom: DEFAULT_ZOOM,
      zoomControl: false, // Desabilitar controle padrão para adicionar customizado
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Adicionar controle de zoom customizado
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Criar grupo de clusters
    const markerClusterGroup = L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true,
      disableClusteringAtZoom: 16,
      chunkedLoading: true,
      iconCreateFunction: function (cluster) {
        const count = cluster.getChildCount();
        let sizeClass = 'marker-cluster-small';
        if (count > 10) sizeClass = 'marker-cluster-large';
        else if (count > 5) sizeClass = 'marker-cluster-medium';

        return L.divIcon({
          html: `<div class="flex items-center justify-center h-full w-full rounded-full bg-blue-500 text-white font-bold text-sm">${count}</div>`,
          className: `marker-cluster ${sizeClass}`,
          iconSize: L.point(40, 40),
        });
      },
    });

    map.addLayer(markerClusterGroup);

    mapRef.current = map;
    markersRef.current = markerClusterGroup;
    setMapLoaded(true);

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = null;
      setMapLoaded(false);
    };
  }, []);

  // Atualizar marcadores quando os pontos mudarem
  useEffect(() => {
    if (!mapRef.current || !markersRef.current || !mapLoaded) return;

    // Limpar marcadores existentes
    markersRef.current.clearLayers();
    markerMapRef.current.clear();

    // Adicionar novos marcadores
    points.forEach(point => {
      if (!point.latitude || !point.longitude) return;

      // Usar um ícone SVG ou customizado para o marcador individual
      const categoryIconSvg = `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="${getCategorySvgPath(point.category)}"></path></svg>`;
      const icon = createCustomIcon(categoryIconSvg, point.category);

      const marker = L.marker([point.latitude, point.longitude], {
        icon,
        title: point.title,
      });

      // Criar conteúdo do popup
      const popupContent = createPopupContent(point);
      marker.bindPopup(popupContent, { maxWidth: 300 });

      // Evento de clique
      marker.on('click', () => {
        if (onMarkerClick) {
          onMarkerClick(point.id);
        }
      });

      markersRef.current!.addLayer(marker);
      markerMapRef.current.set(point.id, marker);
    });

    // Ajustar visualização para mostrar todos os marcadores
    if (points.length > 0 && markersRef.current.getBounds().isValid()) {
      setTimeout(() => {
        mapRef.current!.fitBounds(markersRef.current!.getBounds(), {
          padding: [50, 50],
          maxZoom: 13,
        });
      }, 100);
    }
  }, [points, mapLoaded, onMarkerClick]);

  // Centralizar no ponto selecionado
  useEffect(() => {
    if (!mapRef.current || !selectedPoint) return;

    const marker = markerMapRef.current.get(selectedPoint);
    if (marker) {
      const latLng = marker.getLatLng();
      mapRef.current.setView(latLng, 16, { animate: true });
      marker.openPopup();
    }
  }, [selectedPoint]);

  return (
    <div className="relative w-full h-full">
      <div id="map" className="w-full h-full rounded-lg shadow-lg" />
      
      {/* Control Panel */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2 p-2 bg-white rounded-lg shadow-md">
        {/* Botão Centralizar (só faz sentido no recorte da capital) */}
        {scope === 'teresina' && (
        <button
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.setView([TERESINA_CENTER.lat, TERESINA_CENTER.lng], DEFAULT_ZOOM, {
                animate: true,
              });
            }
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-all flex items-center justify-center text-sm"
          title="Centralizar em Teresina"
        >
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-4.418 0-8 3.582-8 8 0 4.218 5.61 10.592 7.234 12.38.384.41.986.41 1.37 0 1.624-1.788 7.234-8.162 7.234-12.38 0-4.418-3.582-8-8-8zm0 11.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>
          Centralizar
        </button>
        )}

        {/* Mostrar todos os pontos */}
        <button
          onClick={() => {
            if (mapRef.current && markersRef.current && markersRef.current.getBounds().isValid()) {
              mapRef.current.fitBounds(markersRef.current.getBounds(), {
                padding: [50, 50],
                maxZoom: 14,
              });
            }
          }}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md shadow-sm transition-all flex items-center justify-center text-sm"
          title="Ver todos os pontos"
        >
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0 18c4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8 3.589 8 8 8zm0-16c-3.309 0-6 2.691-6 6s2.691 6 6 6 6-2.691 6-6-2.691-6-6-6zm0 10c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z"/></svg>
          Ver Todos
        </button>

        {/* Info Badge */}
        {points.length > 0 && (
          <div className="bg-gray-100 text-gray-700 text-xs py-2 px-3 rounded-md font-medium text-center">
            <span className="font-bold text-blue-600">{points.length}</span> pontos no mapa
          </div>
        )}
      </div>

      {/* Loading indicator when no points */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-[2000] rounded-lg">
          <div className="text-center">
            <div className="text-4xl mb-2 animate-bounce">🌍</div> {/* Ícone mais neutro */}
            <p className="text-gray-600 font-medium">Carregando mapa...</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Retorna o path SVG para o ícone da categoria (exemplo com alguns, você pode expandir)
function getCategorySvgPath(category: string): string {
  switch (category) {
    case 'museu':
      return "M3 6l9 6 9-6-9-6-9 6zm0 6l9 6 9-6-9-6-9 6zm0 6l9 6 9-6-9-6-9 6z"; // Exemplo genérico
    case 'parque':
      return "M10 1v2c-3.86 0-7 3.14-7 7s3.14 7 7 7v2c-4.966 0-9-4.034-9-9s4.034-9 9-9zm12 11h-2v2h2v-2zm-12-8v2c-1.654 0-3 1.346-3 3s1.346 3 3 3v2c-2.757 0-5-2.243-5-5s2.243-5 5-5zm10 2c-3.86 0-7 3.14-7 7v2c4.966 0 9-4.034 9-9s-4.034-9-9-9zm-2 16h2v-2h-2v2z"; // Árvore simples
    case 'monumento':
      return "M12 2c-4.418 0-8 3.582-8 8 0 4.218 5.61 10.592 7.234 12.38.384.41.986.41 1.37 0 1.624-1.788 7.234-8.162 7.234-12.38 0-4.418-3.582-8-8-8zm0 11.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"; // Marcador de mapa
    case 'igreja':
      return "M12 2l-10 5v13h20v-13l-10-5zm0 15h-2v-4h-2v4h-2v-6h2v-2h4v2h2v6h-2z"; // Cruz simples
    case 'praça':
      return "M12 2c-5.514 0-10 4.486-10 10s4.486 10 10 10 10-4.486 10-10-4.486-10-10-10zm0 18c-4.411 0-8-3.589-8-8s3.589-8-8-8-8 3.589-8 8 3.589 8 8 8zm0-14c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zm-4 4h8v2h-8v-2z"; // Banco de parque
    case 'centro-cultural':
      return "M12 2c-5.514 0-10 4.486-10 10s4.486 10 10 10 10-4.486 10-10-4.486-10-10-10zm-3 8h6v2h-6v-2zm0 4h6v2h-6v-2zm0-8h6v2h-6v-2z"; // Palco
    default:
      return "M12 2c-4.418 0-8 3.582-8 8 0 4.218 5.61 10.592 7.234 12.38.384.41.986.41 1.37 0 1.624-1.788 7.234-8.162 7.234-12.38 0-4.418-3.582-8-8-8zm0 11.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"; // Marcador de mapa padrão
  }
}

// Cor de cada categoria (marcador e ícone do popup)
function getCategoryColor(category: string): string {
  switch (category) {
    case 'museu': return '#9b59b6'; // Purple
    case 'parque': return '#2ecc71'; // Green
    case 'monumento': return '#f1c40f'; // Yellow
    case 'igreja': return '#e74c3c'; // Red
    case 'praça': return '#34495e'; // Dark Blue/Grey
    case 'centro-cultural': return '#e67e22'; // Orange
    case 'praia': return '#00b4d8'; // Cyan
    case 'natureza': return '#27ae60'; // Dark Green
    case 'sitio-arqueologico': return '#a0522d'; // Brown
    case 'centro-historico': return '#c0392b'; // Dark Red
    default: return '#3498db'; // Default blue
  }
}

// Criar ícone personalizado (SVG)
function createCustomIcon(svgHtml: string, category: string): L.DivIcon {
  const bgColor = getCategoryColor(category);

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${bgColor};
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: white; /* Cor do ícone */
      font-size: 20px;
    ">
      ${svgHtml}
    </div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 38], // Centraliza a base do ícone no ponto
    popupAnchor: [0, -38],
  });
}

// Criar conteúdo do popup
function createPopupContent(point: TouristPoint): string {
  const imageHtml = point.imageIds && point.imageIds.length > 0
    ? `<img 
        src="${getDriveImageUrl(point.imageIds[0], 'medium')}" 
        alt="${point.title}"
        style="width: 100%; height: 160px; object-fit: cover; border-radius: 8px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
        loading="lazy"
      />`
    : `<div style="width: 100%; height: 160px; background: linear-gradient(135deg, #3498db, #2ecc71); border-radius: 8px; margin-bottom: 12px; display: flex; align-items: center; justify-content: center; font-size: 48px; color: white;">
        ${CATEGORIES.find(c => c.value === point.category)?.icon || '📍'}
      </div>`;

  const category = CATEGORIES.find(c => c.value === point.category);

  return `
    <div class="popup-content" style="font-family: 'Inter', sans-serif; padding: 5px; color: #333;">
      ${imageHtml}
      
      <div style="margin-bottom: 10px;">
        <h3 style="color: #2c3e50; margin: 0 0 4px 0; font-size: 1.2em; font-weight: 700; line-height: 1.3;">
          ${point.title}
        </h3>
        ${point.subtitle ? `<p style="color: #7f8c8d; font-size: 0.9em; margin: 0 0 8px 0; font-weight: 500;">${point.subtitle}</p>` : ''}
      </div>

      <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #eee;">
        ${category ? `
          <p style="margin: 6px 0; font-size: 0.85em; display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.1em; color: ${getCategoryColor(category.value)};">${category.icon}</span>
            <span><strong>Categoria:</strong> ${category.label}</span>
          </p>
        ` : ''}
        
        <p style="margin: 6px 0; font-size: 0.85em; display: flex; align-items: center; gap: 8px;">
          <span style="color: #7f8c8d;">&#x1F4CD;</span>
          <span><strong>Local:</strong> ${[point.neighborhood, getPointCity(point)].filter(Boolean).join(', ')}</span>
        </p>
        
        ${point.phone ? `
          <p style="margin: 6px 0; font-size: 0.85em; display: flex; align-items: center; gap: 8px;">
            <span style="color: #2ecc71;">&#x260E;</span>
            <span><strong>Telefone:</strong> <a href="tel:${point.phone}" style="color: #2ecc71; text-decoration: none;">${point.phone}</a></span>
          </p>
        ` : ''}
        
        ${point.schedule ? `
          <p style="margin: 6px 0; font-size: 0.85em; display: flex; align-items: center; gap: 8px;">
            <span style="color: #f39c12;">&#x23F1;</span>
            <span><strong>Horário:</strong> ${point.schedule}</span>
          </p>
        ` : ''}
      </div>
      
      <p style="margin: 12px 0 8px 0; color: #555; font-size: 0.9em; line-height: 1.5;">
        ${point.description}
      </p>
      
      <div style="display: flex; gap: 10px; margin-top: 15px;">
        <button
          onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${point.latitude},${point.longitude}', '_blank')"
          style="
            flex: 1;
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.9em;
            transition: all 0.2s;
            box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          "
          onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(52, 152, 219, 0.4)'"
          onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(52, 152, 219, 0.3)'"
        >
          <svg style="width:16px; height:16px; margin-right: 6px;" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-4.418 0-8 3.582-8 8 0 4.218 5.61 10.592 7.234 12.38.384.41.986.41 1.37 0 1.624-1.788 7.234-8.162 7.234-12.38 0-4.418-3.582-8-8-8zm0 11.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>
          Como chegar
        </button>
        
        <button
          onclick="window.open('https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${point.title}, ${getPointCity(point)}, PI`)}', '_blank')"
          style="
            background: white;
            color: #555;
            border: 1px solid #bdc3c7;
            padding: 10px 15px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.9em;
            transition: all 0.2s;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          "
          onmouseover="this.style.borderColor='#3498db'; this.style.color='#3498db'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.15)'"
          onmouseout="this.style.borderColor='#bdc3c7'; this.style.color='#555'; this.style.boxShadow='0 2px 5px rgba(0,0,0,0.1)'"
          title="Ver no Google Maps"
        >
          <svg style="width:16px; height:16px;" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        </button>
      </div>
    </div>
  `;
}