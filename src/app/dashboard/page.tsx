import { syncCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { listings, listingImages } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { deleteListingAction, toggleSoldStatusAction } from '@/app/listings/[id]/actions';

export default async function DashboardPage() {
    const user = await syncCurrentUser();

    if (!user) {
        redirect('/sign-in');
    }

    const myListings = await db
        .select()
        .from(listings)
        .where(eq(listings.sellerId, user.id))
        .orderBy(desc(listings.createdAt));

    const allImages = await db
        .select()
        .from(listingImages);

    return (
        <main className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">My Listings</h1>
                    <p className="text-sm text-zinc-500">Manage all the items you have posted for sale.</p>
                </div>
                <Link
                    href="/listings/new"
                    className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition"
                >
                    + Create Listing
                </Link>
            </div>

            {myListings.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-xl space-y-3">
                    <p className="text-zinc-500">You haven&apos;t posted any listings yet.</p>
                    <Link
                        href="/listings/new"
                        className="inline-block text-sm font-semibold text-zinc-900 underline"
                    >
                        Post your first item
                    </Link>
                </div>
            ) : (
                <div className="divide-y border border-zinc-200 rounded-xl overflow-hidden bg-white">
                    {myListings.map((listing) => {
                        const thumbnail = allImages.find((img) => img.listingId === listing.id);

                        return (
                            <div key={listing.id} className="p-4 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    {thumbnail ? (
                                        <img
                                            src={thumbnail.imageUrl}
                                            alt={listing.title}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-lg bg-zinc-100 flex items-center justify-center text-xs text-zinc-400">
                                            No Photo
                                        </div>
                                    )}

                                    <div>
                                        <Link href={`/listings/${listing.id}`} className="font-semibold text-zinc-900 hover:underline">
                                            {listing.title}
                                        </Link>
                                        <p className="text-sm text-zinc-600 font-medium">${listing.price}</p>
                                        <span
                                            className={`inline-block px-2 py-0.5 rounded text-xs font-bold uppercase mt-1 ${listing.status === 'sold'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-emerald-100 text-emerald-800'
                                                }`}
                                        >
                                            {listing.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <form action={toggleSoldStatusAction.bind(null, listing.id)}>
                                        <button
                                            type="submit"
                                            className="px-3 py-1.5 border border-zinc-200 text-xs font-medium rounded-md hover:bg-zinc-50"
                                        >
                                            {listing.status === 'sold' ? 'Mark Active' : 'Mark Sold'}
                                        </button>
                                    </form>

                                    <Link
                                        href={`/listings/${listing.id}/edit`}
                                        className="px-3 py-1.5 border border-zinc-200 text-xs font-medium rounded-md hover:bg-zinc-50"
                                    >
                                        Edit
                                    </Link>

                                    <form action={deleteListingAction.bind(null, listing.id)}>
                                        <button
                                            type="submit"
                                            className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}