'use server'

import { chats, messages } from "@/db/schema"
import { syncCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { eq } from 'drizzle-orm'
import { ablyRest } from "@/lib/ably"
import { messageRatelimit } from "@/lib/ratelimit"
import { messageSchema } from "@/lib/validations"

export async function sendMessageAction(chatId: number, formData: FormData) {
    const user = await syncCurrentUser()

    if (!user) {
        redirect('/sign-in')
    }

    const { success, reset } = await messageRatelimit.limit(user.id);
    if (!success) {
        const retryAfterSeconds = Math.ceil((reset - Date.now()) / 1000);
        return {
            error: `You are sending messages too quickly. Please wait ${retryAfterSeconds}s.`
        };
    }

    const [chat] = await db
        .select()
        .from(chats)
        .where(eq(chats.id, chatId))

    if (!chat || (chat.buyerId !== user.id && chat.sellerId !== user.id)) {
        throw new Error("Unauthorized")
    }

    const rawData = {
        content: formData.get('content'),
    };
    const result = messageSchema.safeParse(rawData);
    if (!result.success) {
        return {
            error: result.error.issues[0]?.message || "Invalid message"
        };
    }


    const [newMessage] = await db
        .insert(messages)
        .values({
            chatId,
            senderId: user.id,
            content: result.data.content
        })

        .returning()

    const channel = ablyRest.channels.get(`chat:${chatId}`);
    await channel.publish("message", newMessage)

    revalidatePath('/chats/' + chatId)

    return { success: true }
}