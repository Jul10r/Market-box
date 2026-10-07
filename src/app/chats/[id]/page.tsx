import { chats, messages } from "@/db/schema";
import { syncCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db";
import { asc, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { sendMessageAction } from "./actions";
import ChatMessages from './ChatMessages';

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
            <form action={sendMessageAction.bind(null, chat.id)} className="flex gap-2">
                <input
                    type="text"
                    name="content"
                    placeholder="Type a message..."
                    required
                    className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700"
                >
                    Send
                </button>
            </form>
        </main>
    )
}