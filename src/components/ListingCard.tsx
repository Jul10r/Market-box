import Link from 'next/link'

interface ListingCardProps {
  id: number
  title: string
  price: string
  category: string
  location?: string | null
  status?: string | null
  createdAt?: Date | string | null
  imageUrl?: string | null
  rating?: number | null
  reviewCount?: number | null
}

function formatListingTime(date?: Date | string | null) {
  if (!date) return ''
  const now = new Date()
  const diffInMs = now.getTime() - new Date(date).getTime()
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours}h ago`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 30) return `${diffInDays} days ago`
  return new Date(date).toLocaleDateString()
}

export default function ListingCard({
  id,
  title,
  price,
  category,
  location,
  status,
  createdAt,
  imageUrl,
  rating,
  reviewCount = 0,
}: ListingCardProps) {
  const isSold = status === 'sold'

  return (
    <Link
      href={`/listings/${id}`}
      className={`group border border-slate-200 rounded-xl overflow-hidden bg-white flex flex-col transition duration-150 cursor-pointer ${
        isSold
          ? 'opacity-80'
          : 'hover:border-slate-300 hover:shadow-md'
      }`}
    >
      <div className="aspect-square bg-slate-100 relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className={`w-full h-full object-cover transition duration-300 ${
              isSold ? 'grayscale' : 'group-hover:scale-105'
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
            <svg className="w-8 h-8 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs mt-1 font-medium">No photo uploaded</span>
          </div>
        )}

        <span className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-sm text-slate-900 text-[11px] font-semibold px-2 py-0.5 rounded-md shadow-xs">
          {category}
        </span>

        {isSold && (
          <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center">
            <span className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
              Sold
            </span>
          </div>
        )}
      </div>

      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          <div
            className={`text-base font-bold tracking-tight ${
              isSold ? 'text-slate-500 line-through' : 'text-slate-900'
            }`}
          >
            ${price}
          </div>
          <h3
            className={`font-medium text-sm line-clamp-1 transition ${
              isSold ? 'text-slate-700' : 'text-slate-800 group-hover:text-blue-600'
            }`}
          >
            {title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {location || 'Local area'}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          {isSold ? (
            <span className="text-slate-400">Sold out</span>
          ) : rating && reviewCount && reviewCount > 0 ? (
            <span className="text-amber-500 font-semibold flex items-center gap-1">
              ★ {Number(rating).toFixed(1)} <span className="text-slate-400 font-normal">({reviewCount})</span>
            </span>
          ) : (
            <span className="text-slate-400 text-xs">No reviews</span>
          )}
          <span className="text-slate-400 text-[11px]">
            {formatListingTime(createdAt)}
          </span>
        </div>
      </div>
    </Link>
  )
}
