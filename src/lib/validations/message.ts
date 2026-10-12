import { z } from "zod";

export const messageSchema = z.object({
    content: z
        .string()
        .trim()
        .min(1, "Message cannot be empty")
        .max(1000, "Message cannot exceed 1000 characters"),
});

export type MessageInput = z.infer<typeof messageSchema>;
