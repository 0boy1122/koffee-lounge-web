"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";

export function AddToCartButton({
  id,
  className = "",
}: {
  id: string;
  className?: string;
}) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  return (
    <button
      type="button"
      aria-label="Add to order"
      onClick={() => {
        addItem(id);
        setJustAdded(true);
        window.setTimeout(() => setJustAdded(false), 900);
      }}
      className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-amber text-espresso-deep shadow-md transition-transform hover:scale-105 active:scale-95 ${className}`}
    >
      {justAdded ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M4 12l5 5L20 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}
