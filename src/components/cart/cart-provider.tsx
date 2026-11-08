"use client";

import { createContext, type ReactNode, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { cartReducer, EMPTY_CART, getCartTotals, type CartItem } from "@/lib/cart";

const STORAGE_KEY = "apexdetail-cart-v1";

type CartContextValue = {
  items: CartItem[];
  totals: ReturnType<typeof getCartTotals>;
  hydrated: boolean;
  open: boolean;
  revision: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, EMPTY_CART);
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as CartItem[];
        if (Array.isArray(parsed)) dispatch({ type: "hydrate", items: parsed });
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [hydrated, state.items]);

  const value = useMemo<CartContextValue>(() => ({
    items: state.items,
    totals: getCartTotals(state.items),
    hydrated,
    open,
    revision,
    addItem: (item) => { dispatch({ type: "add", item }); setRevision((value) => value + 1); },
    removeItem: (id) => dispatch({ type: "remove", id }),
    setQuantity: (id, quantity) => dispatch({ type: "setQuantity", id, quantity }),
    clearCart: () => dispatch({ type: "clear" }),
    setOpen
  }), [hydrated, open, revision, state.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart wymaga CartProvider");
  return context;
}

