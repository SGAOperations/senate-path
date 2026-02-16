# Prisma v7 Migration Guide

## Overview

This document describes the migration from Prisma v6.18.0 to Prisma v7.4.0 completed on February 16, 2026.

## What Changed

### 1. Package Updates

**Updated Packages:**
- `prisma`: `^6.18.0` → `^7.4.0`
- `@prisma/client`: `^6.18.0` → `^7.4.0`

**New Dependencies:**
- `@prisma/adapter-pg`: `^7.4.0` (PostgreSQL driver adapter)
- `pg`: `^8.18.0` (PostgreSQL driver)
- `@types/pg`: `^8.16.0` (TypeScript types for pg)

### 2. Schema Changes

**File: `prisma/schema.prisma`**

Removed datasource URL configuration from schema (moved to `prisma.config.ts`):

```diff
datasource db {
  provider = "postgresql"
-  url       = env("DATABASE_URL")
-  directUrl = env("DIRECT_URL")
}
```

### 3. Configuration Changes

**File: `prisma.config.ts`**

Removed unsupported properties for Prisma v7:

```diff
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
-  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
-    directUrl: env("DIRECT_URL"),
  },
});
```

### 4. Client Initialization Changes

**File: `lib/db.ts`**

Updated to use the driver adapter pattern required by Prisma v7:

```typescript
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Create PostgreSQL connection pool
const pool = globalForPrisma.pgPool ?? new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Create Prisma Client with adapter
export const db = new PrismaClient({ adapter });
```

### 5. TypeScript Configuration

**File: `tsconfig.json`**

Updated target to ES2020 for better compatibility with Prisma v7:

```diff
{
  "compilerOptions": {
-    "target": "ES2017",
+    "target": "ES2020",
    ...
  }
}
```

## Breaking Changes in Prisma v7

1. **Adapter Required**: PrismaClient now requires either an `adapter` (for direct database connection) or `accelerateUrl` (for Prisma Accelerate).

2. **Schema URL Removed**: Database connection URLs can no longer be defined in `schema.prisma`. They must be configured in `prisma.config.ts` and passed to the client via the adapter.

3. **DirectUrl Removed**: The `directUrl` property is no longer supported in datasource configuration.

4. **Engine Property Removed**: The `engine` configuration option is no longer supported in `prisma.config.ts`.

## Migration Steps Performed

1. ✅ Updated `package.json` with Prisma v7 packages
2. ✅ Installed `@prisma/adapter-pg` and `pg` driver
3. ✅ Removed `url` and `directUrl` from `prisma/schema.prisma`
4. ✅ Updated `prisma.config.ts` to remove unsupported properties
5. ✅ Updated `lib/db.ts` to use driver adapter pattern
6. ✅ Updated `tsconfig.json` target to ES2020
7. ✅ Generated Prisma Client v7.4.0
8. ✅ Deployed existing migrations to test database
9. ✅ Verified all CRUD operations work correctly
10. ✅ Verified TypeScript compilation succeeds

## Testing Performed

### Database Connection Test
- ✅ Connection pool creation
- ✅ Prisma adapter initialization
- ✅ PrismaClient instantiation

### CRUD Operations Test
- ✅ CREATE: Created test application and nomination
- ✅ READ: Retrieved records by unique key
- ✅ UPDATE: Modified application data
- ✅ DELETE: Removed test data
- ✅ Relations: Queried with related data

### Build Test
- ✅ TypeScript compilation successful
- ✅ Next.js compilation successful
- ⚠️ Build requires database connection (existing behavior)

## Compatibility

All existing functionality is preserved:
- All Prisma queries work identically
- All database models remain unchanged
- All migrations are compatible
- No changes required to existing queries or mutations

## Notes

- The migration is fully backward compatible with the existing database schema
- No data migration was required
- All existing migrations applied successfully with Prisma v7
- The adapter pattern is the recommended way to use Prisma v7 with traditional databases

## References

- [Prisma v7 Release Notes](https://github.com/prisma/prisma/releases/tag/7.4.0)
- [Prisma Driver Adapters Documentation](https://www.prisma.io/docs/orm/overview/databases/database-drivers)
- [@prisma/adapter-pg Package](https://www.npmjs.com/package/@prisma/adapter-pg)
