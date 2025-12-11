# API Reference

**Base URL**: `/api`
**Auth**: HttpOnly Cookie (`auth_token`)

---

## 1. Admin & Inventory

### `GET /api/admin/inventory`
Fetch all tickets with pagination.
- **Query**: `page`, `search`, `status`, `type`.
- **Response**: `{ tickets: AccessCode[], total: number }`

### `POST /api/admin/inventory` (Batch Assign)
Assign a range of tickets to a user.
- **Body**: `{ startSerial: string, endSerial: string, agentId: string }`
- **Audit**: `ASSIGN_BATCH`

### `POST /api/admin/bind` (Ticket Binder)
Link a physical QR to a serial number (Swap).
- **Body**: `{ code: string, serial: string }`
- **Body**: `{ code: string, serial: string }`
- **Audit**: `BIND_SWAP`

### `POST /api/admin/settings` (Global Control)
Toggle system-wide settings like Lockdown.
- **Body**: `{ isSystemLockdown: boolean, isVotingOpen: boolean }`
- **Auth**: Super Admin Only.

---

## 2. Agent Actions

### `POST /api/agent/sell`
Mark a ticket as SOLD.
- **Body**: `{ ticketId: string, customerName?: string, customerEmail?: string }`
- **Audit**: `MARK_SOLD`

### `POST /api/agent/transfer`
Move stock to another agent.
- **Body**: `{ ticketIds: string[], targetAgentId: string }`
- **Audit**: `TRANSFER`

---

## 3. Gatekeeper

### `POST /api/gatekeeper/scan`
Validate a ticket for entry.
- **Body**: `{ code: string, mode: 'ENTRY' | 'VERIFY' }`
- **Logic**:
  - Finds ticket by `code` OR `serialNumber`.
  - Checks if `status == SOLD`.
  - If `mode == ENTRY` and valid, updates `status = USED`, `scannedAt = now`.
- **Response**:
  - `status`: `GRANTED` | `WARNING` | `USED` | `INVALID`
  - `message`: User-friendly text.

---

## 4. Finance

### `POST /api/finance/settle`
Mark tickets as financially settled.
- **Body**: `{ agentId: string, amount: number, ticketIds: string[] }`
- **Audit**: `FINANCE_SETTLE`

---

## 5. Voting Engine

### `GET /api/vote/candidates`
Fetch all finalists grouped by category.
- **Cache**: 60 minutes (`max-age=3600`).
- **Response**: `{ bands: [], soloSinging: [], ... }`

### `POST /api/vote/cast`
Submit a ballot.
- **Body**: `{ ticketId: string, votes: { bandId: 1, soloSingingId: 4, ... } }`
- **Checks**: 
  - Ticket Status (must be SOLD/SCANNED).
  - System Lockdown (must be false).
  - Voting Open (must be true).
  - Previous Vote (must be null).

### `GET /api/vote/stats`
Get live voting results.
- **Cache**: 15 seconds (`unstable_cache`).
- **Response**: List of candidates with `votes` count and `percentage`.
