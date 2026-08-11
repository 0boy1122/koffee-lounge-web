"use client";

import { useEffect, useState } from "react";
import { api, type ApiOrder, type OrderStatus } from "@/lib/api";

const STATUSES: OrderStatus[] = ["RECEIVED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "COMPLETED", "CANCELLED"];

const STATUS_LABELS: Record<OrderStatus, string> = {
  RECEIVED: "Received",
  PREPARING: "Preparing",
  READY: "Ready",
  OUT_FOR_DELIVERY: "Out for Delivery",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const MODALITY_LABELS: Record<ApiOrder["modality"], string> = {
  DELIVERY: "Delivery",
  PICKUP: "Pickup",
  DINE_IN: "Dine-In",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL");
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = () => {
    api
      .getStaffOrders(filter === "ALL" ? undefined : filter)
      .then(setOrders)
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    load();
    const interval = window.setInterval(load, 10000);
    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const changeStatus = async (id: string, status: OrderStatus) => {
    setUpdatingId(id);
    try {
      await api.updateOrderStatus(id, status);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-dark">Orders</p>
      <h1 className="mt-1 font-display text-3xl font-extrabold text-espresso">Manage Orders</h1>

      <div className="mt-5 flex flex-wrap gap-2">
        {(["ALL", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 font-display text-xs font-semibold ${
              filter === s ? "bg-amber text-espresso-deep" : "bg-white text-espresso/60 shadow-sm"
            }`}
          >
            {s === "ALL" ? "All" : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 space-y-3">
        {orders.length === 0 ? (
          <p className="text-sm text-espresso/50">No orders here yet.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-sm font-bold text-espresso">
                    #{order.orderNumber} · {MODALITY_LABELS[order.modality]}
                  </p>
                  <p className="mt-0.5 text-xs text-espresso/50">
                    {order.customerName ?? "Guest"}
                    {order.customerPhone ? ` · ${order.customerPhone}` : ""}
                    {order.customerEmail ? ` · ${order.customerEmail}` : ""}
                  </p>
                  {order.deliveryAddress && (
                    <p className="mt-0.5 text-xs text-espresso/50">Deliver to: {order.deliveryAddress}</p>
                  )}
                  {order.tableNumber && (
                    <p className="mt-0.5 text-xs text-espresso/50">Table: {order.tableNumber}</p>
                  )}
                  <p className="mt-1 text-xs text-espresso/40">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg font-extrabold text-amber-dark">
                    GH₵{Number(order.total).toFixed(2)}
                  </p>
                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(e) => void changeStatus(order.id, e.target.value as OrderStatus)}
                    className="mt-1.5 rounded-full border border-espresso/15 bg-cream px-3 py-1.5 font-display text-xs font-semibold text-espresso focus:border-amber focus:outline-none disabled:opacity-60"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3 border-t border-espresso/10 pt-3">
                <ul className="space-y-1 text-sm text-espresso/70">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <span>{item.quantity}× {item.nameSnapshot}</span>
                      <span>GH₵{(Number(item.priceSnapshot) * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
