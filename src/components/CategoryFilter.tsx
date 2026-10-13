'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { CATEGORIES } from '@/lib/constants'

export default function CategoryFilter() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const activeCategory = searchParams.get('category')

  function handleSelect(category: string | null) {
    const params = new URLSearchParams(searchParams)

    if (category && category !== activeCategory) {
      params.set('category', category)
    } else {
      params.delete('category')
    }

    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
      <button
        type="button"
        onClick={() => handleSelect(null)}
        className={`font-medium px-3.5 py-1.5 rounded-full shrink-0 transition cursor-pointer ${
          !activeCategory
            ? 'bg-slate-900 text-white'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
        }`}
      >
        All Items
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => handleSelect(cat)}
          className={`font-medium px-3.5 py-1.5 rounded-full shrink-0 transition cursor-pointer ${
            activeCategory === cat
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}