'use client';

import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { Utensils } from 'lucide-react';

interface MapRestaurant {
  id?: number;
  res_id?: number;
  latitude?: number | null;
  longitude?: number | null;
}

interface MapComponentProps {
  restaurants: MapRestaurant[];
  activeRestaurantId?: number | null;
  onRestaurantSelect?: (id: number) => void;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

// Custom DivIcon generator
const createCustomIcon = (isActive: boolean) => {
  const bgColor = isActive ? '#db5a5a' : '#2b4731';
  const html = ReactDOMServer.renderToString(
    <div style={{
      backgroundColor: bgColor,
      width: '36px',
      height: '36px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: '2px solid white',
      transition: 'all 0.3s ease'
    }}>
      <Utensils size={18} strokeWidth={2.5} />
    </div>
  );

  return new L.DivIcon({
    html,
    className: 'custom-leaflet-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });
};

export default function MapComponent({ restaurants, activeRestaurantId, onRestaurantSelect }: MapComponentProps) {
  const activeRestaurant = restaurants?.find(
    (restaurant) => restaurant.id === activeRestaurantId || restaurant.res_id === activeRestaurantId
  );
  const focusedRestaurant = activeRestaurant || restaurants?.[0];
  const center: [number, number] =
    focusedRestaurant?.latitude && focusedRestaurant?.longitude
      ? [focusedRestaurant.latitude, focusedRestaurant.longitude]
      : [21.028511, 105.804817];

  return (
    <MapContainer 
      center={center} 
      zoom={14} 
      style={{ height: '100%', width: '100%', zIndex: 0 }}
      zoomControl={false}
    >
      <MapUpdater center={center} />
      
      {/* Light map tiles */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      
      {/* Custom Zoom Control positioned bottom right above carousel */}
      <ZoomControl position="bottomright" />

      {restaurants.map((restaurant) => {
        const restaurantId = restaurant.id ?? restaurant.res_id;
        if (restaurant.latitude && restaurant.longitude && restaurantId) {
          const isActive = restaurantId === activeRestaurantId;
          return (
            <Marker 
              key={restaurantId} 
              position={[restaurant.latitude, restaurant.longitude]}
              icon={createCustomIcon(isActive)}
              eventHandlers={{
                click: () => {
                  if (onRestaurantSelect) {
                    onRestaurantSelect(restaurantId);
                  }
                },
              }}
            >
            </Marker>
          );
        }
        return null;
      })}
    </MapContainer>
  );
}
