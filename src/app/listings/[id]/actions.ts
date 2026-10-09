'use server'

import { chats, listings, reviews } from "@/db/schema";
import { syncCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { hasUserReviewedListing } from "@/lib/reviews";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function deleteListingAction(listingId: number) {

    const user = await syncCurrentUser();
    if (!user) {
        redirect('/sign-in')
    };

    await db
        .delete(listings)
        .where(and(
            eq(listings.id, listingId),
            eq(listings.sellerId, user.id)
        ))

    revalidatePath('/')
    redirect('/')
}

export async function contactSellerAction(listingId: number, sellerId: string) {
    const user = await syncCurrentUser();

    if (!user) redirect('/sign-in');

    if (user.id === sellerId) return;

    const [existingChat] = await db
        .select()
        .from(chats)
        .where(
            and(
                eq(chats.listingId, listingId),
                eq(chats.buyerId, user.id),
                eq(chats.sellerId, sellerId)
            )
        )

    if (existingChat) {
        redirect(`/chats/${existingChat.id}`)
    }

    const [newChat] = await db
        .insert(chats)
        .values({
            listingId,
            buyerId: user.id,
            sellerId
        })
        .returning()

    redirect(`/chats/${newChat.id}`)
}

export async function createReviewAction(listingId: number, formData: FormData) {
    const user = await syncCurrentUser();
    if (!user) redirect('/sign-in')

    const [listing] = await db
        .select()
        .from(listings)
        .where(eq(listings.id, listingId))

    if (!listing) {
        return { success: false, error: "Listing not found!" }
    }

    if (listing.sellerId === user.id) {
        return { success: false, error: "You cannot review your own listing!" }
    }

    const alreadyReviewed = await hasUserReviewedListing(user.id, listingId);

    if (alreadyReviewed) {
        return { success: false, error: "You have already left a review for this item!" }
    }

    const rating = Number(formData.get('rating'));

    if (isNaN(rating) || (rating < 1 || rating > 5)) {
        return { success: false, error: "Please select a rating between 1 and 5 stars." }
    }

    const comment = (formData.get('comment') as string)?.trim() || null;

    await db
        .insert(reviews)
        .values({
            listingId: listing.id,
            reviewerId: user.id,
            revieweeId: listing.sellerId,
            rating: rating,
            comment: comment,
        })

    revalidatePath(`/listings/${listingId}`);

    return { success: true }

}

export async function toggleSoldStatusAction(listingId: number) {
    const user = await syncCurrentUser();

    if (!user) {
        redirect('/sign-in')
    }

    const [listing] = await db
        .select()
        .from(listings)
        .where(
            and(
                eq(listings.id, listingId),
                eq(listings.sellerId, user.id)
            )
        );

    if (!listing) {
        return
    }

    let newStatus = 'sold';

    if (listing.status === 'sold') {
        newStatus = 'active'
    }

    await db
        .update(listings)
        .set({ status: newStatus })
        .where(eq(listings.id, listingId))

    revalidatePath(`/listings/${listingId}`);
    revalidatePath('/')
    revalidatePath('/dashboard')
}