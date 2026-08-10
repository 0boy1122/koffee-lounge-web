"use client";

import { useMemo, useState } from "react";
import { AppImage as Image } from "@/components/AppImage";
import { categories, dietaryLabels, type DietaryTag } from "@/lib/menu-data";
import { AddToCartButton } from "@/components/AddToCartButton";
import { useCart } from "@/components/CartProvider";

const dietaryFilters: DietaryTag[] = ["vegan", "gf", "nuts"];

export default function MenuPage() {
  const { menuItems } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>("All Menu");
  const [search, setSearch] = useState("");
  const [activeTags, setActiveTags] = useState<Set<DietaryTag>>(new Set());

  const toggleTag = (tag: DietaryTag) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const filtered = useMemo(() => {
    return menuItems.filter((item) => {
      if (activeCategory !== "All Menu" && item.category !== activeCategory) return false;
      if (search.trim() && !item.name.toLowerCase().includes(search.trim().toLowerCase())) {
        return false;
      }
      if (activeTags.size > 0 && ![...activeTags].every((tag) => item.tags.includes(tag))) {
        return false;
      }
      return true;
    });
  }, [activeCategory, search, activeTags]);

  return (
    <>
      <section className="px-4 pb-6 pt-14 md:px-8 md:pt-20">
        <div className="mx-auto max-w-6xl text-center">
          <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-amber-dark">
            Interactive Menu
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold text-espresso md:text-5xl">
            Explore Our Menu
          </h1>

          <div className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search the menu…"
              className="w-full rounded-full border border-espresso/15 bg-white px-4 py-2.5 text-sm text-espresso placeholder:text-espresso/40 focus:border-amber focus:outline-none"
            />
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {dietaryFilters.map((tag) => {
              const active = activeTags.has(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full border px-3 py-1.5 font-display text-xs font-bold transition-colors ${
                    active
                      ? "border-amber bg-amber text-espresso-deep"
                      : "border-espresso/15 bg-white text-espresso/70 hover:border-espresso/30"
                  }`}
                >
                  {dietaryLabels[tag].mark} {dietaryLabels[tag].label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Category sub-nav */}
      <div className="sticky top-[65px] z-30 bg-cream/95 py-4 backdrop-blur md:top-[73px]">
        <div className="mx-auto flex max-w-6xl justify-center gap-2 overflow-x-auto px-4 md:px-8">
          {["All Menu", ...categories.filter((category) => menuItems.some((item) => item.category === category))].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 rounded-full px-4 py-2 font-display text-sm font-semibold shadow-sm transition-colors ${
                activeCategory === cat
                  ? "bg-amber text-espresso-deep"
                  : "bg-white text-espresso/70 hover:text-espresso"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <section className="px-4 py-8 md:px-8">
        <div className="mx-auto max-w-6xl">
          {filtered.length === 0 ? (
            <p className="py-16 text-center text-espresso/50">
              Nothing matches that search — try another keyword or clear a filter.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((item) => (
                <div key={item.id} className="rounded-2xl bg-white p-5 text-center shadow-sm">
                  <p className="font-display text-xs font-bold uppercase tracking-wide text-amber-dark">
                    • {item.category}
                  </p>
                  <p className="mt-1 font-display text-base font-bold text-espresso">{item.name}</p>
                  <p className="mt-0.5 font-display text-sm font-bold text-espresso/70">
                    GH₵{item.price}
                  </p>
                  <div className="relative mx-auto mt-4 h-28 w-28">
                    <div className="h-full w-full overflow-hidden rounded-full">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <AddToCartButton id={item.id} className="absolute bottom-0 right-0 h-9 w-9" />
                  </div>
                  {item.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-espresso/15 px-2 py-0.5 font-display text-[10px] font-semibold text-espresso/50"
                        >
                          {dietaryLabels[tag].mark}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
