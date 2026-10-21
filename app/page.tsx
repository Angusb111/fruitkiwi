
import Image from 'next/image';
import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import BrowseView from './components/BrowseView';

type Listing = {
  id: number;
  address_plain: string | null;
  latitude: number | null;
  longitude: number | null;
  type: string | null;
};

async function ListingsContent() {
  const supabase = await createClient();

  const { data: listings, error } = await supabase
    .from('listings')
    .select('id, address_plain, latitude, longitude, type');

  if (error) {
    console.error('Failed to load listings:', error.message);

    return (
      <div className="p-6 text-red-600">
        Failed to load fruit listings.
      </div>
    );
  }

  return <BrowseView listings={(listings ?? []) as Listing[]} />;
}

export default function Home() {
  return (
    <div className="flex h-dvh flex-col bg-zinc-50">
      <header className="flex shrink-0 items-center bg-white px-6 py-4 md:px-16">
        <Image
          className="h-auto w-[200px] md:w-[300px]"
          src="/wordmark.svg"
          alt="FruitKiwi"
          width={300}
          height={70}
          priority
        />
      </header>

      <main className="relative min-h-0 flex-1">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center">
              Loading fruit listings...
            </div>
          }
        >
          <ListingsContent />
        </Suspense>
      </main>
    </div>
  );
}
