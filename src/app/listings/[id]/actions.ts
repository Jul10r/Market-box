'use server'

import { chats, listings, reviews } from "@/db/schema";
import { syncCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { listingRatelimit, reviewRatelimit } from "@/lib/ratelimit";
import { hasUserReviewedListing } from "@/lib/reviews";
import { listingSchema, reviewSchema } from "@/lib/validations";
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
    if (!user) redirect('/sign-in');

    const { success, reset } = await reviewRatelimit.limit(user.id);
    if (!success) {
        const retryAfterSeconds = Math.ceil((reset - Date.now()) / 1000);
        return {
            success: false,
            error: `You are submitting reviews too quickly. Please wait ${retryAfterSeconds}s.`
        };
    }

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

    const rawData = {
        rating: formData.get('rating'),
        comment: formData.get('comment'),
    };

    const result = reviewSchema.safeParse(rawData);
    if (!result.success) {
        return {
            success: false,
            error: result.error.issues[0]?.message || "Invalid review data",
        };
    }

    await db
        .insert(reviews)
        .values({
            listingId: listing.id,
            reviewerId: user.id,
            revieweeId: listing.sellerId,
            rating: result.data.rating,
            comment: result.data.comment || null,
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

export async function updateListingAction(listingId: number, formData: FormData) {

    const user = await syncCurrentUser();
    if (!user) {
        redirect('/sign-in')
    }

    const { success, reset } = await listingRatelimit.limit(user.id);

    if (!success) {
        const retryAfterSeconds = Math.ceil((reset - Date.now()) / 1000);
        return {
            error: `Rate limit exceeded. Please wait ${retryAfterSeconds}s before updating again.`
        }
    }

    const rawData = {
        title: formData.get('title'),
        description: formData.get('description'),
        price: formData.get('price'),
        category: formData.get('category'),
        location: formData.get('location'),
    };
    const result = listingSchema.safeParse(rawData);
    if (!result.success) {
        return {
            error: result.error.issues[0]?.message || "Invalid input data"
        };
    }

    await db
        .update(listings)
        .set({
            title: result.data.title,
            description: result.data.description,
            price: result.data.price.toFixed(2),
            category: result.data.category,
            location: result.data.location || null,
            updatedAt: new Date()
        })
        .where(and(
            eq(listings.id, listingId),
            eq(listings.sellerId, user.id)
        ));
    revalidatePath('/');
    revalidatePath(`/listings/${listingId}`);
    redirect(`/listings/${listingId}`);
}