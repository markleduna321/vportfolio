import type { Metadata } from "next";
import "./globals.css";

const title = "Mark Harvey Leduna — Video Editor & AI Visual Storyteller";
const description =
  "Video editing, AI-assisted production, motion design, and visual storytelling by Mark Harvey Leduna.";
const siteUrl = process.env.SITE_URL
  ? new URL(process.env.SITE_URL)
  : undefined;

if (
  siteUrl &&
  (!["https:", "http:"].includes(siteUrl.protocol) ||
    siteUrl.pathname !== "/" ||
    siteUrl.search ||
    siteUrl.hash ||
    siteUrl.username ||
    siteUrl.password)
) {
  throw new Error("SITE_URL must be an http(s) website origin, without a path, query, or credentials.");
}

const sharingImage = siteUrl
  ? {
      url: new URL("/share-preview.png", siteUrl).href,
      width: 1200,
      height: 630,
      alt: "Mark Harvey Leduna — Video editing, AI production, and visual storytelling",
    }
  : undefined;

export const metadata: Metadata = {
  title,
  description,
  ...(siteUrl && {
    metadataBase: siteUrl,
    alternates: { canonical: siteUrl.href },
  }),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Mark Harvey Leduna",
    title,
    description,
    ...(siteUrl && { url: siteUrl.href }),
    ...(sharingImage && { images: [sharingImage] }),
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    ...(sharingImage && { images: [sharingImage] }),
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
