"use client";

import { useState, FormEvent } from "react";

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Other"];

const PERFORMANCE_TYPES = [
  "Singing - Solo",
  "Singing - Duo/Group",
  "Singing - Band Performance",
  "Dance - Solo",
  "Dance - Group",
];

const HEARD_FROM = ["Instagram", "Friend", "University Society", "Other"];

const inputClass =
  "w-full border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-fuchsia-400";

const selectClass =
  inputClass +
  " appearance-none bg-no-repeat bg-[length:14px] pr-10 [background-position:right_16px_center]";

const selectArrow = {
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='white' stroke-opacity='0.6' stroke-width='2'><path d='M5 7.5l5 5 5-5' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
};

// Native <option> popups ignore the select's Tailwind background, so give
// every option an explicit dark background or the text renders white-on-white.
const optionStyle = { backgroundColor: "#15121e", color: "#ffffff" };

const labelClass =
  "mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-white/50";

type Status = "idle" | "submitting" | "success" | "error";

export default function RegisterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [heardFrom, setHeardFrom] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    const resolvedYear =
      data.get("yearOfStudy") === "Other"
        ? String(data.get("yearOfStudyOther") ?? "").trim()
        : String(data.get("yearOfStudy") ?? "");

    const resolvedHeard =
      data.get("heardFrom") === "Other"
        ? String(data.get("heardFromOther") ?? "").trim()
        : String(data.get("heardFrom") ?? "");

    const payload = {
      fullName: data.get("fullName"),
      studentId: data.get("studentId"),
      university: data.get("university"),
      yearOfStudy: resolvedYear,
      phone: data.get("phone"),
      email: data.get("email"),
      performanceType: data.get("performanceType"),
      groupName: data.get("groupName"),
      otherMembers: data.get("otherMembers"),
      performerCount: data.get("performerCount"),
      heardFrom: resolvedHeard,
      notes: data.get("notes"),
      declaration: data.get("declaration") === "on",
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
      setYearOfStudy("");
      setHeardFrom("");
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
    <form onSubmit={handleSubmit} className="ah-form-shell relative max-w-2xl p-8 sm:p-10">
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
          <label className={labelClass} htmlFor="fullName">
            Full Name *
          </label>
          <input id="fullName" name="fullName" required className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="studentId">
            Student ID
          </label>
          <input id="studentId" name="studentId" className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="university">
            University *
          </label>
          <input id="university" name="university" required className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="yearOfStudy">
            Year of Study *
          </label>
          <select
            id="yearOfStudy"
            name="yearOfStudy"
            required
            value={yearOfStudy}
            onChange={(e) => setYearOfStudy(e.target.value)}
            className={selectClass}
            style={selectArrow}
          >
            <option value="" disabled style={optionStyle}>
              Select one
            </option>
            {YEARS.map((y) => (
              <option key={y} value={y} style={optionStyle}>
                {y}
              </option>
            ))}
          </select>
          {yearOfStudy === "Other" && (
            <input
              name="yearOfStudyOther"
              placeholder="Please specify"
              required
              className={`${inputClass} mt-2`}
            />
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="phone">
            Contact Number (WhatsApp preferred) *
          </label>
          <input id="phone" name="phone" type="tel" required className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="email">
            Email Address *
          </label>
          <input id="email" name="email" type="email" required className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="performanceType">
            Performance Type *
          </label>
          <select
            id="performanceType"
            name="performanceType"
            required
            defaultValue=""
            className={selectClass}
            style={selectArrow}
          >
            <option value="" disabled style={optionStyle}>
              Select one
            </option>
            {PERFORMANCE_TYPES.map((p) => (
              <option key={p} value={p} style={optionStyle}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="groupName">
            Group/Band Name (if applicable)
          </label>
          <input id="groupName" name="groupName" className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="performerCount">
            Number of Performers on Stage *
          </label>
          <input
            id="performerCount"
            name="performerCount"
            type="number"
            min={1}
            required
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="otherMembers">
            Names of Other Members (if group)
          </label>
          <textarea
            id="otherMembers"
            name="otherMembers"
            rows={2}
            className={inputClass}
            placeholder="List each member, one per line"
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="heardFrom">
            How did you hear about After Hours?
          </label>
          <select
            id="heardFrom"
            name="heardFrom"
            value={heardFrom}
            onChange={(e) => setHeardFrom(e.target.value)}
            className={selectClass}
            style={selectArrow}
          >
            <option value="" style={optionStyle}>
              Select one
            </option>
            {HEARD_FROM.map((h) => (
              <option key={h} value={h} style={optionStyle}>
                {h}
              </option>
            ))}
          </select>
          {heardFrom === "Other" && (
            <input
              name="heardFromOther"
              placeholder="Please specify"
              className={`${inputClass} mt-2`}
            />
          )}
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="notes">
            Any Special Requirements or Notes
          </label>
          <textarea id="notes" name="notes" rows={3} className={inputClass} />
        </div>
      </div>

      <div className="mt-8 border border-white/10 bg-white/[0.03] p-5 text-sm text-white/60">
        <p
          className="mb-2 text-[11px] uppercase tracking-[0.15em] text-white/50"
          style={{ fontFamily: "var(--font-ah-mono), monospace" }}
        >
          Please Note Before Submitting
        </p>
        <ul className="list-disc space-y-2 pl-4">
          <li>
            Drum set, sound system, and standard studio equipment will be
            provided by the organizing committee. Any other instruments
            required for your performance must be arranged and brought by
            the contestants themselves.
          </li>
          <li>
            Dancers: please send your music tracks to the organizing
            committee at least 2 days prior to the audition date. Tracks not
            submitted in advance may result in your audition slot being
            affected.
          </li>
        </ul>
      </div>

      <label className="mt-6 flex items-start gap-3 text-sm text-white/60">
        <input
          type="checkbox"
          name="declaration"
          required
          className="mt-0.5 h-4 w-4 accent-fuchsia-500"
        />
        I have read and understood the notes above, and confirm the details
        in this form are accurate. *
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
