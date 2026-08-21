import { ReactNode } from 'react';

// Login page has its own layout - no sidebar
export default function LoginLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
