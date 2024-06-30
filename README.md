# Next.js 14 - Threads Clone

Threads Clone application, uses TypeScript (StandardJS), Tailwind + Shadcn/UI, MongoDB, the application only has basic functionalities. This project is a test one.

- List and create posts
- List and create replies
- Search users and communities
- Integration with uploadthing.com to upload and view images files.

## Configure environment variables

Rename the file **.env.template** to **.env.local**

- Clerk: Create an account on https://clerk.com, create an application and then go to Api Keys and copy the values of NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
```

- MongoDB URL:

```
MONGODB_URL="mongodb+srv://user:password@domain.com/name_bd"
```

- UploadThing: Go to uploadthing.com, create an account, after logging in, create an app, in API Keys copy UPLOADTHING_SECRET and UPLOADTHING_APP_ID

```
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
```

- Rebuild the node modules and build Next

```
npm install
npm run dev
```
