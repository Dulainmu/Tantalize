import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { hashSync, compareSync } from 'bcryptjs';
import { getSession } from '@/lib/auth';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    try {
        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ success: false, message: 'Password must be at least 6 characters' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { id: session.sub as string } });
        if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

        // Verify Current Password
        const isMatch = compareSync(currentPassword, user.password);
        if (!isMatch) {
            return NextResponse.json({ success: false, message: 'Incorrect current password' }, { status: 403 });
        }

        // Update Password
        const hashedPassword = hashSync(newPassword, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        // Log Action
        await prisma.auditLog.create({
            data: {
                action: 'PASSWORD_CHANGE',
                entityId: user.id,
                actorId: user.id,
                actorName: user.name,
                details: 'User changed their own password'
            }
        });

        return NextResponse.json({ success: true, message: 'Password updated successfully' });

    } catch (error) {
        console.error('Reset Password Error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
