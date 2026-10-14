import { db } from '@/lib/db'
import { listings, listingImages, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { syncCurrentUser } from '@/lib/auth'
import { deleteListingAction, contactSellerAction, toggleSoldStatusAction } from './actions'
import { getListingReviews, getListingReviewStats, hasUserReviewedListing, getUserListingCount } from '@/lib/reviews'
import StarRating from '@/components/StarRating'
import ReviewForm from '@/components/ReviewForm'
import ListingGallery from '@/components/ListingGallery'

interface ListingPageProps {
  params: Promise<{ id: string }>
}

export default async function ListingDetailPage({ params }: ListingPageProps) {
  const { id } = await params
  const listingId = Number(id)

  const [listing] = await db
    .select()
    .from(listings)
    .where(eq(listings.id, listingId))

  if (!listing) {
    notFound()
  }

  const images = await db
    .select()
    .from(listingImages)
    .where(eq(listingImages.listingId, listingId))

  const user = await syncCurrentUser()

  const [seller] = await db
    .select()
    .from(users)
    .where(eq(users.id, listing.sellerId))

  const sellerItemsCount = seller ? await getUserListingCount(seller.id) : 0
  const stats = await getListingReviewStats(listingId)
  const reviewsList = await getListingReviews(listingId)
  const canReview = user && user.id !== listing.sellerId ? !(await hasUserReviewedListing(user.id, listingId)) : false

  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-8 shadow-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-medium transition mb-6"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <ListingGallery images={images} title={listing.title} />
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  {listing.category}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    listing.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {listing.status === 'active' ? 'Active' : 'Sold'}
                </span>
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {listing.title}
                </h1>
                <div className="flex items-baseline gap-3 mt-1.5">
                  <span className={`text-3xl font-extrabold ${listing.status === 'sold' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                    ${listing.price}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm pt-1">
                <StarRating rating={stats.avgRating} count={stats.totalReviews} countLabel="listing reviews" />
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Description
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <div>
                  <span className="font-semibold text-slate-800">Location:</span> {listing.location || 'Local area'}
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Listed:</span> {new Date(listing.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-200">
              {seller && (
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    {seller.avatarUrl ? (
                      <img
                        src={seller.avatarUrl}
                        alt={seller.username}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-sm">
                        {seller.username.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">
                        {seller.username}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Member since {new Date(seller.createdAt).getFullYear()} · {sellerItemsCount} item{sellerItemsCount === 1 ? '' : 's'} listed
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/profile/${seller.id}`}
                    className="text-xs text-blue-600 font-medium hover:underline"
                  >
                    View profile
                  </Link>
                </div>
              )}

              {user?.id !== listing.sellerId && (
                <form action={contactSellerAction.bind(null, listing.id, listing.sellerId)}>
                  <button
                    type="submit"
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition shadow-sm cursor-pointer"
                  >
                    Message Seller
                  </button>
                </form>
              )}

              {user?.id === listing.sellerId && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <Link
                    href={`/listings/${listing.id}/edit`}
                    className="flex-1 text-center py-2 px-3 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Edit Listing
                  </Link>
                  <form action={toggleSoldStatusAction.bind(null, listing.id)} className="flex-1">
                    <button
                      type="submit"
                      className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        listing.status === 'sold'
                          ? 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {listing.status === 'sold' ? 'Mark Active' : 'Mark Sold'}
                    </button>
                  </form>
                  <form action={deleteListingAction.bind(null, listing.id)}>
                    <button
                      type="submit"
                      className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        <section className="mt-10 pt-8 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Customer Reviews</h2>
              <div className="mt-1">
                <StarRating rating={stats.avgRating} count={stats.totalReviews} countLabel="listing reviews" />
              </div>
            </div>
          </div>

          {canReview && (
            <div className="max-w-md">
              <ReviewForm listingId={listing.id} />
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-800">
              Reviews ({reviewsList.length})
            </h3>
            {reviewsList.length === 0 ? (
              <p className="text-slate-400 text-xs">No reviews yet for this item.</p>
            ) : (
              <div className="space-y-3">
                {reviewsList.map((review) => (
                  <div key={review.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        {review.reviewer?.avatarUrl ? (
                          <img
                            src={review.reviewer.avatarUrl}
                            alt={review.reviewer.username ?? 'Reviewer'}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center">
                            {(review.reviewer?.username?.[0] || 'U').toUpperCase()}
                          </div>
                        )}
                        <span className="text-xs font-semibold text-slate-900">
                          {review.reviewer?.username ?? 'User'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mb-1.5">
                      <StarRating rating={review.rating} />
                    </div>
                    {review.comment && (
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}