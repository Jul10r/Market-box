'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export default function SortSelect() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const currentSort = searchParams.get('sort') || '';

    function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const params = new URLSearchParams(searchParams);
        const value = e.target.value;

        if (value) {
            params.set('sort', value)
        } else {
            params.delete('sort')
        }

        router.replace(`${pathname}?${params.toString()}`)
    }

    return (
        <select
            value={currentSort}
            onChange={handleSortChange}
            className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
        >
            <option value="">Newest first</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
        </select>
    )
}