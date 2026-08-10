import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";

export const promoRouter = Router();

const validateSchema = z.object({
  code: z.string().min(1),
});

promoRouter.post("/validate", async (req, res) => {
  const parsed = validateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "A promo code is required." });
    return;
  }

  const code = parsed.data.code.trim().toUpperCase();
  const promo = await prisma.promoCode.findUnique({ where: { code } });

  const expired = promo?.expiresAt ? promo.expiresAt.getTime() < Date.now() : false;

  if (!promo || !promo.active || expired) {
    res.status(404).json({ error: "That code doesn't exist or has expired." });
    return;
  }

  res.json({ code: promo.code, discountRate: Number(promo.discountRate) });
});
