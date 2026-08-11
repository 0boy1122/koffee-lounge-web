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
  available?: boolean;
};

export type OrderStatus = "RECEIVED" | "PREPARING" | "READY" | "OUT_FOR_DELIVERY" | "COMPLETED" | "CANCELLED";
export type OrderModality = "DELIVERY" | "PICKUP" | "DINE_IN";
export type InquiryStatus = "NEW" | "CONTACTED" | "CLOSED";

export type ApiOrderItem = {
  id: string;
  nameSnapshot: string;
  priceSnapshot: number | string;
  quantity: number;
};

export type ApiOrder = {
  id: string;
  orderNumber: string;
  trackingToken?: string;
  status: OrderStatus;
  modality: OrderModality;
  customerName?: string | null;
  customerPhone?: string | null;
  customerEmail?: string | null;
  deliveryAddress?: string | null;
  tableNumber?: string | null;
  subtotal: number | string;
  discountRate: number | string;
  total: number | string;
  promoCode?: string | null;
  items: ApiOrderItem[];
  createdAt: string;
};

export type ApiCorporateInquiry = {
  id: string;
  referenceCode: string;
  fullName: string;
  companyName: string;
  email?: string | null;
  phone?: string | null;
  serviceNeeded: string;
  budgetRange: string;
  estimatedDate: string;
  headcount: number;
  notes?: string | null;
  status: InquiryStatus;
  createdAt: string;
};

export type SalesSummary = {
  totalRevenue: number;
  totalOrders: number;
  revenueToday: number;
  ordersToday: number;
  ordersByStatus: Partial<Record<OrderStatus, number>>;
};

export type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: "STAFF" | "ADMIN";
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
    modality: OrderModality;
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

  // Staff / admin
  staffLogin: (email: string, password: string) =>
    request<StaffUser>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  staffLogout: () => request<void>("/api/auth/logout", { method: "POST" }),
  staffMe: () => request<StaffUser>("/api/auth/me"),
  getSalesSummary: () => request<SalesSummary>("/api/orders/summary"),
  getStaffOrders: (status?: OrderStatus) =>
    request<ApiOrder[]>(`/api/orders${status ? `?status=${status}` : ""}`),
  updateOrderStatus: (id: string, status: OrderStatus) =>
    request<ApiOrder>(`/api/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  getStaffInquiries: () => request<ApiCorporateInquiry[]>("/api/corporate-inquiries"),
  updateInquiryStatus: (id: string, status: InquiryStatus) =>
    request<ApiCorporateInquiry>(`/api/corporate-inquiries/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};
