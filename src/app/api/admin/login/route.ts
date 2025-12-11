import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { compareSync } from 'bcryptjs';
import { SignJWT } from 'jose';

// DB Setup
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Secret for JWT (Should be in env, but fallback for prototype)
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'tantalize_secret_2025_safe');

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, message: 'Missing credentials' }, { status: 400 });
        }

        // 1. Find User
        const user = await prisma.user.findUnique({
            where: { email },
        });



        // 2. Validate using bcrypt
        // Fallback: If password in DB is plain text (legacy), compare directly. Then logic should ideally migrate it.
        // For now, assume migrated or handle both.
        // But since we are reseeding, we can enforce hash.
        if (!user || !compareSync(password, user.password)) {
            return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
        }

        // 3. Create Session Token (JWT)
        // Expires in 24 hours
        const token = await new SignJWT({
            sub: user.id,
            role: user.role,
            name: user.name
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(JWT_SECRET);

        // 4. Set Cookie & Return
        const response = NextResponse.json({
            success: true,
            user: { id: user.id, name: user.name, role: user.role }
        });

        response.cookies.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 // 1 day
        });

        return response;

    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
