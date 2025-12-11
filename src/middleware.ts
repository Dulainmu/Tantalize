
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'tantalize_secret_2025_safe');

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // 1. Define Protected Routes
    const isAdminRoute = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');
    const isCommitteeRoute = pathname.startsWith('/committee');
    const isTreasurerRoute = pathname.startsWith('/treasurer');

    // 4. Deprecated Route Redirection
    // if (pathname.startsWith('/agent/dashboard')) {
    //     return NextResponse.redirect(new URL('/committee/dashboard', req.url));
    // }

    if (isAdminRoute || isCommitteeRoute || isTreasurerRoute) {
        const token = req.cookies.get('admin_token')?.value;

        // Redirect if no token
        if (!token) {
            // Specific Login Pages
            if (isCommitteeRoute) {
                return NextResponse.redirect(new URL('/committee/login', req.url));
            }
            return NextResponse.redirect(new URL('/admin/login', req.url));
        }

        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);
            const role = payload.role as string;

            // Role-Based Access Control (RBAC)

            // Committee/Agent only areas
            if (isCommitteeRoute) {
                // Allow Agent and Super Admin. 
                // Redirect Admin/Treasurer to their dashboards if they try to access Mobile App?
                // actually Super Admin might want to see it.
            }

            // Treasurer areas
            if (isTreasurerRoute) {
                if (role !== 'TREASURER' && role !== 'SUPER_ADMIN') {
                    // If Agent tries to access Treasurer, send back to Committee
                    if (role === 'AGENT') return NextResponse.redirect(new URL('/committee/dashboard', req.url));
                    return NextResponse.redirect(new URL('/admin/login', req.url));
                }
            }

            // Admin areas
            if (isAdminRoute) {
                if (role === 'AGENT' && !pathname.startsWith('/admin/gatekeeper')) {
                    // Redirect Agents to Mobile App
                    return NextResponse.redirect(new URL('/committee/dashboard', req.url));
                }
            }

        } catch (e) {
            // Invalid Token
            const loginUrl = new URL(isCommitteeRoute ? '/committee/login' : '/admin/login', req.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/committee/:path*', '/treasurer/:path*'],
};
