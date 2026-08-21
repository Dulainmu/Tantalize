"use client";

import { useState, FormEvent, ReactNode } from "react";
import { motion, Variants, useReducedMotion } from "framer-motion";
import {
  User,
  IdCard,
  GraduationCap,
  CalendarDays,
  Phone,
  Mail,
  Mic,
  Users,
  Hash,
  HelpCircle,
  NotepadText,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Other"];

const PERFORMANCE_TYPES = [
  "Singing - Solo",
  "Singing - Duo/Group",
  "Singing - Band Performance",
  "Dance - Solo",
  "Dance - Group",
];

const HEARD_FROM = ["Instagram", "Friend", "University Society", "Other"];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const groupVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

const inputClass =
  "w-full border border-white/15 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/35 outline-none transition-all duration-200 focus:border-fuchsia-400 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(255,47,208,0.12)]";

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

function Field({
  icon,
  label,
  required,
  htmlFor,
  span2,
  children,
}: {
  icon: ReactNode;
  label: string;
  required?: boolean;
  htmlFor: string;
  span2?: boolean;
  children: ReactNode;
}) {
  return (
    <motion.div variants={fieldVariants} className={span2 ? "sm:col-span-2" : undefined}>
      <label className={labelClass} htmlFor={htmlFor}>
        {label} {required && <span className="text-fuchsia-400">*</span>}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35">
          {icon}
        </span>
        {children}
      </div>
    </motion.div>
  );
}

function GroupHeading({ index, title }: { index: string; title: string }) {
  return (
    <div className="mb-4 flex items-baseline gap-3">
      <span
        className="text-xs text-fuchsia-400"
        style={{ fontFamily: "var(--font-ah-mono), monospace" }}
      >
        {index}
      </span>
      <span
        className="text-xs uppercase tracking-[0.2em] text-white/40"
        style={{ fontFamily: "var(--font-ah-mono), monospace" }}
      >
        {title}
      </span>
      <span className="h-px flex-1 bg-white/10" />
    </div>
  );
}

type Status = "idle" | "submitting" | "success" | "error";

export default function RegisterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [heardFrom, setHeardFrom] = useState("");
  const reduceMotion = useReducedMotion();

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
    const burst = Array.from({ length: 10 });
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="ah-form-shell relative w-full max-w-2xl overflow-hidden p-10 text-center"
      >
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
          {!reduceMotion &&
            burst.map((_, i) => {
              const angle = (i / burst.length) * Math.PI * 2;
              return (
                <motion.span
                  key={i}
                  className="absolute h-1.5 w-1.5 rounded-full"
                  style={{
                    background: i % 2 === 0 ? "#ff2fd0" : "#3b7bff",
                  }}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos(angle) * 60,
                    y: Math.sin(angle) * 60,
                    opacity: 0,
                  }}
                  transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
                />
              );
            })}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <CheckCircle2 className="h-16 w-16 text-fuchsia-400" strokeWidth={1.5} />
          </motion.div>
        </div>

        <p
          className="mt-6 text-2xl font-bold uppercase"
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
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="ah-form-shell relative w-full max-w-3xl p-8 sm:p-10 lg:max-w-none">
      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      {/* IDENTITY */}
      <GroupHeading index="01" title="Who Are You" />
      <motion.div
        variants={groupVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2"
      >
        <Field icon={<User size={16} />} label="Full Name" required htmlFor="fullName" span2>
          <input id="fullName" name="fullName" required className={inputClass} />
        </Field>

        <Field icon={<IdCard size={16} />} label="Student ID" htmlFor="studentId">
          <input id="studentId" name="studentId" className={inputClass} />
        </Field>

        <Field icon={<GraduationCap size={16} />} label="University" required htmlFor="university">
          <input id="university" name="university" required className={inputClass} />
        </Field>

        <Field icon={<CalendarDays size={16} />} label="Year of Study" required htmlFor="yearOfStudy">
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
              className={`${inputClass} mt-2 pl-4`}
            />
          )}
        </Field>
      </motion.div>

      {/* CONTACT */}
      <div className="mt-10">
        <GroupHeading index="02" title="How To Reach You" />
        <motion.div
          variants={groupVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2"
        >
          <Field icon={<Phone size={16} />} label="Contact Number (WhatsApp preferred)" required htmlFor="phone">
            <input id="phone" name="phone" type="tel" required className={inputClass} />
          </Field>

          <Field icon={<Mail size={16} />} label="Email Address" required htmlFor="email">
            <input id="email" name="email" type="email" required className={inputClass} />
          </Field>
        </motion.div>
      </div>

      {/* THE ACT */}
      <div className="mt-10">
        <GroupHeading index="03" title="Your Act" />
        <motion.div
          variants={groupVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2"
        >
          <Field icon={<Mic size={16} />} label="Performance Type" required htmlFor="performanceType" span2>
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
          </Field>

          <Field icon={<Users size={16} />} label="Group/Band Name (if applicable)" htmlFor="groupName">
            <input id="groupName" name="groupName" className={inputClass} />
          </Field>

          <Field icon={<Hash size={16} />} label="Number of Performers on Stage" required htmlFor="performerCount">
            <input
              id="performerCount"
              name="performerCount"
              type="number"
              min={1}
              required
              className={inputClass}
            />
          </Field>

          <motion.div variants={fieldVariants} className="sm:col-span-2">
            <label className={labelClass} htmlFor="otherMembers">
              Names of Other Members (if group)
            </label>
            <textarea
              id="otherMembers"
              name="otherMembers"
              rows={2}
              className={`${inputClass} pl-4`}
              placeholder="List each member, one per line"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* EXTRAS */}
      <div className="mt-10">
        <GroupHeading index="04" title="Anything Else" />
        <motion.div
          variants={groupVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2"
        >
          <Field icon={<HelpCircle size={16} />} label="How did you hear about After Hours?" htmlFor="heardFrom" span2>
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
                className={`${inputClass} mt-2 pl-4`}
              />
            )}
          </Field>

          <motion.div variants={fieldVariants} className="sm:col-span-2">
            <label className={labelClass} htmlFor="notes">
              <span className="inline-flex items-center gap-1.5">
                <NotepadText size={13} className="text-white/35" />
                Any Special Requirements or Notes
              </span>
            </label>
            <textarea id="notes" name="notes" rows={3} className={`${inputClass} pl-4`} />
          </motion.div>
        </motion.div>
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
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {errorMsg}
        </motion.p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-sm bg-gradient-to-r from-fuchsia-500 to-blue-500 px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-transform hover:scale-[1.01] disabled:opacity-70 disabled:hover:scale-100"
      >
        {status === "submitting" && <Loader2 size={16} className="animate-spin" />}
        <span className="relative z-10">
          {status === "submitting" ? "Submitting…" : "Submit Registration"}
        </span>
        {status !== "submitting" && (
          <span className="absolute inset-0 -translate-x-full bg-white/25 transition-transform duration-500 group-hover:translate-x-0" />
        )}
      </button>
    </form>
  );
}
