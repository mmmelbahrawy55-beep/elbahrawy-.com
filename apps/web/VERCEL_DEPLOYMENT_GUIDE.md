# Vercel Deployment Guide

This guide will help you deploy your project to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. A GitHub, GitLab, or Bitbucket account (to host your code)
3. A PostgreSQL database (we recommend using Vercel Postgres or Neon)

## Step 1: Push Your Code to Git

First, push your code to a Git repository (GitHub, GitLab, or Bitbucket).

## Step 2: Import Project to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Set the project name
4. For the framework, Vercel should automatically detect Next.js
5. For the root directory, select `apps/web`
6. Click "Deploy"

## Step 3: Add Environment Variables

After deployment, go to your project settings on Vercel:

1. Navigate to **Settings** → **Environment Variables**
2. Add the following environment variables:

### Required Variables:

```
DATABASE_URL=
DIRECT_URL=
```

### How to Get DATABASE_URL:

**Option 1: Use Vercel Postgres (Recommended)**
1. Go to **Storage** in your Vercel project
2. Click "Create Database"
3. Select "Postgres"
4. Follow the steps to create your database
5. Vercel will automatically add the `DATABASE_URL` and `DIRECT_URL` to your environment variables

**Option 2: Use Neon (Free Tier Available)**
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string and paste it as `DATABASE_URL`
4. Copy the direct connection string and paste it as `DIRECT_URL`

## Step 4: Run Database Migration

1. After adding the environment variables, go back to your project
2. Open the **Settings** → **Git** tab
3. Under "Ignored Build Step", add a command to run the migration:
   Or, better yet, add a post-install script to your package.json
4. Alternatively, you can run the migration manually using Vercel CLI:

```bash
npm i -g vercel
vercel link
vercel env pull .env.local
cd packages/database
npx prisma db push
npx prisma db seed
```

## Step 5: Redeploy Your Project

1. Push any changes to your Git repository
2. Vercel will automatically redeploy your project

## Step 6: Verify the Deployment

1. Open your deployed site from Vercel
2. Go to `/dashboard` and log in with:
   - Email: `admin@elbahrawy.com`
   - Password: `admin123`
3. Try making changes to the site content
4. Refresh the main page to verify the changes are reflected

## Local Development

For local development, you can use PostgreSQL locally or use SQLite by changing the `datasource db` in `packages/database/prisma/schema.prisma` back to SQLite.

## Troubleshooting

### Build Errors
- Make sure all dependencies are installed
- Check that your Node.js version matches the one in `package.json`
- Verify the environment variables are set correctly

### Database Issues
- Make sure your `DATABASE_URL` is correct and your database is accessible
- Run `npx prisma db push` to apply migrations
- Run `npx prisma db seed` to initialize the database with default data

## Support

For more help, check the [Vercel Documentation](https://vercel.com/docs) or the [Prisma Documentation](https://www.prisma.io/docs).
