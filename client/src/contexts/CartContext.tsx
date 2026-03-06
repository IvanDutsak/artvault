import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Artwork, CartItem } from "@/lib/data";

interface CartContextType {
  items: CartItem[];
  addToCart: (artwork: Artwork) => void;
  removeFromCart: (artworkId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  isInCart: (artworkId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("artvault-cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveToStorage = (newItems: CartItem[]) => {
    localStorage.setItem("artvault-cart", JSON.stringify(newItems));
  };

  const addToCart = useCallback((artwork: Artwork) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.artwork.id === artwork.id);
      if (existing) {
        return prev;
      }
      const next = [...prev, { artwork, quantity: 1 }];
      saveToStorage(next);
      return next;
    });
  }, []);

  const removeFromCart = useCallback((artworkId: string) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.artwork.id !== artworkId);
      saveToStorage(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem("artvault-cart");
  }, []);

  const getTotal = useCallback(() => {
    return items.reduce((sum, item) => sum + item.artwork.price * item.quantity, 0);
  }, [items]);

  const getItemCount = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const isInCart = useCallback(
    (artworkId: string) => {
      return items.some((item) => item.artwork.id === artworkId);
    },
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, clearCart, getTotal, getItemCount, isInCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
