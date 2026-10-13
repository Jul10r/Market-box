'use client'

import { useState, useTransition } from 'react'
import { sendMessageAction } from './actions'

interface ChatInputProps {
  chatId: number
}

export default function ChatInput({ chatId }: ChatInputProps) {
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const textToSend = content.trim()
    if (!textToSend) return

    setContent('')
    setError(null)

    startTransition(async () => {
      const formData = new FormData()
      formData.append('content', textToSend)
      const result = await sendMessageAction(chatId, formData)

      if (result?.error) {
        setError(result.error)
        setContent(textToSend)
      }
    })
  }

  return (
    <div className="p-3 bg-white border-t border-slate-200">
      {error && (
        <div className="p-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs mb-2">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition"
        />
        <button
          type="submit"
          disabled={isPending || !content.trim()}
          className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer"
        >
          {isPending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  )
}