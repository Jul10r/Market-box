import { z } from "zod";
import { CATEGORIES } from "../constants";

export const listingSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title cannot exceed 100 characters"),
    description: z
        .string()
        .trim()
        .min(10, "Description must be at least 10 characters")
        .max(2000, "Description cannot exceed 2000 characters"),
    price: z.coerce
        .number({ error: "Price must be a valid number" })
        .positive("Price must be greater than 0")
        .max(1000000, "Price cannot exceed $1,000,000")
        .multipleOf(0.01, "Price can have at most 2 decimal places"),
    category: z.enum(CATEGORIES, {
        error: "Please select a valid category",
    }),
    location: z
        .string()
        .trim()
        .max(100, "Location cannot exceed 100 characters")
        .optional()
        .or(z.literal("")),
    imageUrls: z
        .array(z.string().url("Invalid image URL"))
        .optional(),
});

export type ListingInput = z.infer<typeof listingSchema>;