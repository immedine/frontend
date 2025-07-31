'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import { MapInput } from './map-input';

interface MapInputWrapperProps {
  defaultAddress?: string;
  defaultCoordinates?: [number, number];
  onLocationSelect: (address: string, coordinates: [number, number]) => void;
  inputPlaceholder?: string;
  noCityCheck?: boolean;
}

export function MapInputWrapper(props: MapInputWrapperProps) {
  const [googleApiLoaded, setGoogleApiLoaded] = useState<boolean>(
    typeof window !== 'undefined' && !!window.google?.maps
  );

  useEffect(() => {
    const checkGoogleMaps = () => {
      if (window.google?.maps) {
        setGoogleApiLoaded(true);
      }
    };

    if (!googleApiLoaded) {
      const interval = setInterval(() => {
        checkGoogleMaps();
        if (window.google?.maps) clearInterval(interval);
      }, 300);
    }

    return () => clearInterval(checkGoogleMaps as any);
  }, [googleApiLoaded]);

  return (
    <>
      {!googleApiLoaded && (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API}&libraries=places`}
          strategy="lazyOnload"
          onLoad={() => setGoogleApiLoaded(true)}
        />
      )}

      {googleApiLoaded ? <MapInput {...props} /> : <p>Loading Google Maps...</p>}
    </>
  );
}
