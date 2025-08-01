'use client';

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { set } from 'date-fns';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API;

export const RouteMap = ({markers, isUpdated, setIsUpdated}) => {
  const mapContainer = useRef(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (mapRef.current) return;
    
    if (markers && markers.length > 1) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current ? mapContainer.current : '',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: markers[0].coordinates,
        zoom: 14,
      });
  
      mapRef.current.on('load', () => {
        getRoute(markers.map((marker: any) => marker.coordinates));
      });
    }
    
  }, [markers]);

  useEffect(() => {
    if (mapRef.current && markers && markers.length > 1 && isUpdated) {
      // reinitialize the map with new markers
      mapRef.current.removeLayer('route');
      mapRef.current.removeSource('route');
      // remove markers from the map
      const markersOnMap = document.querySelectorAll('.mapboxgl-marker');
      markersOnMap.forEach((marker) => {
        marker.remove();
      });

      setTimeout(() => {
        getRoute(markers.map((marker: any) => marker.coordinates));
        setIsUpdated(false); // Reset the isUpdated state after reinitializing the map
      }, 1000); // Optional: Add a delay before reinitializing the map

      
    }
  }, [isUpdated])

  const getRoute = async (coords: any) => {
    const coordString = coords.map((coord: any) => coord.join(',')).join(';');
    const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${coordString}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

    const response = await fetch(url);
    const data = await response.json();
    const route = data.routes[0].geometry;

    // Add route line to the map
    mapRef.current.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: route,
      },
    });

    mapRef.current.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#0074D9',
        'line-width': 5,
      },
    });

    // Optionally add markers at waypoints
    coords.forEach((coord: any, idx: number) => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.background = '#0074D9';
      el.style.color = '#fff';
      el.style.borderRadius = '50%';
      el.style.width = '28px';
      el.style.height = '28px';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.fontWeight = 'bold';
      el.innerText = (idx + 1).toString();

      new mapboxgl.Marker(el).setLngLat(coord).addTo(mapRef.current);
    });
  };

  return <div ref={mapContainer} className="h-full w-full rounded-md border" />;
};

