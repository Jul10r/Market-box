'use client'

import { useState, useTransition } from 'react';
import { createListingAction } from './actions';
import ImageUploader from './ImageUploader';
import { CATEGORIES } from '@/lib/constants'


export default function NewListingPage() {

    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setError(null);
        startTransition(async () => {
            const result = await createListingAction(formData);
            if (result?.error) {
                setError(result.error)
            }
        })
    }

    return (
        <main>
            <h1>Create a New Listing</h1>
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm mb-4">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit}>
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

                <button type="submit" disabled={isPending}>
                    {isPending ? "Publishing..." : "Publish Listing"}
                </button>
            </form>
        </main>
    )
}