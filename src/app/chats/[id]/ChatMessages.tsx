'use client'

import { Message } from '@/db/schema'
import Ably from 'ably'
import { useState, useEffect, useRef } from 'react'

interface ChatMessagesProps {
  chatId: number
  currentUserId: string
  initialMessages: Message[]
  otherUserInitials?: string
}

function formatDateDivider(date: Date | string) {
  const d = new Date(date)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const isYesterday = d.toDateString() === yesterday.toDateString()
  const timeStr = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

  if (isToday) return `Today at ${timeStr}`
  if (isYesterday) return `Yesterday at ${timeStr}`
  return `${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} at ${timeStr}`
}

export default function ChatMessages({
  chatId,
  currentUserId,
  initialMessages,
  otherUserInitials = 'U',
}: ChatMessagesProps) {
  const [messagesList, setMessagesList] = useState<Message[]>(initialMessages)
  const [prevInitial, setPrevInitial] = useState(initialMessages)
  const bottomRef = useRef<HTMLDivElement>(null)

  if (initialMessages !== prevInitial) {
    setPrevInitial(initialMessages)
    setMessagesList(initialMessages)
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messagesList.length])

  useEffect(() => {
    const ably = new Ably.Realtime({ authUrl: '/api/ably/token' })
    const channel = ably.channels.get(`chat:${chatId}`)

    channel.subscribe('message', (messageEvent) => {
      const incomingMessage = messageEvent.data as Message

      setMessagesList((prev) => {
        if (prev.some((m) => m.id === incomingMessage.id)) {
          return prev
        }
        return [...prev, incomingMessage]
      })
    })

    return () => {
      channel.unsubscribe()
      ably.close()
    }
  }, [chatId])

  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 text-sm">
      {messagesList.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-xs">
          No messages yet. Say hello!
        </div>
      ) : (
        messagesList.map((msg, idx) => {
          const isMe = msg.senderId === currentUserId
          const isNewDay =
            idx === 0 ||
            new Date(msg.createdAt).toDateString() !==
              new Date(messagesList[idx - 1].createdAt).toDateString()

          return (
            <div key={msg.id} className="space-y-3">
              {isNewDay && (
                <div className="text-center my-2">
                  <span className="text-[11px] text-slate-400 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                    {formatDateDivider(msg.createdAt)}
                  </span>
                </div>
              )}

              {isMe ? (
                <div className="flex flex-col items-end ml-auto max-w-[80%]">
                  <div className="bg-slate-900 text-white p-3 rounded-2xl rounded-br-xs shadow-xs">
                    <p className="leading-relaxed">{msg.content}</p>
                    <span className="text-[10px] text-slate-300 mt-1 block text-right">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-end gap-2 max-w-[80%]">
                  <div className="w-6 h-6 rounded-full bg-slate-700 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {otherUserInitials}
                  </div>
                  <div className="bg-white border border-slate-200 text-slate-800 p-3 rounded-2xl rounded-bl-xs shadow-xs">
                    <p className="leading-relaxed">{msg.content}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )
        })
      )}
      <div ref={bottomRef} />
    </div>
  )
}