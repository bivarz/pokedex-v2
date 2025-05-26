import { useCallback, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPokemons } from "../../api/pokeapi/services";
import {
  Pokemon,
  UsePokemonListProps,
  UsePokemonListResult,
} from "./usePokemonList.types";

export const usePokemonList = ({
  initialLimit = 20,
  initialOffset = 0,
  searchQuery = "",
}: UsePokemonListProps = {}): UsePokemonListResult => {
  const [limit, setLimitState] = useState<number>(initialLimit);
  const [offset, setOffset] = useState<number>(initialOffset);

  useEffect(() => {
    setOffset(0);
  }, [searchQuery]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["pokemons", offset, limit, searchQuery],
    queryFn: () => getPokemons({ offset, limit, name: searchQuery }),
    select: (response) => ({
      pokemons: response.results.map((pokemon) => {
        const urlParts = pokemon.url.split("/");
        const id = parseInt(urlParts[urlParts.length - 2]);
        return { ...pokemon, id } as Pokemon;
      }),
      hasNext: !!response.next,
      hasPrevious: !!response.previous,
      totalCount: response.count,
    }),
  });

  const currentPage = Math.floor(offset / limit) + 1;
  const totalCount = data?.totalCount || 0;
  const pokemons = data?.pokemons || [];
  const hasNext = data?.hasNext || false;
  const hasPrevious = data?.hasPrevious || false;

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

  const setLimit = useCallback((newLimit: number) => {
    setLimitState(newLimit);
    setOffset(0);
  }, []);

  return {
    error: error as Error | null,
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
