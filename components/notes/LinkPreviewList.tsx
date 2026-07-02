"use client";

import { ExternalLink } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getLinkPreviews } from "@/app/actions";
import { extractUrls, getHostname, type LinkPreview } from "@/lib/note-content";

type LinkPreviewListProps = {
  content: string;
  compact?: boolean;
};

const previewCache = new Map<string, LinkPreview[]>();
const previewRequests = new Map<string, Promise<LinkPreview[]>>();

export function LinkPreviewList({ content, compact }: LinkPreviewListProps) {
  const urlKey = useMemo(
    () => extractUrls(content).slice(0, compact ? 2 : 4).join("\n"),
    [content, compact]
  );
  const urls = useMemo(() => (urlKey ? urlKey.split("\n") : []), [urlKey]);
  const [previews, setPreviews] = useState<LinkPreview[]>([]);

  useEffect(() => {
    if (!urlKey) {
      return;
    }

    const requestUrls = urlKey.split("\n");
    const cachedPreviews = previewCache.get(urlKey);
    if (cachedPreviews) {
      window.setTimeout(() => setPreviews(cachedPreviews), 0);
      return;
    }

    let isCurrent = true;
    const request =
      previewRequests.get(urlKey) ??
      getLinkPreviews(requestUrls).finally(() => {
        previewRequests.delete(urlKey);
      });
    previewRequests.set(urlKey, request);

    void request.then((nextPreviews) => {
      previewCache.set(urlKey, nextPreviews);
      if (isCurrent) setPreviews(nextPreviews);
    });

    return () => {
      isCurrent = false;
    };
  }, [urlKey]);

  if (urls.length === 0) return null;

  const currentPreviews = previews.filter((preview) => urls.includes(preview.url));
  const hasCurrentPreviews = currentPreviews.length === urls.length;
  const visiblePreviews: LinkPreview[] =
    hasCurrentPreviews
      ? currentPreviews
      : urls.map((url) => ({
          url,
          title: getHostname(url),
          siteName: getHostname(url)
        }));

  return (
    <div className={compact ? "border-t border-[#e0e0e0]" : "mt-5 space-y-3"}>
      {visiblePreviews.map((preview) => (
        <a
          key={preview.url}
          href={preview.url}
          target="_blank"
          rel="noreferrer"
          className={[
            "flex overflow-hidden transition hover:bg-black/5",
            compact
              ? "min-h-14 border-b border-[#e0e0e0] bg-white/70 last:border-b-0"
              : "min-h-16 rounded-lg border border-[#dadce0] bg-white/70 shadow-sm hover:shadow-keep"
          ].join(" ")}
          onClick={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
        >
          {preview.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview.image} alt="" className={compact ? "h-14 w-14 shrink-0 object-cover" : "h-16 w-20 shrink-0 object-cover"} />
          ) : (
            <span className={compact ? "grid h-14 w-14 shrink-0 place-items-center bg-black/5 text-[#5f6368]" : "grid h-16 w-20 shrink-0 place-items-center bg-black/5 text-[#5f6368]"}>
              <ExternalLink size={compact ? 18 : 20} />
            </span>
          )}
          <span className="flex min-w-0 flex-1 flex-col justify-center px-3 py-1">
            <span className={compact ? "line-clamp-1 text-sm font-medium text-[#202124]" : "truncate text-sm font-medium text-[#202124]"}>
              {preview.title}
            </span>
            <span className="mt-0.5 truncate text-xs text-[#5f6368]">{preview.siteName}</span>
          </span>
          {compact ? (
            <span className="grid w-8 shrink-0 place-items-start pt-3 text-[#5f6368]">
              <ExternalLink size={16} />
            </span>
          ) : null}
        </a>
      ))}
    </div>
  );
}
