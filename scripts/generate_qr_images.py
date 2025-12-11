import qrcode
import csv
import os

from PIL import Image, ImageDraw, ImageFont

# Create a folder for the images
os.makedirs("qr_images_white", exist_ok=True)

# Read the CSV you just made
print("Generating QR Images from CSV...")

# Ensure CSV exists
if not os.path.exists('tantalize_tickets.csv'):
    print("Error: tantalize_tickets.csv not found. Please run generate_tickets.py first.")
    exit(1)

with open('tantalize_tickets.csv', 'r') as file:
    reader = csv.DictReader(file)
    
    count = 0
    # Try to load a font, fall back to default if necessary
    try:
        # MacOS usually has Arial or Helvetica
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 40)
    except IOError:
        try:
             font = ImageFont.truetype("arial.ttf", 40)
        except IOError:
             font = ImageFont.load_default()

    for row in reader:
        ticket_id = row['Human_Readable_ID']
        url = row['QR_Link_URL']
        
        # Create QR
        qr = qrcode.QRCode(box_size=10, border=2)
        qr.add_data(url)
        qr.make(fit=True)
        
        # Generate as standard image first (White QR, Black BG to perform keying)
        qr_img = qr.make_image(fill_color="white", back_color="black").convert('RGBA')
        
        # Make BLACK background transparent
        datas = qr_img.getdata()
        newData = []
        for item in datas:
            # If pixel is BLACK (or close), make it transparent
            if item[0] < 50 and item[1] < 50 and item[2] < 50:
                newData.append((0, 0, 0, 0))
            else:
                # Keep White
                newData.append(item)
        
        qr_img.putdata(newData)
        
        # Create New Canvas with space for text
        # Add 50px at the bottom
        final_width = qr_img.width
        final_height = qr_img.height + 50
        
        final_img = Image.new('RGBA', (final_width, final_height), (0, 0, 0, 0))
        final_img.paste(qr_img, (0, 0))
        
        # Draw Text
        draw = ImageDraw.Draw(final_img)
        
        # Measure text to center it (bbox: left, top, right, bottom)
        text_bbox = draw.textbbox((0, 0), ticket_id, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]
        
        x = (final_width - text_width) / 2
        y = qr_img.height + (50 - text_height) / 2 - 10 # -10 adjust for baseline
        
        draw.text((x, y), ticket_id, fill="white", font=font)

        # Save as "A7F3.png" (Using the ID as the filename)
        final_img.save(f"qr_images_white/{ticket_id}.png")
        count += 1
        if count % 100 == 0:
            print(f"Generated {count} images...")

print(f"Done. Generated {count} images in 'qr_images_white' folder.")
