# Photo Upload App

A full-stack photo sharing application built with Next.js 15, featuring user authentication, photo uploads, and real-time commenting.

## Features

- **Authentication & Authorization**
  - Google OAuth integration via NextAuth
  - JWT-based session management
  - Protected API routes and pages

- **Photo Management**
  - Upload photos (JPEG, JPG, PNG) with optional titles
  - Automatic image optimization with Next.js Image
  - Persistent storage using Vercel Blob
  - File validation (max 5MB, image types only)
  - Responsive photo gallery

- **Social Features**
  - Comment on photos (max 500 characters)
  - Real-time comment updates
  - User profiles with activity history
  - Clickable user names throughout the app

- **User Experience**
  - Responsive design with Ant Design components
  - Loading states and error handling
  - Relative timestamps (e.g., "2 hours ago")
  - Modal view for photo details

## Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- TypeScript
- React 18
- Ant Design 5
- Tailwind CSS
- date-fns

**Backend:**
- Next.js API Routes
- NextAuth v4 (JWT strategy)
- Prisma ORM 5
- PostgreSQL (Supabase)

**Storage & Deployment:**
- Vercel Blob Storage (images)
- Vercel (hosting & deployment)

## Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase recommended)
- Google OAuth credentials
- Vercel account (for Blob storage)

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd photo-upload-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# Database (Supabase connection pooler for serverless)
DATABASE_URL=postgresql://postgres.your-project-id:your-password@aws-0-region.pooler.supabase.com:5432/postgres

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

### 4. Set up the database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string (use pooler for production) | `postgresql://postgres.project-id:password@aws-0-region.pooler.supabase.com:5432/postgres` |
| `NEXTAUTH_URL` | Base URL of your application | `http://localhost:3000` or `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Secret for JWT encryption | Generate with `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | From Google Cloud Console |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token | From Vercel dashboard |

### Optional Variables (Preview Deployments)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_VERCEL_ENV` | Enable preview mode without OAuth | `preview` |

## Database Setup

This project uses **Supabase** for PostgreSQL hosting:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Navigate to **Project Settings** → **Database**
3. Scroll down to **Connection Pooling** section
4. Copy the **Connection string** (Session mode)
   - Format: `postgresql://postgres.[project-id]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres`
5. Set as `DATABASE_URL` in your environment variables

**Important:** Use the pooler connection string for production/Vercel deployments to avoid connection limits in serverless environments. The pooler URL uses port 5432 but goes through Supabase's connection pooler.

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-app.vercel.app/api/auth/callback/google` (production)
6. Copy Client ID and Client Secret to your environment variables

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com/dashboard)
3. Add all environment variables in **Settings** → **Environment Variables**
4. Deploy!

### Important Deployment Notes

- Use Supabase's connection pooler URL (ends with `.pooler.supabase.com`)
- Update `NEXTAUTH_URL` to your production domain
- Add production OAuth redirect URL to Google Cloud Console
- Vercel automatically runs `prisma generate` on build

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth endpoints
│   │   ├── photos/       # Photo CRUD operations
│   │   └── users/        # User data endpoints
│   ├── login/            # Login page
│   ├── profile/[id]/     # User profile pages
│   └── page.tsx          # Home page
├── components/
│   ├── auth/             # Authentication components
│   ├── comments/         # Comment system
│   └── photos/           # Photo upload & display
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   ├── middleware/       # Auth middleware
│   └── validation/       # Input validation
└── types/                # TypeScript type definitions

prisma/
└── schema.prisma         # Database schema
```

## API Endpoints

### Authentication
- `GET /api/auth/session` - Get current session
- `GET /api/auth/signin` - Sign in page
- `GET /api/auth/signout` - Sign out

### Photos
- `GET /api/photos` - List all photos
- `POST /api/photos` - Upload a photo (requires auth)
- `GET /api/photos/[id]` - Get photo with comments

### Comments
- `POST /api/photos/[id]/comments` - Add comment (requires auth)

### Users
- `GET /api/users/[id]` - Get user profile with photos and comments
- `GET /api/users/me` - Get current user data

## Database Schema

### Models

- **User** - User accounts from OAuth
- **Account** - OAuth account linking
- **Session** - NextAuth sessions
- **Photo** - Uploaded photos with metadata
- **Comment** - Comments on photos

See [prisma/schema.prisma](prisma/schema.prisma) for full schema details.

## Development

### Run database migrations

```bash
npx prisma migrate dev --name description
```

### Access Prisma Studio

```bash
npx prisma studio
```

### Build for production

```bash
npm run build
npm start
```

## Features Implemented

- ✅ User authentication with Google OAuth
- ✅ JWT-based session management
- ✅ Photo upload with validation
- ✅ Image storage with Vercel Blob
- ✅ Photo gallery with responsive grid
- ✅ Comment system with real-time updates
- ✅ User profiles with activity history
- ✅ Clickable user names
- ✅ Relative timestamps
- ✅ Loading states and error handling
- ✅ Mobile-responsive design
- ✅ Preview deployment support
- ✅ React Error Boundary for graceful error handling
- ✅ Input sanitization for XSS prevention
- ✅ Consistent API error responses
- ✅ Enhanced fetch error handling
- ✅ GitHub Actions CI/CD workflow
- ✅ Branch protection with PR approvals

## License

MIT

## Author

Built as a technical assessment for a Senior Full Stack Engineer position.