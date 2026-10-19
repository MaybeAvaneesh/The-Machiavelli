import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Fonts are bundled locally (from @fontsource, SIL OFL) so builds never
// depend on fetching from Google Fonts, which fails intermittently on Vercel.
const cinzel = localFont({
  variable: "--font-cinzel",
  display: "swap",
  src: [
    { path: "./fonts/cinzel-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/cinzel-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/cinzel-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/cinzel-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
});

const garamond = localFont({
  variable: "--font-garamond",
  display: "swap",
  src: [
    { path: "./fonts/eb-garamond-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/eb-garamond-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/eb-garamond-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/eb-garamond-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/eb-garamond-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "The Machiavelli — Power. Treachery. Survival.",
  description:
    "A historical RPG set in Renaissance Italy. Navigate 100 years of political intrigue, military conflict, and papal scheming. Every advantage is a liability.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${garamond.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
