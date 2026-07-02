export type ChecklistItem = {
  checked: boolean;
  text: string;
};

export type LinkPreview = {
  url: string;
  title: string;
  siteName: string;
  image?: string;
};

const checklistPattern = /^\s*-\s\[( |x|X)\]\s?(.*)$/;
const urlPattern = /https?:\/\/[^\s<>"']+/gi;
const trailingUrlPunctuation = /[.,;:!?)]$/;

export function parseChecklistItems(content: string): ChecklistItem[] {
  return content
    .split(/\r?\n/)
    .map((line) => {
      const match = line.match(checklistPattern);
      if (!match) return null;
      return {
        checked: match[1].toLocaleLowerCase("en-US") === "x",
        text: match[2] ?? ""
      };
    })
    .filter((item): item is ChecklistItem => Boolean(item));
}

export function hasChecklistContent(content: string) {
  const lines = content.split(/\r?\n/).filter((line) => line.trim());
  return lines.length > 0 && lines.every((line) => checklistPattern.test(line));
}

export function serializeChecklistItems(items: ChecklistItem[]) {
  return items.map((item) => `- [${item.checked ? "x" : " "}] ${item.text}`).join("\n");
}

export function textToChecklistItems(content: string): ChecklistItem[] {
  const lines = content.split(/\r?\n/).filter((line) => line.trim());
  return lines.length > 0
    ? lines.map((line) => ({ checked: false, text: line }))
    : [{ checked: false, text: "" }];
}

export function checklistItemsToText(items: ChecklistItem[]) {
  return items.map((item) => item.text).join("\n");
}

export function extractUrls(text: string) {
  const urls = new Set<string>();
  for (const match of text.matchAll(urlPattern)) {
    let url = match[0];
    while (trailingUrlPunctuation.test(url)) {
      url = url.slice(0, -1);
    }
    urls.add(url);
  }
  return [...urls];
}

export function getHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function getYouTubeVideoId(url: string) {
  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return parsedUrl.pathname.split("/").filter(Boolean)[0];
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsedUrl.pathname === "/watch") return parsedUrl.searchParams.get("v");

      const parts = parsedUrl.pathname.split("/").filter(Boolean);
      if (["shorts", "embed"].includes(parts[0])) return parts[1];
    }
  } catch {
    return null;
  }

  return null;
}

export function getYouTubeThumbnail(url: string) {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : undefined;
}
