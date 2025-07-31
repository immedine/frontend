'use client';

import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, MarkerF } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Input } from '@/components/ui/input';
import { AlertModal } from '@/components/modal/alert-modal';

interface MapInputProps {
  defaultAddress?: string;
  defaultCoordinates?: [number, number];
  onLocationSelect: (address: string, coordinates: [number, number]) => void;
  inputPlaceholder?: string;
  noCityCheck?: boolean;
}

export function MapInput({
  defaultCoordinates = [5.613491, 51.972466],
  onLocationSelect,
  inputPlaceholder,
  noCityCheck
}: MapInputProps) {
  const [lat, setLat] = useState(defaultCoordinates[1]);
  const [lng, setLng] = useState(defaultCoordinates[0]);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [city, setCity] = useState("");
  const [alertOpen, toggleAlert] = useState(false);
  const [alertObj, setAlertObj] = useState({});
  const [isLoaded, setLoaded] = useState(false);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({ debounce: 300, cache: 86400 });

  useEffect(() => {
    if (defaultCoordinates) {
      setLat(defaultCoordinates[1]);
      setLng(defaultCoordinates[0]);
      if (!isLoaded && !noCityCheck) {
        getCityFromCoordinates(defaultCoordinates[1], defaultCoordinates[0], true);
        setLoaded(true);
      }
    }
  }, [defaultCoordinates]);

  const getCityFromCoordinates = async (lat, lng, isInitial) => {
    return new Promise((resolve, reject) => {
      const geocoder = new window.google.maps.Geocoder();
      const latLng = new window.google.maps.LatLng(lat, lng);

      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === "OK" && results[0]) {
          let cityFound = null;
          results[0].address_components.forEach((component) => {
            if (component.types.includes("locality")) {
              cityFound = component.long_name;
            }
          });


          if (cityFound) {
            if (isInitial) { 
              setCity(cityFound);
            } else {
              resolve(cityFound);
            };
          } else {
            if (isInitial) { 
              setCity("");
            } else {
              resolve("");
            };
            resolve("City not found");
          }
        } else {
          console.log("Error fetching city: " + status);
          if (isInitial) { 
            setCity(""); 
          } else {
            resolve("");
          };
        }
      });
    });
  };


   // Function to get city name from lat/lng
  // const getCityFromCoordinates = async (lat, lng, isInitial) => {
  //   const geocoder = new window.google.maps.Geocoder();
  //   const latLng = new window.google.maps.LatLng(lat, lng);

  //   await geocoder.geocode({ location: latLng }, (results, status) => {
  //     if (status === "OK" && results[0]) {
  //       let cityFound = null;
  //       results[0].address_components.forEach((component) => {
  //         if (component.types.includes("locality")) {
  //           cityFound = component.long_name;
  //         }
  //       });

  //       if (cityFound) {
  //         console.log(cityFound);
  //         if (isInitial) { 
  //           setCity(cityFound) 
  //         } else {
  //           return cityFound
  //         };
  //       } else {
  //         console.log("City not found");
  //         if (isInitial) { 
  //           setCity("") 
  //         } else {
  //           return ""
  //         };
  //       }
  //     } else {
  //       console.error("Geocoder failed due to: " + status);
  //       console.log("Error fetching city");
  //       if (isInitial) { 
  //           setCity("") 
  //         } else {
  //           return ""
  //         };
  //     }
  //   });
  // };

  return (
    <div className="space-y-4 relative">
      <AlertModal
        isOpen={alertOpen}
        onClose={() => toggleAlert(false)}
        description={`The city for the selected location is ${alertObj.cityName}. But the actual city is ${city}. Do you want to continue?`}
        onConfirm={() => {
          setValue(alertObj.description, false);
          clearSuggestions();
          setLat(alertObj.lat);
          setLng(alertObj.lng);
          onLocationSelect(alertObj.description, [alertObj.lng, alertObj.lat]);
          toggleAlert(false);

          setAlertObj({});
        }}
      />
      <Input
        value={value}
        placeholder={inputPlaceholder || 'Search for a location'}
        disabled={!ready}
        onChange={(e) => setValue(e.target.value)}
        className="mb-2"
      />

      {status === 'OK' && (
        <ul className="absolute z-50 w-full bg-white border rounded-md shadow-md max-h-48 overflow-auto">
          {data.map((suggestion) => {
            const { place_id, description } = suggestion;
            return (
              <li
                key={place_id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  getGeocode({ address: description }).then((results) => {
                    const { lat, lng } = getLatLng(results[0]);

                    if (noCityCheck || description.includes(city)) {
                      setValue(description, false);
                      clearSuggestions();
                      setLat(lat);
                      setLng(lng);
                      onLocationSelect(description, [lng, lat]);
                    }  else {
                      getCityFromCoordinates(lat, lng).then(cityName => {
                        if (cityName === city) {
                          setValue(description, false);
                          clearSuggestions();
                          setLat(lat);
                          setLng(lng);
                          onLocationSelect(description, [lng, lat]);
                        } else {
                          setAlertObj({
                            lat,
                            lng,
                            description,
                            cityName
                          });
                          toggleAlert(true);
                        }
                      });
                    }
                    
                    
                    
                  });
                }}
              >
                {description}
              </li>
            );
          })}
        </ul>
      )}

      <div className="relative h-[600px] w-full overflow-hidden rounded-md border">
        <GoogleMap
          zoom={13}
          center={{ lat, lng }}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{ disableDefaultUI: false }}
          onLoad={(map) => (mapRef.current = map)}
        >
          <MarkerF
            position={{ lat, lng }}
            draggable={true}
            onDragEnd={(e) => {
              if (e.latLng) {
                setLat(e.latLng.lat());
                setLng(e.latLng.lng());
                onLocationSelect('Custom location', [e.latLng.lng(), e.latLng.lat()]);
              }
            }}
          />
        </GoogleMap>
      </div>
    </div>

  );
}
