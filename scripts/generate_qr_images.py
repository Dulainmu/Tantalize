import qrcode
import csv
import os

# Create a folder for the images
os.makedirs("qr_images_normal", exist_ok=True)

# Read the CSV you just made
print("Generating QR Images from CSV...")

# Ensure CSV exists
if not os.path.exists('tantalize_tickets.csv'):
    print("Error: tantalize_tickets.csv not found. Please run generate_tickets.py first.")
    exit(1)

with open('tantalize_tickets.csv', 'r') as file:
    reader = csv.DictReader(file)
    
    count = 0
    for row in reader:
        ticket_id = row['Human_Readable_ID']
        url = row['QR_Link_URL']
        
        # Create QR
        qr = qrcode.QRCode(box_size=10, border=2)
        qr.add_data(url)
        qr.make(fit=True)
        
        # Generate as standard image first
        img = qr.make_image(fill_color="black", back_color="white").convert('RGBA')
        
        # Make white background transparent
        datas = img.getdata()
        newData = []
        for item in datas:
            # If pixel is white (or very close to it), make it transparent
            if item[0] > 240 and item[1] > 240 and item[2] > 240:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)
        
        img.putdata(newData)
        
        # Save as "A7F3.png" (Using the ID as the filename)
        img.save(f"qr_images_normal/{ticket_id}.png")
        count += 1
        if count % 100 == 0:
            print(f"Generated {count} images...")

print(f"Done. Generated {count} images in 'qr_images_normal' folder.")
