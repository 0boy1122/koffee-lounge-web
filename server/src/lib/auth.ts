import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const TOKEN_TTL = "8h";

function jwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET must be set in production.");
  }
  return "dev-only-secret-change-me";
}

export function validateAuthConfiguration(): void {
  jwtSecret();
}

export interface StaffTokenPayload {
  staffId: string;
  role: "STAFF" | "ADMIN";
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signStaffToken(payload: StaffTokenPayload): string {
  return jwt.sign(payload, jwtSecret(), { expiresIn: TOKEN_TTL });
}

export function verifyStaffToken(token: string): StaffTokenPayload | null {
  try {
    return jwt.verify(token, jwtSecret()) as StaffTokenPayload;
  } catch {
    return null;
  }
}
