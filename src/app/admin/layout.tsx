"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminAuthProvider, useAdminAuth } from "@/lib/admin-auth";
import { CupIcon } from "@/components/CupIcon";

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/inquiries", label: "Corporate Inquiries" },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { staff, loading, logout } = useAdminAuth();
  const isLoginPage = pathname?.replace(/\/$/, "") === "/admin/login";

  useEffect(() => {
    if (!loading && !staff && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [loading, staff, isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="font-display text-sm text-espresso/50">Loading…</p>
      </div>
    );
  }

  if (!staff) return null; // redirecting to /admin/login

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="hidden w-60 flex-shrink-0 border-r border-espresso/10 bg-white p-5 sm:block">
        <Link href="/admin" className="flex items-center gap-1.5">
          <CupIcon className="h-7 w-7 text-espresso" />
          <span className="font-display text-sm font-bold text-espresso">
            Koffee Lounge
            <br />
            <span className="text-xs font-semibold text-espresso/50">Staff Dashboard</span>
          </span>
        </Link>

        <nav className="mt-8 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 font-display text-sm font-semibold transition-colors ${
                pathname === link.href
                  ? "bg-amber/15 text-amber-dark"
                  : "text-espresso/70 hover:bg-cream"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-10 border-t border-espresso/10 pt-4">
          <p className="font-display text-xs font-bold text-espresso">{staff.name}</p>
          <p className="text-xs text-espresso/50">{staff.email}</p>
          <button
            onClick={() => {
              void logout().then(() => router.replace("/admin/login"));
            }}
            className="mt-3 font-display text-xs font-bold text-espresso/60 hover:text-espresso"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-espresso/10 bg-white px-4 py-3 sm:hidden">
        <Link href="/admin" className="flex items-center gap-1.5">
          <CupIcon className="h-6 w-6 text-espresso" />
          <span className="font-display text-sm font-bold text-espresso">Staff Dashboard</span>
        </Link>
        <button
          onClick={() => {
            void logout().then(() => router.replace("/admin/login"));
          }}
          className="font-display text-xs font-bold text-espresso/60"
        >
          Log out
        </button>
      </div>

      <div className="flex-1 pt-14 sm:pt-0">
        <nav className="flex gap-1 overflow-x-auto border-b border-espresso/10 bg-white px-4 py-2 sm:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex-shrink-0 rounded-full px-3 py-1.5 font-display text-xs font-semibold ${
                pathname === link.href ? "bg-amber text-espresso-deep" : "text-espresso/60"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
