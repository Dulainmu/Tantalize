import uuid
import csv

# CONFIGURATION
TOTAL_TICKETS = 1500
BASE_URL = "https://tantalize.lk/t/"

filename = "tantalize_tickets.csv"

print(f"Generating {TOTAL_TICKETS} tickets...")

with open(filename, mode='w', newline='') as file:
    writer = csv.writer(file)
    # The Header Row for the Printer
    writer.writerow(["Serial_Number", "Human_Readable_ID", "QR_Link_URL", "Ticket_Status"])

    for i in range(1, TOTAL_TICKETS + 1):
        # 1. Generate a secure random ID (8 chars is enough for 1500 people, but hard to guess)
        # We use .hex to get clean characters (0-9, a-f)
        unique_id = uuid.uuid4().hex[:8].upper()
        
        # 2. Create the Magic Link
        magic_link = f"{BASE_URL}{unique_id}"
        
        # 3. Create Serial Number (e.g., 0001, 0002)
        serial_no = f"{i:04d}"
        
        # 4. Write to CSV
        writer.writerow([serial_no, unique_id, magic_link, "NORMAL"])

print(f"Success! '{filename}' created with {TOTAL_TICKETS} unique codes.")
