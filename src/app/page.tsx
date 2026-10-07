import Link from 'next/link';
import { db } from '@/lib/db';
import { listings, listingImages } from '@/db/schema';
import { desc, eq, and, or, ilike, gte, lte, asc, } from 'drizzle-orm';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import PriceFilter from '@/components/PriceFilter';
import SortSelect from '@/components/SortSelect';


interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {

  const params = await searchParams;

  const conditions = [eq(listings.status, 'active')]

  if (params.q) {
    conditions.push(
      or(
        ilike(listings.title, `%${params.q}%`),
        ilike(listings.description, `%${params.q}%`)
      )!
    );
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
    .from(listingImages);


  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6">
      <header>
        <SearchBar />
        <PriceFilter />
        <CategoryFilter />
        <SortSelect />
        <Link href="/listings/new">Create Listing</Link>
      </header>

      {allListings.length === 0 ? (
        <p>No listings yet. Be the first to post!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allListings.map((listing) => {
            const thumbnail = allImages.find((img) => img.listingId === listing.id);
            return (
              <div key={listing.id} className="border border-gray-200 rounded-lg overflow-hidden flex flex-col hover:shadow-md transition">
                {thumbnail ? (
                  <img
                    src={thumbnail.imageUrl}
                    alt={listing.title}
                    className="w-full aspect-square object-cover"
                  />
                ) : (
                  <div className="aspect-square bg-gray-100 relative flex items-center justify-center text-gray-400 text-sm">
                    No Photo
                  </div>
                )}
                <div className="p-4 flex flex-col flex-1">
                  <Link href={`/listings/${listing.id}`}>
                    <h2>{listing.title}</h2>
                  </Link>
                  <p>Price: ${listing.price}</p>
                  <p>Category: {listing.category}</p>
                  <p>Location: {listing.location}</p>
                </div>
              </div>
            );
          })}
        </div>
      )
      }
    </main>
  );
}