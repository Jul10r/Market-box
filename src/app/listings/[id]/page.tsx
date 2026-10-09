import { db } from '@/lib/db';
import { listings, listingImages, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { syncCurrentUser } from '@/lib/auth'
import { deleteListingAction, contactSellerAction, toggleSoldStatusAction } from './actions';
import { getListingReviews, getListingReviewStats, hasUserReviewedListing } from '@/lib/reviews';
import StarRating from '@/components/StarRating';
import ReviewForm from '@/components/ReviewForm';


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

    const user = await syncCurrentUser();

    const [seller] = await db
        .select()
        .from(users)
        .where(eq(users.id, listing.sellerId));

    const listingId = Number(id);

    const stats = await getListingReviewStats(listingId);

    const reviewsList = await getListingReviews(listingId);

    const canReview = user && user.id !== listing.sellerId ? !(await hasUserReviewedListing(user.id, listingId)) : false


    return (
        <main className="max-w-4xl mx-auto p-6 space-y-6">
            <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-800">
                ← Back to all listings
            </Link>
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
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-zinc-900">{listing.title}</h1>
                <div className="flex items-center gap-4">
                    <p className="text-2xl font-bold text-zinc-900">${listing.price}</p>
                    <StarRating rating={stats.avgRating} count={stats.totalReviews} />
                </div>
            </div>
            {listing.status === 'sold' && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-red-100 text-red-800">
                    Sold
                </span>
            )}
            <div className="space-y-1 text-sm text-zinc-600">
                <p><span className="font-medium text-zinc-900">Category:</span> {listing.category}</p>
                <p><span className="font-medium text-zinc-900">Location:</span> {listing.location}</p>
                <p><span className="font-medium text-zinc-900">Status:</span> {listing.status}</p>
            </div>
            <div className="pt-2">
                <h2 className="text-sm font-medium text-zinc-900 mb-1">Description</h2>
                <p className="text-zinc-700 whitespace-pre-line">{listing.description}</p>
            </div>
            {/* Seller profile link */}
            {seller && (
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="text-xs text-zinc-500">Seller</p>
                        <Link href={`/profile/${seller.id}`} className="font-semibold text-zinc-900 hover:underline">
                            {seller.username}
                        </Link>
                    </div>
                    {user?.id !== listing.sellerId && (
                        <form action={contactSellerAction.bind(null, listing.id, listing.sellerId)}>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition"
                            >
                                Message Seller
                            </button>
                        </form>
                    )}
                </div>
            )}
            {/* Owner Actions */}
            {user?.id === listing.sellerId && (
                <div className="flex items-center gap-3 pt-2">
                    <Link
                        href={`/listings/${listing.id}/edit`}
                        className="px-4 py-2 border border-zinc-300 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                    >
                        Edit Listing
                    </Link>
                    <form action={deleteListingAction.bind(null, listing.id)}>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                        >
                            Delete Listing
                        </button>
                    </form>
                    <form action={toggleSoldStatusAction.bind(null, listing.id)}>
                        <button
                            type="submit"
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${listing.status === 'sold'
                                ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                }`}
                        >
                            {listing.status === 'sold' ? 'Mark as Active' : 'Mark as Sold'}
                        </button>
                    </form>
                </div>
            )}
            {/* Reviews & Ratings Section */}
            <section className="mt-8 pt-8 border-t border-zinc-200 space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-zinc-900">Customer Reviews</h2>
                    <div className="mt-1">
                        <StarRating rating={stats.avgRating} count={stats.totalReviews} />
                    </div>
                </div>
                {/* Form: only shown if eligible */}
                {canReview && (
                    <div className="max-w-md">
                        <ReviewForm listingId={listing.id} />
                    </div>
                )}
                {/* Reviews List */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-zinc-800">Reviews ({reviewsList.length})</h3>
                    {reviewsList.length === 0 ? (
                        <p className="text-zinc-500 text-sm">No reviews yet for this item.</p>
                    ) : (
                        <div className="space-y-4">
                            {reviewsList.map((review) => (
                                <div key={review.id} className="p-4 border border-zinc-200 rounded-lg bg-white">
                                    <div className="flex items-center gap-3 mb-2">
                                        {review.reviewer.avatarUrl ? (
                                            <img
                                                src={review.reviewer.avatarUrl}
                                                alt={review.reviewer.username}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-600">
                                                {review.reviewer.username[0]?.toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-medium text-zinc-900">
                                                {review.reviewer.username}
                                            </p>
                                            <p className="text-xs text-zinc-400">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        <StarRating rating={review.rating} />
                                    </div>
                                    {review.comment && (
                                        <p className="text-sm text-zinc-700">{review.comment}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}