import Link from 'next/link';
import { db } from '@/lib/db';
import { listings } from '@/db/schema';
import { desc } from 'drizzle-orm';

export default async function HomePage() {
  const allListings = await db
    .select()
    .from(listings)
    .orderBy(desc(listings.createdAt));

  return (
    <main>

      <header>
        <Link href="/listings/new">Create Listing</Link>
      </header >

      {allListings.length === 0 ? (
        <p>No listings yet. Be the first to post!</p>
      ) : (
        <div>
          {allListings.map((listing) => (
            <div key={listing.id}>
              <Link href={`/listings/${listing.id}`}>
                <h2>{listing.title}</h2>
              </Link>

              <p>Price: ${listing.price}</p>
              <p>Category: {listing.category}</p>
              <p>Location: {listing.location}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  )

}