'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar() {

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const [term, setTerm] = useState(searchParams.get('q') || '')

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const params = new URLSearchParams(searchParams);

        if (term.trim()) {
            params.set('q', term.trim());
        } else {
            params.delete('q');
        }

        router.replace(`${pathname}?${params.toString()}`);
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md">
            <input
                type="text"
                placeholder="Search listings..."
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 flex-1"
            />
            <button type="submit" className="bg-black text-white px-4 py-2 rounded">
                Search
            </button>
        </form>
    )
}