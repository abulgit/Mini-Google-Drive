# Mini Drive

A personal cloud storage application built with Next.js and Azure Blob Storage.

## Features

- Google OAuth authentication
- File upload with progress tracking (up to 5GB)
- File management (rename, delete, star, restore)
- Search and filtering
- Activity tracking
- Dark mode

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- MongoDB
- Azure Blob Storage
- NextAuth.js
- Tailwind CSS + shadcn/ui

## Setup

1. Clone and install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

3. Set up required services:
   - Google OAuth credentials
   - MongoDB database
   - Azure Storage account

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run type     # TypeScript check
npm run format   # Format code with Prettier
```

## How It Works

Files are uploaded directly from the browser to Azure Blob Storage using pre-signed URLs. File metadata is stored in MongoDB. This keeps the server lightweight and uploads fast.

Authentication uses NextAuth with Google OAuth. All routes under `/dashboard` and `/api` are protected by middleware.

## License

MIT
