// filepath: /root/projects/PersonalProjects/pokedex-v2/frontend/src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryProvider } from "@/providers/ReactQuery/ReactQueryProvider";
import { SearchProvider } from "@/features/pokemons/context/SearchContext";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/shared";

export const metadata: Metadata = {
  title: "Pokedex",
  description: "A modern Pokedex app built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <AuthProvider>
            <SearchProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <div className="flex-grow">{children}</div>
              </div>
            </SearchProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
