import ServerSidebar from '@/components/server/server-sidebar'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import React from 'react'

const ServerIdLayout = async ({ children, params }: {
    children: React.ReactNode,
    params: { serverId: string }
}) => {
    const { serverId } = params; 

    const profile = await currentProfile()

    if (!profile) {
        return redirect('/sign-in')
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    if (!server) {
        return redirect('/')
    }

    return (
        <div className='h-full'>
            <div className='md:flex invisible md:visible h-full w-60 z-20 flex-col fixed inset-y-0'>
                <ServerSidebar
                serverId={params.serverId}
                />
            </div>
            <main className='h-full md:pl-60'>
                {children}
            </main>
        </div>
    )
}

export default ServerIdLayout
