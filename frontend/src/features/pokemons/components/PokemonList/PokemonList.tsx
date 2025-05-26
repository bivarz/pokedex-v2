"use client";
import { usePokemonList } from "../../hooks/usePokemonList/usePokemonList";
import { PokemonCard } from "../PokemonCard/PokemonCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useSearch } from "../../context/SearchContext";

export function PokemonList() {
  const { debouncedSearch, handleClearSearch } = useSearch();

  const {
    pokemons,
    isLoading,
    error,
    hasNext,
    hasPrevious,
    goToNextPage,
    goToPreviousPage,
    totalCount,
  } = usePokemonList({
    initialLimit: 12,
    searchQuery: debouncedSearch,
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h3 className="text-xl font-medium text-red-600 mb-2">
          Oops, something went wrong!
        </h3>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="container py-4 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">List of Pokémons</h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {pokemons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg text-gray-500 mb-4">
                No Pokémon found matching &quot;{debouncedSearch}&quot;
              </p>
              <Button variant="outline" onClick={handleClearSearch}>
                Clear search
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {pokemons.map((pokemon) => (
                  <PokemonCard key={pokemon.id} pokemon={pokemon} />
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-8 gap-4">
                <p className="text-sm text-muted-foreground">
                  Showing {pokemons.length} of {totalCount} Pokémon
                  {debouncedSearch ? ` matching "${debouncedSearch}"` : ""}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={goToPreviousPage}
                    disabled={!hasPrevious}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <Button onClick={goToNextPage} disabled={!hasNext}>
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
