import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { ChannelType, MemberRole } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'
import ServerHeader from './server-header'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import ServerSearch from './server-search'
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react'
import { Separator } from '../ui/separator'
import ServerSection from './server-section'
import ServerChannel from './server-channel'
import ServerMember from './server-member'

interface serverSidebarProps {
    serverId: string
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className='mr-2 h-4 w-4' />,
    [ChannelType.AUDIO]: <Mic className='mr-2 h-4 w-4' />,
    [ChannelType.VIDEO]: <Video className='mr-2 h-4 w-4' />
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className='mr-2 h-4 w-4 text-indigo-500' />,
    [MemberRole.ADMIN]: <ShieldAlert className='mr-2 h-4 w-4 text-rose-500' />,
}

const ServerSidebar = async ({
    serverId
}: serverSidebarProps) => {
    const profile = await currentProfile()

    if (!profile) {
        return redirect('/sign-in')
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: 'asc'
                }
            },
            members: {
                include: {
                    profile: true
                },
                orderBy: {
                    role: 'asc'
                }
            }
        }
    })

    const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT)
    const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO)
    const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO)
    const members = server?.members.filter((member) => member.profileId !== profile.id)

    if (!server) {
        return redirect('/')
    }

    const role = server.members.find((member) => member.profileId === profile.id)?.role

    return (
       <div className='md:flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]'>
            <ServerHeader
                server={server}
                role={role}
            />
            <ScrollArea className='flex-1 px-3'>
                <div className='mt-2'>
                    <ServerSearch data={[
                        {
                            label: 'Text Channels',
                            type: 'channel',
                            data: textChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.type]
                            }))
                        },
                        {
                            label: 'Voice Channels',
                            type: 'channel',
                            data: audioChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.type]
                            }))
                        },
                        {
                            label: 'Video Channels',
                            type: 'channel',
                            data: videoChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.type]
                            }))
                        },
                        {
                            label: 'Members Channels',
                            type: 'member',
                            data: members?.map((member) => ({
                                id: member.id,
                                name: member.profile.name,
                                icon: roleIconMap[member.role]
                            }))
                        },
                    ]}
                    />
                </div>
                <Separator className='bg-zinc-200 dark:bg-zinc-700 rounded-md my-2' />
                {!!textChannels?.length && (
                    <div className='mb-2'>
                        <ServerSection
                            sectionType='channels'
                            channelType={ChannelType.TEXT}
                            label='Text Channels'
                            role={role}
                        />
                        <div className='space-y-[2px]'>
                            {textChannels.map((channel) => (
                                <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
                            ))}
                        </div>
                    </div>
                )}
                {!!audioChannels?.length && (
                    <div className='mb-2'>
                        <ServerSection
                            sectionType='channels'
                            channelType={ChannelType.AUDIO}
                            label='Voice Channels'
                            role={role}
                        />
                        <div className='space-y-[2px]'>
                            {audioChannels.map((channel) => (
                                <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
                            ))}
                        </div>
                    </div>
                )}
                {!!videoChannels?.length && (
                    <div className='mb-2'>
                        <ServerSection
                            sectionType='channels'
                            channelType={ChannelType.VIDEO}
                            label='Video Channels'
                            role={role}
                        />
                        <div className='space-y-[2px]'>
                            {videoChannels.map((channel) => (
                                <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
                            ))}
                        </div>
                    </div>
                )}
                {!!members?.length && (
                    <div className='mb-2'>
                        <ServerSection
                            sectionType='members'
                            label='Members'
                            role={role}
                            server={server}
                        />
                        <div className='space-y-[2px]'>
                            {members.map((member) => (
                                <ServerMember key={member.id} member={member} server={server}/>
                            ))}
                        </div>
                    </div>
                )}
            </ScrollArea>

        </div>
    )
}

export default ServerSidebar
