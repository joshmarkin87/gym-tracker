"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  slug: string;
  name: string;
  nominalSize: string;
  lotCode: string;
  unitPrice: number;
  qty: number;
};

type Cart = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, "qty">, qty: number) => void;
  setQty: (lotCode: string, qty: number) => void;
  remove: (lotCode: string) => void;
  clear: () => void;
};

const CartContext = createContext<Cart | null>(null);
const KEY = "cart.v1";
export const MAX_QTY = 10;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, loaded]);

  const add = useCallback((item: Omit<CartItem, "qty">, qty: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.lotCode === item.lotCode);
      if (existing) {
        return prev.map((i) => (i.lotCode === item.lotCode ? { ...i, qty: Math.min(MAX_QTY, i.qty + qty) } : i));
      }
      return [...prev, { ...item, qty: Math.min(MAX_QTY, qty) }];
    });
  }, []);
  const setQty = useCallback((lotCode: string, qty: number) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.lotCode !== lotCode) : prev.map((i) => (i.lotCode === lotCode ? { ...i, qty: Math.min(MAX_QTY, qty) } : i)),
    );
  }, []);
  const remove = useCallback((lotCode: string) => setItems((prev) => prev.filter((i) => i.lotCode !== lotCode)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + i.qty * i.unitPrice, 0),
      add,
      setQty,
      remove,
      clear,
    }),
    [items, add, setQty, remove, clear],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}

export function CartCount() {
  const { count } = useCart();
  return (
    <span className="num">
      Cart{count > 0 && <span className="ml-1 rounded-full bg-accent px-2 py-0.5 text-xs text-white">{count}</span>}
      <span className="sr-only">, {count} items</span>
    </span>
  );
}
