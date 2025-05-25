import { act, renderHook, waitFor } from "@testing-library/react";
import { usePokemonList } from "./usePokemonList";
import { getPokemons } from "../../api/pokeapi/services";

jest.mock("../../api/pokeapi/services", () => ({
  getPokemons: jest.fn(),
}));

describe("usePokemonList", () => {
  const mockPokemons = {
    count: 1118,
    next: "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
    previous: null,
    results: [
      { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
      { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
      { name: "venusaur", url: "https://pokeapi.co/api/v2/pokemon/3/" },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getPokemons as jest.Mock).mockResolvedValue(mockPokemons);
  });

  it("should load pokemons on initial render", async () => {
    const { result } = renderHook(() => usePokemonList());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.pokemons).toEqual([]);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.pokemons).toHaveLength(3);
    expect(result.current.pokemons[0].id).toBe(1);
    expect(result.current.pokemons[0].name).toBe("bulbasaur");
    expect(result.current.totalCount).toBe(1118);
    expect(result.current.hasNext).toBe(true);
    expect(result.current.hasPrevious).toBe(false);
  });

  it("should use custom initial limit and offset", async () => {
    renderHook(() => usePokemonList({ initialLimit: 30, initialOffset: 60 }));

    await waitFor(() => {
      expect(getPokemons).toHaveBeenCalledWith({ offset: 60, limit: 30 });
    });
  });

  it("should handle API errors", async () => {
    const errorMessage = "Network error";
    (getPokemons as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => usePokemonList());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(errorMessage);
  });

  it("should correctly calculate current page", async () => {
    const { result } = renderHook(() =>
      usePokemonList({ initialOffset: 40, initialLimit: 20 })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.currentPage).toBe(3);
  });

  it("should extract pokemon IDs correctly from URLs", async () => {
    const { result } = renderHook(() => usePokemonList());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.pokemons[0].id).toBe(1);
    expect(result.current.pokemons[1].id).toBe(2);
    expect(result.current.pokemons[2].id).toBe(3);
  });

  it("should navigate to next page", async () => {
    const { result, rerender } = renderHook(() => usePokemonList());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(getPokemons).toHaveBeenCalledTimes(1);

    const nextPageMock = {
      ...mockPokemons,
      previous: "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20",
      next: "https://pokeapi.co/api/v2/pokemon?offset=40&limit=20",
    };
    (getPokemons as jest.Mock).mockResolvedValueOnce(nextPageMock);

    const offsetBefore = result.current.offset;

    await act(async () => {
      result.current.goToNextPage();
    });

    rerender();

    expect(result.current.offset).toBe(offsetBefore + result.current.limit);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(getPokemons).toHaveBeenCalledTimes(2);
  });

  it("should navigate to previous page", async () => {
    const mockWithPrevious = {
      ...mockPokemons,
      previous: "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20",
      next: "https://pokeapi.co/api/v2/pokemon?offset=40&limit=20",
    };
    (getPokemons as jest.Mock).mockResolvedValue(mockWithPrevious);

    const { result, rerender } = renderHook(() =>
      usePokemonList({ initialOffset: 20 })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(getPokemons).toHaveBeenCalledTimes(1);
    expect(result.current.hasPrevious).toBe(true);

    const previousPageMock = {
      ...mockPokemons,
      previous: null,
      next: "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
    };
    (getPokemons as jest.Mock).mockResolvedValueOnce(previousPageMock);

    const offsetBefore = result.current.offset;
    const limit = result.current.limit;

    await act(async () => {
      result.current.goToPreviousPage();
    });

    rerender();

    expect(result.current.offset).toBe(offsetBefore - limit);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(getPokemons).toHaveBeenCalledTimes(2);
    expect(getPokemons).toHaveBeenLastCalledWith({ offset: 0, limit: 20 });
  });

  it("should not navigate to previous page when on first page", async () => {
    const { result } = renderHook(() => usePokemonList());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(getPokemons).toHaveBeenCalledTimes(1);
    expect(result.current.hasPrevious).toBe(false);

    const offsetBefore = result.current.offset;

    await act(async () => {
      result.current.goToPreviousPage();
    });

    expect(result.current.offset).toBe(offsetBefore);

    expect(getPokemons).toHaveBeenCalledTimes(1);
  });
});
