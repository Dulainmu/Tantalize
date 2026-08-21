import type { Metadata } from "next";
import "../after-hours.css";
import RegisterForm from "@/components/after-hours/RegisterForm";
import RegisterSidebar from "@/components/after-hours/RegisterSidebar";

export const metadata: Metadata = {
  title: "Register - After Hours",
  description: "Register your act for After Hours, the official qualifying stage for Tantalize 2026.",
};

export default function RegisterPage() {
  return (
    <main className="ah-grid-bg relative min-h-screen overflow-hidden" style={{ fontFamily: "var(--font-ah-body), system-ui, sans-serif" }}>
      <div className="ah-grain" />
      <div className="ah-blob ah-blob-1 -left-24 -top-24 h-72 w-72 bg-fuchsia-600/20" aria-hidden />
      <div className="ah-blob ah-blob-2 -right-20 top-24 h-72 w-72 bg-blue-600/15" aria-hidden />
      <div className="ah-glitch-edge ah-glitch-edge-l" aria-hidden />
      <div className="ah-glitch-edge ah-glitch-edge-r" aria-hidden />

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
            Fields marked * are required.
          </p>
        </RegisterSidebar>

        <section className="min-w-0">
          <RegisterForm />
        </section>
      </div>
    </main>
  );
}
