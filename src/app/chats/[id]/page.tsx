import { chats, messages } from "@/db/schema";
import { syncCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db";
import { asc, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { sendMessageAction } from "./actions";
import ChatMessages from './ChatMessages';
import ChatInput from "./ChatInput";

interface ChatPageProps {
    params: Promise<{ id: string }>
}

export default async function chatPage({ params }: ChatPageProps) {
    const { id } = await params;

    const user = await syncCurrentUser();

    if (!user) {
        redirect('/sign-in')
    }

    const [chat] = await db
        .select()
        .from(chats)
        .where(eq(chats.id, Number(id)))

    if (!chat) {
        notFound()
    }

    if (chat.buyerId !== user.id && chat.sellerId !== user.id) {
        notFound();
    }

    const chatMessages = await db
        .select()
        .from(messages)
        .where(eq(messages.chatId, chat.id))
        .orderBy(asc(messages.createdAt))

    return (
        <main className="max-w-2xl mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">Chat #{chat.id}</h1>
            <ChatMessages
                chatId={chat.id}
                currentUserId={user.id}
                initialMessages={chatMessages}
            />
            <ChatInput chatId={chat.id} />
        </main>
    )
}