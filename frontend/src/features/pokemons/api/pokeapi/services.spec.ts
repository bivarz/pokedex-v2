import { api } from "../axios";
import { getPokemons } from "./services";

jest.mock("../axios", () => ({
  api: {
    get: jest.fn(),
  },
}));

describe("PokeAPI service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getPokemons", () => {
    it("should call API with correct parameters", async () => {
      const mockResponse = {
        data: {
          results: [
            { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
            { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
          ],
          count: 1118,
          next: "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
          previous: null,
        },
      };

      (api.get as jest.Mock).mockResolvedValue(mockResponse);

      const params = { offset: 0, limit: 20 };

      const result = await getPokemons(params);

      expect(api.get).toHaveBeenCalledWith("/pokemon?offset=0&limit=20");

      expect(result).toEqual(mockResponse.data);
    });

    it("should handle API errors properly", async () => {
      const errorMessage = "Network Error";
      (api.get as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const params = { offset: 0, limit: 20 };

      await expect(getPokemons(params)).rejects.toThrow(errorMessage);

      expect(api.get).toHaveBeenCalledWith("/pokemon?offset=0&limit=20");
    });

    it("should handle different pagination parameters", async () => {
      const mockResponse = {
        data: {
          results: [],
          count: 1118,
          next: null,
          previous: "https://pokeapi.co/api/v2/pokemon?offset=0&limit=50",
        },
      };

      (api.get as jest.Mock).mockResolvedValue(mockResponse);

      const params = { offset: 50, limit: 50 };

      const result = await getPokemons(params);

      expect(api.get).toHaveBeenCalledWith("/pokemon?offset=50&limit=50");

      expect(result).toEqual(mockResponse.data);
    });
  });
});
