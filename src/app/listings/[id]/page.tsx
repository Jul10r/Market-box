import { db } from '@/lib/db';
import { listings, listingImages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { syncCurrentUser } from '@/lib/auth'
import { deleteListingAction, contactSellerAction } from './actions';


interface ListingPageProps {
    params: Promise<{ id: string }>;
}

export default async function ListingDetailPage({ params }: ListingPageProps) {
    const { id } = await params;

    const [listing] = await db
        .select()
        .from(listings)
        .where(eq(listings.id, Number(id)))

    if (!listing) {
        notFound();
    }

    const images = await db
        .select()
        .from(listingImages)
        .where(eq(listingImages.listingId, Number(id)));

    const user = await syncCurrentUser()


    return (
        <main>
            <Link href="/">Back to all listings</Link>
            {images.length > 0 && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', margin: '16px 0' }}>
                    {images.map((img) => (
                        <img
                            key={img.id}
                            src={img.imageUrl}
                            alt={listing.title}
                            style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                    ))}
                </div>
            )}
            <h1>{listing.title}</h1>
            <p>Price: ${listing.price}</p>
            <p>Category: {listing.category}</p>
            <p>Location: {listing.location}</p>
            <p>Description: {listing.description}</p>
            <p>Status: {listing.status}</p>
            {user?.id === listing.sellerId && (
                <div>
                    <Link href={`/listings/${listing.id}/edit`}>Edit Listing</Link>
                    <form action={deleteListingAction.bind(null, listing.id)}>
                        <button type="submit">Delete Listing</button>
                    </form>
                </div>
            )}
            {user?.id !== listing.sellerId && (
                <form action={contactSellerAction.bind(null, listing.id, listing.sellerId)}>
                    <button type="submit">Message Seller</button>
                </form>
            )}
        </main>
    )
}