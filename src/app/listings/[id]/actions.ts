'use server'

import { chats, listings } from "@/db/schema";
import { syncCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
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