import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { requireAdmin } from "../middleware/requireStaff";

export const menuRouter = Router();

menuRouter.get("/", async (req, res) => {
  const includeUnavailable = req.query.all === "true";
  const items = await prisma.menuItem.findMany({
    where: includeUnavailable ? {} : { available: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });
  res.json(items);
});

menuRouter.get("/:id", async (req, res) => {
  const item = await prisma.menuItem.findUnique({ where: { id: req.params.id } });
  if (!item) {
    res.status(404).json({ error: "Menu item not found." });
    return;
  }
  res.json(item);
});

const menuItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  category: z.string().min(1),
  tags: z.array(z.enum(["vegan", "gf", "nuts"])).default([]),
  image: z.string().min(1),
  popular: z.boolean().default(false),
  available: z.boolean().default(true),
});

// Staff-only menu management (create / update / delete)
menuRouter.post("/", requireAdmin, async (req, res) => {
  const parsed = menuItemSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const item = await prisma.menuItem.create({ data: parsed.data });
  res.status(201).json(item);
});

menuRouter.patch("/:id", requireAdmin, async (req, res) => {
  const parsed = menuItemSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const item = await prisma.menuItem
    .update({ where: { id: String(req.params.id) }, data: parsed.data })
    .catch(() => null);
  if (!item) {
    res.status(404).json({ error: "Menu item not found." });
    return;
  }
  res.json(item);
});

menuRouter.delete("/:id", requireAdmin, async (req, res) => {
  await prisma.menuItem.delete({ where: { id: String(req.params.id) } }).catch(() => null);
  res.status(204).end();
});
