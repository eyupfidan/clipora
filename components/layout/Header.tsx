"use client";

import { Grid2X2, List, Menu, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { clsx } from "clsx";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { LANGUAGES, type LanguageCode } from "@/lib/i18n";

type HeaderProps = {
  onMenuClick: () => void;
};

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { language, setLanguage, t } = useLanguage();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [isPending, startTransition] = useTransition();
  const view = searchParams.get("view") === "list" ? "list" : "grid";

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  const baseParams = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);

  function updateParam(name: string, value: string | null) {
    const params = new URLSearchParams(baseParams.toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    startTransition(() => {
      router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
    });
  }

  function handleSearch(value: string) {
    setQuery(value);
    updateParam("q", value.trim() || null);
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-2 border-b border-[#e0e0e0] bg-white/95 px-2 backdrop-blur md:gap-3 md:px-6">
      <button
        type="button"
        aria-label={t("menuOpen")}
        className="rounded-full p-3 text-[#5f6368] hover:bg-[#f1f3f4]"
        onClick={onMenuClick}
      >
        <Menu size={22} />
      </button>
      <div className="flex min-w-[48px] items-center gap-2 text-xl text-[#5f6368] sm:min-w-[132px]">
        <div className="grid h-9 w-9 place-items-center rounded bg-[#fbbc04] font-bold text-white">
          K
        </div>
        <span className="hidden sm:inline">{t("appTitle")}</span>
      </div>
      <div className="relative mx-auto flex max-w-3xl flex-1 items-center">
        <Search className="pointer-events-none absolute left-4 text-[#5f6368]" size={20} />
        <input
          value={query}
          onChange={(event) => handleSearch(event.target.value)}
          placeholder={t("search")}
          className="h-12 w-full rounded-lg border border-transparent bg-[#f1f3f4] pl-12 pr-4 outline-none transition focus:border-[#dadce0] focus:bg-white focus:shadow-keep"
        />
        {isPending ? (
          <span className="absolute right-3 text-xs text-[#5f6368]">{t("loading")}</span>
        ) : null}
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <select
          aria-label="Language"
          value={language}
          className="mr-1 h-10 w-16 rounded-lg border border-[#dadce0] bg-white px-2 text-sm text-[#3c4043] outline-none transition focus:border-[#1a73e8] sm:w-auto md:mr-2"
          onChange={(event) => setLanguage(event.target.value as LanguageCode)}
        >
          {LANGUAGES.map((item) => (
            <option key={item.code} value={item.code}>
              {item.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          aria-label={t("gridView")}
          className={clsx(
            "rounded-full p-3 text-[#5f6368] hover:bg-[#f1f3f4]",
            view === "grid" && "bg-[#e8f0fe] text-[#1a73e8]"
          )}
          onClick={() => updateParam("view", "grid")}
        >
          <Grid2X2 size={20} />
        </button>
        <button
          type="button"
          aria-label={t("listView")}
          className={clsx(
            "rounded-full p-3 text-[#5f6368] hover:bg-[#f1f3f4]",
            view === "list" && "bg-[#e8f0fe] text-[#1a73e8]"
          )}
          onClick={() => updateParam("view", "list")}
        >
          <List size={20} />
        </button>
      </div>
    </header>
  );
}
