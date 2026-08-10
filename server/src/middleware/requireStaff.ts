import type { NextFunction, Request, Response } from "express";
import { verifyStaffToken, type StaffTokenPayload } from "../lib/auth";

declare global {
  namespace Express {
    interface Request {
      staff?: StaffTokenPayload;
    }
  }
}

export function requireStaff(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.staff_token;
  const payload = token ? verifyStaffToken(token) : null;
  if (!payload) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  req.staff = payload;
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  requireStaff(req, res, () => {
    if (req.staff?.role !== "ADMIN") {
      res.status(403).json({ error: "Admin access required" });
      return;
    }
    next();
  });
}
