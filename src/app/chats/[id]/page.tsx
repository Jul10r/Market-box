import { chats, messages, listings, users } from "@/db/schema"
import { syncCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { and, asc, eq, ne } from "drizzle-orm"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import ChatMessages from './ChatMessages'
import ChatInput from "./ChatInput"

interface ChatPageProps {
  params: Promise<{ id: string }>
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params
  const chatId = Number(id)
  if (Number.isNaN(chatId)) {
    notFound()
  }

  const user = await syncCurrentUser()
  if (!user) {
    redirect('/sign-in')
  }

  const [chat] = await db
    .select()
    .from(chats)
    .where(eq(chats.id, chatId))

  if (!chat) {
    notFound()
  }

  if (chat.buyerId !== user.id && chat.sellerId !== user.id) {
    notFound()
  }

  const [listing] = chat.listingId
    ? await db
        .select()
        .from(listings)
        .where(eq(listings.id, chat.listingId))
    : []

  const otherUserId = user.id === chat.buyerId ? chat.sellerId : chat.buyerId
  const [otherUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, otherUserId))

  const isBuyer = chat.buyerId === user.id
  const role = isBuyer ? "Buying" : "Selling"
  const otherInitials = otherUser?.username?.slice(0, 2).toUpperCase() || 'U'

  const chatMessages = await db
    .select()
    .from(messages)
    .where(eq(messages.chatId, chat.id))
    .orderBy(asc(messages.createdAt))

  await db
    .update(messages)
    .set({ isRead: true })
    .where(
      and(
        eq(messages.chatId, chat.id),
        ne(messages.senderId, user.id),
        eq(messages.isRead, false)
      )
    )

  return (
    <main className="max-w-2xl mx-auto p-4 sm:p-6">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[560px]">
        <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/chats"
              className="text-slate-400 hover:text-slate-700 transition mr-0.5"
              title="Back to inbox"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center">
              {otherInitials}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                {otherUser?.username || 'User'}
              </div>
              <p className="text-[11px] text-slate-500">
                {listing ? `Re: ${listing.title} ($${listing.price})` : `Conversation #${chat.id}`}
              </p>
            </div>
          </div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded border ${
            isBuyer
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            {role}
          </span>
        </div>

        <ChatMessages
          key={chat.id}
          chatId={chat.id}
          currentUserId={user.id}
          initialMessages={chatMessages}
          otherUserInitials={otherInitials}
        />

        <ChatInput chatId={chat.id} />
      </div>
    </main>
  )
}