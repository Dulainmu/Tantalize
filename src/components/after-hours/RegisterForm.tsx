"use client";

import { useState, FormEvent } from "react";

const CATEGORIES = ["Solo Singer", "Dancer / Dance Crew", "Band", "Mixed Performance"];

const inputClass =
  "w-full border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-fuchsia-400";

const labelClass =
  "mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-white/50";

type Status = "idle" | "submitting" | "success" | "error";

export default function RegisterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [category, setCategory] = useState("");

  const showMembers = category === "Band" || category === "Dancer / Dance Crew" || category === "Mixed Performance";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      actName: data.get("actName"),
      university: data.get("university"),
      phone: data.get("phone"),
      email: data.get("email"),
      category: data.get("category"),
      memberInfo: data.get("memberInfo"),
      portfolioLink: data.get("portfolioLink"),
      consent: data.get("consent") === "on",
      website: data.get("website"), // honeypot
    };

    try {
      const res = await fetch("/api/after-hours/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(json.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
      setCategory("");
    } catch {
      setErrorMsg("Couldn't reach the server. Check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="ah-form-shell max-w-2xl p-10 text-center">
        <p
          className="text-2xl font-bold uppercase"
          style={{ fontFamily: "var(--font-ah-display), sans-serif" }}
        >
          You&rsquo;re In.
        </p>
        <p className="mt-3 text-white/65">
          Your registration has been received. Keep an eye on your email for
          audition details.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 border border-white/20 px-6 py-2.5 text-sm uppercase tracking-wide text-white/70 transition-colors hover:border-white/50 hover:text-white"
        >
          Register another act
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="ah-form-shell max-w-2xl p-8 sm:p-10">
      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="actName">
            Performer / Act Name *
          </label>
          <input id="actName" name="actName" required className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="university">
            University *
          </label>
          <input id="university" name="university" required className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="category">
            Category *
          </label>
          <select
            id="category"
            name="category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              Select one
            </option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="phone">
            Contact Phone *
          </label>
          <input id="phone" name="phone" type="tel" required className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="email">
            Contact Email *
          </label>
          <input id="email" name="email" type="email" required className={inputClass} />
        </div>

        {showMembers && (
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="memberInfo">
              Member Names {category === "Band" ? "& Instruments" : ""}
            </label>
            <textarea
              id="memberInfo"
              name="memberInfo"
              rows={2}
              className={inputClass}
              placeholder="List each member, one per line"
            />
          </div>
        )}

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="portfolioLink">
            Portfolio / Social Link
          </label>
          <input
            id="portfolioLink"
            name="portfolioLink"
            type="url"
            placeholder="https://instagram.com/..."
            className={inputClass}
          />
        </div>
      </div>

      <label className="mt-6 flex items-start gap-3 text-sm text-white/60">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 h-4 w-4 accent-fuchsia-500"
        />
        I consent to being contacted by the After Hours organizing committee
        regarding this registration. *
      </label>

      {status === "error" && (
        <p className="mt-4 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 w-full rounded-sm bg-gradient-to-r from-fuchsia-500 to-blue-500 px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-transform hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100"
      >
        {status === "submitting" ? "Submitting…" : "Submit Registration"}
      </button>
    </form>
  );
}
