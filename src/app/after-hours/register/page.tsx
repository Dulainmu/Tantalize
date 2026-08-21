import type { Metadata } from "next";
import Link from "next/link";
import "../after-hours.css";
import CheckerStripe from "@/components/after-hours/CheckerStripe";
import RegisterForm from "@/components/after-hours/RegisterForm";
import RegisterHeader from "@/components/after-hours/RegisterHeader";

export const metadata: Metadata = {
  title: "Register — After Hours",
  description: "Register your act for After Hours, the official qualifying stage for Tantalize 2026.",
};

export default function RegisterPage() {
  return (
    <main className="ah-grid-bg relative min-h-screen overflow-hidden" style={{ fontFamily: "var(--font-ah-body), system-ui, sans-serif" }}>
      <div className="ah-grain" />
      <div className="ah-blob ah-blob-1 -left-24 -top-24 h-72 w-72 bg-fuchsia-600/20" aria-hidden />
      <div className="ah-blob ah-blob-2 -right-20 top-24 h-72 w-72 bg-blue-600/15" aria-hidden />

      <RegisterHeader>
        <Link
          href="/after-hours"
          className="text-xs tracking-[0.2em] text-white/40 transition-colors hover:text-white/70"
          style={{ fontFamily: "var(--font-ah-mono), monospace" }}
        >
          ← BACK TO AFTER HOURS
        </Link>
        <h1
          className="mt-4 text-4xl font-extrabold uppercase leading-[0.95] sm:text-5xl"
          style={{ fontFamily: "var(--font-ah-display), sans-serif" }}
        >
          Register to Perform
        </h1>
        <p className="mt-3 max-w-xl text-white/65">
          Fill in your details below to register your act for After Hours.
          Fields marked * are required.
        </p>
      </RegisterHeader>

      <CheckerStripe />

      <section className="relative px-6 py-12 sm:px-10">
        <RegisterForm />

        <p className="mt-6 max-w-2xl text-xs text-white/35">
          Having trouble with this form?{" "}
          <Link href="/after-hours/register-google" className="text-fuchsia-400 hover:text-fuchsia-300">
            Use the Google Form instead
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
