import { db } from "@/lib/db"
import { users, listings, listingImages } from "@/db/schema"
import { eq, and, desc } from "drizzle-orm"
import { notFound } from "next/navigation"
import { getSellerReviewStats, getUserListingCount, getAllListingReviewStats } from "@/lib/reviews"
import StarRating from "@/components/StarRating"
import ListingCard from "@/components/ListingCard"

interface ProfilePageProps {
  params: Promise<{ id: string }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))

  if (!user) {
    notFound()
  }

  const listingCount = await getUserListingCount(user.id)
  const isSeller = listingCount > 0
  const sellerStats = isSeller ? await getSellerReviewStats(user.id) : null

  const userListings = isSeller
    ? await db
        .select()
        .from(listings)
        .where(and(eq(listings.sellerId, user.id), eq(listings.status, 'active')))
        .orderBy(desc(listings.createdAt))
    : []

  const allImages = isSeller
    ? await db.select().from(listingImages)
    : []

  const allReviewStats = isSeller
    ? await getAllListingReviewStats()
    : []

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xl sm:text-2xl shrink-0">
              {user.username.slice(0, 2).toUpperCase()}
            </div>
          )}

          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {user.username}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                  isSeller
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isSeller ? 'Seller' : 'Buyer'}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Member since {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            {isSeller && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-3">
                <StarRating
                  rating={sellerStats?.avgRating ?? null}
                  count={sellerStats?.totalReviews ?? 0}
                  countLabel="reviews"
                />
                <span className="text-xs text-slate-400">
                  · {listingCount} item{listingCount === 1 ? '' : 's'} listed
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {isSeller && userListings.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Active Listings from {user.username}
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {userListings.length} item{userListings.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {userListings.map((listing) => {
              const thumbnail = allImages.find((img) => img.listingId === listing.id)
              const reviewStat = allReviewStats.find((s) => s.listingId === listing.id)

              return (
                <ListingCard
                  key={listing.id}
                  id={listing.id}
                  title={listing.title}
                  price={listing.price}
                  category={listing.category}
                  location={listing.location}
                  status={listing.status}
                  createdAt={listing.createdAt}
                  imageUrl={thumbnail?.imageUrl}
                  rating={reviewStat?.avgRating}
                  reviewCount={reviewStat?.totalReviews}
                />
              )
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <svg className="w-6 h-6 stroke-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h4 className="text-sm font-semibold text-slate-900">No active listings</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            This member has no items currently for sale on the marketplace.
          </p>
        </div>
      )}
    </main>
  )
}