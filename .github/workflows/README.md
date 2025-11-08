# Auto Apply Migrations GitHub Action

This repository includes an automated GitHub Action that applies database migrations when code is pushed to the `main` or `dev` branches.

## How It Works

The workflow (`.github/workflows/migrate.yml`) automatically:
1. Triggers on pushes to `main` or `dev` branches
2. Selects the appropriate GitHub environment:
   - `production` for the `main` branch
   - `development` for the `dev` branch
3. Installs dependencies
4. Runs `prisma migrate deploy` to apply pending migrations

## Setup Instructions

### 1. Create GitHub Environments

You need to create two environments in your GitHub repository:

1. Go to your repository on GitHub
2. Click on **Settings** → **Environments**
3. Create two environments:
   - `production`
   - `development`

### 2. Configure Environment Secrets

For each environment (`production` and `development`), add the following secrets:

#### Required Secrets:
- `DATABASE_URL` - The PostgreSQL connection string for the database
  - Format: `postgresql://user:password@host:port/database`
- `DIRECT_URL` - The direct PostgreSQL connection string (required by Prisma)
  - Format: `postgresql://user:password@host:port/database`

**To add secrets:**
1. Go to **Settings** → **Environments**
2. Click on the environment name (e.g., `production`)
3. Click **Add Secret**
4. Enter the secret name and value
5. Click **Add secret**

### 3. Environment Protection Rules (Optional but Recommended)

For the `production` environment, consider adding protection rules:

1. Go to the `production` environment settings
2. Configure protection rules:
   - **Required reviewers**: Add users who must approve deployments
   - **Wait timer**: Add a delay before deployment
   - **Deployment branches**: Limit to `main` branch only

## Usage

The migration workflow runs automatically when you:
- Push commits to the `main` branch → applies migrations to **production**
- Push commits to the `dev` branch → applies migrations to **development**

You can monitor the workflow execution in the **Actions** tab of your repository.

## Migration Commands

For local development, use these commands:

```bash
# Create a new migration (development only)
npm run prisma:migrate

# or with yarn
yarn prisma:migrate

# Check migration status
npx prisma migrate status

# Apply migrations manually (if needed)
npx prisma migrate deploy
```

## Important Notes

- ⚠️ **Never commit database credentials** to your repository
- ✅ Always use GitHub environment secrets for sensitive data
- ✅ The workflow uses `prisma migrate deploy` which only applies pending migrations (safe for production)
- ✅ Failed migrations will cause the workflow to fail, preventing partial deployments
- 📝 Review migration files before pushing to ensure they're correct

## Troubleshooting

### Workflow fails with "Missing environment"
- Ensure both `production` and `development` environments are created in GitHub

### Workflow fails with "Missing required environment variable"
- Check that `DATABASE_URL` and `DIRECT_URL` secrets are set in the environment

### Migration fails to apply
- Check the workflow logs in the Actions tab
- Verify the migration files are valid
- Ensure the database is accessible from GitHub Actions runners

## Security Best Practices

1. **Use environment secrets** for all database credentials
2. **Enable environment protection rules** for production
3. **Limit branch access** to prevent unauthorized deployments
4. **Review migrations** before merging to main or dev branches
5. **Monitor workflow runs** to catch issues early
