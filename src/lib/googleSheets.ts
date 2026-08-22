import { JWT } from "google-auth-library";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

function getClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !rawKey) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY are not set"
    );
  }

  return new JWT({
    email,
    key: rawKey.replace(/\\n/g, "\n"),
    scopes: SCOPES,
  });
}

export async function appendRow(row: (string | number)[]) {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const range = process.env.GOOGLE_SHEET_RANGE || "Registrations!A:N";

  if (!sheetId) {
    throw new Error("GOOGLE_SHEET_ID is not set");
  }

  const client = getClient();
  // RAW (not USER_ENTERED) so Sheets never tries to parse a value as a
  // formula — a leading "+" on a phone number like "+94 77 ..." would
  // otherwise be read as the start of a formula and error out.
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(
    range
  )}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;

  const res = await client.request({
    url,
    method: "POST",
    data: { values: [row] },
  });

  return res.data;
}
