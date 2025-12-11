# Database Schema Documentation

**Version**: 1.0
**ORM**: Prisma
**Database**: PostgreSQL

---

## Overview

The database is designed around two core concepts: **Users** (Staff) and **AccessCodes** (Tickets).

## Models (Entities)

### 1. User
Represents a staff member or system administrator.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key. |
| `email` | String | Unique login identifier. |
| `password` | String | Hashed password. |
| `name` | String | Display name. |
| `role` | Enum | `SUPER_ADMIN`, `TREASURER`, `AGENT`, `GATEKEEPER`. |
| `assignedTickets` | Relation | One-to-Many relation to `AccessCode`. |

### 2. AccessCode (The Ticket)
Represents a single admission ticket.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key. |
| `code` | String | **Human Readable ID** (8-char). Printed on Ticket. Unique. |
| `serialNumber` | String | **Physical Serial** (e.g. "1250"). Printed on Ticket. |
| `status` | Enum | `IN_STOCK`, `ASSIGNED`, `SOLD`, `USED`, `REVOKED`. |
| `type` | Enum | `NORMAL`, `VIP`. |
| `assignedToId` | UUID? | FK to `User`. The Agent currently holding this ticket. |
| `ownerName` | String? | Name of the Guest (Customer). |
| `ownerEmail` | String? | Email of the Guest. |
| `paymentSettled` | Boolean | True if Agent has handed over cash to Treasurer. |
| `scannedAt` | DateTime? | Timestamp of entry at the gate. |
| `votedAt` | DateTime? | Timestamp when voting ballot was cast. |

### 6. TicketTransfer (P2P)
Records the transfer of ticket batches between Committee Members.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | Int | Primary Key. |
| `fromAgentId` | String | Sender Agent ID. |
| `toAgentId` | String | Receiver Agent ID. |
| `status` | Enum | `PENDING`, `ACCEPTED`, `REJECTED`, `CANCELLED`. |
| `timestamp` | DateTime | Created At. |

### 7. GlobalSettings (Singleton)
System-wide configuration.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | Int | Always 1. |
| `isSystemLockdown` | Boolean | If true, all scanning/selling interfaces are disabled. |
| `isVotingOpen` | Boolean | Controls access to the voting page. |
| `isResultsPublic` | Boolean | Controls public visibility of results. |

### 4. Candidate (Voting Nominee)
Contestants for the Tantalize Awards.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | Int | Primary Key. |
| `name` | String | Contestant Name. |
| `institute` | String | e.g., SLIIT, CINEC. |
| `image` | String | URL to profile image. |
| `category` | Enum | `BAND`, `SOLO_SINGING`, `GROUP_SINGING`, `SOLO_DANCING`, `GROUP_DANCING`. |

### 5. Vote (Ballot)
A single ballot cast by a ticket holder. One Ticket = One Ballot (with up to 5 selections).

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | Int | Primary Key. |
| `accessCodeId` | String | Unique Ticket ID (One ballot per ticket). |
| `bandId` | Int? | FK to Candidate (Band Category). |
| `soloSingingId` | Int? | FK to Candidate. |
| `groupSingingId` | Int? | FK to Candidate. |
| `soloDancingId` | Int? | FK to Candidate. |
| `groupDancingId` | Int? | FK to Candidate. |
| `timestamp` | DateTime | When the vote was cast. |

### 3. AuditLog
Immutable record of system actions for security and finance tracking.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key. |
| `action` | Enum | `ASSIGN_BATCH`, `MARK_SOLD`, `TRANSFER`, `GATE_ENTRY`... |
| `actorId` | String | ID of the User who performed the action. |
| `entityId` | String? | ID of the affected object (usually `Ticket.id`). |
| `details` | JSON | Context (e.g., "Swapped with Ticket B", "Amount: 1500"). |
| `timestamp` | DateTime | When it happened. |

## Enums

### Role
- `SUPER_ADMIN`: Full access.
- `TREASURER`: Finance Dashboard access.
- `AGENT`: Mobile Wallet access.
- `GATEKEEPER`: Scanner access.

### TicketStatus
- `IN_STOCK`: Unassigned, sitting in Master Inventory.
- `ASSIGNED`: Given to an Agent, but not yet sold to a Customer.
- `SOLD`: Sold to a Customer (Cash collected by Agent). Valid for Entry.
- `USED`: Successfully scanned at the gate.
- `REVOKED`: Banned/Lost/Stolen.

### VoteCategory
- `BAND`
- `SOLO_SINGING`
- `GROUP_SINGING`
- `SOLO_DANCING`
- `GROUP_DANCING`

---

## Relationships

- **User** `1` -- `N` **AccessCode** (`assignedTo`)
  - *An User (Agent) can hold multiple Tickets.*

- **User** `1` -- `N` **AuditLog** (`actor`)
  - *An User generates multiple Audit Logs.*
