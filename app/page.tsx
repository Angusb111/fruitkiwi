
import Image from 'next/image';
import { Suspense } from 'react';
import FruitMap from './components/Map';
import { createClient } from '@/utils/supabase/server';

async function ListingsMap() {
  const supabase = await createClient();

  const { data: listings, error } = await supabase
    .from('listings')
    .select('id, address_plain, latitude, longitude, type');

  if (error) {
    console.error('Failed to load listings:', error.message);
  }

  return <FruitMap listings={listings ?? []} />;
}

export default function Home() {
  return (
    <div className="flex h-screen flex-col bg-zinc-50">
      <header className="flex shrink-0 items-center bg-white px-6 py-4 md:px-16">
        <Image
          className="h-auto w-[200px] md:w-[300px]"
          src="/wordmark.svg"
          alt="Kiwi-Fruit Logo"
          width={300}
          height={70}
          priority
        />
      </header>

      <main className="min-h-0 flex-1">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center">
              Loading fruit listings...
            </div>
          }
        >
          <ListingsMap />
        </Suspense>
      </main>
    </div>
  );
}
