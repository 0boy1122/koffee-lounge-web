"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { menuItems, type MenuItem } from "@/lib/menu-data";
import { api } from "@/lib/api";

export interface CartLine {
  item: MenuItem;
  qty: number;
}

interface CartContextValue {
  menuItems: MenuItem[];
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
  applyPromo: (code: string) => Promise<void>;
  total: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [availableMenuItems, setAvailableMenuItems] = useState<MenuItem[]>(menuItems);
  const [promoCode, setPromoCode] = useState("");
  const [discountRate, setDiscountRate] = useState(0);
  const [promoError, setPromoError] = useState("");

  useEffect(() => {
    void api.getMenu().then((items) => {
      setAvailableMenuItems(items.map((item) => ({
        ...item,
        price: Number(item.price),
        tags: item.tags.filter((tag): tag is MenuItem["tags"][number] =>
          tag === "vegan" || tag === "gf" || tag === "nuts"
        ),
      })));
    }).catch(() => {
      // Preserve the local catalogue when the API is offline.
    });
  }, []);

  const addItem = useCallback((id: string) => {
    const fallbackItem = menuItems.find((item) => item.id === id);
    const item = availableMenuItems.find((candidate) => candidate.id === id)
      ?? availableMenuItems.find((candidate) => candidate.name === fallbackItem?.name);
    if (!item) return;

    setLines((prev) => {
      const existing = prev.find((line) => line.item.id === item.id);
      if (existing) {
        return prev.map((l) =>
          l.item.id === item.id ? { ...l, qty: l.qty + 1 } : l
        );
      }
      return [...prev, { item, qty: 1 }];
    });
  }, [availableMenuItems]);

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

  const applyPromo = useCallback(async (code: string) => {
    const normalized = code.trim().toUpperCase();
    setPromoCode(normalized);
    if (!normalized) {
      setDiscountRate(0);
      setPromoError("");
      return;
    }
    try {
      const promo = await api.validatePromo(normalized);
      setPromoCode(promo.code);
      setDiscountRate(promo.discountRate);
      setPromoError("");
    } catch (error) {
      setDiscountRate(0);
      setPromoError(error instanceof Error ? error.message : "That code doesn't exist or has expired.");
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
    menuItems: availableMenuItems,
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
