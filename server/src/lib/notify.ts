import type { CorporateInquiry, Order } from "@prisma/client";

/**
 * Notification stubs. No email/SMS provider is wired up yet — these just log
 * what *would* be sent, so the call sites are already in place. Swap the
 * body for a real provider (Resend, SendGrid, Twilio, Hubtel SMS, etc.) when
 * credentials are available; nothing else in the codebase needs to change.
 */

export async function notifySalesTeam(inquiry: CorporateInquiry): Promise<void> {
  console.log(
    `[notify] New corporate inquiry ${inquiry.referenceCode} from ${inquiry.fullName} ` +
      `(${inquiry.companyName}) — service: ${inquiry.serviceNeeded}, headcount: ${inquiry.headcount}.`
  );
}

export async function notifyCustomerOrderConfirmed(order: Order): Promise<void> {
  const contact = order.customerEmail ?? order.customerPhone ?? "guest";
  console.log(`[notify] Order ${order.orderNumber} confirmed — would notify ${contact}.`);
}

export async function notifyCustomerStatusChanged(order: Order): Promise<void> {
  const contact = order.customerEmail ?? order.customerPhone ?? "guest";
  console.log(`[notify] Order ${order.orderNumber} is now ${order.status} — would notify ${contact}.`);
}

export async function notifyKitchen(order: Order): Promise<void> {
  console.log(`[notify] New kitchen ticket for order ${order.orderNumber} (${order.modality}).`);
}
