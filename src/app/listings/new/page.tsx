import { db } from '@/lib/db';
import { listings, listingImages } from '@/db/schema';
import { syncCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import ImageUploader from './ImageUploader';
import { CATEGORIES } from '@/lib/constants'

async function createListingAction(formData: FormData) {
    'use server';

    const user = await syncCurrentUser();
    if (!user) {
        redirect('/sign-in')
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const category = formData.get('category') as string;
    const location = formData.get('location') as string;
    const imageUrls = formData.getAll('images') as string[];

    const [newListing] = await db
        .insert(listings)
        .values({
            sellerId: user.id,
            title,
            description,
            price,
            category,
            location,
        })
        .returning({ id: listings.id })

    if (imageUrls.length > 0) {
        await db
            .insert(listingImages)
            .values(
                imageUrls.map((url) => ({
                    listingId: newListing.id,
                    imageUrl: url,
                }))
            )
    }

    revalidatePath('/');
    redirect(`/listings/${newListing.id}`)

}

export default function NewListingPage() {
    return (
        <main>
            <h1>Create a New Listing</h1>
            <form action={createListingAction}>
                <div>
                    <label>Title:</label>
                    <input name="title" required />
                </div>

                <div>
                    <label>Description:</label>
                    <input name="description" required />
                </div>

                <div>
                    <label>Price ($):</label>
                    <input name="price" type="number" step="0.01" required />
                </div>

                <div>
                    <label>Category:</label>
                    <select name="category" required defaultValue="">
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
                    <input name="location" />
                </div>

                <div>
                    <label>Photos:</label>
                    <ImageUploader />
                </div>

                <button type="submit">Publish Listing</button>
            </form>
        </main>
    )
}