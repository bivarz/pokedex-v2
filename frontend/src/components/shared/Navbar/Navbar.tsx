"use client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search, X, Menu, LogOut } from "lucide-react";
import { useSearch } from "@/features/pokemons/context/SearchContext";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { searchTerm, setSearchTerm, handleClearSearch } = useSearch();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") {
      handleClearSearch();
    }
  }, [pathname, handleClearSearch]);

  const showSearch = pathname === "/";

  return (
    <header className="w-full border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
      <div className="w-full mx-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6 shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-bold text-xl">Pokédex</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                  pathname === "/" ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                Home
              </Link>
              <Link
                href="/about"
                className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                  pathname === "/about"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                About
              </Link>
            </nav>
          </div>

          {showSearch && (
            <div className="flex-grow max-w-2xl mx-4 hidden sm:block">
              <div className="relative w-full">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search Pokémon..."
                  className="pl-8 pr-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="h-9 w-9"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            )}

            <div className="md:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showSearch && (
        <div className="sm:hidden border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="relative w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search Pokémon..."
                className="pl-8 pr-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
