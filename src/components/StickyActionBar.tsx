"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export function StickyActionBar() {
  const { itemCount } = useCart();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-espresso/10 bg-cream/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <Link
        href="/order"
        className="relative flex flex-1 items-center justify-center rounded-full bg-amber py-3 font-display text-sm font-bold text-espresso-deep"
      >
        Order Online
        {itemCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-espresso font-display text-[11px] font-bold text-amber">
            {itemCount}
          </span>
        )}
      </Link>
      <Link
        href="/corporate"
        className="flex flex-1 items-center justify-center rounded-full border-2 border-espresso py-2.5 font-display text-sm font-bold text-espresso"
      >
        Corporate Services
      </Link>
    </div>
  );
}
