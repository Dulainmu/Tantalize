import type { Metadata } from "next";
import { Big_Shoulders, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import AfterHoursShell from "@/components/after-hours/AfterHoursShell";

const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-ah-display",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ah-body",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ah-mono",
});

export const metadata: Metadata = {
  title: "After Hours: Register to Perform",
  description:
    "After Hours is Sri Lanka's inter-university talent competition, the official qualifying stage for Tantalize 2026. Solo singers, dancers, bands, and mixed acts, register now.",
  openGraph: {
    title: "After Hours: Register to Perform",
    description:
      "One stage. Endless talent. The official qualifying platform for Tantalize 2026.",
    url: "https://tantalize.lk/after-hours",
    siteName: "After Hours",
    type: "website",
  },
};

export default function AfterHoursLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${bigShoulders.variable} ${plexSans.variable} ${plexMono.variable} bg-black text-white`}
    >
      <AfterHoursShell>{children}</AfterHoursShell>
    </div>
  );
}
