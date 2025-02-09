// import { currentProfile } from '@/lib/current-profile'
// import { db } from '@/lib/db'
// import { redirect } from 'next/navigation'

// interface inviteCodePageProps {
//     params: {
//         inviteCode: string
//     }
// }

// const InviteCodePage = async ({
//     params
// }: inviteCodePageProps) => {
//     const profile = await currentProfile()

//     if (!profile) {
//         return redirect('/sign-in')
//     }

//     if (!params.inviteCode) {
//         return redirect('/')
//     }

//     const existingServer = await db.server.findFirst({
//         where: {
//             inviteCode: params.inviteCode,
//             members: {
//                 some: {
//                     profileId: profile.id
//                 }
//             }
//         }
//     })

//     if (existingServer) {
//         return redirect(`/servers/${existingServer.id}`)
//     }

//     const server = await db.server.update({
//         where: {
//             inviteCode: params.inviteCode
//         },
//         data: {
//             members: {
//                 create: {
//                     profileId: profile.id
//                 }
//             }
//         }
//     })

//     if(server) {
//         return redirect(`/servers/${server.id}`)
//     }
    
//     return null
// }

// export default InviteCodePage


import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

interface InviteCodePageProps {
  // Declare params as a promise of an object with inviteCode
  params: Promise<{ inviteCode: string }>;
}

export default async function InviteCodePage({ params }: InviteCodePageProps) {
  // Await the promise to get the actual params object
  const { inviteCode } = await params;

  const profile = await currentProfile();

  if (!profile) {
    return redirect('/sign-in');
  }

  if (!inviteCode) {
    return redirect('/');
  }

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  const server = await db.server.update({
    where: {
      inviteCode,
    },
    data: {
      members: {
        create: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return null;
}
