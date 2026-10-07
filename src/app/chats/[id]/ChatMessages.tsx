'use client'

import { Message } from '@/db/schema'
import Ably from 'ably';
import { useState, useEffect } from 'react'


interface ChatMessagesProps {
    chatId: number
    currentUserId: string
    initialMessages: Message[]
}


export default function ChatMessages({
    chatId,
    currentUserId,
    initialMessages,
}: ChatMessagesProps) {

    const [messagesList, setMessagesList] = useState<Message[]>(initialMessages)

    useEffect(() => {
        setMessagesList(initialMessages);
    }, [initialMessages]);


    useEffect(() => {
        const ably = new Ably.Realtime({ authUrl: '/api/ably/token' });

        const channel = ably.channels.get(`chat:${chatId}`);

        channel.subscribe('message', (messageEvent) => {
            const incomingMessage = messageEvent.data as Message;

            setMessagesList((prev) => {

                if (prev.some((m) => m.id === incomingMessage.id)) {
                    return prev;
                }

                return [...prev, incomingMessage];
            })
        });

        return () => {
            channel.unsubscribe();
        };
    }, [chatId])

    return (
        <div className="flex flex-col gap-3 mb-6">
            {messagesList.length === 0 ? (
                <p className="text-gray-500">No messages yet. Say hello!</p>
            ) : (
                messagesList.map((msg) => {
                    const isMe = msg.senderId === currentUserId
                    return (
                        <div
                            key={msg.id}
                            className={`p-3 rounded-lg max-w-[75%] ${isMe
                                ? 'ml-auto bg-blue-600 text-white'
                                : 'mr-auto bg-gray-200 text-gray-900'
                                }`}
                        >
                            <p>{msg.content}</p>
                            <span className="text-xs opacity-75">
                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>
                    )
                })
            )}
        </div>
    )
}