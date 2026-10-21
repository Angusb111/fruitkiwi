
'use client';

import { useEffect, useRef } from 'react';
import {
  Map,
  NavigationControl,
  setWorkerUrl,
  Marker,
  Popup,
  AttributionControl,
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

type Listing = {
  id: number;
  address_plain: string | null;
  latitude: number | null;
  longitude: number | null;
  type: string | null;
};

setWorkerUrl('/maplibre/maplibre-gl-worker.mjs');

export default function MapComponent({
  listings,
}: {
  listings: Listing[];
}) {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new Map({
      container: mapContainer.current,
      style:
        'https://basemaps.linz.govt.nz/v1/styles/topolite-v2.json?api=c01jwykec5weqkbr50vc30xwzgs',
      center: [178.0176, -38.6623],
      zoom: 12,
      attributionControl: false,
    });

    map.addControl(new NavigationControl(), 'top-right');
    map.addControl(
      new AttributionControl({ compact: true }),
      'bottom-right',
    );
    map.on('error', (event) => {
      console.error('MapLibre error:', event.error);
    });

    listings.forEach((listing) => {
      if (listing.latitude == null || listing.longitude == null) {
        return;
      }

      const latitude = listing.latitude / 10_000_000;
      const longitude = listing.longitude / 10_000_000;

      const markerElement = document.createElement('img');

      if (listing.type === 'Lemons') {
        markerElement.src = '/lem-pin.svg';
      } else if (listing.type === 'Oranges') {
        markerElement.src = '/org-pin.svg';
      } else if (listing.type === 'Apples') {
        markerElement.src = '/apl-pin.svg';
      } else {
        markerElement.src = '/fei-pin1.svg';
      }

      markerElement.alt = listing.type ?? 'Fruit listing';
      markerElement.style.width = '40px';
      markerElement.style.height = '40px';
      markerElement.style.cursor = 'pointer';

      // Build the popup content.
      const popupContent = document.createElement('div');
      popupContent.style.padding = '4px';
      popupContent.style.color = '#222';

      const fruitName = document.createElement('strong');
      fruitName.textContent = listing.type ?? 'Fruit available';
      popupContent.appendChild(fruitName);

      if (listing.address_plain) {
        const address = document.createElement('p');
        address.textContent = listing.address_plain;
        address.style.margin = '4px 0 0';
        popupContent.appendChild(address);
      }

      const popup = new Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 25,
      }).setDOMContent(popupContent);

      let closeTimeout: ReturnType<typeof setTimeout> | undefined;

      const cancelClose = () => {
        if (closeTimeout) {
          clearTimeout(closeTimeout);
          closeTimeout = undefined;
        }
      };

      const scheduleClose = () => {
        cancelClose();
        closeTimeout = setTimeout(() => {
          popup.remove();
        }, 150);
      };

      // Create the marker.
      new Marker({
        element: markerElement,
        anchor: 'bottom',
      })
        .setLngLat([longitude, latitude])
        .addTo(map);

      // Show popup when hovering over the marker.
      markerElement.addEventListener('mouseenter', () => {
        cancelClose();
        popup.setLngLat([longitude, latitude]).addTo(map);
      });

      markerElement.addEventListener('mouseleave', scheduleClose);

      // Keep popup open while the pointer is over it.
      popup.on('open', () => {
        const popupElement = popup.getElement();

        popupElement.addEventListener('mouseenter', cancelClose);
        popupElement.addEventListener('mouseleave', scheduleClose);
      });
    });

    // Centre on the user's location if permission is granted.
    map.on('load', () => {
      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          map.flyTo({
            center: [
              position.coords.longitude,
              position.coords.latitude,
            ],
            zoom: 13,
            essential: true,
          });
          const { latitude, longitude } = position.coords;

          // Create the user's location blip.
          const el = document.createElement('div');
          el.className = 'user-location-blip';

          new Marker({ element: el })
            .setLngLat([longitude, latitude])
            .addTo(map);
        },
        (error) => {
          console.warn(
            'Location unavailable; keeping default map centre:',
            error.message,
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        },
        
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
        minHeight: '400px',
      }}
    />
  );
}
