import { chats, messages, listings, users, listingImages } from "@/db/schema"
import { syncCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { and, eq, or, exists, inArray } from "drizzle-orm"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function UserChats() {
  const user = await syncCurrentUser()

  if (!user) redirect('/sign-in')

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

  const listingIds = [
    ...new Set(
      conversations
        .map((c) => c.listingId)
        .filter((id): id is number => id !== null)
    ),
  ]

  const otherUserIds = [
    ...new Set(
      conversations.map((c) => (c.buyerId === user.id ? c.sellerId : c.buyerId))
    ),
  ]

  const relatedListings = listingIds.length > 0
    ? await db.select().from(listings).where(inArray(listings.id, listingIds))
    : []

  const relatedUsers = otherUserIds.length > 0
    ? await db.select().from(users).where(inArray(users.id, otherUserIds))
    : []

  const relatedImages = listingIds.length > 0
    ? await db.select().from(listingImages).where(inArray(listingImages.listingId, listingIds))
    : []

  return (
    <main className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Your Messages</h1>
            <p className="text-xs text-slate-500 mt-0.5">Conversations with buyers and sellers</p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {conversations.length} conversation{conversations.length === 1 ? '' : 's'}
          </span>
        </div>

        {conversations.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <svg className="w-6 h-6 stroke-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h4 className="text-sm font-semibold text-slate-900">No messages yet</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              When you contact sellers or buyers message you about your items, your conversations will show up here.
            </p>
            <Link
              href="/"
              className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {conversations.map((chat) => {
              const isBuyer = chat.buyerId === user.id
              const role = isBuyer ? "Buying" : "Selling"
              const otherUserId = isBuyer ? chat.sellerId : chat.buyerId
              const otherUser = relatedUsers.find((u) => u.id === otherUserId)
              const listing = relatedListings.find((l) => l.id === chat.listingId)
              const thumbnail = relatedImages.find((img) => img.listingId === chat.listingId)

              return (
                <Link
                  key={chat.id}
                  href={`/chats/${chat.id}`}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/75 transition block cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {thumbnail ? (
                        <img src={thumbnail.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : otherUser?.avatarUrl ? (
                        <img src={otherUser.avatarUrl} alt={otherUser.username} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center">
                          {otherUser?.username?.slice(0, 2).toUpperCase() || 'MB'}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900">
                          {otherUser?.username || `User`}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isBuyer
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        {listing ? `${listing.title} · $${listing.price}` : `Listing #${chat.listingId}`}
                      </p>
                    </div>
                  </div>

                  <span className="text-slate-400 hover:text-slate-700 text-xs font-medium shrink-0">
                    Open →
                  </span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}