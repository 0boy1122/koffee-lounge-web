"use client";

import { useState, type FormEvent } from "react";
import { ArrowButton } from "@/components/ArrowButton";

const offerings = [
  {
    title: "Office Coffee Subscriptions",
    detail: "Fresh roast deliveries on a schedule, with bean-to-cup machine support included.",
  },
  {
    title: "Corporate Catering",
    detail: "Breakfast spreads, sandwich platters, executive lunches, and coffee carafes for meetings.",
  },
  {
    title: "Event & Venue Rental",
    detail: "Reserve the lounge for mixers, workshops, or private networking events.",
  },
];

const clientLogos = ["Fintech HQ", "Baobab Studio", "Everstream Ltd.", "Northbridge Co."];

const serviceOptions = ["Catering", "Subscription", "Venue Rental", "Bulk Orders"];
const budgetOptions = ["Under GH₵1,000", "GH₵1,000 – 3,000", "GH₵3,000 – 10,000", "GH₵10,000+"];

export default function CorporatePage() {
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setReference(`CS-${Math.floor(1000 + Math.random() * 9000)}`);
    setSubmitted(true);
  };

  return (
    <>
      <section className="px-4 pb-8 pt-14 md:px-8 md:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-amber-dark">
            Corporate Services
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight text-espresso md:text-6xl">
            Coffee, Catering, and Space — Built Around Your Office
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-espresso/70">
            Tell us what you need and our corporate team replies within one
            business day with a proposal.
          </p>
        </div>
      </section>

      {/* Offerings */}
      <section className="px-4 py-10 md:px-8">
        <div className="mx-auto max-w-6xl grid gap-4 sm:grid-cols-3">
          {offerings.map((offer, i) => (
            <div key={offer.title} className="rounded-2xl bg-white p-6 shadow-sm">
              <span className="font-display text-xs font-bold text-amber-dark">0{i + 1}</span>
              <p className="mt-3 font-display text-lg font-bold text-espresso">{offer.title}</p>
              <p className="mt-2 text-sm text-espresso/60">{offer.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Inquiry form */}
      <section id="inquiry" className="scroll-mt-24 px-4 py-16 md:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center font-display text-3xl font-extrabold text-espresso">
            Request a Corporate Proposal
          </h2>
          <p className="mt-2 text-center text-sm text-espresso/60">
            The more detail you give us, the faster we can quote accurately.
          </p>

          {submitted ? (
            <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
              <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-dark">
                Inquiry received — Ref #{reference}
              </p>
              <p className="mt-3 font-display text-xl font-bold text-espresso">
                Thanks — our corporate team has been notified.
              </p>
              <p className="mt-2 text-sm text-espresso/60">
                Expect a reply at the email or phone you provided within one
                business day. Keep your reference number for follow-up.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-5 font-display text-sm font-bold text-amber-dark hover:text-espresso"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full Name" name="name" required />
                <Field label="Company Name" name="company" required />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-espresso/80">
                    Service Needed
                  </label>
                  <select
                    required
                    className="mt-1.5 w-full rounded-lg border border-espresso/15 bg-cream px-3 py-2.5 text-sm text-espresso focus:border-amber focus:outline-none"
                  >
                    <option value="">Select one…</option>
                    {serviceOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-espresso/80">
                    Budget Range
                  </label>
                  <select
                    required
                    className="mt-1.5 w-full rounded-lg border border-espresso/15 bg-cream px-3 py-2.5 text-sm text-espresso focus:border-amber focus:outline-none"
                  >
                    <option value="">Select one…</option>
                    {budgetOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Estimated Date" name="date" type="date" required />
                <Field label="Guest / Headcount" name="headcount" type="number" placeholder="e.g. 40" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-espresso/80">
                  Specific Notes / Dietary Requirements
                </label>
                <textarea
                  rows={4}
                  className="mt-1.5 w-full rounded-lg border border-espresso/15 bg-cream px-3 py-2.5 text-sm text-espresso placeholder:text-espresso/35 focus:border-amber focus:outline-none"
                  placeholder="Anything else we should know?"
                />
              </div>
              <ArrowButton type="submit" variant="amber">
                Send Inquiry
              </ArrowButton>
            </form>
          )}
        </div>
      </section>

      {/* Social proof */}
      <div className="torn-edge-down" />
      <section className="bg-espresso px-4 py-16 text-cream md:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-center font-display text-xs font-bold uppercase tracking-[0.25em] text-cream/40">
            Trusted by teams across Accra
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {clientLogos.map((name) => (
              <span key={name} className="font-display text-lg font-bold text-cream/50">
                {name}
              </span>
            ))}
          </div>
          <blockquote className="mx-auto mt-10 max-w-2xl text-center">
            <p className="font-display text-xl leading-snug text-cream/85">
              &ldquo;Koffee Lounge runs our office subscription and last
              quarter&apos;s all-hands catering. Both were seamless.&rdquo;
            </p>
            <footer className="mt-4 font-display text-xs font-semibold text-amber">
              Operations Manager, Fintech HQ
            </footer>
          </blockquote>
        </div>
      </section>
      <div className="torn-edge-up" />
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-espresso/80">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-espresso/15 bg-cream px-3 py-2.5 text-sm text-espresso placeholder:text-espresso/35 focus:border-amber focus:outline-none"
      />
    </div>
  );
}
