'use client'

import { createReviewAction } from "@/app/listings/[id]/actions";
import { useState, useTransition } from "react"

interface ReviewFormProps {
    listingId: number
}

export default function ReviewForm({ listingId }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isPending, startTransition] = useTransition();

    if (success) {
        return (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm">
                Thank you for your review!
            </div>
        )
    };

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (rating === 0) {
            setError("Please select a rating of at least 1 star.")
            return
        }

        startTransition(async () => {
            const formData = new FormData();

            formData.append('rating', String(rating));
            formData.append('comment', comment);

            const result = await createReviewAction(listingId, formData)

            if (result?.error) {
                setError(result.error);
            } else if (result?.success) {
                setSuccess(true)
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="border rounded-xl p-5 bg-white shadow-sm space-y-4">
            <h3 className="font-semibold text-zinc-900">Leave a Review</h3>
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                </div>
            )}
            <div>
                <label className="block text-xs font-medium text-zinc-600 mb-1">
                    Rating
                </label>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 focus:outline-none cursor-pointer transition-colors"
                            aria-label={`Rate ${star} stars`}
                        >
                            <svg
                                className={`w-6 h-6 ${star <= (hoverRating || rating)
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-zinc-300 fill-zinc-200"
                                    }`}
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292z" />
                            </svg>
                        </button>
                    ))}
                    <span className="text-sm font-medium text-zinc-600 ml-2 inline-block min-w-[90px]">
                        {hoverRating || rating ? `${hoverRating || rating} / 5` : "Select stars"}
                    </span>
                </div>
            </div>
            <div>
                <label htmlFor="comment" className="block text-xs font-medium text-zinc-600 mb-1">
                    Comment (optional)
                </label>
                <textarea
                    id="comment"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this item..."
                    className="w-full border border-zinc-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
            </div>
            <button
                type="submit"
                disabled={isPending || rating === 0}
                className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                {isPending ? "Submitting..." : "Submit Review"}
            </button>
        </form>
    )
}