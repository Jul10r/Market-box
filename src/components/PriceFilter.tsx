'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState } from 'react'

export default function PriceFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const [min, setMin] = useState(searchParams.get('minPrice') || '')
  const [max, setMax] = useState(searchParams.get('maxPrice') || '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const params = new URLSearchParams(searchParams)

    if (min) params.set('minPrice', min)
    else params.delete('minPrice')

    if (max) params.set('maxPrice', max)
    else params.delete('maxPrice')

    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex shrink-0 items-center gap-1.5 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 font-medium text-xs focus-within:border-slate-400 transition">
      <span className="text-slate-500">$</span>
      <input
        type="number"
        placeholder="Min"
        value={min}
        onChange={(e) => setMin(e.target.value)}
        className="w-12 outline-none bg-transparent text-slate-800 placeholder-slate-400 text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <span className="text-slate-300">to</span>
      <span className="text-slate-500">$</span>
      <input
        type="number"
        placeholder="Max"
        value={max}
        onChange={(e) => setMax(e.target.value)}
        className="w-12 outline-none bg-transparent text-slate-800 placeholder-slate-400 text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="submit"
        className="text-xs text-slate-600 hover:text-slate-900 font-semibold ml-0.5 cursor-pointer"
      >
        Go
      </button>
    </form>
  )
}