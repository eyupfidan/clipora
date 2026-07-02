"use server";

import { getSafeLinkPreviews } from "@/lib/link-preview";

export async function getLinkPreviews(urls: string[]) {
  return getSafeLinkPreviews(urls);
}
