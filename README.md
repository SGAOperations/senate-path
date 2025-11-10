# SGA Senator Application, Nomination, and Audit System

The purpose of this application is to streamline the application and nomination processes for senators at SGA (Student Government Association).

## Technologies

**Frontend & Backend:**
- [Next.js 16](https://nextjs.org/) - React framework with App Router
- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety

**Database:**
- [Prisma](https://www.prisma.io/) - Modern ORM for PostgreSQL
- [PostgreSQL](https://www.postgresql.org/) - Relational database

**UI Components:**
- [Material UI](https://mui.com/) - Component library
- [styled-components](https://styled-components.com/) - CSS-in-JS

## Architecture

This is a modern Next.js 16 application with:
- **No API routes** - All data access happens server-side
- **Server Functions** - Direct database queries from React Server Components
- **Server Actions** - Form submissions with `'use server'` directive
- **Prisma ORM** - Type-safe database access

```
/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── (pages)/           # Application pages (to be migrated)
├── lib/                    # Server-side code
│   ├── db.ts              # Prisma client singleton
│   ├── data/              # Data access layer
│   │   ├── applications.ts
│   │   ├── nominations.ts
│   │   └── users.ts
│   └── actions/           # Server actions for mutations
│       ├── applications.ts
│       └── nominations.ts
├── components/            # React components (to be migrated)
├── prisma/
│   └── schema.prisma     # Database schema
└── package.json
```

## Database Schema

The application manages three main entities:

- **Applications** - Senator applications from students
- **Nominations** - Nominations for senator candidates
- **Users** - System users with roles (Admin, Applicant, Standard)

## Setting up the development environment

### Prerequisites

1. [Node.js](https://nodejs.org/en) (v18 or higher)
   - To check if it's installed: `node -v`
   - To install: [mac/linux](https://github.com/nvm-sh/nvm) or [windows](https://github.com/coreybutler/nvm-windows)

2. [PostgreSQL](https://www.postgresql.org/download/) database
   - Local installation or cloud service (Supabase, Neon, etc.)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/b-at-neu/nomination-system.git
cd nomination-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your database connection strings and Supabase credentials:
```
DATABASE_URL="postgresql://user:password@host:port/database"
DIRECT_URL="postgresql://user:password@host:port/database"
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
```

To get your Supabase credentials:
- Create a project at [Supabase](https://supabase.com)
- Go to Project Settings > API
- Copy the Project URL and anon/public key
- Copy the service_role key (this is needed for user management - keep it secret!)

4. Generate Prisma client and run migrations:
```bash
npm run prisma:generate
npm run prisma:migrate
```

## Running the app

For development:
```bash
npm run dev
```

The application will be available at http://localhost:3000/

For production build:
```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations

## Key Features

- **Application Submission** - Students can submit their senator applications
- **Nomination System** - Constituents can nominate candidates
- **Admin Dashboard** - View and manage all applications and nominations (protected by authentication)
- **User Management** - Admin page to create and remove authentication accounts
  - Create new admin users with email and password
  - Delete existing users (cannot delete your own account)
  - View all registered users and their activity
- **Authentication** - Secure password-based login via Supabase Auth
  - Email and password authentication
  - Admin pages are protected and only accessible to logged-in users
  - Admin link only visible in navbar for authenticated users
- **Constituency Validation** - Ensures nominators and nominees are in the same constituency
- **Duplicate Prevention** - Prevents duplicate nominations and applications

## Authentication

The application uses Supabase Auth with email and password for authentication:

1. Users click "Login" in the navbar
2. They enter their email address and password
3. Once authenticated, users can access the Admin Dashboard and User Management
4. Admin users can create new accounts from the User Management page (`/admin/users`)

The admin page (`/admin`) is protected by middleware and requires authentication to access.

## Deployment

This Next.js application can be deployed to:
- [Vercel](https://vercel.com/) (recommended)
- [Netlify](https://www.netlify.com/)
- Any Node.js hosting platform
- Docker container

Make sure to set the following environment variables in your deployment platform:
- `DATABASE_URL` - PostgreSQL database connection string
- `DIRECT_URL` - Direct PostgreSQL connection string (for Prisma migrations)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (required for user management)

## Development Notes

- All data fetching uses React Server Components
- Form submissions use Next.js Server Actions
- No client-side API calls needed
- Prisma provides full type safety from database to UI
- Database migrations are managed through Prisma Migrate
