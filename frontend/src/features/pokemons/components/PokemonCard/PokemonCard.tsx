"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pokemon } from "../../hooks/usePokemonList/usePokemonList.types";

import { Heart } from "lucide-react";

interface PokemonCardProps {
  pokemon: Pokemon;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [pokemonType, setPokemonType] = useState("");
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`
        );
        const data = await response.json();

        if (data.types && data.types.length > 0) {
          setPokemonType(data.types[0].type.name);
        }
      } catch (error) {
        console.error("Error fetching pokemon details:", error);
      }
    };

    fetchPokemonDetails();
  }, [pokemon.id]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  const getTypeGradient = () => {
    const typeColors: Record<string, string> = {
      normal: "from-gray-100",
      fire: "from-orange-300",
      water: "from-blue-100",
      electric: "from-yellow-100",
      grass: "from-green-100",
      ice: "from-cyan-100",
      fighting: "from-red-200",
      poison: "from-purple-100",
      ground: "from-amber-200",
      flying: "from-indigo-100",
      psychic: "from-pink-100",
      bug: "from-lime-100",
      rock: "from-stone-200",
      ghost: "from-violet-300",
      dragon: "from-violet-200",
      dark: "from-stone-300",
      steel: "from-slate-200",
      fairy: "from-rose-100",
    };

    return `bg-gradient-to-b ${
      typeColors[pokemonType] || "from-gray-100"
    } to-white`;
  };

  const PokeBall = () => (
    <div className="relative w-4 h-4">
      <div
        className="absolute inset-0 bg-red-500 rounded-full"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)" }}
      ></div>
      <div
        className="absolute inset-0 bg-white rounded-full"
        style={{ clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)" }}
      ></div>
      <div className="absolute inset-0 border border-gray-800 rounded-full"></div>
      <div className="absolute inset-[30%] bg-white rounded-full border border-gray-800"></div>
    </div>
  );

  return (
    <Link href={`/pokemon/${pokemon.id}`}>
      <div
        className={`rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 relative ${getTypeGradient()}`}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1">
            <PokeBall />
            <span className="text-gray-600 text-xs font-medium">
              #{pokemon.id.toString().padStart(3, "0")}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavoriteClick}
            className="h-8 w-8 p-0 rounded-full"
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
              size={20}
            />
          </Button>
        </div>

        <div className="flex justify-center">
          <div className="relative w-32 h-32 mb-2">
            <Image
              src={imageUrl}
              alt={pokemon.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain"
              priority={pokemon.id <= 9}
            />
          </div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <h3 className="font-semibold capitalize text-sm">{pokemon.name}</h3>

          {pokemonType && (
            <span
              className={`text-xs font-medium capitalize px-2 py-1 rounded-full bg-white/70 shadow-sm`}
            >
              {pokemonType}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
