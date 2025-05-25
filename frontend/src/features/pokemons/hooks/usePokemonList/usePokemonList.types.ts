export interface UsePokemonListProps {
  initialLimit?: number;
  initialOffset?: number;
}

export interface Pokemon {
  name: string;
  url: string;
  id: number;
}

export interface UsePokemonListResult {
  pokemons: Pokemon[];
  isLoading: boolean;
  error: Error | null;
  offset: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  setLimit: (limit: number) => void;
  currentPage: number;
  limit: number;
}
