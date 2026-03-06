import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (artworkId: string) => void;
  isFavorite: (artworkId: string) => boolean;
  getFavoritesCount: () => number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("artvault-favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = useCallback((artworkId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(artworkId)
        ? prev.filter((id) => id !== artworkId)
        : [...prev, artworkId];
      localStorage.setItem("artvault-favorites", JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (artworkId: string) => favorites.includes(artworkId),
    [favorites]
  );

  const getFavoritesCount = useCallback(() => favorites.length, [favorites]);

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite, getFavoritesCount }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
