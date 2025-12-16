
console.log('1. Require dotenv');
try { require("dotenv/config"); console.log('✅ dotenv ok'); } catch(e) { console.error('❌ dotenv failed', e.message); }

console.log('2. Require pg');
try { require('pg'); console.log('✅ pg ok'); } catch(e) { console.error('❌ pg failed', e.message); }

console.log('3. Require @prisma/client');
try { require('@prisma/client'); console.log('✅ prisma client ok'); } catch(e) { console.error('❌ prisma client failed', e.message); }

console.log('4. Require @prisma/adapter-pg');
try { require('@prisma/adapter-pg'); console.log('✅ adapter-pg ok'); } catch(e) { console.error('❌ adapter-pg failed', e.message); }

console.log('5. Require pdfkit');
try { require('pdfkit'); console.log('✅ pdfkit ok'); } catch(e) { console.error('❌ pdfkit failed', e.message); }

console.log('6. Require qrcode');
try { require('qrcode'); console.log('✅ qrcode ok'); } catch(e) { console.error('❌ qrcode failed', e.message); }

console.log('Done.');
