"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { menuItems, type MenuItem } from "@/lib/menu-data";

export interface CartLine {
  item: MenuItem;
  qty: number;
}

const PROMO_CODES: Record<string, number> = {
  FIRST15: 0.15,
  OFFICE10: 0.1,
};

interface CartContextValue {
  lines: CartLine[];
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  itemCount: number;
  subtotal: number;
  promoCode: string;
  promoError: string;
  discountRate: number;
  applyPromo: (code: string) => void;
  total: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [discountRate, setDiscountRate] = useState(0);
  const [promoError, setPromoError] = useState("");

  const addItem = useCallback((id: string) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.item.id === id);
      if (existing) {
        return prev.map((l) =>
          l.item.id === id ? { ...l, qty: l.qty + 1 } : l
        );
      }
      const item = menuItems.find((m) => m.id === id);
      if (!item) return prev;
      return [...prev, { item, qty: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.item.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((prev) => {
      if (qty <= 0) return prev.filter((l) => l.item.id !== id);
      return prev.map((l) => (l.item.id === id ? { ...l, qty } : l));
    });
  }, []);

  const clear = useCallback(() => {
    setLines([]);
    setPromoCode("");
    setDiscountRate(0);
    setPromoError("");
  }, []);

  const applyPromo = useCallback((code: string) => {
    const normalized = code.trim().toUpperCase();
    setPromoCode(normalized);
    if (!normalized) {
      setDiscountRate(0);
      setPromoError("");
      return;
    }
    const rate = PROMO_CODES[normalized];
    if (rate) {
      setDiscountRate(rate);
      setPromoError("");
    } else {
      setDiscountRate(0);
      setPromoError("That code doesn't exist or has expired.");
    }
  }, []);

  const itemCount = useMemo(
    () => lines.reduce((sum, l) => sum + l.qty, 0),
    [lines]
  );
  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.qty * l.item.price, 0),
    [lines]
  );
  const total = useMemo(
    () => Math.round(subtotal * (1 - discountRate) * 100) / 100,
    [subtotal, discountRate]
  );

  const value: CartContextValue = {
    lines,
    addItem,
    removeItem,
    setQty,
    clear,
    itemCount,
    subtotal,
    promoCode,
    promoError,
    discountRate,
    applyPromo,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
