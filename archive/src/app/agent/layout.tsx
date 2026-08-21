import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AgentLayoutClient from '@/components/agent/AgentLayout';

export default async function AgentLayout({ children }: { children: ReactNode }) {
    const session = await getSession();

    // Redirect to login if not authenticated as agent
    // (Login page will be excluded via separate layout or route group if needed, 
    // but for now we assume /agent/login handles its own layout or we check path)

    return (
        <AgentLayoutClient
            userName={session?.name as string || 'Agent'}
        >
            {children}
        </AgentLayoutClient>
    );
}
