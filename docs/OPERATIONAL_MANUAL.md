# Operational Manual (SOPs)

**For**: Admin, Treasurer, Agents, Gatekeepers.

---

## 1. 👮 Super Admin (IT Head)

### How to Create a New User
1. Login to `/admin/login`.
2. Go to **Committee** (`/admin/users`).
3. Click "Add New Member".
4. Select Role (e.g., `AGENT` or `TREASURER`).
5. Share credentials securely.

### How to Assign Tickets to an Agent
1. Go to **Inventory** (`/admin/inventory`).
2. Click **"Batch Assign"**.
3. Select the Agent.
4. Enter the Serial Range (e.g., "0001" to "0050").
5. Click Assign. *These tickets will now appear in that Agent's wallet.*

### How to Fix a "Mismatched" Ticket (Binder Tool)
*Use this if the QR sticker doesn't match the printed serial number.*
1. Go to **Binder** (`/admin/binder`).
2. Scan the **QR Code**.
3. Type the **Physical Serial Number**.
4. Click "Bind". The system swaps the records to match reality.

---

## 2. 💰 Treasurer (Finance)

### How to Collect Cash
1. Login to `/admin/login` (Treasurer Account).
2. Go to **Dashboard** (`/treasurer/dashboard`).
3. Find the Agent in the list (shows "Pending: Rs. 15,000").
4. Click **"Collect"**.
5. Verify the physical cash amount matches the system.
6. Click **"Confirm Receipt"**.
   - *The tickets are now marked as "Settled".*
   - *Audit Log records the transaction.*

---

## 3. 📱 Committee Member (Mobile App)

### 1. The Wallet (Home)
- **Check Stock**: Large number shows how many tickets you hold.
- **Check Liability**: Large cash value shows what you owe the Treasurer.
- **Selling**: Tap the **"+" (Plus)** button to start a sale.

### 2. How to Sell a Ticket
1. Tap **"Record Sale"**.
2. **Select Tickets**: Tap the serial numbers you are handing over.
3. **Customer Info**: Enter Name/Mobile (Optional) so they can recover lost tickets.
4. **Payment**: Select CASH or BANK TRANSFER.
5. Tap **"Confirm Sale"**. Code activates instantly.

### 3. Transferring Tickets (Swap)
*When giving your books to another member.*
1. Go to **"Transfers"**.
2. Tap **"Send Tickets"**.
3. Select the Serial Range.
4. Select the **Recipient Member**.
5. Click Send.
   - *Tickets remain yours until they click "Accept".*
   - *Once accepted, your liability drops, and theirs increases.*

### 4. How to Find a Ticket (Flashlight)
*If you have a customized stack and need to find #0045 quickly.*
1. Tap the **Flashlight/Scan** icon.
2. Point camera at the physical ticket QR.
3. The app highlights the ticket in your list so you can mark it sold.

### 5. Lost Ticket Reporting
1. Select the specific ticket in your Inventory.
2. Tap **"Report Lost"**.
3. Confirm. This **deactivates the QR code** immediately.
   - *Note: You are still liable for the cost until Admin clears it.*

---

## 4. 🚪 Gatekeeper (Security)

### Entry Procedure
1. Login to `/admin/gatekeeper`.
2. Tap **"ENTRY MODE"**.
3. Scan the Guest's Ticket.
   - **Green (ACCESS GRANTED)**: Let them in.
   - **Yellow (WARNING: UNPAID)**: Ticket is valid but Agent hasn't marked it SOLD. Verify payment proof, then allow.
   - **Red (USED / INVALID)**: Deny Entry.

### Manual Lookup (Damaged QR)
1. Tap the **Keyboard Icon** (⌨️) on the scanner screen.
2. Type the Serial Number (e.g., "0050").
3. Tap Verify.

---

## 5. 🗳️ Voting Management

### How to Open/Close Voting
1. Login to `/admin/settings`.
2. Toggle **"System Lockdown"** to OFF (if active).
3. Toggle **"Voting Open"** to ON.
   - *Users can now access the voting page via their Ticket QR link.*

### How to View Live Results
1. Navigate to `https://tantalize.lk/vote/results`.
2. This page auto-refreshes every 15 seconds.
3. **Note**: Do not share this link with the public until you are ready to reveal the winner!

---

## 6. 🚨 Emergency Procedures

### SYSTEM LOCKDOWN
**USE ONLY IF: Security Breach, Riot, or Server Failure.**
1. Login to `/admin/settings`.
2. Click the big red button: **"ENABLE LOCKDOWN"**.
3. **Effect**: 
   - All Scanners stop working.
   - All Agent sales are blocked.
   - Voting is suspended.
4. To restore, click "DISABLE LOCKDOWN".
