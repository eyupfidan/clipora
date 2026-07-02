import { getHostname, getYouTubeThumbnail, type LinkPreview } from "@/lib/note-content";

function readMetaTag(html: string, property: string) {
  const escapedProperty = property.replaceAll(":", "\\:");
  const propertyPattern = new RegExp(
    `<meta[^>]+(?:property|name)=["']${escapedProperty}["'][^>]+content=["']([^"']+)["'][^>]*>`,
    "i"
  );
  const contentFirstPattern = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escapedProperty}["'][^>]*>`,
    "i"
  );

  return html.match(propertyPattern)?.[1] ?? html.match(contentFirstPattern)?.[1] ?? "";
}

function readTitle(html: string) {
  return html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ?? "";
}

function decodeHtml(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .trim();
}

async function buildLinkPreview(url: string): Promise<LinkPreview> {
  const fallbackTitle = getHostname(url);
  const fallbackImage = getYouTubeThumbnail(url);

  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": "Clipora link preview bot"
      },
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      return {
        url,
        title: fallbackTitle,
        siteName: fallbackTitle,
        image: fallbackImage
      };
    }

    const html = await response.text();
    const title = decodeHtml(readMetaTag(html, "og:title") || readTitle(html) || fallbackTitle);
    const siteName = decodeHtml(readMetaTag(html, "og:site_name") || fallbackTitle);
    const image = readMetaTag(html, "og:image") || fallbackImage;

    return {
      url,
      title,
      siteName,
      image
    };
  } catch {
    return {
      url,
      title: fallbackTitle,
      siteName: fallbackTitle,
      image: fallbackImage
    };
  }
}

export async function getSafeLinkPreviews(urls: string[]) {
  const safeUrls = [...new Set(urls)]
    .map((url) => {
      try {
        const parsedUrl = new URL(url);
        return ["http:", "https:"].includes(parsedUrl.protocol) ? parsedUrl.toString() : null;
      } catch {
        return null;
      }
    })
    .filter((url): url is string => Boolean(url))
    .slice(0, 4);

  return Promise.all(safeUrls.map((url) => buildLinkPreview(url)));
}
