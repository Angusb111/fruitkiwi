import Image from "next/image";
import FruitMap from "./components/Map";

export default function Home() {
  return (
    <div className="flex h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <header className="flex shrink-0 items-center bg-white px-6 py-8 dark:bg-black md:px-12">
        <Image
          className="w-[200px] md:w-[300px] dark:invert"
          src="/wordmark-basic.svg"
          alt="FruitKiwi"
          width={300}
          height={70}
          priority
        />
      </header>

      <main className="min-h-0 flex-1">
        <FruitMap />
      </main>
    </div>
  );
}