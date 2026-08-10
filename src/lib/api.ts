const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");

export type ApiMenuItem = {
  id: string;
  name: string;
  description: string;
  price: number | string;
  category: string;
  tags: string[];
  image: string;
  popular?: boolean;
};

type ApiOrder = {
  id: string;
  orderNumber: string;
  trackingToken?: string;
  status: "RECEIVED" | "PREPARING" | "READY" | "OUT_FOR_DELIVERY" | "COMPLETED" | "CANCELLED";
  modality: "DELIVERY" | "PICKUP" | "DINE_IN";
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    credentials: "include",
  });
  const body = await response.json().catch(() => null) as { error?: string } | null;
  if (!response.ok) throw new Error(body?.error ?? "Something went wrong. Please try again.");
  return body as T;
}

export const api = {
  getMenu: () => request<ApiMenuItem[]>("/api/menu"),
  validatePromo: (code: string) =>
    request<{ code: string; discountRate: number }>("/api/promo/validate", {
      method: "POST",
      body: JSON.stringify({ code }),
    }),
  createOrder: (data: {
    items: { menuItemId: string; quantity: number }[];
    modality: ApiOrder["modality"];
    promoCode?: string;
    customerName: string;
    customerEmail?: string;
    customerPhone?: string;
    deliveryAddress?: string;
    tableNumber?: string;
  }) => request<ApiOrder>("/api/orders", { method: "POST", body: JSON.stringify(data) }),
  getOrder: (id: string, trackingToken: string) =>
    request<ApiOrder>(`/api/orders/${id}?token=${encodeURIComponent(trackingToken)}`),
  createCorporateInquiry: (data: {
    fullName: string;
    companyName: string;
    email?: string;
    phone?: string;
    serviceNeeded: "Catering" | "Subscription" | "Venue Rental" | "Bulk Orders";
    budgetRange: string;
    estimatedDate: string;
    headcount: number;
    notes?: string;
  }) => request<{ referenceCode: string }>("/api/corporate-inquiries", {
    method: "POST",
    body: JSON.stringify(data),
  }),
};
