
const { Client } = require('pg');

const DB_URL = 'postgres://4f38cc339555579f57d9dec30bb63c3f530949a96f88484f8c45ebe24ecc5821:sk_C__Kp0iVL8_YGYLwpA2wj@db.prisma.io:5432/postgres?sslmode=require';

const client = new Client({
  connectionString: DB_URL,
  ssl: { rejectUnauthorized: false }, 
  connectionTimeoutMillis: 30000 // Increased to 30s
});

console.log('Attempting connection to:', DB_URL.replace(/:[^:]*@/, ':****@'));

async function main() {
  try {
    await client.connect();
    console.log('✅ Connected!');
    const res = await client.query('SELECT count(*) FROM "AccessCode"');
    console.log('Count:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    if (err.cause) console.error('Cause:', err.cause);
  }
}

main();
