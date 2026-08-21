
const { Client } = require('pg');

const DB_URL = 'postgres://4f38cc339555579f57d9dec30bb63c3f530949a96f88484f8c45ebe24ecc5821:sk_C__Kp0iVL8_YGYLwpA2wj@db.prisma.io:5432/postgres?sslmode=require';

const client = new Client({
  connectionString: DB_URL,
  ssl: { rejectUnauthorized: false }, 
  connectionTimeoutMillis: 30000
});

async function main() {
    try {
        await client.connect();
        console.log('✅ Connected');
        
        const res = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'AccessCode'
        `);
        
        console.log('--- COLUMNS ---');
        res.rows.forEach(r => console.log(r.column_name));
        console.log('--- END ---');
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
main();
