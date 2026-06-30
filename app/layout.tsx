import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { DEFAULT_LANGUAGE, LANGUAGES, type LanguageCode } from "@/lib/i18n";
import { getLabels } from "@/lib/notes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clipora",
  description: "Google Keep'ten ilham alan gelismis lokal not uygulamasi"
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const storedLanguage = cookieStore.get("keep-notes-language")?.value;
  const initialLanguage: LanguageCode = LANGUAGES.some((language) => language.code === storedLanguage)
    ? (storedLanguage as LanguageCode)
    : DEFAULT_LANGUAGE;
  const labels = await getLabels();

  return (
    <html lang={initialLanguage}>
      <body className={inter.className}>
        <AppShell labels={labels} initialLanguage={initialLanguage}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
