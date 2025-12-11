
import "dotenv/config";
import { PrismaClient, VoteCategory } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DATA = [
    // BANDS
    { category: VoteCategory.BAND, name: "SLIIT VIBES", institute: "SLIIT" },
    { category: VoteCategory.BAND, name: "ANC RAAVA", institute: "ANC" },

    // SOLO SINGING
    { category: VoteCategory.SOLO_SINGING, name: "AMAAVI PERERA", institute: "NIBM" },
    { category: VoteCategory.SOLO_SINGING, name: "UWANI PERERA", institute: "BMS" },
    { category: VoteCategory.SOLO_SINGING, name: "NEHARA JAYATHUNGA", institute: "SLIIT" },
    { category: VoteCategory.SOLO_SINGING, name: "ANUHAS SIRIWARDANE", institute: "KDU" },
    { category: VoteCategory.SOLO_SINGING, name: "MALSHI RATHNAYAKE", institute: "CINEC" },

    // GROUP SINGING
    { category: VoteCategory.GROUP_SINGING, name: "LYRA", institute: "CINEC" },
    { category: VoteCategory.GROUP_SINGING, name: "SOUL SYNC", institute: "CINEC" },

    // SOLO DANCING
    { category: VoteCategory.SOLO_DANCING, name: "DIVON RODRIGO", institute: "ACBT" },
    { category: VoteCategory.SOLO_DANCING, name: "THISEV ANDERSON", institute: "SLIIT" },
    { category: VoteCategory.SOLO_DANCING, name: "N. SARMLI", institute: "SLIIT" },

    // GROUP DANCING
    { category: VoteCategory.GROUP_DANCING, name: "RHYTHMORA", institute: "UOM" },
    { category: VoteCategory.GROUP_DANCING, name: "TEAM DEFYRE", institute: "KDU" },
    { category: VoteCategory.GROUP_DANCING, name: "LEGACY STEPS", institute: "CINEC" },
    { category: VoteCategory.GROUP_DANCING, name: "13LAZE", institute: "HHS" },
];

async function main() {
    console.log('Seeding Finalists...');

    // Clear existing
    await prisma.candidate.deleteMany({});

    for (const c of DATA) {
        await prisma.candidate.create({
            data: {
                name: c.name,
                institute: c.institute,
                category: c.category,
                // Assign image path convention
                image: `/finalists/${c.category.toLowerCase()}_${c.name.replace(/ /g, '_').toLowerCase()}.jpg`
            }
        });
    }

    console.log('✅ Finalists Seeded.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
