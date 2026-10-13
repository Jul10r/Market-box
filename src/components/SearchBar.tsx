'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SearchBar() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const [term, setTerm] = useState(searchParams.get('q') || '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const params = new URLSearchParams(searchParams)

    if (term.trim()) {
      params.set('q', term.trim())
    } else {
      params.delete('q')
    }

    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full sm:w-auto flex-1 min-w-0 max-w-md items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus-within:border-slate-400 focus-within:bg-white transition">
      <button
        type="submit"
        aria-label="Search"
        className="text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer flex items-center justify-center"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
      <input
        type="text"
        placeholder="Search furniture, electronics, bikes..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className="bg-transparent outline-none w-full min-w-0 text-slate-800 placeholder-slate-400 text-sm"
      />
    </form>
  )
}