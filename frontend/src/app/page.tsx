import { PokemonList } from "@/features/pokemons/components/PokemonList/PokemonList";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center pb-16 gap-6 sm:p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="w-full max-w-7xl flex flex-col gap-6 row-start-2 items-center sm:items-start">
        <PokemonList />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
