import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { prisma } from "../db";
import { generateInquiryReference } from "../lib/codes";
import { requireStaff } from "../middleware/requireStaff";
import { notifySalesTeam } from "../lib/notify";

export const corporateRouter = Router();

const inquirySchema = z.object({
  fullName: z.string().min(1),
  companyName: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().min(7).max(30).optional(),
  serviceNeeded: z.enum(["Catering", "Subscription", "Venue Rental", "Bulk Orders"]),
  budgetRange: z.string().min(1),
  estimatedDate: z.string().min(1),
  headcount: z.number().int().positive(),
  notes: z.string().max(2_000).optional(),
}).refine((data) => data.email || data.phone, {
  message: "An email address or phone number is required.",
  path: ["email"],
});

const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many inquiries from this connection. Please try again later." },
});

corporateRouter.post("/", inquiryLimiter, async (req, res) => {
  const parsed = inquirySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const data = parsed.data;
  const inquiry = await prisma.corporateInquiry.create({
    data: {
      referenceCode: generateInquiryReference(),
      fullName: data.fullName,
      companyName: data.companyName,
      email: data.email,
      phone: data.phone,
      serviceNeeded: data.serviceNeeded,
      budgetRange: data.budgetRange,
      estimatedDate: new Date(data.estimatedDate),
      headcount: data.headcount,
      notes: data.notes,
    },
  });

  await notifySalesTeam(inquiry);

  res.status(201).json({ referenceCode: inquiry.referenceCode });
});

// Staff-only: view and triage inquiries
corporateRouter.get("/", requireStaff, async (_req, res) => {
  const inquiries = await prisma.corporateInquiry.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(inquiries);
});

corporateRouter.patch("/:id/status", requireStaff, async (req, res) => {
  const schema = z.object({ status: z.enum(["NEW", "CONTACTED", "CLOSED"]) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "A valid status is required." });
    return;
  }
  const inquiry = await prisma.corporateInquiry
    .update({ where: { id: String(req.params.id) }, data: { status: parsed.data.status } })
    .catch(() => null);
  if (!inquiry) {
    res.status(404).json({ error: "Inquiry not found." });
    return;
  }
  res.json(inquiry);
});
