"use client";

import { Suspense } from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import type { LanguageCode } from "@/lib/i18n";
import type { LabelSummary } from "@/types/note";

type AppShellProps = {
  labels: LabelSummary[];
  initialLanguage: LanguageCode;
  children: React.ReactNode;
};

export function AppShell({ labels, initialLanguage, children }: AppShellProps) {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);

  function handleMenuClick() {
    if (window.matchMedia("(min-width: 768px)").matches) {
      setIsDesktopSidebarCollapsed((value) => !value);
      return;
    }
    setIsMobileSidebarOpen((value) => !value);
  }

  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      <div className="min-h-screen bg-white">
        <Suspense
          fallback={
            <div className="sticky top-0 z-40 h-16 border-b border-[#e0e0e0] bg-white" />
          }
        >
          <Header onMenuClick={handleMenuClick} />
        </Suspense>
        <div className="flex">
          {isMobileSidebarOpen ? (
            <button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-20 animate-fade-in bg-black/20 md:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          ) : null}
          <Sidebar
            labels={labels}
            isMobileOpen={isMobileSidebarOpen}
            isDesktopCollapsed={isDesktopSidebarCollapsed}
            onNavigate={() => setIsMobileSidebarOpen(false)}
          />
          <main
            key={pathname}
            className={[
              "min-w-0 flex-1 px-4 py-6 transition-[margin] duration-200 ease-out md:px-8",
              isDesktopSidebarCollapsed ? "md:ml-0" : "md:ml-72",
              "animate-page-in"
            ].join(" ")}
          >
            {children}
          </main>
        </div>
      </div>
    </LanguageProvider>
  );
}
