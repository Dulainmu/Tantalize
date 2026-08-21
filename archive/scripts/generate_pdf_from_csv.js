
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

const INPUT_ID = path.join(process.cwd(), 'tantalize_tickets.csv');
const OUT_FILE = path.join(process.cwd(), 'public', 'Tantalize_Stickers.pdf');

// Constants
const A3_WIDTH = 841.89;
const A3_HEIGHT = 1190.55;
const MM_TO_PT = 2.83465;

const STICKER_SIZE_MM = 24; // Updated to 2.4cm
const STICKER_SIZE_PT = STICKER_SIZE_MM * MM_TO_PT;
const GAP_MM = 2; // Keep gap
const GAP_PT = GAP_MM * MM_TO_PT;
const MARGIN_MM = 10;
const MARGIN_PT = MARGIN_MM * MM_TO_PT;

async function main() {
    console.log('🖨️  Starting PDF Generation from CSV...');

    if (!fs.existsSync(INPUT_ID)) {
        console.error('❌ CSV file not found:', INPUT_ID);
        process.exit(1);
    }

    const content = fs.readFileSync(INPUT_ID, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim() !== '');
    
    // Parse tickets
    const tickets = [];
    for (const line of lines) {
        const cols = line.split(',');
        if (cols.length < 3) continue;
        
        const serial = cols[0].trim();
        if (serial.toLowerCase().includes('serial')) continue; // Header

        tickets.push({
            serialNumber: serial,
            code: cols[1].trim(),
            magicLink: cols[2].trim()
        });
    }

    console.log(`Found ${tickets.length} tickets.`);

    // Create PDF
    const doc = new PDFDocument({
        size: 'A3', // A3
        margin: MARGIN_PT,
        autoFirstPage: true
    });

    const stream = fs.createWriteStream(OUT_FILE);
    doc.pipe(stream);

    // Layout
    const availableWidth = A3_WIDTH - (2 * MARGIN_PT);
    const availableHeight = A3_HEIGHT - (2 * MARGIN_PT);
    const cols = Math.floor((availableWidth + GAP_PT) / (STICKER_SIZE_PT + GAP_PT));
    const rows = Math.floor((availableHeight + GAP_PT) / (STICKER_SIZE_PT + GAP_PT));

    let col = 0;
    let row = 0;


    for (const ticket of tickets) {
         // Position
        const x = MARGIN_PT + (col * (STICKER_SIZE_PT + GAP_PT));
        const y = MARGIN_PT + (row * (STICKER_SIZE_PT + GAP_PT));

        // Background
        const radius = 2.5 * MM_TO_PT; // slightly smaller radius for smaller box
        doc.roundedRect(x, y, STICKER_SIZE_PT, STICKER_SIZE_PT, radius).fill('#0f3ea6');

        // QR Construction (Vector Dots)
        try {
            // Create raw QR data (no buffer)
            const qrData = QRCode.create(ticket.magicLink, {
                errorCorrectionLevel: 'M'
            });
            const modules = qrData.modules.data;
            const size = qrData.modules.size;

            // Calculate Size
            const stickerQrTargetSize = 18 * MM_TO_PT; // Updated to 1.8cm (<2cm)
            const cellSize = stickerQrTargetSize / size;
            
            // Centering
            const qrMarginX = (STICKER_SIZE_PT - (size * cellSize)) / 2;
            const qrMarginY = (STICKER_SIZE_PT - (size * cellSize)) / 2 - (2 * MM_TO_PT); // Shift up

            // Helper to check if a module is part of the 3 Finder Patterns
            // TopLeft (0,0 to 7,7), TopRight (size-7,0 to size,7), BottomLeft (0,size-7 to 7,size)
            // Note: Finder patterns are 7x7.
            const isFinder = (r, c) => {
                if (r < 7 && c < 7) return true; // Top Left
                if (r < 7 && c >= size - 7) return true; // Top Right
                if (r >= size - 7 && c < 7) return true; // Bottom Left
                return false;
            };

            // 1. Draw Data Modules (Dots) - Skip Finders
            doc.fillColor('#FFFFFF'); 
            
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    if (isFinder(r, c)) continue; // Skip finder areas

                    if (modules[r * size + c]) {
                        const dotX = x + qrMarginX + (c * cellSize);
                        const dotY = y + qrMarginY + (r * cellSize);
                        const radius = cellSize / 2;
                        const drawRadius = radius * 0.9; 
                        doc.circle(dotX + radius, dotY + radius, drawRadius).fill();
                    }
                }
            }

            // 2. Draw Custom Modern Finder Patterns
            // Function to draw a concentric finder
            const drawFinder = (row, col) => {
                const startX = x + qrMarginX + (col * cellSize);
                const startY = y + qrMarginY + (row * cellSize);
                const finderSize = 7 * cellSize;
                
                // Outer Box (7x7) - Black (White in our case)
                const cornerRadius = 2.5 * cellSize; 
                doc.roundedRect(startX, startY, finderSize, finderSize, cornerRadius).fill('#FFFFFF');
                
                // Inner Cutout (5x5) - Blue (Background color)
                const cutoutSize = 5 * cellSize;
                const offsetCutout = 1 * cellSize;
                const innerRadius = 2 * cellSize; 
                doc.roundedRect(startX + offsetCutout, startY + offsetCutout, cutoutSize, cutoutSize, innerRadius).fill('#0f3ea6');

                // Center Box (3x3) - White
                const centerSize = 3 * cellSize;
                const offsetCenter = 2 * cellSize;
                const centerRadius = 1.2 * cellSize;
                doc.roundedRect(startX + offsetCenter, startY + offsetCenter, centerSize, centerSize, centerRadius).fill('#FFFFFF');
            };

            drawFinder(0, 0); // Top Left
            drawFinder(0, size - 7); // Top Right
            drawFinder(size - 7, 0); // Bottom Left

             // Human Readable ID
            doc.fillColor('#FFFFFF')
               .font('Helvetica-Bold')
               .fontSize(7) // Slightly smaller font
               .text(`${ticket.code}`, x, y + STICKER_SIZE_PT - (4 * MM_TO_PT), {
                   width: STICKER_SIZE_PT,
                   align: 'center'
               });

        } catch (e) {
            console.error('QR Error:', e);
        }

        // Navigate Grid
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
    console.log(`✅ PDF Generated: ${OUT_FILE}`);
}

main();
