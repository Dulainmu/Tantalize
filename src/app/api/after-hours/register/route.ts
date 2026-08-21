import { NextRequest, NextResponse } from "next/server";
import { appendRow } from "@/lib/googleSheets";

const CATEGORIES = ["Solo Singer", "Dancer / Dance Crew", "Band", "Mixed Performance"];

const submissionsByIp = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;

function isRateLimited(ip: string) {
  const now = Date.now();
  const timestamps = (submissionsByIp.get(ip) ?? []).filter(
    (t) => now - t < WINDOW_MS
  );
  timestamps.push(now);
  submissionsByIp.set(ip, timestamps);
  return timestamps.length > MAX_PER_WINDOW;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again in a minute." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot — bots fill every field, humans never see this one.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const actName = String(body.actName ?? "").trim();
  const university = String(body.university ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const email = String(body.email ?? "").trim();
  const category = String(body.category ?? "").trim();
  const memberInfo = String(body.memberInfo ?? "").trim();
  const portfolioLink = String(body.portfolioLink ?? "").trim();
  const consent = Boolean(body.consent);

  if (!actName || !university || !phone || !email || !category || !consent) {
    return NextResponse.json(
      { error: "Please fill in all required fields and accept the consent checkbox." },
      { status: 400 }
    );
  }

  if (!CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Invalid category." }, { status: 400 });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    await appendRow([
      new Date().toISOString(),
      actName,
      university,
      phone,
      email,
      category,
      memberInfo,
      portfolioLink,
      "Yes",
    ]);
  } catch (err) {
    console.error("After Hours registration — failed to write to sheet:", err);
    return NextResponse.json(
      { error: "Something went wrong on our end. Please try again shortly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
