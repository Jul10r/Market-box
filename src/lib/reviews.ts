import { and, avg, count, desc, eq } from "drizzle-orm";
import { db } from "./db";
import { listings, reviews, users } from "@/db/schema";


export async function getSellerReviewStats(sellerId: string) {
    const [result] = await db
        .select({
            avgRating: avg(reviews.rating),
            totalReviews: count(reviews.id)
        })
        .from(reviews)
        .where(eq(reviews.revieweeId, sellerId))

    return {
        avgRating: result?.avgRating ?
            Number(Number(result.avgRating).toFixed(1)) : null,
        totalReviews: Number(result?.totalReviews ?? 0),
    }
}

export async function getListingReviewStats(listingId: number) {
    const [result] = await db
        .select({
            avgRating: avg(reviews.rating),
            totalReviews: count(reviews.id)
        })
        .from(reviews)
        .where(eq(reviews.listingId, listingId))

    return {
        avgRating: result?.avgRating ?
            Number(Number(result.avgRating).toFixed(1)) : null,
        totalReviews: Number(result?.totalReviews ?? 0),
    }
}

export async function getListingReviews(listingId: number) {
    return await db
        .select({
            id: reviews.id,
            rating: reviews.rating,
            comment: reviews.comment,
            createdAt: reviews.createdAt,
            reviewer: {
                id: users.id,
                username: users.username,
                avatarUrl: users.avatarUrl
            },
        })
        .from(reviews)
        .innerJoin(users, eq(reviews.reviewerId, users.id))
        .where(eq(reviews.listingId, listingId))
        .orderBy(desc(reviews.createdAt))
}

export async function hasUserReviewedListing(reviewerId: string, listingId: number) {
    const [existing] = await db
        .select({ id: reviews.id })
        .from(reviews)
        .where(
            and(
                eq(reviews.reviewerId, reviewerId),
                eq(reviews.listingId, listingId)
            )
        )
        .limit(1)

    return Boolean(existing);
}

export async function getUserListingCount(userId: string) {
    const [result] = await db
        .select({ total: count(listings.id) })
        .from(listings)
        .where(eq(listings.sellerId, userId))

    return Number(result?.total ?? 0)
}

export async function getAllListingReviewStats() {
    const results = await db
        .select({
            listingId: reviews.listingId,
            avgRating: avg(reviews.rating),
            totalReviews: count(reviews.id)
        })
        .from(reviews)
        .groupBy(reviews.listingId);

    return results.map((r) => ({
        listingId: r.listingId,
        avgRating: r.avgRating ? Number(Number(r.avgRating).toFixed(1)) : null,
        totalReviews: Number(r.totalReviews ?? 0)
    }))
}