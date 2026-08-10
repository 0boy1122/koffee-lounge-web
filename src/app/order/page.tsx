"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { ArrowButton } from "@/components/ArrowButton";
import { CupIcon } from "@/components/CupIcon";
import { api } from "@/lib/api";

type Modality = "delivery" | "pickup" | "dine-in";
type Step = "cart" | "modality" | "tracking";
type OrderStage = "received" | "preparing" | "final";
type CheckoutDetails = {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  tableNumber?: string;
};

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
  const [orderId, setOrderId] = useState("");
  const [trackingToken, setTrackingToken] = useState("");
  const [stage, setStage] = useState<OrderStage>("received");
  const [checkoutError, setCheckoutError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (step !== "tracking" || !orderId || !trackingToken) return;
    const syncStatus = async () => {
      try {
        const order = await api.getOrder(orderId, trackingToken);
        setStage(order.status === "RECEIVED" ? "received" : order.status === "PREPARING" ? "preparing" : "final");
      } catch {
        // Keep the most recently known state while a request is retried.
      }
    };
    void syncStatus();
    const interval = window.setInterval(() => void syncStatus(), 5000);
    return () => window.clearInterval(interval);
  }, [step, orderId, trackingToken]);

  const startCheckout = async (m: Modality, details: CheckoutDetails) => {
    setCheckoutError("");
    setIsSubmitting(true);
    try {
      const order = await api.createOrder({
        items: lines.map(({ item, qty }) => ({ menuItemId: item.id, quantity: qty })),
        modality: m === "delivery" ? "DELIVERY" : m === "pickup" ? "PICKUP" : "DINE_IN",
        promoCode: promoCode || undefined,
        ...details,
      });
      if (!order.trackingToken) throw new Error("We couldn't start secure order tracking. Please try again.");
      setOrderId(order.id);
      setTrackingToken(order.trackingToken);
      setOrderNumber(order.orderNumber);
      setStage("received");
      setModality(m);
      setStep("tracking");
      clear();
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "We couldn't place your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
                    void applyPromo("FIRST15");
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
                void applyPromo(promoInput);
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
        <ModalityModal onSelect={startCheckout} onClose={() => setStep("cart")} isSubmitting={isSubmitting} error={checkoutError} />
      )}
    </section>
  );
}

function ModalityModal({
  onSelect,
  onClose,
  isSubmitting,
  error,
}: {
  onSelect: (m: Modality, details: CheckoutDetails) => void | Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
  error: string;
}) {
  const [selectedModality, setSelectedModality] = useState<Modality | null>(null);
  const submitDetails = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedModality) return;
    const form = new FormData(event.currentTarget);
    void onSelect(selectedModality, {
      customerName: String(form.get("customerName") ?? ""),
      customerEmail: String(form.get("customerEmail") ?? "") || undefined,
      customerPhone: String(form.get("customerPhone") ?? "") || undefined,
      deliveryAddress: String(form.get("deliveryAddress") ?? "") || undefined,
      tableNumber: String(form.get("tableNumber") ?? "") || undefined,
    });
  };

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
            onClick={() => setSelectedModality("delivery")}
            disabled={isSubmitting}
          />
          <ModalityOption
            title="Pick Up / Takeaway"
            detail="Choose a pick-up time slot at the counter."
            onClick={() => setSelectedModality("pickup")}
            disabled={isSubmitting}
          />
          <ModalityOption
            title="Dine-In / Table Order"
            detail="Scan the table QR code, or tell us your table number."
            onClick={() => setSelectedModality("dine-in")}
            disabled={isSubmitting}
          />
        </div>
        {selectedModality && (
          <form onSubmit={submitDetails} className="mt-5 space-y-3 border-t border-espresso/10 pt-5">
            <input name="customerName" required placeholder="Your name" className="w-full rounded-lg border border-espresso/15 bg-white px-3 py-2 text-sm" />
            <div className="grid gap-3 sm:grid-cols-2">
              <input name="customerEmail" type="email" placeholder="Email address" className="w-full rounded-lg border border-espresso/15 bg-white px-3 py-2 text-sm" />
              <input name="customerPhone" type="tel" placeholder="Phone number" className="w-full rounded-lg border border-espresso/15 bg-white px-3 py-2 text-sm" />
            </div>
            {selectedModality === "delivery" && <input name="deliveryAddress" required placeholder="Delivery address" className="w-full rounded-lg border border-espresso/15 bg-white px-3 py-2 text-sm" />}
            {selectedModality === "dine-in" && <input name="tableNumber" required placeholder="Table number" className="w-full rounded-lg border border-espresso/15 bg-white px-3 py-2 text-sm" />}
            <button disabled={isSubmitting} className="w-full rounded-full bg-amber px-4 py-2.5 text-sm font-bold text-espresso-deep disabled:opacity-60">
              {isSubmitting ? "Placing order…" : "Place order"}
            </button>
            <p className="text-xs text-espresso/50">Add at least an email address or phone number.</p>
          </form>
        )}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        {isSubmitting && <p className="mt-4 text-sm text-espresso/60">Placing your order…</p>}
      </div>
    </div>
  );
}

function ModalityOption({
  title,
  detail,
  onClick,
  disabled,
}: {
  title: string;
  detail: string;
  onClick: () => void | Promise<void>;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-xl bg-white p-4 text-left shadow-sm transition-colors hover:ring-2 hover:ring-amber disabled:cursor-not-allowed disabled:opacity-60"
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
