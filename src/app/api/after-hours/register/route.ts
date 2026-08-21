import { NextRequest, NextResponse } from "next/server";
import { appendRow } from "@/lib/googleSheets";

const PERFORMANCE_TYPES = [
  "Singing - Solo",
  "Singing - Duo/Group",
  "Singing - Band Performance",
  "Dance - Solo",
  "Dance - Group",
];

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

  const fullName = String(body.fullName ?? "").trim();
  const studentId = String(body.studentId ?? "").trim();
  const university = String(body.university ?? "").trim();
  const yearOfStudy = String(body.yearOfStudy ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const email = String(body.email ?? "").trim();
  const performanceType = String(body.performanceType ?? "").trim();
  const groupName = String(body.groupName ?? "").trim();
  const otherMembers = String(body.otherMembers ?? "").trim();
  const performerCount = String(body.performerCount ?? "").trim();
  const heardFrom = String(body.heardFrom ?? "").trim();
  const notes = String(body.notes ?? "").trim();
  const declaration = Boolean(body.declaration);

  if (
    !fullName ||
    !university ||
    !yearOfStudy ||
    !phone ||
    !email ||
    !performanceType ||
    !performerCount ||
    !declaration
  ) {
    return NextResponse.json(
      { error: "Please fill in all required fields and accept the declaration." },
      { status: 400 }
    );
  }

  if (!PERFORMANCE_TYPES.includes(performanceType)) {
    return NextResponse.json({ error: "Invalid performance type." }, { status: 400 });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const performerCountNum = Number(performerCount);
  if (!Number.isFinite(performerCountNum) || performerCountNum < 1) {
    return NextResponse.json(
      { error: "Please enter a valid number of performers." },
      { status: 400 }
    );
  }

  try {
    await appendRow([
      new Date().toISOString(),
      fullName,
      studentId,
      university,
      yearOfStudy,
      phone,
      email,
      performanceType,
      groupName,
      otherMembers,
      performerCountNum,
      heardFrom,
      notes,
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
