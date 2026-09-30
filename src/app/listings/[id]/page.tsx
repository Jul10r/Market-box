import { db } from '@/lib/db';
import { listings } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { syncCurrentUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache';


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

    const user = await syncCurrentUser()

    async function deleteListingAction() {
        'use server'

        const user = await syncCurrentUser();
        if (!user) {
            redirect('/sign-in')
        };

        await db
            .delete(listings)
            .where(and(
                eq(listings.id, Number(id)),
                eq(listings.sellerId, user.id)
            ))

        revalidatePath('/')
        redirect('/')
    }

    return (
        <main>
            <Link href="/">Back to all listings</Link>
            <h1>{listing.title}</h1>
            <p>Price: ${listing.price}</p>
            <p>Category: {listing.category}</p>
            <p>Location: {listing.location}</p>
            <p>Description: {listing.description}</p>
            <p>Status: {listing.status}</p>
            {user?.id === listing.sellerId && (
                <div>
                    <Link href={`/listings/${listing.id}/edit`}>Edit Listing</Link>
                    <form action={deleteListingAction}>
                        <button type="submit">Delete Listing</button>
                    </form>
                </div>
            )}
        </main>
    )
}