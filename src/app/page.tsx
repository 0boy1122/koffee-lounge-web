import { AppImage as Image } from "@/components/AppImage";
import Link from "next/link";
import { ArrowButton } from "@/components/ArrowButton";
import { AddToCartButton } from "@/components/AddToCartButton";
import { BranchDoodle } from "@/components/BranchDoodle";
import { CupIcon } from "@/components/CupIcon";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { menuItems } from "@/lib/menu-data";

const drinkPills = ["Espresso", "Macchiato", "Flatwhite", "Cappuccino", "Latte", "Mocha", "Americano"];

const flavors = [
  {
    name: "Caramel Bliss",
    detail: "Rich caramel & creamy espresso",
    price: "GH₵29.75",
    image: "/gallery/flavor-caramel2.jpg",
    id: "mango-smoothie",
  },
  {
    name: "Mocha Delight",
    detail: "Chocolate-infused coffee perfection",
    price: "GH₵28.50",
    image: "/gallery/flavor-mocha2.jpg",
    id: "iced-mocha",
  },
  {
    name: "Golden Cappuccino",
    detail: "Smooth espresso with silky microfoam",
    price: "GH₵24.00",
    image: "/gallery/flavor-cappuccino2.jpg",
    id: "flat-white",
  },
];

const features = [
  { title: "Premium Beans", detail: "Single-origin, ethically sourced from Ghanaian farms." },
  { title: "Expert Roasting", detail: "Small-batch roasted to unlock sweetness and depth." },
  { title: "Sustainable Sourcing", detail: "Direct partnerships that support the farmers we buy from." },
  { title: "Fresh Every Day", detail: "Roasted daily so every cup hits peak flavor." },
];

const stats = [
  { value: "50+", label: "Drinks on Menu" },
  { value: "40+", label: "Corporate Clients" },
  { value: "10,000+", label: "Happy Customers" },
  { value: "Est.", label: "2019" },
];

