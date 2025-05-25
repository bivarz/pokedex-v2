import { renderHook, act } from "@testing-library/react";
import { usePokemonList } from "./usePokemonList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { getPokemons } from "../../api/pokeapi/services";

jest.mock("../../api/pokeapi/services", () => ({
  getPokemons: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => {
  const originalModule = jest.requireActual("@tanstack/react-query");
  return {
    ...originalModule,
    useQuery: jest.fn(),
  };
});

import { useQuery } from "@tanstack/react-query";

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

  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    return function Wrapper({ children }: { children: React.ReactNode }) {
      return React.createElement(
        QueryClientProvider,
        { client: queryClient },
        children
      );
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useQuery as jest.Mock).mockImplementation(({ select }) => {
      const selectedData = select ? select(mockPokemons) : undefined;

      return {
        data: selectedData,
        isLoading: false,
        error: null,
      };
    });

    (getPokemons as jest.Mock).mockResolvedValue(mockPokemons);
  });

  it("should initialize with correct default values", () => {
    const { result } = renderHook(() => usePokemonList(), {
      wrapper: createWrapper(),
    });

    expect(result.current.limit).toBe(20);
    expect(result.current.offset).toBe(0);
    expect(result.current.currentPage).toBe(1);
  });

  it("should accept custom initial limit and offset", () => {
    const { result } = renderHook(
      () => usePokemonList({ initialLimit: 30, initialOffset: 60 }),
      { wrapper: createWrapper() }
    );

    expect(result.current.limit).toBe(30);
    expect(result.current.offset).toBe(60);
    expect(result.current.currentPage).toBe(3); // 60/30 + 1 = 3
  });

  it("should use React Query with correct parameters", () => {
    renderHook(() => usePokemonList(), { wrapper: createWrapper() });

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ["pokemons", 0, 20],
      queryFn: expect.any(Function),
      select: expect.any(Function),
    });
  });

  it("should extract pokemon IDs correctly from URLs", () => {
    const { result } = renderHook(() => usePokemonList(), {
      wrapper: createWrapper(),
    });

    expect(result.current.pokemons).toHaveLength(3);
    expect(result.current.pokemons[0].id).toBe(1);
    expect(result.current.pokemons[1].id).toBe(2);
    expect(result.current.pokemons[2].id).toBe(3);
  });

  it("should handle loading state", () => {
    (useQuery as jest.Mock).mockReturnValueOnce({
      data: undefined,
      isLoading: true,
      error: null,
    });

    const { result } = renderHook(() => usePokemonList(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.pokemons).toEqual([]);
  });

  it("should handle error state", () => {
    const testError = new Error("Test error");

    (useQuery as jest.Mock).mockReturnValueOnce({
      data: undefined,
      isLoading: false,
      error: testError,
    });

    const { result } = renderHook(() => usePokemonList(), {
      wrapper: createWrapper(),
    });

    expect(result.current.error).toBe(testError);
    expect(result.current.pokemons).toEqual([]);
  });

  it("should go to next page when hasNext is true", () => {
    const { result } = renderHook(() => usePokemonList(), {
      wrapper: createWrapper(),
    });

    const initialOffset = result.current.offset;

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.offset).toBe(initialOffset + result.current.limit);
  });

  it("should not go to next page when hasNext is false", () => {
    (useQuery as jest.Mock).mockImplementation(({ select }) => {
      const mockWithoutNext = {
        ...mockPokemons,
        next: null,
      };

      const selectedData = select ? select(mockWithoutNext) : undefined;

      return {
        data: selectedData,
        isLoading: false,
        error: null,
      };
    });

    const { result } = renderHook(() => usePokemonList(), {
      wrapper: createWrapper(),
    });

    const initialOffset = result.current.offset;

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.offset).toBe(initialOffset);
  });

  it("should go to previous page when hasPrevious is true", () => {
    (useQuery as jest.Mock).mockImplementation(({ select }) => {
      const mockWithPrevious = {
        ...mockPokemons,
        previous: "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20",
      };

      const selectedData = select ? select(mockWithPrevious) : undefined;

      return {
        data: selectedData,
        isLoading: false,
        error: null,
      };
    });

    const { result } = renderHook(() => usePokemonList({ initialOffset: 20 }), {
      wrapper: createWrapper(),
    });

    const initialOffset = result.current.offset;

    act(() => {
      result.current.goToPreviousPage();
    });

    expect(result.current.offset).toBe(initialOffset - result.current.limit);
  });

  it("should not go to previous page when hasPrevious is false", () => {
    const { result } = renderHook(() => usePokemonList(), {
      wrapper: createWrapper(),
    });

    const initialOffset = result.current.offset;

    act(() => {
      result.current.goToPreviousPage();
    });

    expect(result.current.offset).toBe(initialOffset);
  });

  it("should set new limit and reset offset", () => {
    const { result } = renderHook(() => usePokemonList({ initialOffset: 40 }), {
      wrapper: createWrapper(),
    });

    const newLimit = 50;

    act(() => {
      result.current.setLimit(newLimit);
    });

    expect(result.current.limit).toBe(newLimit);
    expect(result.current.offset).toBe(0);
  });

  it("should update query key when offset or limit changes", () => {
    const { result } = renderHook(() => usePokemonList(), {
      wrapper: createWrapper(),
    });

    (useQuery as jest.Mock).mockClear();

    act(() => {
      result.current.goToNextPage();
    });

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["pokemons", 20, 20],
      })
    );

    (useQuery as jest.Mock).mockClear();

    act(() => {
      result.current.setLimit(30);
    });

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["pokemons", 0, 30],
      })
    );
  });
});
