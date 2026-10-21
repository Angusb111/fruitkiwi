
'use client';

import { useEffect, useState } from 'react';
import FruitMap from './Map';

type Listing = {
  id: number;
  address_plain: string | null;
  latitude: number | null;
  longitude: number | null;
  type: string | null;
};

type View = 'list' | 'map' | 'filter';

type UserLocation = {
  latitude: number;
  longitude: number;
};

function distanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function BrowseView({
  listings,
}: {
  listings: Listing[];
}) {
  const [activeView, setActiveView] = useState<View>('map');
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.warn('Could not get location:', error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 300000,
      },
    );
  }, []);

  const buttonStyle = (view: View) =>
    `flex items-center justify-center rounded-full shadow-xl/20 transition-all duration-300 ${
      activeView === view
        ? 'bg-green-600 p-7 text-white'
        : 'bg-white p-4 text-black'
    }`;

  return (
    <div className="relative h-full">
      <div className="h-full">
        {activeView === 'map' && <FruitMap listings={listings} />}

        {activeView === 'list' && (
          <div className="h-full overflow-y-auto px-4 pb-28 pt-4">
            <h1 className="mb-4 text-xl font-semibold">
              Fruit available nearby
            </h1>

            {!userLocation && (
              <p className="mb-4 text-sm text-zinc-500">
                Allow location access to see distances.
              </p>
            )}

            {listings.length === 0 ? (
              <p className="text-zinc-600">No fruit listings yet.</p>
            ) : (
              <div className="space-y-3">
                {listings
                  .map((listing) => {
                    const latitude =
                      listing.latitude == null
                        ? null
                        : listing.latitude / 10_000_000;
                    const longitude =
                      listing.longitude == null
                        ? null
                        : listing.longitude / 10_000_000;

                    const distance =
                      userLocation &&
                      latitude != null &&
                      longitude != null
                        ? distanceKm(
                            userLocation.latitude,
                            userLocation.longitude,
                            latitude,
                            longitude,
                          )
                        : null;

                    return { ...listing, distance };
                  })
                  .sort((a, b) => {
                    if (a.distance == null) return 1;
                    if (b.distance == null) return -1;
                    return a.distance - b.distance;
                  })
                  .map((listing) => (
                    <article
                      key={listing.id}
                      className="rounded-2xl bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-lg font-semibold text-zinc-900">
                            {listing.type ?? 'Fruit available'}
                          </h2>
                          <p className="mt-1 text-sm text-zinc-600">
                            {listing.address_plain ??
                              'Location not specified'}
                          </p>
                        </div>

                        <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-800">
                          {listing.distance != null
                            ? `${listing.distance < 10 ? listing.distance.toFixed(1) : Math.round(listing.distance)} km away`
                            : 'Distance unknown'}
                        </span>
                      </div>
                    </article>
                  ))}
              </div>
            )}
          </div>
        )}

        {activeView === 'filter' && (
          <div className="h-full overflow-y-auto p-4 pb-28">
            <h1 className="mb-4 text-xl font-semibold">Filter fruit</h1>
            <p className="text-zinc-600">
              Filtering controls can be added here.
            </p>
            <button
              onClick={() => setActiveView('map')}
              className="mt-4 rounded-full bg-green-600 px-5 py-3 text-white"
            >
              Back to map
            </button>
          </div>
        )}
      </div>

      <footer className="absolute bottom-0 z-10 flex w-full items-end justify-evenly px-2 pb-4 pt-6">
        <button
          onClick={() => setActiveView('list')}
          aria-label="List view"
          aria-pressed={activeView === 'list'}
          className={buttonStyle('list')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        </button>

        <button
          onClick={() => setActiveView('map')}
          aria-label="Map view"
          aria-pressed={activeView === 'map'}
          className={buttonStyle('map')}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
          </svg>
        </button>

        <button
          onClick={() => setActiveView('filter')}
          aria-label="Filter listings"
          aria-pressed={activeView === 'filter'}
          className={buttonStyle('filter')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
        </button>
      </footer>
    </div>
  );
}
