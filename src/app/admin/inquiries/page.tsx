"use client";

import { useEffect, useState } from "react";
import { api, type ApiCorporateInquiry, type InquiryStatus } from "@/lib/api";

const STATUSES: InquiryStatus[] = ["NEW", "CONTACTED", "CLOSED"];
const STATUS_LABELS: Record<InquiryStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  CLOSED: "Closed",
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<ApiCorporateInquiry[]>([]);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = () => {
    api.getStaffInquiries().then(setInquiries).catch((err) => setError(err.message));
  };

  useEffect(() => {
    load();
    const interval = window.setInterval(load, 15000);
    return () => window.clearInterval(interval);
  }, []);

  const changeStatus = async (id: string, status: InquiryStatus) => {
    setUpdatingId(id);
    try {
      await api.updateInquiryStatus(id, status);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't update inquiry status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <p className="font-display text-xs font-bold uppercase tracking-widest text-amber-dark">
        Corporate Inquiries
      </p>
      <h1 className="mt-1 font-display text-3xl font-extrabold text-espresso">Corporate Leads</h1>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 space-y-3">
        {inquiries.length === 0 ? (
          <p className="text-sm text-espresso/50">No inquiries yet.</p>
        ) : (
          inquiries.map((inquiry) => (
            <div key={inquiry.id} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-sm font-bold text-espresso">
                    {inquiry.fullName} · {inquiry.companyName}
                  </p>
                  <p className="mt-0.5 text-xs text-espresso/50">
                    Ref #{inquiry.referenceCode}
                    {inquiry.email ? ` · ${inquiry.email}` : ""}
                    {inquiry.phone ? ` · ${inquiry.phone}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-espresso/60">
                    {inquiry.serviceNeeded} · {inquiry.budgetRange} · {inquiry.headcount} people ·
                    est. {new Date(inquiry.estimatedDate).toLocaleDateString()}
                  </p>
                  {inquiry.notes && (
                    <p className="mt-2 max-w-lg text-sm text-espresso/70">&ldquo;{inquiry.notes}&rdquo;</p>
                  )}
                  <p className="mt-1 text-xs text-espresso/40">
                    Submitted {new Date(inquiry.createdAt).toLocaleString()}
                  </p>
                </div>
                <select
                  value={inquiry.status}
                  disabled={updatingId === inquiry.id}
                  onChange={(e) => void changeStatus(inquiry.id, e.target.value as InquiryStatus)}
                  className="flex-shrink-0 rounded-full border border-espresso/15 bg-cream px-3 py-1.5 font-display text-xs font-semibold text-espresso focus:border-amber focus:outline-none disabled:opacity-60"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
