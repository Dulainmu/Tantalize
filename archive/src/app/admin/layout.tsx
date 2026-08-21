import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AdminLayoutClient from '@/components/admin/AdminLayout';

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const session = await getSession();

    // Redirect to login if not authenticated (except for login page itself)
    // This is handled per-page, but we can set defaults here

    return (
        <AdminLayoutClient
            userName={session?.name as string || 'Guest'}
            userRole={session?.role as string || 'UNKNOWN'}
        >
            {children}
        </AdminLayoutClient>
    );
}
