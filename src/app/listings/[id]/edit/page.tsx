import { CATEGORIES } from '@/lib/constants';
import { db } from '@/lib/db';
import { listings } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { syncCurrentUser } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

interface EditListingPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditListingPage({ params }: EditListingPageProps) {
    const { id } = await params;

    const user = await syncCurrentUser();
    if (!user) {
        redirect('/sign-in')
    }

    const [listing] = await db
        .select()
        .from(listings)
        .where(eq(listings.id, Number(id)));

    if (!listing) {
        return notFound();
    }

    if (listing.sellerId !== user.id) {
        redirect(`/listings/${id}`)
    }

    async function updateListingAction(formData: FormData) {
        'use server';

        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const price = formData.get('price') as string;
        const category = formData.get('category') as string;
        const location = formData.get('location') as string;

        await db
            .update(listings)
            .set({
                title,
                description,
                price,
                category,
                location,
                updatedAt: new Date()
            })
            .where(and(
                eq(listings.id, Number(id)),
                eq(listings.sellerId, user!.id)
            ))

        revalidatePath('/');
        revalidatePath(`/listings/${id}`)
        redirect(`/listings/${id}`)
    }

    return (
        <main>
            <h1>Edit Listing</h1>

            <form action={updateListingAction}>
                <div>
                    <label>Title:</label>
                    <input name="title" defaultValue={listing.title} required />
                </div>

                <div>
                    <label>Description:</label>
                    <input name="description" defaultValue={listing.description} required />
                </div>

                <div>
                    <label>Price ($):</label>
                    <input name="price" type="number" step="0.01" defaultValue={listing.price} required />
                </div>

                <div>
                    <label>Category:</label>
                    <select name="category" required defaultValue={listing.category}>
                        <option value="" disabled>Select a category</option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Location:</label>
                    <input name="location" defaultValue={listing.location ?? ''} />
                </div>

                <button type="submit">Save Changes</button>
            </form>
            <Link href={`/listings/${id}`}>Cancel</Link>
        </main >
    )
};
