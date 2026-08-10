import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { prisma } from "../db";
import { signStaffToken, verifyPassword } from "../lib/auth";
import { requireStaff } from "../middleware/requireStaff";

export const authRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again in a few minutes." },
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post("/login", loginLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  const { email, password } = parsed.data;
  const staff = await prisma.staffUser.findUnique({ where: { email } });
  const valid = staff ? await verifyPassword(password, staff.passwordHash) : false;

  if (!staff || !valid) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  const token = signStaffToken({ staffId: staff.id, role: staff.role });
  res.cookie("staff_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 8 * 60 * 60 * 1000,
  });
  res.json({ id: staff.id, name: staff.name, email: staff.email, role: staff.role });
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie("staff_token");
  res.status(204).end();
});

authRouter.get("/me", requireStaff, async (req, res) => {
  const staff = await prisma.staffUser.findUnique({ where: { id: req.staff!.staffId } });
  if (!staff) {
    res.status(404).json({ error: "Staff account not found." });
    return;
  }
  res.json({ id: staff.id, name: staff.name, email: staff.email, role: staff.role });
});
