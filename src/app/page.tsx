import Link from 'next/link'
import { db } from '@/lib/db'
import { listings, listingImages } from '@/db/schema'
import { desc, eq, and, or, ilike, gte, lte, asc } from 'drizzle-orm'
import SearchBar from '@/components/SearchBar'
import CategoryFilter from '@/components/CategoryFilter'
import PriceFilter from '@/components/PriceFilter'
import SortSelect from '@/components/SortSelect'
import ListingCard from '@/components/ListingCard'
import { getAllListingReviewStats } from '@/lib/reviews'

interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams

  const conditions = [eq(listings.status, 'active')]

  if (params.q) {
    conditions.push(
      or(
        ilike(listings.title, `%${params.q}%`),
        ilike(listings.description, `%${params.q}%`)
      )!
    )
  }

  if (params.category) {
    conditions.push(eq(listings.category, params.category))
  }

  if (params.minPrice && !isNaN(Number(params.minPrice))) {
    conditions.push(gte(listings.price, params.minPrice))
  }

  if (params.maxPrice && !isNaN(Number(params.maxPrice))) {
    conditions.push(lte(listings.price, params.maxPrice))
  }

  let orderClause = desc(listings.createdAt)

  if (params.sort === 'price_asc') {
    orderClause = asc(listings.price)
  } else if (params.sort === 'price_desc') {
    orderClause = desc(listings.price)
  }

  const allListings = await db
    .select()
    .from(listings)
    .where(and(...conditions))
    .orderBy(orderClause)

  const allImages = await db
    .select()
    .from(listingImages)

  const allReviewStats = await getAllListingReviewStats()

  const hasActiveFilters = Boolean(params.q || params.category || params.minPrice || params.maxPrice)

  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between pb-5 border-b border-slate-100">
          <SearchBar />
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <PriceFilter />
            <SortSelect />
            <Link
              href="/listings/new"
              className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-4 py-2 rounded-lg text-xs transition whitespace-nowrap cursor-pointer shrink-0"
            >
              + Post Item
            </Link>
          </div>
        </div>

        <CategoryFilter />

        {hasActiveFilters && (
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-lg px-3.5 py-2 text-xs">
            <div className="flex flex-wrap items-center gap-1.5 text-slate-600">
              <span className="font-medium text-slate-700">Active filters:</span>
              {params.q && (
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-800">
                  &ldquo;{params.q}&rdquo;
                </span>
              )}
              {params.category && (
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-800">
                  {params.category}
                </span>
              )}
              {(params.minPrice || params.maxPrice) && (
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-800">
                  \${params.minPrice || '0'} - \${params.maxPrice || '∞'}
                </span>
              )}
            </div>
            <Link
              href="/"
              className="text-slate-500 hover:text-slate-900 font-semibold underline underline-offset-2 transition ml-2 shrink-0"
            >
              Reset all
            </Link>
          </div>
        )}

        {allListings.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <svg className="w-6 h-6 stroke-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h4 className="text-sm font-semibold text-slate-900">No listings found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Try adjusting your search filters or be the first to post an item for sale.
            </p>
            {hasActiveFilters ? (
              <Link
                href="/"
                className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Reset All Filters
              </Link>
            ) : (
              <Link
                href="/listings/new"
                className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Post an Item Now
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {allListings.map((listing) => {
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
        )}
      </div>
    </main>
  )
}