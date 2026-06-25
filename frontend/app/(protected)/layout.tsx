'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CurrentUser from '@/hooks/currentUser';

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const { data: user, isLoading } = CurrentUser();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <aside className="w-64 bg-slate-900 text-white p-4">
                <h2>Dsync</h2>
                <p>Welcome, {user.name}!</p>
            </aside>
            <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
                {children}
            </main>
        </div>
    );
}
