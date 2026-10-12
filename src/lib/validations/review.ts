import { z } from "zod";

export const reviewSchema = z.object({
    rating: z.coerce
        .number({ error: "Rating must be a number" })
        .int("Rating must be a whole number")
        .min(1, "Rating must be at least 1 star")
        .max(5, "Rating cannot exceed 5 stars"),
    comment: z
        .string()
        .trim()
        .max(500, "Comment cannot exceed 500 characters")
        .optional()
        .or(z.literal("")),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
