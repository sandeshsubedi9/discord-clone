"use client"

import React from 'react'
import { ActionTooltip } from '../action-tooltip'
import { Video, VideoOff } from 'lucide-react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import qs from 'query-string'

const ChatVideoButton = () => {
    const pathname = usePathname()
    const router = useRouter()

    const searchParams = useSearchParams()
    const isVideo = searchParams?.get('video')

    const onClick = () => {
        const url = qs.stringifyUrl({
            url: pathname || '',
            query: {
                video: isVideo ? undefined : true
            }
        }, { skipNull: true })

        router.push(url)
    }

    const Icon = isVideo ? VideoOff : Video
    const tooltipLabel = isVideo ? "End video call" : "Start video call"

    return (
        <ActionTooltip side='bottom' label={tooltipLabel}>
            <button 
            onClick={onClick}
            className='hover:opacity-75 transition mr-4'>
                <Icon className='h-6 w-6 text-zinc-500 dark:text-zinc-400' />
            </button>
        </ActionTooltip>
    )
}

export default ChatVideoButton
