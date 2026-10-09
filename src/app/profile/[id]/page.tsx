import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getSellerReviewStats, getUserListingCount } from "@/lib/reviews";
import StarRating from "@/components/StarRating";

interface ProfilePageProps {
    params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { id } = await params;

    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id));

    if (!user) {
        notFound();
    }

    const listingCount = await getUserListingCount(user.id);
    const isSeller = listingCount > 0;

    const sellerStats = isSeller ? await getSellerReviewStats(user.id) : null;

    return (
        <main className="max-w-2xl mx-auto p-8">
            <div className="flex items-center gap-6 p-6 border rounded-xl shadow-sm">
                {user.avatarUrl && (
                    <img
                        src={user.avatarUrl}
                        alt={user.username}
                        className="w-20 h-20 rounded-full object-cover border"
                    />
                )}
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold">{user.username}</h1>
                        {isSeller ? (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                Seller
                            </span>
                        ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600">
                                Buyer
                            </span>
                        )}
                    </div>

                    <p className="text-sm text-zinc-500 mt-1">
                        Member since {new Date(user.createdAt).toLocaleDateString()}
                    </p>

                    {isSeller && (
                        <div className="mt-3 pt-3 border-t border-zinc-100 space-y-1">
                            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                Seller Reputation ({listingCount} item{listingCount === 1 ? '' : 's'} listed)
                            </p>
                            <StarRating
                                rating={sellerStats?.avgRating ?? null}
                                count={sellerStats?.totalReviews ?? 0}
                            />
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}