'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
// @ts-ignore
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API || '';

// Add custom CSS for map controls
const mapStyles = `
.mapboxgl-ctrl-geocoder {
  width: 100% !important;
  max-width: none !important;
  margin: 0 0 8px 0 !important;
  position: relative !important;
  box-shadow: none !important;
}

.mapboxgl-ctrl-top-right {
  position: absolute !important;
  top: 12px !important;
  right: 12px !important;
  max-width: 40px !important;
}

.mapboxgl-ctrl-top-left {
  position: absolute !important;
  top: 12px !important;
  left: 12px !important;
  width: calc(100% - 24px) !important;
}
`;

interface MapInputProps {
  defaultAddress?: string;
  defaultCoordinates?: [number, number];
  onLocationSelect: (address: string, coordinates: [number, number]) => void;
}

export const MapWithSearch = ({
  defaultAddress = '',
  defaultCoordinates,
  onLocationSelect,
  inputPlaceholder
}: MapInputProps) =>{
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // utils/reverseGeocode.js
const reverseGeocode = async (lng: any, lat: any) => {
  const accessToken = MAPBOX_TOKEN;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch address');
  const data = await res.json();

  // Usually the most relevant address is the first feature
  return data.features?.[0]?.place_name || 'No address found';
}


  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = mapStyles;
    document.head.appendChild(styleElement);

    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Pre-load map style
    const preloadStyle = new Image();
    preloadStyle.src =
      'https://api.mapbox.com/styles/v1/mapbox/streets-v12/sprite@2x.png';

    const initializeMap = async () => {
      try {
        const newMap = new mapboxgl.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: defaultCoordinates.length ? defaultCoordinates : [5.613491, 51.972466],
          zoom: 13,
        });

        // Wait for both style and map to load
        await Promise.all([
          new Promise((resolve) => newMap.on('style.load', resolve)),
          new Promise((resolve) => newMap.on('load', resolve))
        ]);

        map.current = newMap;


        const geocoder = new MapboxGeocoder({
          accessToken: MAPBOX_TOKEN,
          mapboxgl: mapboxgl,
          marker: false, // we'll add our own marker
          // countries: 'in',
          types: 'country, region, postcode, district, place, locality, neighborhood, address, poi, poi.landmark',
          placeholder: inputPlaceholder || 'Search for a location'
        });

        newMap.addControl(geocoder);
        newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

        const newMarker = new mapboxgl.Marker({ draggable: true }).setLngLat(
          defaultCoordinates.length ? defaultCoordinates : [-79.4512, 43.6568]
        );

        if (defaultCoordinates.length) {
          newMarker.addTo(newMap);
        }

        marker.current = newMarker;

        setIsLoading(false);

        geocoder.on('result', (event) => {
          const coordinates = event.result.center;
          const address = event.result.place_name;

          if (newMarker && newMap) {
            newMarker.setLngLat(coordinates).addTo(newMap);
            newMap.flyTo({ center: coordinates, zoom: 15 });
          }

          onLocationSelect(address, coordinates as [number, number]);
        });

        newMarker.on('dragend', async () => {
          const { lng, lat } = newMarker.getLngLat();
          if (newMap) {
            newMap.flyTo({ center: [lng, lat], zoom: 15 });
          }
          try {
            const coordinates = [lng, lat];
            const address = await reverseGeocode(lng, lat);
            onLocationSelect(address, coordinates as [number, number]); 
          } catch (err) {
            console.error('Geocoding error:', err);
          }
        });

        
      } catch (error) {
        console.error('Map initialization error:', error);
        setIsLoading(false);
      }
    };

    initializeMap();

    return () => {
      // if (map.current) {
      //   map.current.remove();
      // }
      // document.head.removeChild(styleElement);
    };
  }, [defaultCoordinates, onLocationSelect]);

  useEffect(() => {
  console.log('defaultCoordinates changed:', defaultCoordinates);}
  , []);

  return (
    <div className="space-y-4">
      <div
        ref={mapContainer}
        className={`relative h-[400px] w-full overflow-hidden rounded-md border transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'
          }`}
      />
     {/* {defaultCoordinates && (
        <p className="text-sm text-muted-foreground">
          Coordinates: {defaultCoordinates[0].toFixed(6)},{' '}
          {defaultCoordinates[1].toFixed(6)}
        </p>
      )}*/}
    </div>
  );
}
