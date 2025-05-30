import { Pokemon } from "../../hooks/usePokemonList/usePokemonList.types";

export interface getPokemonsProps {
  offset: number;
  limit: number;
  name?: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}
