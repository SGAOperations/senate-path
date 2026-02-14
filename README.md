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

2. [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for local database)
   - Required for running the local PostgreSQL database
   - To check if it's installed: `docker --version`

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

The `.env.example` file comes pre-configured with local database settings. For local development, you can use these defaults as-is.

For production or if you want to use a different database:
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

## Local Development Database

This project uses Docker to run a local PostgreSQL database for development. This allows you to test database schema changes locally before deploying to production.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) must be installed and running
- Ensure port 5432 is available on your machine

### Initial Setup

1. Make sure you have copied `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

The default local database connection is already configured in `.env.example`:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/senate_path_dev?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/senate_path_dev?schema=public"
```

2. Start the local PostgreSQL database:
```bash
npm run db:start
```

3. Run Prisma migrations to create the database schema:
```bash
npm run prisma:migrate
```

You're now ready to develop! The local database will persist data between restarts.

### Common Commands

| Command | Description |
|---------|-------------|
| `npm run db:start` | Start the Docker PostgreSQL container in the background |
| `npm run db:stop` | Stop the Docker container (data is preserved) |
| `npm run db:reset` | Stop container, remove all data, start fresh, and run migrations |
| `npm run prisma:migrate` | Create and apply a new Prisma migration (will prompt for migration name) |
| `npm run prisma:studio` | Open Prisma Studio to visually browse and edit your local database |
| `npm run prisma:generate` | Regenerate Prisma client after schema changes |

### Development Workflow

1. Create a new branch for your work:
```bash
git checkout -b 123-add-new-feature
```

2. Start the local database (if not already running):
```bash
npm run db:start
```

3. Make changes to your Prisma schema in `prisma/schema.prisma`

4. Create and apply the migration:
```bash
npm run prisma:migrate
```
Prisma will prompt you for a migration name (e.g., "add_user_role_field")

5. Test your changes locally using Prisma Studio or your application:
```bash
npm run prisma:studio  # Visual database browser
npm run dev            # Start Next.js dev server
```

6. Commit both your schema changes AND the migration files:
```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "#123 add new feature"
git push
```

### Troubleshooting

**Port 5432 already in use**
- Check if PostgreSQL is already running locally: `sudo lsof -i :5432` (Mac/Linux) or check Task Manager (Windows)
- Stop the existing PostgreSQL service or change the port in `docker-compose.yml`

**Container won't start**
- Make sure Docker Desktop is running
- Check Docker logs: `docker logs senate-path-db`
- Try removing the container: `docker compose down -v` then `npm run db:start`

**Database connection errors**
- Verify the container is running: `docker ps`
- Check your `.env.local` file has the correct `DATABASE_URL`
- Try restarting the container: `npm run db:stop && npm run db:start`

**Need to start fresh**
- Use `npm run db:reset` to completely reset your local database
- This will delete all data and re-run migrations

**Migration conflicts**
- If you have uncommitted migrations, you may need to reset: `npm run db:reset`
- Delete problematic migration folders from `prisma/migrations/` and re-create them
- For production conflicts, coordinate with your team before resetting

### Database Deployment Notes

- **Local database** is completely separate from production/staging databases
- **Migration files** in `prisma/migrations/` are version controlled and committed to git
- **Vercel deployment** automatically runs migrations when code is merged to `dev` or `main` branches
- **Production database** (Supabase) is updated through the Vercel deployment process
- You can safely reset your local database anytime without affecting production

### Old Setup Instructions (PostgreSQL without Docker)

If you prefer to use a cloud-hosted database or local PostgreSQL installation instead of Docker:

1. [PostgreSQL](https://www.postgresql.org/download/) database
   - Local installation or cloud service (Supabase, Neon, etc.)

2. Update your `.env.local` with your database credentials:
```
DATABASE_URL="postgresql://user:password@host:port/database"
DIRECT_URL="postgresql://user:password@host:port/database"
```

3. Generate Prisma client and run migrations:
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

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Database Management
- `npm run db:start` - Start local Docker PostgreSQL container
- `npm run db:stop` - Stop local Docker container
- `npm run db:reset` - Reset local database (removes all data and re-runs migrations)

### Prisma
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Create and apply database migrations
- `npm run prisma:studio` - Open Prisma Studio for database inspection

## Key Features

- **Application Submission** - Students can submit their senator applications
- **Nomination System** - Constituents can nominate candidates
- **Admin Dashboard** - View and manage all applications and nominations (protected by authentication)
- **Nomination Approval System** - Admins can review and approve/reject nominations
  - Dedicated nominations management page at `/admin/nominations`
  - Filter nominations by status (Pending, Approved, Rejected) or by specific nominee
  - Search across all nomination fields (nominee, nominator, email, college, major)
  - Sort nominations by date, nominee name, or status
  - Bulk approve or reject multiple nominations at once
  - View statistics: total, pending, approved, rejected nominations and unique nominees
  - New nominations are created with PENDING status and require admin approval
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
