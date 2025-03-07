// import ChatHeader from '@/components/chat/chat-header'
// import ChatInput from '@/components/chat/chat-input'
// import ChatMessages from '@/components/chat/chat-messages'
// import { MediaRoom } from '@/components/media-room'
// import { getOrCreateConversation } from '@/lib/conversation'
// import { currentProfile } from '@/lib/current-profile'
// import { db } from '@/lib/db'
// import { redirect } from 'next/navigation'
// import React from 'react'

// interface MemberIdPageProps {
//   params: {
//     memberId: string
//     serverId: string
//   }
//   searchParams: {
//     video?: boolean
//   }
// }

// const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
//   const profile = await currentProfile()

//   if (!profile) {
//     redirect('/sign-in')
//   }

//   const currentMember = await db.member.findFirst({
//     where: {
//       serverId: params.serverId,
//       profileId: profile?.id
//     },
//     include: {
//       profile: true
//     }
//   })

//   if (!currentMember) {
//     redirect('/')
//   }

//   const conversation = await getOrCreateConversation(currentMember.id, params.memberId)

//   if (!conversation) {
//     return redirect(`/servers/${params.serverId}`)
//   }

//   const { memberOne, memberTwo } = conversation

//   const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne

//   return (
//     <div className='bg-white dark:bg-[#313338] flex flex-col h-full '>

//       <ChatHeader
//         imageUrl={otherMember.profile.imageUrl}
//         name={otherMember.profile.name}
//         serverId={params.serverId}
//         type="conversation"
//       />
//       {searchParams.video && (
//         <MediaRoom 
//           chatId={conversation.id}
//           video={true}
//           audio={true}
//         />
//       )}
//       {!searchParams.video && (
//         <>
//           <ChatMessages
//             member={currentMember}
//             name={otherMember.profile.name}
//             chatId={conversation.id}
//             type='conversation'
//             apiUrl='/api/direct-messages'
//             paramKey='conversationId'
//             paramValue={conversation.id}
//             socketUrl='/api/socket/direct-messages'
//             socketQuery={{ conversationId: conversation.id }}
//           />

//           <ChatInput
//             name={otherMember.profile.name}
//             type='conversation'
//             apiUrl='/api/socket/direct-messages'
//             query={{ conversationId: conversation.id }}
//           />
//         </>
//       )}

//     </div>
//   )
// }

// export default MemberIdPage






import ChatHeader from '@/components/chat/chat-header'
import ChatInput from '@/components/chat/chat-input'
import ChatMessages from '@/components/chat/chat-messages'
import { MediaRoom } from '@/components/media-room'
import { getOrCreateConversation } from '@/lib/conversation'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import React from 'react'

interface MemberIdPageProps {
  // Both params and searchParams are promises.
  params: Promise<{ memberId: string; serverId: string }>;
  searchParams: Promise<{ video?: boolean }>;
}

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
  // Await both params and searchParams to extract the actual values.
  const { memberId, serverId } = await params;
  const search = await searchParams;

  const profile = await currentProfile();

  if (!profile) {
    return redirect('/sign-in');
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id
    },
    include: {
      profile: true
    }
  });

  if (!currentMember) {
    return redirect('/');
  }

  const conversation = await getOrCreateConversation(currentMember.id, memberId);

  if (!conversation) {
    return redirect(`/servers/${serverId}`);
  }

  const { memberOne, memberTwo } = conversation;
  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={serverId}
        type="conversation"
      />
      
      {search.video ? (
        <MediaRoom chatId={conversation.id} video={true} audio={true} />
      ) : (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{ conversationId: conversation.id }}
          />

          <ChatInput
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{ conversationId: conversation.id }}
          />
        </>
      )}
    </div>
  );
};

export default MemberIdPage;



