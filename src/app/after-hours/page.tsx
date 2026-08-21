import Link from "next/link";
import "./after-hours.css";
import CheckerStripe from "@/components/after-hours/CheckerStripe";
import Hero from "@/components/after-hours/Hero";
import Reveal from "@/components/after-hours/Reveal";
import ScrollProgress from "@/components/after-hours/ScrollProgress";

const STAGES = [
  { label: "Registrations", detail: "Open now" },
  { label: "Auditions", detail: "Date TBA" },
  { label: "After Hours", detail: "Semi-Finals — TBA" },
  { label: "Tantalize", detail: "Grand Finale — TBA" },
];

const CATEGORIES = [
  { name: "Solo Singers", detail: "Any genre, any language." },
  { name: "Dancers & Crews", detail: "Solo or group choreography." },
  { name: "Bands", detail: "Full live-instrument acts." },
  { name: "Mixed Performances", detail: "Combine disciplines on one act." },
];

const COMMITTEE = [
  { role: "Project Chairperson", name: "Nishen Anthony" },
  { role: "Project Co-Chairperson", name: "Denam Pathmanathan" },
  { role: "Project Coordinator", name: "Yazid Niyas" },
  { role: "Project Coordinator", name: "Ishra Ammon" },
  { role: "Project Secretary", name: "Diseni Chanulya" },
  { role: "Project Treasurer", name: "Kithmi Rachela" },
];

export default function AfterHoursPage() {
  return (
    <main
      className="min-h-screen"
      style={{ fontFamily: "var(--font-ah-body), system-ui, sans-serif" }}
    >
      <ScrollProgress />

      <Hero />

      <CheckerStripe />

      {/* ABOUT */}
      <section id="about" className="px-6 py-16 sm:px-10">
        <Reveal>
          <p
            className="text-xs tracking-[0.25em] text-fuchsia-400"
            style={{ fontFamily: "var(--font-ah-mono), monospace" }}
          >
            WHAT IS AFTER HOURS
          </p>
          <h2
            className="mt-3 max-w-3xl text-3xl font-bold uppercase leading-tight sm:text-4xl"
            style={{ fontFamily: "var(--font-ah-display), sans-serif" }}
          >
            The newly reconstructed evolution of Acoustic Night.
          </h2>
          <p className="mt-5 max-w-2xl text-white/70">
            After Hours brings together talented performers from universities
            across Sri Lanka — solo singers, dancers and dance crews, bands,
            and mixed acts — competing for a place in the grand finale.
            It&rsquo;s the official platform where the country&rsquo;s next
            wave of performers earns their spot on Tantalize&rsquo;s stage.
          </p>
        </Reveal>
      </section>

      <CheckerStripe />

      {/* ROAD TO TANTALIZE */}
      <section className="px-6 py-16 sm:px-10">
        <Reveal>
          <p
            className="text-xs tracking-[0.25em] text-blue-400"
            style={{ fontFamily: "var(--font-ah-mono), monospace" }}
          >
            THE ROAD TO TANTALIZE
          </p>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-4">
          {STAGES.map((stage, i) => (
            <Reveal key={stage.label} delay={i * 0.1}>
              <div className="relative">
                <div
                  className="text-6xl font-extrabold text-white/10"
                  style={{ fontFamily: "var(--font-ah-display), sans-serif" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div
                  className="mt-1 text-xl font-bold uppercase"
                  style={{ fontFamily: "var(--font-ah-display), sans-serif" }}
                >
                  {stage.label}
                </div>
                <div
                  className="mt-1 text-sm text-white/50"
                  style={{ fontFamily: "var(--font-ah-mono), monospace" }}
                >
                  {stage.detail}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CheckerStripe />

      {/* WHO CAN TAKE THE STAGE */}
      <section className="px-6 py-16 sm:px-10">
        <Reveal>
          <p
            className="text-xs tracking-[0.25em] text-fuchsia-400"
            style={{ fontFamily: "var(--font-ah-mono), monospace" }}
          >
            WHO CAN TAKE THE STAGE
          </p>
          <h2
            className="mt-3 text-3xl font-bold uppercase sm:text-4xl"
            style={{ fontFamily: "var(--font-ah-display), sans-serif" }}
          >
            Open to university students across Sri Lanka
          </h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat, i) => (
            <Reveal key={cat.name} delay={i * 0.08}>
              <div className="ah-card border border-white/12 bg-white/[0.03] p-6">
                <div
                  className="text-lg font-bold uppercase"
                  style={{ fontFamily: "var(--font-ah-display), sans-serif" }}
                >
                  {cat.name}
                </div>
                <p className="mt-2 text-sm text-white/55">{cat.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CheckerStripe />

      {/* REGISTER */}
      <section id="register" className="px-6 py-16 sm:px-10">
        <Reveal>
          <p
            className="text-xs tracking-[0.25em] text-blue-400"
            style={{ fontFamily: "var(--font-ah-mono), monospace" }}
          >
            REGISTER
          </p>
          <h2
            className="mt-3 text-3xl font-bold uppercase sm:text-4xl"
            style={{ fontFamily: "var(--font-ah-display), sans-serif" }}
          >
            Are you ready?
          </h2>
          <p className="mt-3 max-w-xl text-white/70">
            Your talent could take you all the way to Sri Lanka&rsquo;s
            biggest inter-university stage.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/after-hours/register"
              className="rounded-sm bg-gradient-to-r from-fuchsia-500 to-blue-500 px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-transform hover:scale-[1.03]"
            >
              Register to Perform
            </Link>
            <Link
              href="/after-hours/register-google"
              className="rounded-sm border border-white/25 px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-white/80 transition-colors hover:border-white/60 hover:text-white"
            >
              Use the Google Form
            </Link>
          </div>
        </Reveal>
      </section>

      <CheckerStripe />

      {/* COMMITTEE / FOOTER */}
      <footer className="px-6 py-16 sm:px-10">
        <Reveal>
          <p
            className="text-xs tracking-[0.25em] text-white/50"
            style={{ fontFamily: "var(--font-ah-mono), monospace" }}
          >
            ORGANIZING COMMITTEE
          </p>
        </Reveal>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COMMITTEE.map((person, i) => (
            <Reveal key={person.name} delay={i * 0.06} y={12}>
              <div className="ah-card border border-white/10 p-4">
                <div
                  className="text-[11px] uppercase tracking-wide text-fuchsia-400"
                  style={{ fontFamily: "var(--font-ah-mono), monospace" }}
                >
                  {person.role}
                </div>
                <div className="mt-1 font-medium">{person.name}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-1 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:justify-between">
          <span>AFTER HOURS × TANTALIZE 2026</span>
          <span>An initiative by the Student Activity Club of APIIT</span>
        </div>
      </footer>
    </main>
  );
}
