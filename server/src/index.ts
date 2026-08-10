import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ensureDevDatabase } from "./dev-db";
import { validateAuthConfiguration } from "./lib/auth";

async function main() {
  if (process.env.NODE_ENV === "production" && !process.env.FRONTEND_ORIGIN) {
    throw new Error("FRONTEND_ORIGIN must be set in production.");
  }
  validateAuthConfiguration();
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = await ensureDevDatabase();
    console.log("Local dev database ready at", process.env.DATABASE_URL);
  }

  // Route modules create the Prisma client, so load them only after the
  // local development database has supplied DATABASE_URL.
  const [{ menuRouter }, { ordersRouter }, { promoRouter }, { corporateRouter }, { authRouter }] = await Promise.all([
    import("./routes/menu.js"),
    import("./routes/orders.js"),
    import("./routes/promo.js"),
    import("./routes/corporate.js"),
    import("./routes/auth.js"),
  ]);

  const app = express();
  app.use(
    cors({
      origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000",
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(cookieParser());

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/menu", menuRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/promo", promoRouter);
  app.use("/api/corporate-inquiries", corporateRouter);
  app.use("/api/auth", authRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found." });
  });

  const port = Number(process.env.PORT ?? 4000);
  app.listen(port, () => {
    console.log(`Koffee Lounge API listening on http://localhost:${port}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
