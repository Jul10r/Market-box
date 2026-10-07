'use server'

import { chats, messages } from "@/db/schema"
import { syncCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { eq } from 'drizzle-orm'
import { ablyRest } from "@/lib/ably"

export async function sendMessageAction(chatId: number, formData: FormData) {
    const user = await syncCurrentUser()

    if (!user) {
        redirect('/sign-in')
    }

    const [chat] = await db
        .select()
        .from(chats)
        .where(eq(chats.id, chatId))

    if (!chat || (chat.buyerId !== user.id && chat.sellerId !== user.id)) {
        throw new Error("Unauthorized")
    }

    const message = formData.get('content')?.toString()

    if (!message || message.trim() === '') {
        return
    }



    const [newMessage] = await db
        .insert(messages)
        .values({
            chatId,
            senderId: user.id,
            content: message
        })

        .returning()

    const channel = ablyRest.channels.get(`chat:${chatId}`);
    await channel.publish("message", newMessage)

    revalidatePath('/chats/' + chatId)
}