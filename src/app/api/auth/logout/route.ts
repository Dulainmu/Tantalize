import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

    // Clear the admin_token cookie
    response.cookies.set('admin_token', '', {
        httpOnly: true,
        expires: new Date(0), // Expire immediately
        path: '/',
        secure: process.env.NODE_ENV === 'production'
    });

    return response;
}
