import { api } from "../apiConfig";
import { getPokemonsProps, PokemonListResponse } from "./services.types";

export const getPokemons = async ({
  offset,
  limit,
  name,
}: getPokemonsProps): Promise<PokemonListResponse> => {
  if (name) {
    const response = await api.get(`/pokemon?offset=0&limit=1000`);
    const allPokemon = response.data;

    const filteredResults = (
      allPokemon.results as { name: string; url: string }[]
    ).filter((pokemon: { name: string }) =>
      pokemon.name.toLowerCase().includes(name.toLowerCase())
    );

    const mappedResults = filteredResults.map(
      (pokemon: { name: string; url: string }) => {
        const urlParts = pokemon.url.split("/").filter(Boolean);
        const id = parseInt(urlParts[urlParts.length - 1], 10);
        return {
          name: pokemon.name,
          url: pokemon.url,
          id,
        };
      }
    );

    const paginatedResults = mappedResults.slice(offset, offset + limit);

    return {
      count: mappedResults.length,
      next:
        offset + limit < mappedResults.length
          ? `https://pokeapi.co/api/v2/pokemon?offset=${
              offset + limit
            }&limit=${limit}`
          : null,
      previous:
        offset > 0
          ? `https://pokeapi.co/api/v2/pokemon?offset=${Math.max(
              0,
              offset - limit
            )}&limit=${limit}`
          : null,
      results: paginatedResults,
    };
  }

  const response = await api.get(`/pokemon?offset=${offset}&limit=${limit}`);
  return response.data;
};
