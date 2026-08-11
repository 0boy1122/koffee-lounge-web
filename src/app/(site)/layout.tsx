import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StickyActionBar } from "@/components/StickyActionBar";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <SiteFooter />
      <StickyActionBar />
    </>
  );
}
