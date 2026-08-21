console.log('Loading libs...');
require("dotenv/config");
console.log('dotenv loaded');
const { PrismaClient } = require('@prisma/client');
console.log('prisma client loaded');
const { Pool } = require('pg');
console.log('pg loaded');
const { PrismaPg } = require('@prisma/adapter-pg');
console.log('adapter loaded');
const PDFDocument = require('pdfkit');
console.log('pdfkit loaded');
const QRCode = require('qrcode');
console.log('qrcode loaded');
const fs = require('fs');
const path = require('path');
console.log('Libs loaded');

// Database Setup
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Constants
const A4_WIDTH = 595.28;  // 210mm in points (1mm = 2.83465 pt)
const A4_HEIGHT = 841.89; // 297mm in points
const MM_TO_PT = 2.83465;

// Sticker Config
const STICKER_SIZE_MM = 30; // 3cm
const STICKER_SIZE_PT = STICKER_SIZE_MM * MM_TO_PT; // ~85.04pt
const GAP_MM = 2; // Gap between stickers
const GAP_PT = GAP_MM * MM_TO_PT;
const MARGIN_MM = 10;
const MARGIN_PT = MARGIN_MM * MM_TO_PT;

const BG_COLOR = '#0f3ea6';
const FG_COLOR = '#FFFFFF';

// Fix output path to be absolute or relative to CWD correctly
const OUT_FILE = path.join(process.cwd(), 'public', 'Tantalize_Stickers.pdf');

async function main() {
    console.log('🖨️  Starting PDF Generation...');

    // Fetch Tickets
    const tickets = await prisma.accessCode.findMany({
        orderBy: { serialNumber: 'asc' }
    });
    console.log(`Found ${tickets.length} tickets.`);

    // Create PDF
    const doc = new PDFDocument({
        size: 'A4',
        margin: MARGIN_PT,
        autoFirstPage: true
    });

    const stream = fs.createWriteStream(OUT_FILE);
    doc.pipe(stream);

    // Grid Calculation
    const availableWidth = A4_WIDTH - (2 * MARGIN_PT);
    const availableHeight = A4_HEIGHT - (2 * MARGIN_PT);
    
    // How many columns/rows fit?
    const cols = Math.floor((availableWidth + GAP_PT) / (STICKER_SIZE_PT + GAP_PT));
    const rows = Math.floor((availableHeight + GAP_PT) / (STICKER_SIZE_PT + GAP_PT));

    console.log(`Layout: ${cols} x ${rows} per page.`);

    let col = 0;
    let row = 0;

    for (const ticket of tickets) {
        // Calculate Position
        const x = MARGIN_PT + (col * (STICKER_SIZE_PT + GAP_PT));
        const y = MARGIN_PT + (row * (STICKER_SIZE_PT + GAP_PT));

        // 1. Draw Background
        doc.rect(x, y, STICKER_SIZE_PT, STICKER_SIZE_PT)
           .fill(BG_COLOR);

        // 2. Generate QR
        try {
            const qrBuffer = await QRCode.toBuffer(ticket.magicLink, {
                color: {
                    // White QR on Blue BG (Transparent light modules)
                    dark: '#FFFFFF',
                    light: '#0000' 
                },
                width: 200, // High res for print
                margin: 0
            });

            // 3. Draw QR Image
            // Sticker is 30mm. QR should be e.g. 20mm
            const qrSize = 20 * MM_TO_PT; 
            const qrMargin = (STICKER_SIZE_PT - qrSize) / 2;
            const qrYOffset = 2 * MM_TO_PT; 

            doc.image(qrBuffer, x + qrMargin, y + qrYOffset, { width: qrSize });

            // 4. Draw Serial Number
            doc.fillColor('#FFFFFF')
               .font('Helvetica-Bold')
               .fontSize(7)
               .text(`${ticket.serialNumber}`, x, y + STICKER_SIZE_PT - (6 * MM_TO_PT), {
                   width: STICKER_SIZE_PT,
                   align: 'center'
               });

        } catch (e) {
            console.error(`Error generating QR for ${ticket.serialNumber}`, e);
        }

        // Advance Grid
        col++;
        if (col >= cols) {
            col = 0;
            row++;
            if (row >= rows) {
                row = 0;
                doc.addPage();
            }
        }
    }

    doc.end();
    console.log('✅ PDF Generated: public/Tantalize_Stickers.pdf');
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
