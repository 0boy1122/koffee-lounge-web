import { prisma } from "../db";
import { notifyCustomerStatusChanged } from "./notify";

/**
 * Auto-advances a freshly placed order through its lifecycle, standing in
 * for a real kitchen/POS integration. Staff can still override the status
 * manually at any time via PATCH /orders/:id/status — this only advances an
 * order if it's still sitting at the status it expects, so a manual change
 * (or cancellation) always wins.
 */
export function scheduleAutoAdvance(orderId: string): void {
  if (process.env.NODE_ENV === "production") return;
  setTimeout(() => advanceIfStillAt(orderId, "RECEIVED", "PREPARING"), 8_000);
  setTimeout(() => advanceToFinalStage(orderId), 25_000);
}

async function advanceIfStillAt(
  orderId: string,
  expected: "RECEIVED" | "PREPARING",
  next: "PREPARING" | "READY" | "OUT_FOR_DELIVERY"
) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.status !== expected) return;

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status: next, statusEvents: { create: { status: next, note: "Auto-advanced" } } },
  });
  await notifyCustomerStatusChanged(updated);
}

async function advanceToFinalStage(orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.status !== "PREPARING") return;

  const next = order.modality === "DELIVERY" ? "OUT_FOR_DELIVERY" : "READY";
  await advanceIfStillAt(orderId, "PREPARING", next);
}
