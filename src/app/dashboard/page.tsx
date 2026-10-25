import { syncCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { listings, listingImages } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { toggleSoldStatusAction } from '@/app/listings/[id]/actions'
import DeleteListingButton from '@/components/DeleteListingButton'

export default async function DashboardPage() {
  const user = await syncCurrentUser()

  if (!user) {
    redirect('/sign-in')
  }

  const myListings = await db
    .select()
    .from(listings)
    .where(eq(listings.sellerId, user.id))
    .orderBy(desc(listings.createdAt))

  const allImages = await db
    .select()
    .from(listingImages)

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Seller Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Manage your items, update prices, and mark sales.</p>
        </div>
        <Link
          href="/listings/new"
          className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition shadow-sm cursor-pointer"
        >
          + Post an Item
        </Link>
      </div>

      {myListings.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <svg className="w-6 h-6 stroke-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h4 className="text-sm font-semibold text-slate-900">No listings posted yet</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            You have not posted anything for sale. Turn items you do not use into extra cash today.
          </p>
          <Link
            href="/listings/new"
            className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            Post an Item Now
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Your Listings</h3>
            <span className="text-xs text-slate-500 font-medium">
              {myListings.length} item{myListings.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
            {myListings.map((listing) => {
              const thumbnail = allImages.find((img) => img.listingId === listing.id)

              return (
                <div key={listing.id} className="p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-slate-50/50 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {thumbnail ? (
                        <img
                          src={thumbnail.imageUrl}
                          alt={listing.title}
                          className={`w-full h-full object-cover ${listing.status === 'sold' ? 'grayscale opacity-75' : ''}`}
                        />
                      ) : (
                        <div className="text-[10px] text-slate-400 font-medium">
                          No photo
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">
                        <Link
                          href={`/listings/${listing.id}`}
                          className="hover:text-blue-600 transition"
                        >
                          {listing.title}
                        </Link>
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs font-bold ${listing.status === 'sold' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                          ${listing.price}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${listing.status === 'sold'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-emerald-100 text-emerald-800'
                            }`}
                        >
                          {listing.status}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {listing.location || 'Local area'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                    <Link
                      href={`/listings/${listing.id}/edit`}
                      className="px-2.5 py-1 text-xs border border-slate-200 rounded font-medium text-slate-700 hover:bg-slate-50 transition"
                    >
                      Edit
                    </Link>

                    <form action={toggleSoldStatusAction.bind(null, listing.id)}>
                      <button
                        type="submit"
                        className="px-2.5 py-1 text-xs bg-slate-100 text-slate-700 rounded font-medium hover:bg-slate-200 transition cursor-pointer"
                      >
                        {listing.status === 'sold' ? 'Mark Active' : 'Mark Sold'}
                      </button>
                    </form>

                    <DeleteListingButton listingId={listing.id} size="sm" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </main>
  )
}