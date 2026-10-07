'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { CATEGORIES } from '@/lib/constants';

export default function CategoryFilter() {

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const activeCategory = searchParams.get('category')

    function handleSelect(category: string | null) {
        const params = new URLSearchParams(searchParams);

        if (category && category !== activeCategory) {
            params.set('category', category)
        } else {
            params.delete('category')
        }

        router.replace(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="flex gap-2 flex-wrap my-4">
            {/* "All" button */}
            <button
                onClick={() => handleSelect(null)}
                className={!activeCategory ? 'bg-black text-white px-3 py-1 rounded-full' : 'bg-gray-100 text-gray-700 px-3 py-1 rounded-full'}
            >
                All
            </button>
            {/* Category buttons */}
            {CATEGORIES.map((cat) => (
                <button
                    key={cat}
                    onClick={() => handleSelect(cat)}
                    className={activeCategory === cat ? 'bg-black text-white px-3 py-1 rounded-full' : 'bg-gray-100 text-gray-700 px-3 py-1 rounded-full'}
                >
                    {cat}
                </button>
            ))}
        </div>
    )

}