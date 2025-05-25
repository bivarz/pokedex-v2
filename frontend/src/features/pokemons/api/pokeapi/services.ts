import { api } from "../apiConfig";
import { getPokemonsProps, PokemonListResponse } from "./services.types";

export const getPokemons = async ({
  offset,
  limit,
}: getPokemonsProps): Promise<PokemonListResponse> => {
  const response = await api.get(`/pokemon?offset=${offset}&limit=${limit}`);
  return response.data;
};
