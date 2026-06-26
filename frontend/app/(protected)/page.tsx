'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedIndex() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/dashboard');
    }, [router]);

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        </div>
    );
}
