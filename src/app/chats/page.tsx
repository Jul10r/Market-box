import { chats, messages } from "@/db/schema";
import { syncCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { and, eq, or, exists } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function userChats() {
    const user = await syncCurrentUser();

    if (!user) redirect('/sign-in');

    const conversations = await db
        .select()
        .from(chats)
        .where(
            and(
                or(
                    eq(chats.buyerId, user.id),
                    eq(chats.sellerId, user.id)
                ),
                exists(
                    db
                        .select()
                        .from(messages)
                        .where(eq(messages.chatId, chats.id))
                )
            )
        )

    return (
        <main className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Your Inbox</h1>
            {conversations.length === 0 ? (
                <p className="text-gray-500">You don't have any messages yet.</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {conversations.map((chat) => {
                        const role = chat.buyerId === user.id ? "Buying" : "Selling";
                        return (
                            <Link
                                key={chat.id}
                                href={`/chats/${chat.id}`}
                                className="block p-4 border rounded-lg hover:bg-gray-50 transition"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="font-semibold text-lg">Conversation #{chat.id}</h2>
                                        <p className="text-sm text-gray-500">Role: {role}</p>
                                    </div>
                                    <span className="text-blue-600 text-sm font-medium">View chat &rarr;</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </main>
    )
}