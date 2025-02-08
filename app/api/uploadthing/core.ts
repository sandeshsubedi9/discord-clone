import { currentUser} from '@clerk/nextjs/server';
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = async () => {
  
    const user = await currentUser();

    if (!user) throw new UploadThingError('Unauthorized');
    return { userId: user.id };
  };

export const ourFileRouter = {
 serverImage: f({ image: { maxFileSize: "4MB" ,maxFileCount:1 } })
 .middleware(async() => await handleAuth())
 .onUploadComplete(() => {}),

 messageFile: f(["image", "pdf", ])
 .middleware(async() => await handleAuth())
 .onUploadComplete(() => {}),

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;





// import { currentUser } from '@clerk/nextjs/server';
// import { createUploadthing, type FileRouter } from "uploadthing/next";
// import { UploadThingError } from "uploadthing/server";

// const f = createUploadthing();

// // Authentication handler
// const handleAuth = async () => {
//   const user = await currentUser();
  
//   if (!user) {
//     throw new UploadThingError('Unauthorized');
//   }
  
//   return { userId: user.id }; // Make sure this matches the requirements of your auth logic
// };

// // Define your file router
// export const ourFileRouter = {
//   // Server image route
//   serverImage: f({ 
//     image: { maxFileSize: "4MB", maxFileCount: 1 } 
//   })
//   .middleware(async () => await handleAuth()) // Ensure proper usage of the middleware
//   .onUploadComplete(({ metadata }) => {
//     console.log('Upload complete for serverImage', metadata);
//   }),

//   // Message file route
//   messageFile: f([
//     "image", "pdf"
//   ])
//   .middleware(async () => await handleAuth()) // Ensure proper usage of the middleware
//   .onUploadComplete(({ metadata }) => {
//     console.log('Upload complete for messageFile', metadata);
//   }),
// } satisfies FileRouter;

// // Export the file router type
// export type OurFileRouter = typeof ourFileRouter;
