'use client'

import { useState } from 'react'

interface ListingGalleryProps {
  images: { id: number; imageUrl: string }[]
  title: string
}

export default function ListingGallery({ images, title }: ListingGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="aspect-4/3 w-full bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-slate-400">
        <svg className="w-12 h-12 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-xs mt-2 font-medium">No photo uploaded</span>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="aspect-4/3 w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
        <img
          src={images[activeIndex]?.imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`w-20 h-20 rounded-lg overflow-hidden shrink-0 transition cursor-pointer ${
                idx === activeIndex
                  ? 'border-2 border-slate-900 ring-2 ring-slate-900/10'
                  : 'border border-slate-200 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
