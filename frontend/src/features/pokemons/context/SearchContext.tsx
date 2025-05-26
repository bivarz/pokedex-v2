"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { useDebounce } from "../hooks/useDebounce/useDebounce";

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  debouncedSearch: string;
  handleClearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        debouncedSearch,
        handleClearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
