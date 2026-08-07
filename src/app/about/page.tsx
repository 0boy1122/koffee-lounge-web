import type { Metadata } from "next";
import { AppImage as Image } from "@/components/AppImage";
import { ArrowButton } from "@/components/ArrowButton";

export const metadata: Metadata = {
  title: "About Us — Koffee Lounge",
  description: "The story behind Koffee Lounge: sourcing, sustainability, and community.",
};

const gallery = [
  { src: "/gallery/gallery-interior2.jpg", span: "sm:col-span-2 sm:row-span-2", alt: "Koffee Lounge interior" },
  { src: "/gallery/gallery-pastry-table2.jpg", span: "", alt: "Pastries and coffee at a table" },
  { src: "/gallery/gallery-latte-pour2.jpg", span: "sm:row-span-2", alt: "Barista pouring latte art" },
  { src: "/gallery/gallery-matcha2.jpg", span: "", alt: "Matcha lattes overhead" },
  { src: "/gallery/gallery-friends2.jpg", span: "sm:col-span-2", alt: "Friends catching up over coffee" },
  { src: "/gallery/gallery-pour-filter2.jpg", span: "", alt: "Barista pouring filter coffee" },
];

const commitments = [
  { mark: "🌱", title: "Ethically Sourced Beans", detail: "Direct trade with three Ghanaian and East African cooperatives." },
  { mark: "♻", title: "Eco-Friendly Packaging", detail: "Compostable cups, lids, and takeaway boxes, citywide." },
  { mark: "🌾", title: "Dietary Accommodations", detail: "Vegan and gluten-free options across every category." },
];

export default function AboutPage() {
  return (
    <>
      <section className="px-4 pb-8 pt-14 md:px-8 md:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-amber-dark">
            Our Story
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight text-espresso md:text-6xl">
            A Roastery That Grew Into a Workday Habit
          </h1>
          <div className="mx-auto mt-6 max-w-xl space-y-4 text-espresso/70">
            <p>
              Koffee Lounge started as a single roaster and three tables. We
              sourced our first bags direct from a cooperative outside
              Kumasi, and roasted small batches because we couldn&apos;t
              afford to do otherwise. That habit stuck — every bag we pour
              today is still roasted within the week it&apos;s brewed.
            </p>
            <p>
              As regulars started bringing their whole office for meetings,
              we built the corporate side of Koffee Lounge around what they
              asked for: reliable delivery, simple invoicing, and food that
              holds up past 10am.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery mosaic */}
      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-display text-4xl font-extrabold text-espresso md:text-5xl">
            Life @ Koffee Lounge
          </h2>
          <div className="mt-10 grid auto-rows-[140px] grid-cols-2 gap-3 sm:grid-cols-4 sm:auto-rows-[160px]">
            {gallery.map((g) => (
              <div key={g.src} className={`relative overflow-hidden rounded-2xl ${g.span}`}>
                <Image src={g.src} alt={g.alt} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability & sourcing */}
      <div className="torn-edge-down" />
      <section className="bg-espresso px-4 py-16 text-cream md:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-center font-display text-sm font-bold uppercase tracking-[0.25em] text-amber">
            Sourcing &amp; Sustainability
          </p>
          <h2 className="mt-2 text-center font-display text-4xl font-extrabold md:text-5xl">
            Good Coffee Starts With Who Grew It
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {commitments.map((item) => (
              <div key={item.title} className="rounded-2xl bg-cream/5 p-6 text-center">
                <span className="text-3xl">{item.mark}</span>
                <p className="mt-3 font-display text-lg font-bold">{item.title}</p>
                <p className="mt-1 text-sm text-cream/60">{item.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <ArrowButton href="/menu" variant="amber">
              Explore Our Menu
            </ArrowButton>
          </div>
        </div>
      </section>
      <div className="torn-edge-up" />
    </>
  );
}
