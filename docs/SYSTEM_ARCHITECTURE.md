# Tantalize 2025 - System Architecture Document

**Version**: 1.0
**Date**: December 2025
**Author**: Tantalize IT Team

---

## 1. Executive Summary

This document outlines the technical architecture of the **Tantalize 2025** event management platform. The system is designed to handle high-traffic ticket sales, secure access control (Gatekeeping), financial auditing, and audience engagement (Voting) for a large-scale university event.

## 2. Technology Stack

### Core Framework
- **Frontend/Backend**: [Next.js 14](https://nextjs.org/) (App Router, Server Actions)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Framer Motion (for animations)

### Database & State
- **Database**: PostgreSQL (hosted on Railway/Supabase)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: Custom JWT-based stateless session management (HttpOnly Cookies).

### Infrastructure
- **Hosting**: Vercel (Front/Back) + Railway (Postgres)
- **Secrets Management**: `.env` (Environment Variables)

---

## 3. High-Level Architecture Modules

The application is divided into 5 distinct modules, accessible via role-based access control (RBAC).

### A. The Public Portal (User Facing)
- **URL**: `https://tantalize.lk`
- **Purpose**: Event information, Ticket Purchasing (Magic Link / WhatsApp integration), Live Voting interface.
- **Key Components**: Hero Section, Timeline, Ticket purchase flow.

### B. The Command Center (Super Admin)
- **URL**: `/admin`
- **Role**: `SUPER_ADMIN`
- **Features**:
  - **Inventory Management**: Create/Edit 1500+ ticket records.
  - **User Management**: Assign Roles (Agents, Treasurer).
  - **Audit Logs**: Full trace of every system action.
  - **Gate & Voting Control**: Emergency overrides and global toggles.

### C. The Sales Force (Agents)
- **URL**: `/agent`
- **Role**: `AGENT`
- **Features**:
  - **Digital Wallet**: View assigned tickets.
  - **QR Distribution**: "Mark as Sold" to release QR to customer.
  - **Peer-to-Peer Transfer**: Securely transfer stock between agents.

### D. Finance & Settlement (Treasurer)
- **URL**: `/treasurer`
- **Role**: `TREASURER`
- **Features**:
  - **Debt Tracking**: Real-time view of cash held by each agent.
  - **Settlement Workflow**: Accept cash -> Mark tickets as "Settled" -> Generate receipt log.

### E. Access Control (Gatekeeper)
- **URL**: `/admin/gatekeeper`
- **Role**: `GATEKEEPER` / `SUPER_ADMIN`
- **Features**:
  - **QR Scanner**: Mobile-optimized scanner.
  - **Validation Engine**: Checks `TicketStatus` (SOLD vs ASSIGNED vs USED).
  - **Offline-First Logic**: Warning system for unpaid (ASSIGNED) tickets.

### F. Voting Engine (The Director)
- **URL**: `/t/[id]` (User), `/vote/results` (Public)
- **Purpose**: Audience choice awards (King/Queen/Bands).
- **Architecture**:
  - **Transaction-Safe**: One Ticket = One Ballot.
  - **High-Concurrency**: Results are cached (`unstable_cache`) to handle 4000+ simultaneous viewers.
  - **Live UI**: Auto-refreshing charts using polling.

---

## 4. Security Architecture

### 4.1 Authentication & Authorization
- **Passwords**: Hashed using **Bcrypt** (Salted).
- **JWT**: Signed using `HS256`. Tokens expire every 24 hours.
- **Role-Based Middlewares**: Middleware ensures users can only access routes permitted for their `Role`.

### 4.2 Data Integrity & Safety
- **System Lockdown**: Global "Kill Switch" stored in `GlobalSettings`. Instantly blocks all Scanning, Selling, and Voting APIs in case of emergency.
- **Audit Logging**: Critical actions (`SELL`, `SETTLE`, `ENTRY`) are recorded in an immutable `AuditLog` table.
- **Concurrency Control**: Prisma transactions allow safe ticket transfers and settlements.

### 4.3 Ticket Security
- **Unique Identifiers**:
  - `id` (UUID): Internal Database ID.
  - `code` (8-char Hex): Human Readable ID (printed on ticket).
  - `serialNumber` (String): Physical Ticket Number (e.g., "0050").
- **Anti-Fraud**:
  - QR Codes are signed/linked to the UUID.
  - "Used" tickets are rejected instantly at the gate.
  - "Assigned" (but unpaid) tickets trigger a `WARNING` but not a `DENY`, allowing for on-site resolution.
