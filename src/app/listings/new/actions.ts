'use server'

import { listingImages, listings } from "@/db/schema";
import { syncCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { listingRatelimit } from "@/lib/ratelimit";
import { listingSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createListingAction(formData: FormData) {

    const user = await syncCurrentUser();
    if (!user) {
        redirect('/sign-in')
    }

    const { success, reset } = await listingRatelimit.limit(user.id);

    if (!success) {
        const retryAfterSeconds = Math.ceil((reset - Date.now()) / 1000);
        return {
            error: `Rate limit exceeded. Please wait ${retryAfterSeconds}s before creating another listing.`
        }
    }

    const rawData = {
        title: formData.get('title'),
        description: formData.get('description'),
        price: formData.get('price'),
        category: formData.get('category'),
        location: formData.get('location'),
        imageUrls: formData.getAll('images'),
    };

    const result = listingSchema.safeParse(rawData)

    if (!result.success) {
        return {
            error: result.error.issues[0]?.message || "Invalid input data"
        }
    }


    const [newListing] = await db
        .insert(listings)
        .values({
            sellerId: user.id,
            title: result.data.title,
            description: result.data.description,
            price: result.data.price.toFixed(2),
            category: result.data.category,
            location: result.data.location || null,
        })
        .returning({ id: listings.id });

    if (result.data.imageUrls && result.data.imageUrls.length > 0) {
        await db
            .insert(listingImages)
            .values(
                result.data.imageUrls.map((url) => ({
                    listingId: newListing.id,
                    imageUrl: url,
                }))
            );
    }

    revalidatePath('/');
    redirect(`/listings/${newListing.id}`)

}