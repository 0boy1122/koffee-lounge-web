import { createHash, randomBytes } from "node:crypto";

function randomCode(prefix: string): string {
  return `${prefix}-${randomBytes(6).toString("hex").toUpperCase()}`;
}

export function generateOrderNumber(): string {
  return randomCode("KL");
}

export function generateInquiryReference(): string {
  return randomCode("CS");
}

export function generateTrackingToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashTrackingToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
