'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState } from 'react';


export default function PriceFilter() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [min, setMin] = useState(searchParams.get('minPrice') || '')
    const [max, setMax] = useState(searchParams.get('maxPrice') || '')

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const params = new URLSearchParams(searchParams);

        if (min) params.set('minPrice', min)
        else params.delete('minPrice')

        if (max) params.set('maxPrice', max)
        else params.delete('maxPrice')

        router.replace(`${pathname}?${params.toString()}`)
    }

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
                type="number"
                placeholder="Min $"
                value={min}
                onChange={(e) => setMin(e.target.value)}
                className="w-24 border border-gray-300 rounded px-2 py-1 text-sm"
            />
            <span>-</span>
            <input
                type="number"
                placeholder="Max $"
                value={max}
                onChange={(e) => setMax(e.target.value)}
                className="w-24 border border-gray-300 rounded px-2 py-1 text-sm"
            />
            <button type="submit" className="bg-gray-800 text-white px-3 py-1 rounded text-sm">
                Apply
            </button>
        </form>
    )
}