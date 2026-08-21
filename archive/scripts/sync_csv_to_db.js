
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const crypto = require('crypto');

// URL from debug_db.js
const DB_URL = 'postgres://4f38cc339555579f57d9dec30bb63c3f530949a96f88484f8c45ebe24ecc5821:sk_C__Kp0iVL8_YGYLwpA2wj@db.prisma.io:5432/postgres?sslmode=require';

const client = new Client({
  connectionString: DB_URL,
  ssl: { rejectUnauthorized: false }, 
  connectionTimeoutMillis: 30000
});

const INPUT_FILE = path.join(process.cwd(), 'tantalize_tickets.csv');

async function main() {
    console.log('🔄 Starting Database Sync (PG Client - Fixed Columns)...');

    if (!fs.existsSync(INPUT_FILE)) {
        console.error('❌ CSV file not found:', INPUT_FILE);
        process.exit(1);
    }

    try {
        await client.connect();
        console.log('✅ Connected to DB');
    } catch (e) {
        console.error('❌ Connection failed:', e.message);
        process.exit(1);
    }

    const content = fs.readFileSync(INPUT_FILE, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim() !== '');
    console.log(`📂 Found ${lines.length} lines in CSV.`);

    let successCount = 0;
    let errorCount = 0;

    for (const [index, line] of lines.entries()) {
        const cols = line.split(',');
        if (cols.length < 3) continue;

        const serialRaw = cols[0].trim();
        const code = cols[1].trim();
        // const magicLink = cols[2].trim(); // Column missing in DB!

        if (serialRaw.toLowerCase().includes('serial')) continue;

        try {
            // Upsert Logic manually
            // Exists?
            const checkRes = await client.query(
                `SELECT id, "serialNumber" FROM "AccessCode" WHERE code = $1`,
                [code]
            );

            if (checkRes.rows.length > 0) {
                // Update
                const existing = checkRes.rows[0];
                if (existing.serialNumber !== serialRaw) {
                     console.log(`[${index}/${lines.length}] ✏️  Updating ${code}: Serial ${existing.serialNumber} -> ${serialRaw}`);
                     await client.query(
                         `UPDATE "AccessCode" SET "serialNumber" = $1, "updatedAt" = NOW() WHERE id = $2`,
                         [serialRaw, existing.id]
                     );
                } else {
                    process.stdout.write('.');
                }
            } else {
                // Insert
                console.log(`\n[${index}/${lines.length}] ✨ Creating ${code} (Serial: ${serialRaw})`);
                await client.query(
                    `INSERT INTO "AccessCode" (
                        "id", "code", "serialNumber", "type", "status", "paymentSettled", "createdAt", "updatedAt"
                    ) VALUES (
                        $1, $2, $3, 'NORMAL', 'IN_STOCK', false, NOW(), NOW()
                    )`,
                    [crypto.randomUUID(), code, serialRaw]
                );
            }
            successCount++;

        } catch (err) {
            console.error(`\n❌ Error processing ${code}:`, err.message);
            errorCount++;
        }
    }

    console.log('\n🎉 Sync Complete!');
    console.log(`✅ Processed: ${successCount}`);
    console.log(`❌ Errors:    ${errorCount}`);
    
    await client.end();
}

main();
