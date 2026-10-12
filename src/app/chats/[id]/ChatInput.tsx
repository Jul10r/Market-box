'use client';

import { useState, useTransition, useRef } from 'react';
import { sendMessageAction } from './actions';

interface ChatInputProps {
    chatId: number;
}

export default function ChatInput({ chatId }: ChatInputProps) {

    const [content, setContent] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const formRef = useRef<HTMLFormElement>(null);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const textToSend = content.trim();
        if (!textToSend) return;

        setContent('');
        setError(null);

        startTransition(async () => {

            const formData = new FormData();
            formData.append('content', textToSend);
            const result = await sendMessageAction(chatId, formData);

            if (result?.error) {
                setError(result.error);
                setContent(textToSend);
            }
        });
    }

    return (
        <div>
            {error && (
                <div className="p-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs mb-2">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    disabled={isPending || !content.trim()}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                    {isPending ? 'Sending...' : 'Send'}
                </button>
            </form>
        </div>
    );
}