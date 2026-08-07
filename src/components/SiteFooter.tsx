import Image from "next/image";
import Link from "next/link";

const socials = [
  { label: "Facebook", path: "M14 9h-2V7c0-.6.4-1 1-1h1V3h-2a3 3 0 0 0-3 3v3H7v3h2v6h3v-6h2l1-3z" },
  {
    label: "Instagram",
    path: "M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8zm4 3.5A4.5 4.5 0 1 1 7.5 13 4.5 4.5 0 0 1 12 8.5zm0 2A2.5 2.5 0 1 0 14.5 13 2.5 2.5 0 0 0 12 10.5zM17.75 6.75a1 1 0 1 1-1-1 1 1 0 0 1 1 1z",
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-cream pt-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 md:px-8">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Koffee Lounge" width={1064} height={649} className="h-20 w-auto" />
        </Link>

        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          {[
            { href: "/", label: "Home" },
            { href: "/menu", label: "Menu" },
            { href: "/about", label: "About Us" },
            { href: "/corporate", label: "Corporate" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-display text-sm font-semibold text-espresso/75 hover:text-espresso"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex gap-3">
          {socials.map((s) => (
            <a
              key={s.label}
              href="#"
              aria-label={s.label}
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-amber text-amber-dark transition-colors hover:bg-amber hover:text-espresso-deep"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d={s.path} />
              </svg>
            </a>
          ))}
        </div>

        <div className="grid gap-1 pb-8 text-center text-xs text-espresso/50">
          <p>
            12 Independence Ave, Accra &middot; Mon–Fri 6:30am–8pm &middot; Sat–Sun 7:30am–9pm
          </p>
          <p>© {new Date().getFullYear()} Koffee Lounge. All rights reserved.</p>
        </div>
      </div>

      <div className="relative h-16 w-full overflow-hidden md:h-24">
        <Image
          src="/gallery/coffee-beans-strip2.jpg"
          alt=""
          fill
          className="object-cover"
        />
      </div>
    </footer>
  );
}
