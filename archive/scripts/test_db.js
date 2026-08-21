
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;
console.log('Connecting to:', connectionString.replace(/:[^:]*@/, ':****@')); // Mask password

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false } // db.prisma.io might need this or just sslmode=require handled by pg
});

async function main() {
  try {
    await client.connect();
    console.log('✅ Connected successfully!');
    const res = await client.query('SELECT NOW()');
    console.log('Time:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('❌ Connection failed:', err);
  }
}

main();
