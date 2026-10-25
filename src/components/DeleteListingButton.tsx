'use client'

import { useState, useTransition } from 'react'
import { deleteListingAction } from '@/app/listings/[id]/actions'

interface DeleteListingButtonProps {
    listingId: number
    size?: 'sm' | 'md'
}

export default function DeleteListingButton({
    listingId,
    size = 'md',
}: DeleteListingButtonProps) {
    const [confirming, setConfirming] = useState(false)
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        startTransition(async () => {
            await deleteListingAction(listingId)
        })
    }

    const baseStyle = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'py-2 px-3 text-xs'

    if (confirming) {
        return (
            <div className="flex items-center gap-1.5">
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isPending}
                    className={`${baseStyle} bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition cursor-pointer disabled:opacity-50`}
                >
                    {isPending ? 'Deleting...' : 'Confirm?'}
                </button>
                <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    disabled={isPending}
                    className={`${baseStyle} border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg font-medium transition cursor-pointer`}
                >
                    Cancel
                </button>
            </div>
        )
    }

    return (
        <button
            type="button"
            onClick={() => setConfirming(true)}
            className={
                size === 'sm'
                    ? 'px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 rounded font-medium transition cursor-pointer'
                    : 'py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer'
            }
        >
            Delete
        </button>
    )
}