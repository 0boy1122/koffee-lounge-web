"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { ArrowButton } from "@/components/ArrowButton";
import { CupIcon } from "@/components/CupIcon";

type Modality = "delivery" | "pickup" | "dine-in";
type Step = "cart" | "modality" | "tracking";
type OrderStage = "received" | "preparing" | "final";

const STAGE_LABELS: Record<Modality, string> = {
  delivery: "Out for Delivery",
  pickup: "Ready for Pick-Up",
  "dine-in": "Ready at Your Table",
};

export default function OrderPage() {
  const { lines, setQty, removeItem, subtotal, promoCode, promoError, discountRate, applyPromo, total, clear } =
    useCart();

  const [step, setStep] = useState<Step>("cart");
  const [modality, setModality] = useState<Modality | null>(null);
  const [promoInput, setPromoInput] = useState(promoCode);
  const [leadEmail, setLeadEmail] = useState("");
  const [leadApplied, setLeadApplied] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [stage, setStage] = useState<OrderStage>("received");

  // Mock a real-time status tracker advancing on its own, since there's no
  // backend/POS behind this prototype yet.
  useEffect(() => {
    if (step !== "tracking") return;
    const t1 = window.setTimeout(() => setStage("preparing"), 3000);
    const t2 = window.setTimeout(() => setStage("final"), 7000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [step]);

  const startCheckout = (m: Modality) => {
    setModality(m);
    setOrderNumber(`KL-${Math.floor(1000 + Math.random() * 9000)}`);
    setStage("received");
    setStep("tracking");
    clear();
  };

  if (step === "tracking" && modality) {
    return <StatusTracker modality={modality} orderNumber={orderNumber} stage={stage} />;
  }

  return (
    <section className="px-4 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-amber-dark">
          Your Order
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold text-espresso">
          {lines.length === 0 ? "Your cart is empty" : "Review Your Order"}
        </h1>

        {lines.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-espresso/60">
              Nothing here yet — add something good from the menu.
            </p>
            <div className="mt-5 flex justify-center">
              <ArrowButton href="/menu" variant="amber">
                Browse the Menu
              </ArrowButton>
            </div>
          </div>
        ) : (
          <>
            {!leadApplied && (
              <div className="mt-6 flex flex-col gap-3 rounded-2xl border-2 border-amber/40 bg-amber/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-espresso/80">
                  <span className="font-bold text-amber-dark">Get 15% off</span> your
                  first order — enter your email to apply it now.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!leadEmail.trim()) return;
                    applyPromo("FIRST15");
                    setPromoInput("FIRST15");
                    setLeadApplied(true);
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="email"
                    required
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-40 rounded-full border border-espresso/15 bg-white px-3 py-1.5 text-sm text-espresso placeholder:text-espresso/40 focus:border-amber focus:outline-none sm:w-48"
                  />
                  <button className="flex-shrink-0 rounded-full bg-amber px-4 py-1.5 text-xs font-bold text-espresso-deep">
                    Apply
                  </button>
                </form>
              </div>
            )}

            <div className="mt-6 divide-y divide-espresso/8 rounded-2xl bg-white shadow-sm">
              {lines.map(({ item, qty }) => (
                <div key={item.id} className="flex items-center gap-4 p-4">
                  <div className="flex-1">
                    <p className="font-display text-base font-bold text-espresso">{item.name}</p>
                    <p className="text-xs text-espresso/50">GH₵{item.price} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQty(item.id, qty - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-espresso/20 text-espresso/70"
                      aria-label={`Remove one ${item.name}`}
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-sm font-semibold text-espresso">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(item.id, qty + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-espresso/20 text-espresso/70"
                      aria-label={`Add one more ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                  <span className="w-20 flex-shrink-0 text-right font-display text-sm font-bold text-amber-dark">
                    GH₵{qty * item.price}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-espresso/30 hover:text-espresso/60"
                    aria-label={`Remove ${item.name}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Promo code */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                applyPromo(promoInput);
              }}
              className="mt-4 flex gap-2"
            >
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Promo code"
                className="flex-1 rounded-full border border-espresso/15 bg-white px-4 py-2 text-sm uppercase text-espresso placeholder:text-espresso/40 placeholder:normal-case focus:border-amber focus:outline-none"
              />
              <button className="rounded-full border-2 border-espresso px-4 py-2 text-sm font-bold text-espresso">
                Apply
              </button>
            </form>
            {promoError && <p className="mt-1.5 text-xs text-red-600">{promoError}</p>}
            {discountRate > 0 && !promoError && (
              <p className="mt-1.5 text-xs font-semibold text-amber-dark">
                {Math.round(discountRate * 100)}% discount applied.
              </p>
            )}

            {/* Totals */}
            <div className="mt-6 space-y-1.5 rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex justify-between text-sm text-espresso/60">
                <span>Subtotal</span>
                <span>GH₵{subtotal.toFixed(2)}</span>
              </div>
              {discountRate > 0 && (
                <div className="flex justify-between text-sm font-semibold text-amber-dark">
                  <span>Discount ({Math.round(discountRate * 100)}%)</span>
                  <span>−GH₵{(subtotal - total).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-espresso/10 pt-2 font-display text-base font-bold text-espresso">
                <span>Total</span>
                <span>GH₵{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <ArrowButton type="button" variant="amber" onClick={() => setStep("modality")} className="w-full justify-center">
                Continue to Checkout
              </ArrowButton>
            </div>
          </>
        )}
      </div>

      {step === "modality" && (
        <ModalityModal onSelect={startCheckout} onClose={() => setStep("cart")} />
      )}
    </section>
  );
}

function ModalityModal({
  onSelect,
  onClose,
}: {
  onSelect: (m: Modality) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-espresso/60 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-t-2xl bg-cream p-6 sm:rounded-2xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-extrabold text-espresso">How would you like it?</h2>
          <button onClick={onClose} className="text-espresso/40 hover:text-espresso/70" aria-label="Close">
            ✕
          </button>
        </div>
        <p className="mt-1 text-sm text-espresso/50">
          No account needed — we&apos;ll text order updates to this number.
        </p>

        <div className="mt-5 space-y-3">
          <ModalityOption
            title="Delivery"
            detail="Enter your address — we'll check the delivery radius."
            onClick={() => onSelect("delivery")}
          />
          <ModalityOption
            title="Pick Up / Takeaway"
            detail="Choose a pick-up time slot at the counter."
            onClick={() => onSelect("pickup")}
          />
          <ModalityOption
            title="Dine-In / Table Order"
            detail="Scan the table QR code, or tell us your table number."
            onClick={() => onSelect("dine-in")}
          />
        </div>
      </div>
    </div>
  );
}

function ModalityOption({
  title,
  detail,
  onClick,
}: {
  title: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl bg-white p-4 text-left shadow-sm transition-colors hover:ring-2 hover:ring-amber"
    >
      <p className="font-display text-base font-bold text-espresso">{title}</p>
      <p className="mt-0.5 text-xs text-espresso/50">{detail}</p>
    </button>
  );
}

function StatusTracker({
  modality,
  orderNumber,
  stage,
}: {
  modality: Modality;
  orderNumber: string;
  stage: OrderStage;
}) {
  const steps: { key: OrderStage; label: string }[] = [
    { key: "received", label: "Order Received" },
    { key: "preparing", label: "Preparing" },
    { key: "final", label: STAGE_LABELS[modality] },
  ];
  const activeIndex = steps.findIndex((s) => s.key === stage);

  return (
    <section className="flex min-h-[70vh] items-center px-4 py-16 md:px-8">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-widest text-amber-dark">
            <CupIcon className="h-4 w-4" /> Order Ticket
          </span>
          <span className="rounded-full border border-espresso/20 px-2 py-0.5 font-display text-[11px] font-semibold text-espresso/60">
            #{orderNumber}
          </span>
        </div>

        <p className="mt-6 font-display text-2xl font-extrabold text-espresso">
          {modality === "delivery" && "On its way to you"}
          {modality === "pickup" && "Getting your takeaway ready"}
          {modality === "dine-in" && "Heading to your table"}
        </p>

        <div className="mt-8 space-y-0">
          {steps.map((s, i) => {
            const done = i <= activeIndex;
            return (
              <div key={s.key} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-bold transition-colors ${
                      done ? "border-amber bg-amber text-espresso-deep" : "border-espresso/20 text-espresso/30"
                    }`}
                  >
                    {done ? "✓" : ""}
                  </span>
                  {i < steps.length - 1 && (
                    <span
                      className={`h-8 w-0.5 transition-colors ${
                        i < activeIndex ? "bg-amber" : "bg-espresso/15"
                      }`}
                    />
                  )}
                </div>
                <p className={`pt-0.5 text-sm font-semibold ${done ? "text-espresso" : "text-espresso/35"}`}>
                  {s.label}
                </p>
              </div>
            );
          })}
        </div>

        <p className="mt-6 border-t border-dashed border-espresso/15 pt-4 text-xs text-espresso/50">
          We&apos;ll text you as your order moves through each step.
        </p>

        <div className="mt-6">
          <ArrowButton href="/menu" variant="amber">
            Order Something Else
          </ArrowButton>
        </div>
      </div>
    </section>
  );
}
