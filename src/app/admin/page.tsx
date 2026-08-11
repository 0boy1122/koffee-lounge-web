"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type SalesSummary, type OrderStatus } from "@/lib/api";

const STATUS_LABELS: Record<OrderStatus, string> = {
  RECEIVED: "Received",
  PREPARING: "Preparing",
  READY: "Ready",
  OUT_FOR_DELIVERY: "Out for Delivery",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = () => {
      api.getSalesSummary().then(setSummary).catch((err) => setError(err.message));
    };
    load();
    const interval = window.setInterval(load, 15000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-dark">
            Dashboard
          </p>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-espresso">Sales Overview</h1>
        </div>
        <Link
          href="/admin/orders"
          className="rounded-full bg-amber px-4 py-2 font-display text-sm font-bold text-espresso-deep"
        >
          View Orders
        </Link>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {!summary ? (
        <p className="mt-8 text-sm text-espresso/50">Loading…</p>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Revenue Today" value={`GH₵${summary.revenueToday.toFixed(2)}`} />
            <StatCard label="Orders Today" value={String(summary.ordersToday)} />
            <StatCard label="Total Revenue" value={`GH₵${summary.totalRevenue.toFixed(2)}`} />
            <StatCard label="Total Orders" value={String(summary.totalOrders)} />
          </div>

          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
            <p className="font-display text-sm font-bold text-espresso">Orders by Status</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((status) => (
                <div key={status} className="rounded-xl bg-cream p-4 text-center">
                  <p className="font-display text-2xl font-extrabold text-espresso">
                    {summary.ordersByStatus[status] ?? 0}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-espresso/50">{STATUS_LABELS[status]}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="font-display text-2xl font-extrabold text-espresso">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-espresso/50">{label}</p>
    </div>
  );
}
