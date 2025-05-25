import { useState, useEffect, useCallback } from "react";
import { getPokemons } from "../../api/pokeapi/services";
import { PokemonListResponse } from "../../api/pokeapi/services.types";
import {
  Pokemon,
  UsePokemonListProps,
  UsePokemonListResult,
} from "./usePokemonList.types";

export const usePokemonList = ({
  initialLimit = 20,
  initialOffset = 0,
}: UsePokemonListProps = {}): UsePokemonListResult => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [offset, setOffset] = useState<number>(initialOffset);
  const [limit, setLimit] = useState<number>(initialLimit);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [hasPrevious, setHasPrevious] = useState<boolean>(false);

  const currentPage = Math.floor(offset / limit) + 1;

  const fetchPokemons = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response: PokemonListResponse = await getPokemons({
        offset,
        limit,
      });

      const pokemonsWithIds = response.results.map((pokemon) => {
        const urlParts = pokemon.url.split("/");
        const id = parseInt(urlParts[urlParts.length - 2]);
        return { ...pokemon, id };
      });

      setPokemons(pokemonsWithIds);
      setTotalCount(response.count);
      setHasNext(!!response.next);
      setHasPrevious(!!response.previous);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch pokemons")
      );
    } finally {
      setIsLoading(false);
    }
  }, [offset, limit]);

  useEffect(() => {
    fetchPokemons();
  }, [fetchPokemons]);

  const goToNextPage = useCallback(() => {
    if (hasNext) {
      setOffset((prev) => prev + limit);
    }
  }, [hasNext, limit]);

  const goToPreviousPage = useCallback(() => {
    if (hasPrevious) {
      setOffset((prev) => Math.max(0, prev - limit));
    }
  }, [hasPrevious, limit]);

  return {
    error,
    limit,
    offset,
    hasNext,
    pokemons,
    setLimit,
    isLoading,
    totalCount,
    currentPage,
    hasPrevious,
    goToNextPage,
    goToPreviousPage,
  };
};
