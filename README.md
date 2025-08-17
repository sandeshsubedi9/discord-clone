# Team Chat Application 🎧💬

A full-stack real-time Team Chat application inspired by **Discord**, featuring servers, text channels, voice/video calls, role-based permissions, direct messages, image sharing, and emoji support.

---

## 🚀 Live Demo
(ctlr + click to open it in new tab) 

https://discord-clone-80eq.onrender.com

---

## 📌 Features

- **Server Management**
  - Create, delete, and manage servers
  - Role-based permissions (Admin, Moderator, Member)
  - Invite system
  - Remove members, promote/demote roles

- **Channels**
  - Multiple text and voice channels within a server
  - Direct one-on-one private messages
  - Real-time updates via **Socket.IO**
  - Voice & video chat via **LiveKit**

- **Messaging**
  - Infinite scroll pagination (10 messages at a time) with caching via **React Query**
  - Send images (stored via **Cloudinary**)
  - Emoji picker with custom emoji support
  - Light & dark mode

- **Authentication**
  - Secure login/signup with **Clerk**

- **Real-Time Communication**
  - Instant updates without refresh
  - Voice and video calls in channels or private chats

---

## 🛠 Tech Stack

**Frontend:**
- [Next.js](https://nextjs.org/)  
- [React](https://react.dev/)  
- [React Query](https://tanstack.com/query/latest)  
- [Socket.IO Client](https://socket.io/)  
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) – UI components library  

**Backend:**
- [Next.js API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)  
- [Socket.IO Server](https://socket.io/)  
- [Prisma](https://www.prisma.io/)  
- [Neon Database](https://neon.tech/)  

**Other Services:**
- [Clerk](https://clerk.dev/) – Authentication  
- [LiveKit](https://livekit.io/) – Audio/Video calls  
- [Cloudinary](https://cloudinary.com/) – Image storage  

---

