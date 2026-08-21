
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Database Setup
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgres://4f38cc339555579f57d9dec30bb63c3f530949a96f88484f8c45ebe24ecc5821:sk_C__Kp0iVL8_YGYLwpA2wj@db.prisma.io:5432/postgres?sslmode=require',
    },
  },
});

const OUT_FILE = path.join(process.cwd(), 'tantalize_links.csv');

async function main() {
    console.log('📊 Starting CSV Export...');

    // Fetch Tickets
    const tickets = await prisma.accessCode.findMany({
        orderBy: { serialNumber: 'asc' }
    });
    console.log(`Found ${tickets.length} tickets.`);

    // CSV Header
    const header = 'Serial,Code,MagicLink\n';
    
    // CSV Rows
    const rows = tickets.map(t => {
        return `${t.serialNumber},${t.code},${t.magicLink}`;
    }).join('\n');

    fs.writeFileSync(OUT_FILE, content);

    if (fs.existsSync(OUT_FILE)) {
        console.log(`✅ Verified existence of ${OUT_FILE}`);
        console.log(`Size: ${fs.statSync(OUT_FILE).size} bytes`);
    } else {
        console.error(`❌ File NOT found after write: ${OUT_FILE}`);
    }

    console.log(`✅ Exported to ${OUT_FILE}`);
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
