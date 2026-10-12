'use client'

import { useState, useTransition } from 'react';
import { updateListingAction } from '../actions';
import { CATEGORIES } from '@/lib/constants';
import { Listing } from '@/db/schema';
import Link from 'next/link';


interface EditListingFormProps {
    listing: Listing;
}

export default function EditListingForm({ listing }: EditListingFormProps) {
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault(); // Prevents reverting to old values
        const formData = new FormData(e.currentTarget);
        setError(null);
        startTransition(async () => {
            const result = await updateListingAction(listing.id, formData);
            if (result?.error) {
                setError(result.error);
            }
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm mb-4">
                    {error}
                </div>
            )}
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
                    {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Location:</label>
                <input name="location" defaultValue={listing.location ?? ''} />
            </div>
            <button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
            </button>
            <Link href={`/listings/${listing.id}`}>Cancel</Link>
        </form>
    );
}