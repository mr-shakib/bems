# 🚀 BEMS Vercel Deployment Guide

Complete guide to deploy BEMS to Vercel.

## Prerequisites

- ✅ GitHub account
- ✅ Vercel account ([sign up free](https://vercel.com))
- ✅ Appwrite instance (cloud or self-hosted)
- ✅ Cloudinary account (for image uploads)

---

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mr-shakib/bems)

---

## Manual Deployment Steps

### 1. Push to GitHub

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Import to Vercel

1. Visit [vercel.com/new](https://vercel.com/new)
2. Click "Import Project"
3. Select your GitHub repository
4. Click "Import"

### 3. Configure Environment Variables

Go to your Vercel project → Settings → Environment Variables

Add all variables from `.env.example`:

#### App Configuration
```
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

#### Appwrite Configuration
```
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=your_project_id
NEXT_APPWRITE_KEY=your_api_key
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
NEXT_PUBLIC_APPWRITE_WORKSPACES_ID=your_workspaces_collection_id
NEXT_PUBLIC_APPWRITE_MEMBERS_ID=your_members_collection_id
NEXT_PUBLIC_APPWRITE_PROJECTS_ID=your_projects_collection_id
NEXT_PUBLIC_APPWRITE_TASKS_ID=your_tasks_collection_id
NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID=your_images_bucket_id
```

#### Cloudinary Configuration
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

**Important:**
- Select **Production, Preview, and Development** for each variable
- Do NOT include quotes around values
- Variable names are case-sensitive

### 4. Deploy

Click "Deploy" and wait for the build to complete (2-3 minutes).

---

## Post-Deployment Configuration

### Update Appwrite Settings

After deployment, update your Appwrite project:

1. Go to [Appwrite Console](https://cloud.appwrite.io)
2. Select your project
3. Navigate to **Settings** → **Platforms**
4. Add Web Platform:
   - **Name:** BEMS Production
   - **Hostname:** `your-app.vercel.app`
5. Update CORS settings to include your Vercel domain

### Test Your Deployment

- [ ] Visit your Vercel URL
- [ ] Test user registration
- [ ] Test user login
- [ ] Create a workspace
- [ ] Create a project
- [ ] Create tasks
- [ ] Upload images

---

## Custom Domain (Optional)

To add a custom domain:

1. Go to Vercel project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` environment variable
5. Add custom domain to Appwrite platforms

---

## Continuous Deployment

Vercel automatically deploys:
- **Production:** Every push to `main` branch
- **Preview:** Every pull request

---

## Troubleshooting

### Build Fails

**Check:**
- All environment variables are set correctly
- Build logs in Vercel dashboard
- Try building locally: `npm run build`

**Solution:**
```bash
# Clear cache and rebuild
npm run clean
npm install
npm run build
```

### Authentication Issues

**Check:**
- Appwrite endpoint is correct
- Vercel domain is added to Appwrite platforms
- API key has correct permissions

**Solution:**
1. Verify all Appwrite environment variables
2. Add Vercel URL to Appwrite platforms
3. Check Appwrite CORS settings

### CORS Errors

**Check:**
- Vercel domain matches exactly in Appwrite
- CORS configuration in `src/app/api/[[...route]]/route.ts`

**Solution:**
1. Add `*.vercel.app` to Appwrite CORS
2. Add your custom domain if using one
3. Clear browser cache

### Environment Variables Not Working

**Check:**
- Variables are added to all environments
- Variable names match exactly (case-sensitive)
- No extra spaces in values

**Solution:**
1. Re-add variables in Vercel
2. Redeploy after adding variables
3. Check for typos in variable names

---

## Rollback

If deployment fails:

1. Go to Vercel → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

---

## Monitoring

### Enable Vercel Analytics

1. Go to project settings
2. Navigate to "Analytics"
3. Enable analytics

### Check Logs

- **Build Logs:** Vercel → Deployments → Select deployment
- **Runtime Logs:** Vercel → Logs
- **Browser Console:** F12 → Console tab

---

## Performance Optimization

### Already Configured:
- ✅ Next.js 14 with App Router
- ✅ Automatic code splitting
- ✅ Image optimization
- ✅ Server-side rendering
- ✅ Static generation where possible

### Recommendations:
- Enable Vercel Speed Insights
- Monitor Core Web Vitals
- Use Vercel Image Optimization
- Enable caching headers

---

## Security Checklist

- [ ] All API keys are in environment variables
- [ ] `.env.local` is in `.gitignore`
- [ ] Appwrite CORS is properly configured
- [ ] Only necessary domains are whitelisted
- [ ] API keys have minimal required permissions

---

## Support

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Appwrite Docs:** [appwrite.io/docs](https://appwrite.io/docs)
- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)
- **Project Issues:** [GitHub Issues](https://github.com/mr-shakib/bems/issues)

---

**Ready to deploy!** 🚀

Built with ❤️ by [mr-shakib](https://github.com/mr-shakib)
