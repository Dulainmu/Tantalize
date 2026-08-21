# Phase 2: Smart-Hybrid System Requirements

## Executive Summary
Convert the Tantalize event entry and voting system from a traditional paper-based process to a "Smart-Hybrid" system. This maintains the preference for physical tokens (tickets) while introducing digital security and automated voting logic.

## Core Goals
1.  **Secure the Gate**: Eliminate fake tickets and "pass-backs".
2.  **Digitize Voting**: Enable instant, accurate audience voting without user logins or apps.
3.  **Seamless Experience**: No account creation for attendees; "Scan & Go".

## 1. The "Smart Ticket"
Every physical ticket is unique and acts as a secure digital key.

### Physical Specifications
- **Front**: Standard Tantalize artwork (Souvenir value).
- **Back**: 
    - Unique QR Code.
    - "Do Not Share" Security Warning.
- **Production**: Variable Data Printing (VDP) using a generated CSV of 1,500 entries.

### Digital Identity
- **Format**: High-entropy Magic Links (e.g., `tantalize.lk/t/x7k9-p2m4`).
- **Security**: The URL contains a UUID or high-entropy token that uniquely identifies the ticket record in the database.

---

## 2. Module A: The Gatekeeper (Security Scanner)
**User**: Security Guards / Gate Admins.
**Platform**: Web-based App (Mobile optimized).

### Workflow
1.  **Scan**: Guard scans the attendee's QC code.
2.  **Validation**:
    - System checks `Is_Valid` (Is this a real ticket?).
    - System checks `Is_Inside` (Has this ticket already been scanned?).
3.  **Feedback**:
    - **GREEN**: "Welcome" (Valid entry). System timestamps entry (e.g., 7:02 PM).
    - **RED**: "ALARM: Ticket Already Scanned" (Fraud attempt).
4.  **Offline Capability**: Must function or queue scans if Wi-Fi drops (likely utilizing local storage or optimistic UI).

---

## 3. Module B: The "One-Touch" Voting Engine
**User**: Attendees.
**Platform**: Web-based (Mobile).

### Workflow
1.  **Activation**: The Voting Link (`tantalize.lk/vote` or the magic link itself) is **LOCKED** by default. It only unlocks after the Gatekeeper scans the ticket.
    - *Prevention*: Stops users from voting from home without attending.
2.  **Interface**: 
    - User scans their own ticket to access the voting page.
    - Simple UI to select winners:
        - **Dancing**
        - **Singing**
        - **Band**
3.  **Constraints**:
    - One vote per Ticket ID.
    - Link permanently locks after submission.

## 4. Technical Stack
- **Frontend**: Next.js (Mobile-optimized).
- **Database**: PostgreSQL (Relational data integrity).
- **Hosting**: Vercel / AWS (Scale for 1,500 concurrent users).
