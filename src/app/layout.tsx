import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { Analytics } from "@vercel/analytics/next";

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
  icons: {
    icon: "/Tanata Logo.webp",
    shortcut: "/Tanata Logo.webp",
    apple: "/Tanata Logo.webp",
  },
  openGraph: {
    title: "Tantalize 2025 - Sri Lanka's Premier Cultural & Music Event",
    description: "Experience the pinnacle of Sri Lankan cultural and music events.",
    url: "https://tantalize.lk",
    siteName: "Tantalize 2025",
    images: [
      {
        url: "/2024_Crowd.webp",
        width: 1200,
        height: 630,
        alt: "Tantalize 2025 Crowd",
      },
      {
        url: "/Tanata Logo.webp",
        width: 800,
        height: 800,
        alt: "Tantalize Logo",
      },
    ],
    type: "website",
    locale: "en_LK",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tantalize 2025",
    description: "Sri Lanka's Premier Cultural & Music Event",
    images: ["/2024_Crowd.webp"],
  },
  verification: {
    google: "uBObjysE7b7UYMPv_wK_Nbhs4wObOqnYf_oZHBVyNyQ",
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
        <link rel="preload" href="/Tanata Logo.webp" as="image" type="image/webp" fetchPriority="high" />
        <link rel="preload" href="/APIIT logo white.webp" as="image" type="image/webp" fetchPriority="high" />
        <link rel="preload" href="/hero-poster.webp" as="image" type="image/webp" fetchPriority="high" />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-primary-950 text-white overflow-x-hidden`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              "name": "Tantalize 2025",
              "startDate": "2025-06-07T18:00",
              "endDate": "2025-06-07T23:59",
              "eventStatus": "https://schema.org/EventScheduled",
              "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
              "location": {
                "@type": "Place",
                "name": "Nelum Pokuna Outdoor Arena",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "110 Ananda Coomaraswamy Mawatha",
                  "addressLocality": "Colombo 07",
                  "postalCode": "00700",
                  "addressCountry": "LK"
                }
              },
              "image": [
                "https://tantalize.lk/hero-poster.webp",
                "https://tantalize.lk/2024_Crowd.webp"
              ],
              "description": "Sri Lanka's Premier Cultural & Music Event featuring the biggest student talent and guest stars.",
              "organizer": {
                "@type": "Organization",
                "name": "APIIT Student Council",
                "url": "https://tantalize.lk"
              }
            })
          }}
        />
        <ClientLayout>
          {children}
          <Analytics />
        </ClientLayout>
      </body>
    </html>
  );
}
