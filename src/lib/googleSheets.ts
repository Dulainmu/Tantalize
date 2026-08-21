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
  const range = process.env.GOOGLE_SHEET_RANGE || "Sheet1!A:N";

  if (!sheetId) {
    throw new Error("GOOGLE_SHEET_ID is not set");
  }

  const client = getClient();
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(
    range
  )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const res = await client.request({
    url,
    method: "POST",
    data: { values: [row] },
  });

  return res.data;
}
