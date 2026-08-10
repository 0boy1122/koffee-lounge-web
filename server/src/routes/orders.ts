import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { prisma } from "../db";
import { generateOrderNumber, generateTrackingToken, hashTrackingToken } from "../lib/codes";
import { requireStaff } from "../middleware/requireStaff";
import {
  notifyCustomerOrderConfirmed,
  notifyCustomerStatusChanged,
  notifyKitchen,
} from "../lib/notify";
import { scheduleAutoAdvance } from "../lib/orderSimulation";

export const ordersRouter = Router();

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        menuItemId: z.string().min(1),
        quantity: z.number().int().positive().max(50),
      })
    )
    .min(1),
  modality: z.enum(["DELIVERY", "PICKUP", "DINE_IN"]),
  deliveryAddress: z.string().optional(),
  tableNumber: z.string().optional(),
  promoCode: z.string().optional(),
  customerName: z.string().min(1).max(100),
  customerPhone: z.string().min(7).max(30).optional(),
  customerEmail: z.string().email().optional(),
}).superRefine((data, ctx) => {
  if (data.modality === "DELIVERY" && !data.deliveryAddress?.trim()) {
    ctx.addIssue({ code: "custom", path: ["deliveryAddress"], message: "A delivery address is required." });
  }
  if (data.modality === "DINE_IN" && !data.tableNumber?.trim()) {
    ctx.addIssue({ code: "custom", path: ["tableNumber"], message: "A table number is required." });
  }
  if (!data.customerPhone && !data.customerEmail) {
    ctx.addIssue({ code: "custom", path: ["customerEmail"], message: "An email address or phone number is required." });
  }
});

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many orders from this connection. Please try again shortly." },
});

ordersRouter.post("/", orderLimiter, async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const data = parsed.data;

  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: data.items.map((i) => i.menuItemId) }, available: true },
  });
  if (menuItems.length !== new Set(data.items.map((i) => i.menuItemId)).size) {
    res.status(400).json({ error: "One or more items in your cart are no longer available." });
    return;
  }

  const lines = data.items.map((line) => {
    const item = menuItems.find((m) => m.id === line.menuItemId)!;
    return { item, quantity: line.quantity };
  });
  const subtotal = lines.reduce(
    (sum, l) => sum + Number(l.item.price) * l.quantity,
    0
  );

  let discountRate = 0;
  if (data.promoCode) {
    const promo = await prisma.promoCode.findUnique({
      where: { code: data.promoCode.trim().toUpperCase() },
    });
    const expired = promo?.expiresAt ? promo.expiresAt.getTime() < Date.now() : false;
    if (promo && promo.active && !expired) {
      discountRate = Number(promo.discountRate);
    }
  }
  const total = Math.round(subtotal * (1 - discountRate) * 100) / 100;

  const trackingToken = generateTrackingToken();
  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      trackingTokenHash: hashTrackingToken(trackingToken),
      modality: data.modality,
      deliveryAddress: data.deliveryAddress,
      tableNumber: data.tableNumber,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      subtotal,
      discountRate,
      total,
      promoCode: discountRate > 0 ? data.promoCode?.trim().toUpperCase() : undefined,
      items: {
        create: lines.map((l) => ({
          menuItemId: l.item.id,
          nameSnapshot: l.item.name,
          priceSnapshot: l.item.price,
          quantity: l.quantity,
        })),
      },
      statusEvents: { create: { status: "RECEIVED" } },
    },
    include: { items: true },
  });

  await notifyCustomerOrderConfirmed(order);
  await notifyKitchen(order);
  scheduleAutoAdvance(order.id);

  res.status(201).json({ ...order, trackingToken });
});

ordersRouter.get("/:id", async (req, res) => {
  const trackingToken = typeof req.query.token === "string" ? req.query.token : "";
  if (!trackingToken) {
    res.status(401).json({ error: "A tracking token is required." });
    return;
  }
  const order = await prisma.order.findUnique({
    where: { id: String(req.params.id), trackingTokenHash: hashTrackingToken(trackingToken) },
    include: { items: true, statusEvents: { orderBy: { createdAt: "asc" } } },
  });
  if (!order) {
    res.status(404).json({ error: "Order not found." });
    return;
  }
  res.json(order);
});

// Staff: sales tracking. Must be registered before "/:id" so "summary"
// isn't swallowed by the order-lookup route.
ordersRouter.get("/summary", requireStaff, async (_req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const countedStatuses = ["RECEIVED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "COMPLETED"] as const;

  const [totals, today, byStatus] = await Promise.all([
    prisma.order.aggregate({
      where: { status: { in: [...countedStatuses] } },
      _sum: { total: true },
      _count: true,
    }),
    prisma.order.aggregate({
      where: { status: { in: [...countedStatuses] }, createdAt: { gte: startOfToday } },
      _sum: { total: true },
      _count: true,
    }),
    prisma.order.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);

  res.json({
    totalRevenue: Number(totals._sum.total ?? 0),
    totalOrders: totals._count,
    revenueToday: Number(today._sum.total ?? 0),
    ordersToday: today._count,
    ordersByStatus: Object.fromEntries(byStatus.map((row) => [row.status, row._count])),
  });
});

// Staff: list + manage orders
ordersRouter.get("/", requireStaff, async (req, res) => {
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const orders = await prisma.order.findMany({
    where: status ? { status: status as never } : {},
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(orders);
});

const statusSchema = z.object({
  status: z.enum(["RECEIVED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "COMPLETED", "CANCELLED"]),
});

ordersRouter.patch("/:id/status", requireStaff, async (req, res) => {
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "A valid status is required." });
    return;
  }

  const order = await prisma.order
    .update({
      where: { id: String(req.params.id) },
      data: {
        status: parsed.data.status,
        statusEvents: { create: { status: parsed.data.status, note: "Updated by staff" } },
      },
      include: { items: true, statusEvents: { orderBy: { createdAt: "asc" } } },
    })
    .catch(() => null);

  if (!order) {
    res.status(404).json({ error: "Order not found." });
    return;
  }

  await notifyCustomerStatusChanged(order);
  res.json(order);
});
