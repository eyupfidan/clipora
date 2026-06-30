"use client";

import { Archive, FileText, Tag, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { useLanguage } from "@/components/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n";
import type { LabelSummary } from "@/types/note";

type SidebarProps = {
  labels: LabelSummary[];
  isMobileOpen: boolean;
  isDesktopCollapsed: boolean;
  onNavigate: () => void;
};

const navItems: Array<{ href: string; labelKey: TranslationKey; icon: LucideIcon }> = [
  { href: "/", labelKey: "notes", icon: FileText },
  { href: "/archive", labelKey: "archive", icon: Archive },
  { href: "/trash", labelKey: "trash", icon: Trash2 }
];

export function Sidebar({ labels, isMobileOpen, isDesktopCollapsed, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <aside
      className={clsx(
        "fixed bottom-0 left-0 top-16 z-30 w-72 border-r border-[#e0e0e0] bg-white py-2 transition-transform duration-200 ease-out",
        isMobileOpen ? "translate-x-0" : "-translate-x-full",
        isDesktopCollapsed ? "md:-translate-x-full" : "md:translate-x-0"
      )}
    >
      <nav className="space-y-1 pr-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={clsx(
                "flex h-12 items-center gap-5 rounded-r-full px-6 text-sm font-medium transition",
                active ? "bg-[#feefc3] text-[#202124]" : "text-[#3c4043] hover:bg-[#f1f3f4]"
              )}
            >
              <Icon size={20} />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>
      <div className="mt-6 px-6 text-xs font-semibold uppercase tracking-wide text-[#5f6368]">
        {t("labels")}
      </div>
      <nav className="mt-2 space-y-1 pr-3">
        {labels.length === 0 ? (
          <div className="px-6 py-3 text-sm text-[#5f6368]">{t("noLabels")}</div>
        ) : (
          labels.map((label) => {
            const href = `/labels/${encodeURIComponent(label.name)}`;
            const active = pathname === href;
            return (
              <Link
                key={label.id}
                href={href}
                onClick={onNavigate}
                className={clsx(
                  "flex h-12 items-center gap-5 rounded-r-full px-6 text-sm font-medium transition",
                  active ? "bg-[#feefc3] text-[#202124]" : "text-[#3c4043] hover:bg-[#f1f3f4]"
                )}
              >
                <Tag size={20} />
                <span className="truncate">{label.name}</span>
              </Link>
            );
          })
        )}
      </nav>
    </aside>
  );
}
