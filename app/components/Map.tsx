'use client';

import { useEffect, useRef } from 'react';
import { Map, NavigationControl, setWorkerUrl, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

setWorkerUrl('/maplibre/maplibre-gl-worker.mjs');

export default function MapComponent() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new Map({
      container: mapContainer.current,

      style:
        'https://basemaps.linz.govt.nz/v1/styles/topolite-v2.json?api=c01jwykec5weqkbr50vc30xwzgs',

      center: [172.25982, -40.9081],
      zoom: 5,
    });

    const markerElement = document.createElement('img');

    markerElement.src = '/fei-pin1.svg';
    markerElement.style.width = '40px';
    markerElement.style.height = '40px';
    markerElement.style.cursor = 'pointer';

    new Marker({
    element: markerElement,
    anchor: 'bottom',
    })
    .setLngLat([178.02132117767334, -38.663281375645994])
    .addTo(map);


    map.addControl(new NavigationControl(), 'top-right');

    // Centre the map on the user's location.
    map.on('load', () => {
      if (!navigator.geolocation) {
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          map.flyTo({
            center: [longitude, latitude],
            zoom: 13,
            essential: true,
          });
        },

        (error) => {
          console.log(
            'Could not get location:',
            error.message
          );
        },

        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
}