
const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(process.cwd(), 'tantalize_tickets.csv');
const OUT_FILE = path.join(process.cwd(), 'tantalize_links.csv');

function main() {
    console.log('📂 Reading local ticket file:', INPUT_FILE);

    if (!fs.existsSync(INPUT_FILE)) {
        console.error('❌ Input file not found!');
        return;
    }

    const content = fs.readFileSync(INPUT_FILE, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim() !== '');

    console.log(`Found ${lines.length} lines (including possible header).`);

    // Output Header
    const outLines = ['Serial,Code,MagicLink'];

    let count = 0;
    for (const line of lines) {
        // CSV format: Serial_Number,Human_Readable_ID,QR_Link_URL,Ticket_Status
        // Example: 0001,146AB186,https://tantalize.lk/t/146AB186,NORMAL
        const cols = line.split(',');
        
        if (cols.length < 3) continue;

        const serial = cols[0].trim();
        // Skip header if present
        if (serial.toLowerCase().includes('serial')) continue;

        const code = cols[1].trim();
        const magicLink = cols[2].trim();

        outLines.push(`${serial},${code},${magicLink}`);
        count++;
    }

    fs.writeFileSync(OUT_FILE, outLines.join('\n'));
    console.log(`✅ Exported ${count} tickets to ${OUT_FILE}`);

    // Verify
    if (fs.existsSync(OUT_FILE)) {
         console.log(`Size: ${fs.statSync(OUT_FILE).size} bytes`);
    }
}

main();
