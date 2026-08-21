import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import TreasurerLayoutClient from '@/components/treasurer/TreasurerLayout';

export default async function TreasurerLayout({ children }: { children: ReactNode }) {
    const session = await getSession();

    if (!session || (session.role !== 'TREASURER' && session.role !== 'SUPER_ADMIN')) {
        redirect('/admin/login');
    }

    return (
        <TreasurerLayoutClient
            userName={session?.name as string || 'Treasurer'}
            userRole={session?.role as string || 'TREASURER'}
        >
            {children}
        </TreasurerLayoutClient>
    );
}
