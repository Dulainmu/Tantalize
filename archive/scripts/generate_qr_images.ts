
import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import QRCode from 'qrcode';
import { createCanvas, registerFont } from 'canvas';
import fs from 'fs';
import path from 'path';

// Setup Prisma
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Configuration
const CONFIG = {
    bgColor: '#0f3ea6', // Blue
    qrColor: '#FFFFFF', // White
    width: 600,
    height: 750, // Added space for text
    qrSize: 400,
    outputDir: path.join(process.cwd(), 'c:/Users/PC/Downloads/Tantalize-main/Tantalize-main/src/app/admin/gatekeeper/page.tsx', 'generated_qrcodes'), // Adjusted to project root /public/generated_qrcodes typically
};

// Fix output dir to be in project root public/generated_qrcodes
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'generated_qrcodes');

async function main() {
    console.log('🖼️  Starting QR Code Generation...');
    
    // Ensure output directory
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Fetch all tickets
    const tickets = await prisma.accessCode.findMany({
        orderBy: { serialNumber: 'asc' }
    });

    console.log(`Found ${tickets.length} tickets. Generating images...`);

    let count = 0;
    for (const ticket of tickets) {
        try {
            // 1. Generate QR Data URL
            // Code content: https://tantalize.lk/t/XXXXXXXX
            const qrContent = ticket.magicLink; // Should be full URL
            
            // Generate QR buffer with transparent background allowed (we will composite)
            // But qrcode lib is easier if we generate a buffer/string
            const qrBuffer = await QRCode.toBuffer(qrContent, {
                color: {
                    dark: CONFIG.qrColor,  // White Dots
                    light: '#0000', // Transparent Background
                },
                width: CONFIG.qrSize,
                margin: 1
            });

            // 2. Create Canvas
            const canvas = createCanvas(CONFIG.width, CONFIG.height);
            const ctx = canvas.getContext('2d');

            // 3. Fill Background
            ctx.fillStyle = CONFIG.bgColor;
            ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);

            // 4. Draw QR Code
            // We need to load the buffer as Image
            const { loadImage } = await import('canvas'); // Dynamic import sometimes needed or top level
            const qrImage = await loadImage(qrBuffer);
            
            // Center QR
            const qrX = (CONFIG.width - CONFIG.qrSize) / 2;
            const qrY = 100; // Top padding
            ctx.drawImage(qrImage, qrX, qrY);

            // 5. Draw Serial Number
            // Use a default font or register one if available. 
            // System fonts might vary, sans-serif is safe.
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 40px sans-serif'; // Simple bold font
            ctx.textAlign = 'center';
            
            // Text: Serial 0001
            const text = `NO: ${ticket.serialNumber}`;
            const textY = qrY + CONFIG.qrSize + 60; // Below QR
            ctx.fillText(text, CONFIG.width / 2, textY);

            // Optional: Draw Human Readable ID small
            ctx.font = '24px sans-serif';
            ctx.fillStyle = '#AAAAAA'; // Slightly dim
            const idText = `${ticket.code}`;
            ctx.fillText(idText, CONFIG.width / 2, textY + 40);


            // 6. Save File
            const fileName = `TICKET_${ticket.serialNumber}.png`;
            const filePath = path.join(OUTPUT_DIR, fileName);
            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(filePath, buffer);

            count++;
            if (count % 100 === 0) {
                console.log(`Progress: ${count}/${tickets.length}`);
            }

        } catch (err) {
            console.error(`Failed to generate for ticket ${ticket.code}`, err);
        }
    }

    console.log('✅ All images generated successfully!');
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
