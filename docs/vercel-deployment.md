# Vercel Deployment Guide

This guide provides instructions for deploying the Personal Command Center to Vercel, ensuring a flawless CI/CD pipeline and environment configuration.

## 1. Repository Sync

1.  **Push to GitHub:**
    - Initialize a git repository if you haven't: `git init`.
    - Commit your code: `git add . && git commit -m "initial commit"`.
    - Create a new repository on GitHub and push your code: `git push -u origin main`.
2.  **Import to Vercel:**
    - Log in to [Vercel](https://vercel.com/).
    - Click **Add New > Project**.
    - Import your GitHub repository.

## 2. Environment Configuration

Before clicking **Deploy**, you must configure the environment variables:
1.  Expand the **Environment Variables** section.
2.  Copy every key-value pair from your `.env.local` or `.env.example` file.
3.  Ensure all `NEXT_PUBLIC_FIREBASE_*` variables are present.
4.  Set the environment for these variables to `Production`, `Preview`, and `Development`.

## 3. Framework Settings

Vercel automatically detects Next.js projects. Confirm the following defaults:
- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Install Command:** `npm install`
- **Output Directory:** `.next`

## 4. CI/CD Pipeline

- **Production Deployments:** Every push to the `main` branch triggers a Production build and deployment.
- **Preview Deployments:** Pushes to any other branch (e.g., `feature/dashboard`) trigger a Preview deployment. This allows you to verify changes on a live URL before merging to `main`.
- **Instant Rollbacks:** If a deployment fails or introduces a bug, Vercel allows you to roll back to any previous successful deployment with one click.

## 5. Zero-Error Policy (Troubleshooting)

The project is configured with strict TypeScript and ESLint rules. **Vercel will block your deployment if:**

1.  **TypeScript Errors:** Any use of `any` types (unless explicitly allowed in `tsconfig`) or type mismatches will cause `npm run build` to fail.
2.  **ESLint Warnings:** The build process is configured to treat ESLint warnings as errors. Ensure `npm run lint` passes locally before pushing.

### Common Build Failures

| Error | Solution |
| :--- | :--- |
| `Type 'any' is not assignable...` | Define a proper Interface in `src/types/index.ts` and apply it. |
| `Module not found: Can't resolve 'lucide-react'` | Ensure the package is in `package.json` and run `npm install`. |
| `Firebase: Error (auth/invalid-api-key)` | Check that `NEXT_PUBLIC_FIREBASE_API_KEY` is correctly set in the Vercel dashboard. |

To verify deployment readiness locally, always run:
```bash
npm run build
```
If this command passes without error, your Vercel deployment will succeed.
