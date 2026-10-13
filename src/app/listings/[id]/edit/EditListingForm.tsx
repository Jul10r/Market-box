'use client'

import { useState, useTransition } from 'react'
import { updateListingAction } from '../actions'
import { CATEGORIES } from '@/lib/constants'
import { Listing } from '@/db/schema'
import Link from 'next/link'

interface EditListingFormProps {
  listing: Listing
}

export default function EditListingForm({ listing }: EditListingFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setError(null)
    startTransition(async () => {
      const result = await updateListingAction(listing.id, formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
      <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Edit Listing</h1>
          <p className="text-xs text-slate-500 mt-1">Update price, description, or category for your item.</p>
        </div>
        <Link href={`/listings/${listing.id}`} className="text-xs text-slate-500 hover:text-slate-800 font-medium transition">
          Cancel
        </Link>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm mb-5">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Title
          </label>
          <input
            name="title"
            defaultValue={listing.title}
            required
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Price ($)
            </label>
            <input
              name="price"
              type="number"
              step="0.01"
              defaultValue={listing.price}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Category
            </label>
            <select
              name="category"
              required
              defaultValue={listing.category}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Location
          </label>
          <input
            name="location"
            defaultValue={listing.location ?? ''}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            defaultValue={listing.description}
            required
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-medium rounded-lg text-sm transition cursor-pointer"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
          <Link
            href={`/listings/${listing.id}`}
            className="px-4 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium rounded-lg text-sm transition"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}