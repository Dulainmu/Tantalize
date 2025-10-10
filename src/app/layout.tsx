import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Tantalize 2025 - Sri Lanka's Premier Cultural & Music Event",
  description: "Experience the pinnacle of Sri Lankan cultural and music events. Tantalize 2025 brings together the finest artists, sponsors, and attendees for an unforgettable celebration of culture and music.",
  keywords: "Tantalize, Sri Lanka, cultural event, music festival, 2025, APIIT, Colombo",
  authors: [{ name: "Tantalize Team" }],
  openGraph: {
    title: "Tantalize 2025 - Sri Lanka's Premier Cultural & Music Event",
    description: "Experience the pinnacle of Sri Lankan cultural and music events.",
    type: "website",
    locale: "en_LK",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preload critical images for faster loading screen */}
        <link rel="preload" href="/Tanata Logo.png" as="image" type="image/png" />
        <link rel="preload" href="/APIIT-Logo-White.png" as="image" type="image/png" />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-primary-950 text-white overflow-x-hidden`}
      >
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
