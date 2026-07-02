"use client";

import { extractUrls } from "@/lib/note-content";

type LinkedTextProps = {
  text: string;
  className?: string;
};

export function LinkedText({ text, className }: LinkedTextProps) {
  const urls = extractUrls(text);

  if (urls.length === 0) {
    return <span className={className}>{text}</span>;
  }

  const parts: React.ReactNode[] = [];
  let cursor = 0;

  urls.forEach((url) => {
    const index = text.indexOf(url, cursor);
    if (index === -1) return;

    if (index > cursor) {
      parts.push(text.slice(cursor, index));
    }

    parts.push(
      <a
        key={`${url}-${index}`}
        href={url}
        target="_blank"
        rel="noreferrer"
        className="break-all text-[#1a73e8] underline decoration-[#1a73e8]/50 underline-offset-2 hover:decoration-[#1a73e8]"
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {url}
      </a>
    );
    cursor = index + url.length;
  });

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return <span className={className}>{parts}</span>;
}