export default function HomePage() {
  const popular = menuItems.filter((i) => i.popular).slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-8 pt-10 md:px-8 md:pt-16">
        {/* Decorative watermark swirl behind the headline */}
        <svg
          viewBox="0 0 700 700"
          className="pointer-events-none absolute left-1/2 top-0 h-[640px] w-[640px] -translate-x-1/2 text-espresso/[0.07] md:h-[760px] md:w-[760px]"
          aria-hidden="true"
        >
          <path
            d="M350 60c150 0 260 110 260 250s-120 250-270 250c-110 0-190-60-190-145 0-70 60-120 130-120 55 0 95 35 95 85 0 35-27 60-60 60"
            stroke="currentColor"
            strokeWidth="46"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <BranchDoodle className="pointer-events-none absolute -left-6 top-6 hidden h-40 w-40 text-espresso/10 sm:block" />
        <BranchDoodle className="pointer-events-none absolute -right-6 bottom-0 hidden h-40 w-40 rotate-180 text-espresso/10 sm:block" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-amber-dark">
            Est. in Accra
          </p>
          <h1 className="mt-3 font-display text-5xl font-extrabold leading-[1.05] text-espresso md:text-7xl">
            Freshly Brewed Coffee
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base text-espresso/70">
            A neighbourhood roastery for everyday coffee lovers, and a
            dependable catering partner for the offices around them.
          </p>
        </div>

        <div className="relative mx-auto mt-10 flex max-w-2xl justify-center">
          <div className="float-sway relative z-20 mt-6 aspect-[4/5] w-[36%] -rotate-6 overflow-hidden rounded-2xl border-4 border-white shadow-xl">
            <Image src="/gallery/hero-latte-wood2.jpg" alt="Latte art on a wooden tray" fill className="object-cover" priority />
          </div>
          <div className="float-sway relative z-10 aspect-[4/5] w-[36%] -mx-4 overflow-hidden rounded-2xl border-4 border-white shadow-xl" style={{ animationDelay: "0.6s" }}>
            <Image src="/gallery/hero-whipped-choc2.jpg" alt="Whipped-cream coffee drink" fill className="object-cover" priority />
          </div>
          <div className="float-sway relative z-20 mt-6 aspect-[4/5] w-[36%] rotate-6 overflow-hidden rounded-2xl border-4 border-white shadow-xl" style={{ animationDelay: "1.2s" }}>
            <Image src="/gallery/hero-latte-flowers2.jpg" alt="Latte art with dried flowers" fill className="object-cover" />
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-3">
          <ArrowButton href="/order" variant="amber">
            Order Online Now
          </ArrowButton>
          <ArrowButton href="/corporate" variant="outline">
            Book Corporate Services
          </ArrowButton>
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2">
          {drinkPills.map((pill, i) => (
            <Link
              key={pill}
              href="/menu"
              className={`rounded-full px-4 py-2 font-display text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5 ${
                i === 3 ? "bg-amber text-espresso-deep" : "bg-white text-espresso"
              }`}
              style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 2}deg)` }}
            >
              {pill}
            </Link>
          ))}
        </div>
      </section>

      {/* More than just coffee */}
      <section className="px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
            <Image src="/gallery/interior-counter2.jpg" alt="Koffee Lounge interior" fill className="object-cover" />
          </div>
          <div>
            <h2 className="font-display text-4xl font-extrabold leading-tight text-espresso md:text-5xl">
              More Than
              <br />
              Just Coffee
            </h2>
            <p className="mt-4 max-w-md text-espresso/70">
              At Koffee Lounge, coffee is a daily ritual crafted with passion.
              We source premium beans from Ghanaian farms and roast them
              in-house to unlock rich flavors — for the guest grabbing a
              flat white, and the office ordering fifty of them.
            </p>
            <ul className="mt-5 space-y-2">
              {["Premium beans, expertly roasted", "Crafted fresh, every day", "Cozy space, great coffee", "Reliable office delivery"].map((line) => (
                <li key={line} className="flex items-center gap-2 text-sm font-semibold text-espresso">
                  <CupIcon className="h-4 w-4 text-amber-dark" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-6 text-center md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-4xl font-extrabold text-espresso md:text-5xl">{s.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-espresso/60">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular flavors */}
      <section className="px-4 py-16 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-display text-4xl font-extrabold text-espresso md:text-5xl">
            Popular Flavors
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {flavors.map((f) => (
              <div key={f.name} className="rounded-2xl bg-white p-6 text-center shadow-md">
                <div className="flex justify-center gap-0.5 text-amber">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-3 font-display text-2xl font-bold text-espresso">{f.name}</p>
                <p className="mt-1 text-sm text-espresso/60">{f.detail}</p>
                <p className="mt-3 font-display text-xl font-bold text-espresso">{f.price}</p>
                <div className="relative mx-auto mt-4 h-40 w-40">
                  <div className="h-full w-full overflow-hidden rounded-full border-4 border-cream shadow-inner">
                    <Image src={f.image} alt={f.name} fill className="object-cover" />
                  </div>
                  <AddToCartButton id={f.id} className="absolute -bottom-4 left-1/2 -translate-x-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate banner (dark band) */}
      <div className="torn-edge-down" />
      <section className="bg-espresso px-4 py-16 text-cream md:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-amber">
            For Your Office
          </p>
          <h2 className="mt-3 font-display text-4xl font-extrabold md:text-5xl">
            Coffee Subscriptions &amp; Catering, Built for Teams
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-cream/70">
            From a weekly bean delivery to a 60-person all-hands, our
            corporate team builds a package around your schedule and budget.
          </p>
          <div className="mt-7 flex justify-center gap-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cream/70">
              <span className="text-amber">☕</span> Freshly Prepared
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cream/70">
              <span className="text-amber">🚚</span> Reliable Delivery
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cream/70">
              <span className="text-amber">✓</span> Quality Guaranteed
            </div>
          </div>
          <div className="mt-7 flex justify-center">
            <ArrowButton href="/corporate#inquiry" variant="amber">
              Request Corporate Proposal
            </ArrowButton>
          </div>
        </div>
      </section>
      <div className="torn-edge-up" />

      {/* Why choose us */}
      <section className="px-4 py-16 md:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-display text-4xl font-extrabold text-espresso md:text-5xl">
            Why Choose Koffee Lounge
          </h2>
          <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {features.map((f) => (
              <div key={f.title} className="flex gap-4">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-amber/15">
                  <CupIcon className="h-5 w-5 text-amber-dark" />
                </span>
                <div>
                  <p className="font-display text-lg font-bold text-espresso">{f.title}</p>
                  <p className="mt-1 text-sm text-espresso/60">{f.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular items quick add (from spec: Popular Items Preview) */}
      <section className="px-4 pb-16 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl font-extrabold text-espresso">On the Counter Today</h2>
            <Link href="/menu" className="hidden font-display text-sm font-bold text-amber-dark md:block">
              View full menu →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((item) => (
              <div key={item.id} className="rounded-2xl bg-white p-4 text-center shadow-sm">
                <div className="relative mx-auto aspect-square w-28">
                  <div className="h-full w-full overflow-hidden rounded-full">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <AddToCartButton id={item.id} className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-9 w-9" />
                </div>
                <div className="mt-5 flex items-start justify-between gap-2">
                  <p className="font-display text-sm font-bold text-espresso">{item.name}</p>
                  <span className="flex-shrink-0 font-display text-sm font-bold text-amber-dark">
                    GH₵{item.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery CTA */}
      <div className="torn-edge-down" />
      <section className="relative overflow-hidden bg-espresso px-4 py-16 text-cream md:px-8">
        <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-[0.8fr_1fr]">
          <div className="relative mx-auto aspect-[2/3] w-full max-w-xs overflow-hidden rounded-2xl">
            <Image src="/gallery/courier2.jpg" alt="Koffee Lounge delivery courier" fill className="object-cover" />
          </div>
          <div>
            <h2 className="font-display text-4xl font-extrabold leading-tight md:text-5xl">
              Koffee Cravings? We&apos;ve Got You Covered
            </h2>
            <p className="mt-4 max-w-md text-cream/70">
              Order your favorite drinks and treats for quick delivery within
              our service area. Fresh ingredients, careful packaging, and
              dependable delivery — every single time.
            </p>
            <div className="mt-6">
              <ArrowButton href="/order" variant="amber">
                Order Now
              </ArrowButton>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-xs font-semibold text-cream/60">
              <span>☕ Freshly Prepared</span>
              <span>🚚 Reliable Local Delivery</span>
              <span>✓ Quality Guaranteed</span>
            </div>
          </div>
        </div>
      </section>
      <div className="torn-edge-up" />

      {/* Testimonials */}
      <section className="px-4 py-16 md:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-display text-4xl font-extrabold text-espresso md:text-5xl">
            What Our Regulars Say
          </h2>
          <TestimonialCarousel />
        </div>
      </section>
    </>
  );
}
