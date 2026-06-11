import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond, Playfair_Display, Abril_Fatface } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"]
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  style: ["normal", "italic"]
});

const abril = Abril_Fatface({
  variable: "--font-abril",
  subsets: ["latin"],
  weight: "400"
});

export const metadata: Metadata = {
  title: "Kawaii.uz — O'zbekistondagi eng yirik anime va manga platformasi",
  description: "Kawaii.uz - O'zbekistondagi anime va manga muxlislari uchun raqamli ekotizim. Bizning Search Bot, Anime Portal, Manga Reader va Kawaii Wiki loyihalarimiz orqali o'z sevimli kontentingizni toping.",
  keywords: ["kawaii", "kawaii.uz", "anime uz", "manga uzbekcha", "anime skachat", "kawaii bot", "anime uzbek tilida", "manga reader uz", "anime portal uz"],
  authors: [{ name: "Kawaii Dev Team" }],
  openGraph: {
    title: "Kawaii.uz — O'zbekistondagi eng yirik anime va manga platformasi",
    description: "Anime va manga ixlosmandlari uchun maxsus raqamli ekotizim va loyihalar portali.",
    url: "https://kawaii.uz",
    siteName: "Kawaii.uz",
    images: [
      {
        url: "/media/background.webp",
        width: 1200,
        height: 630,
        alt: "Kawaii.uz Ekotizimi",
      },
    ],
    locale: "uz_UZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${playfair.variable} ${abril.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
