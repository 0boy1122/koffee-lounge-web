"use client";

import { AppImage as Image } from "@/components/AppImage";
import { useState } from "react";

const testimonials = [
  {
    name: "Ama O.",
    quote: "The coffee is fresh and perfectly brewed. The cozy atmosphere makes it my favorite spot. Highly recommended!",
    image: "/gallery/testimonial-hands2.jpg",
  },
  {
    name: "Naa D.",
    quote: "I come here every morning before work. It's become my happy place — the flat whites never miss.",
    image: "/gallery/testimonial-woman2.jpg",
  },
  {
    name: "Kwabena A.",
    quote: "I love stopping by before work. The staff are friendly, service is quick, and coffee is amazing.",
    image: "/gallery/testimonial-window2.jpg",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-amber">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialCarousel() {
  const [active, setActive] = useState(1);

  const cycle = (dir: 1 | -1) => {
    setActive((a) => (a + dir + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative mt-10">
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => cycle(-1)}
          aria-label="Previous testimonial"
          className="hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white text-espresso shadow-md sm:flex"
        >
          ←
        </button>

        <div className="grid gap-4 sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`rounded-2xl bg-white p-4 shadow-md transition-all ${
                i === active ? "sm:-translate-y-3 sm:shadow-xl" : "sm:opacity-70"
              } ${i === active ? "" : "hidden sm:block"}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image src={t.image} alt={t.name} fill className="object-cover" />
              </div>
              <div className="mt-3">
                <Stars />
                <p className="mt-2 text-sm text-espresso/75">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-3 font-display text-sm font-bold text-espresso">{t.name}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => cycle(1)}
          aria-label="Next testimonial"
          className="hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber text-espresso-deep shadow-md sm:flex"
        >
          →
        </button>
      </div>

      <div className="mt-6 flex justify-center gap-2 sm:hidden">
        <button onClick={() => cycle(-1)} className="rounded-full bg-white px-4 py-1.5 text-sm shadow">←</button>
        <button onClick={() => cycle(1)} className="rounded-full bg-amber px-4 py-1.5 text-sm text-espresso-deep shadow">→</button>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {testimonials.map((t, i) => (
          <button
            key={t.name}
            aria-label={`Show testimonial ${i + 1}`}
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all ${i === active ? "w-6 bg-espresso" : "w-2 bg-espresso/25"}`}
          />
        ))}
      </div>
    </div>
  );
}
