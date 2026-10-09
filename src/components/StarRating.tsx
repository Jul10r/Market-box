interface StarRatingProps {
    rating: number | null;
    count?: number;
}


export default function StarRating({ rating, count }: StarRatingProps) {
    if (rating === null || rating === 0) {
        return (
            <span className="text-xs text-zinc-400 font-medium">
                No reviews yet!
            </span>
        )
    }

    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`w-4 h-4 ${star <= Math.round(rating)
                            ? "text-amber-400 fill-amber-400"
                            : "text-zinc-300 fill-zinc-200"
                            }`}
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
            <span className="text-sm font-semibold text-zinc-800 ml-1">
                {rating.toFixed(1)}
            </span>
            {count !== undefined && (
                <span className="text-xs text-zinc-500">
                    ({count})
                </span>
            )}
        </div>
    );
}