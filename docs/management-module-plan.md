
# Ticket Management System (Inventory & Finance)

## 1. Overview
This module shifts the system from a simple scanner to a full **Inventory Management System**. It tracks the physical flow of ticket books from the Printer -> Admin -> Agents -> Customers -> Gate. The primary goal is financial accountability ("Cash in Hand") and inventory tracking.

## 2. User Roles
*   **SUPER_ADMIN (Web)**: The Treasurer/Head. Can assign books, view master inventory, settlement payments, and ban tickets.
*   **AGENT (Mobile Web)**: Committee members. Can view their "Wallet" (assigned tickets), mark tickets as SOLD (collecting cash), and transfer tickets to other agents.
*   **GATE_GUARD (Scanner)**: Security. Scans tickets. System flags if a ticket is valid but "Unpaid" (Assigned but not Sold).

## 3. Database Schema Changes

### New Model: `User`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String (UUID) | Unique ID |
| `name` | String | Display Name (e.g., "Shehan") |
| `email` | String | Login ID (Unique) |
| `password` | String | Hashed Password |
| `role` | Enum | `SUPER_ADMIN`, `AGENT`, `GATE_GUARD` |

### Updates: `AccessCode` (Ticket)
*   **New Status Enum**: `IN_STOCK` (Default), `ASSIGNED` (Held by Agent), `SOLD` (Paid/Customer has it), `SCANNED` (Used), `BANNED` (Lost/Stolen).
*   **New Fields**:
    *   `assignedToId`: String (FK to User) - Who holds the book?
    *   `soldAt`: DateTime - When was it marked sold?
    *   `customerName`: String (Optional) - CRM data.
    *   `customerPhone`: String (Optional) - CRM data.
    *   `paymentSettled`: Boolean - Has Agent paid Admin? (Default: False).

## 4. Key Workflows (Blueprints)

### A. Super-Admin Dashboard
1.  **Batch Assignment Tool**:
    *   Select Range (e.g., 0001 - 0025).
    *   Select Agent.
    *   Action: Update `assignedToId` and set Status `ASSIGNED`.
2.  **Master Inventory**:
    *   Table columns: Serial | Status | Holder | Settled?
    *   Filters: "Show Unsold", "Show Shehan's Tickets".
3.  **Finance Settlement**:
    *   View Agent's "Sold but Unsettled" tickets.
    *   Click "Mark Settled" upon receiving cash.

### B. Agent Dashboard ("My Wallet")
1.  **Stats**:
    *   "Tickets Held": 25
    *   "Sold": 10
    *   "Cash in Hand": Rs. 15,000 (Calculated).
2.  **Mark as Sold**:
    *   Click Ticket # (e.g., 0001).
    *   Action: Customer Details -> Confirm.
    *   Result: Status `SOLD`.
3.  **Transfer**:
    *   Move tickets to another Agent (requires acceptance).

### C. Gate Logic Updates
*   **Scan Logic**:
    *   If `SOLD` -> Allow Entry (`SCANNED`).
    *   If `ASSIGNED` -> Allow Entry (Don't block guest) BUT **Flag Alert**: "Ticket Unpaid/Unsold. Check with Agent [Name]".
    *   If `BANNED` -> Deny Entry ("Kill Switch").
    *   If `IN_STOCK` -> Deny Entry (Stolen from stock?).

## 5. Security & Auditing
*   **Kill Switch**: Admin can range-select and BAN lost books.
*   **Audit Logs**: Track every status change (Assigned -> Sold) with User ID and Timestamp.
