import type { Metadata } from "next";
import Link from "next/link";
import "../after-hours.css";
import RegisterSidebar from "@/components/after-hours/RegisterSidebar";

const GOOGLE_FORM_EMBED_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSf4_AKIzU997ppsEilSbPD7YylPIZ40O13u04NFmABaaz2YAQ/viewform?embedded=true";

export const metadata: Metadata = {
  title: "Register — After Hours",
  description: "Register your act for After Hours, the official qualifying stage for Tantalize 2026.",
};

export default function RegisterGooglePage() {
  return (
    <main className="ah-grid-bg relative min-h-screen overflow-hidden" style={{ fontFamily: "var(--font-ah-body), system-ui, sans-serif" }}>
      <div className="ah-grain" />
      <div className="ah-blob ah-blob-1 -left-24 -top-24 h-72 w-72 bg-fuchsia-600/20" aria-hidden />
      <div className="ah-blob ah-blob-2 -right-20 top-24 h-72 w-72 bg-blue-600/15" aria-hidden />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 sm:px-10 lg:grid-cols-[340px_1fr] lg:gap-16 lg:py-20">
        <RegisterSidebar>
          <h1
            className="mt-4 text-4xl font-extrabold uppercase leading-[0.95] sm:text-5xl lg:text-4xl"
            style={{ fontFamily: "var(--font-ah-display), sans-serif" }}
          >
            Register to Perform
          </h1>
          <p className="mt-3 max-w-xl text-white/65 lg:max-w-none">
            Fill in your details below to register your act for After Hours.
          </p>
        </RegisterSidebar>

        <section className="min-w-0">
          <div className="ah-form-shell max-w-3xl">
            <iframe
              src={GOOGLE_FORM_EMBED_URL}
              className="ah-form-frame"
              title="After Hours Registration Form"
            >
              Loading…
            </iframe>
          </div>

          <p className="mt-6 max-w-2xl text-xs text-white/35">
            Prefer our own form instead?{" "}
            <Link href="/after-hours/register" className="text-fuchsia-400 hover:text-fuchsia-300">
              Register here
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
