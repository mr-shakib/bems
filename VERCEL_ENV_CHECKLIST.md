# Vercel Environment Variables Checklist

## Critical Configuration Steps

### ⚠️ IMPORTANT: Variable Format
When adding environment variables to Vercel, make sure:
- Remove quotes around values (Vercel adds them automatically)
- Use exact variable names (case-sensitive)
- **DO NOT include comments** (no `#` lines)

---

## Required Environment Variables for Production

Copy these **EXACT** variable names and values to Vercel Dashboard → Settings → Environment Variables:

### App Configuration
```
NEXT_PUBLIC_APP_URL
https://bems.space
```
**⚠️ CRITICAL:** Must be `https://bems.space` (NOT `http://localhost:3000`)

---

### Appwrite Configuration
```
NEXT_PUBLIC_APPWRITE_ENDPOINT
https://fra.cloud.appwrite.io/v1
```

```
NEXT_PUBLIC_APPWRITE_PROJECT
68a35934000d7fdba65d
```

```
NEXT_PUBLIC_APPWRITE_DATABASE_ID
68a35a0c003c1920a347
```

```
NEXT_PUBLIC_APPWRITE_WORKSPACES_ID
68a35a81002b38fabbf3
```

```
NEXT_PUBLIC_APPWRITE_PROJECTS_ID
68a35a2f00155fd39254
```

```
NEXT_PUBLIC_APPWRITE_MEMBERS_ID
68a35a71000b6cff830f
```

```
NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID
68a35c5d0009e6c6f5a2
```

```
NEXT_PUBLIC_APPWRITE_TASKS_ID
68a9fdee00116a96e475
```

---

### Appwrite Server Key (Secret)
```
NEXT_APPWRITE_KEY
standard_4bd2027b1a4d39824281322720ef4a833239106cbd3621a72ba1f95f875aada48a5fdaf636fa285f2db3ac6648253c93664e3a8e53b7c8ac9f348a0dc4ef97cc66f4e1c756fd3f1e9f0d301ded4ad2fd2eaaac9fbe1f736ec5a6b98758506a67ae6b11b1e66b01b76450f1b735120219c5fd06483dd0f221178e656e11595369
```

---

### Cloudinary Configuration
```
CLOUDINARY_CLOUD_NAME
dgn2nezo7
```

```
CLOUDINARY_API_KEY
154781953695782
```

```
CLOUDINARY_API_SECRET
le5wq695ykNC3sA61IPpjqlqDb4
```

```
CLOUDINARY_UPLOAD_PRESET
bems_profile_pictures
```

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
dgn2nezo7
```

```
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
bems_profile_pictures
```

---

## How to Add Variables to Vercel

1. Go to: https://vercel.com/mr-shakib/bems/settings/environment-variables
2. For each variable above:
   - Click "Add New"
   - Enter the variable name (e.g., `NEXT_PUBLIC_APP_URL`)
   - Enter the value (e.g., `https://bems.space`)
   - Select Environment: **Production, Preview, and Development** (all three)
   - Click "Save"
3. After adding ALL variables, click "Redeploy" button

---

## Common 503 Error Causes

### 1. Wrong APP_URL
❌ **Wrong:** `NEXT_PUBLIC_APP_URL=http://localhost:3000`  
✅ **Correct:** `NEXT_PUBLIC_APP_URL=https://bems.space`

### 2. Missing Variables
Make sure you have **ALL 16 variables** listed above.

### 3. Typos in Variable Names
- Variable names are **case-sensitive**
- Must start with `NEXT_PUBLIC_` for client-side access
- Check for extra spaces or typos

### 4. Didn't Redeploy After Adding Variables
- Environment variables are only loaded during build
- You **MUST** redeploy after adding/changing variables
- Go to Deployments → Click "..." → "Redeploy"

---

## Verification Steps

After adding all variables and redeploying:

1. Check build logs for environment variable errors
2. Visit https://bems.space
3. Check browser console (F12) for errors
4. Verify you can sign in/sign up

---

## Troubleshooting 503 Errors

If you still get 503 after adding all variables:

### Check Vercel Function Logs
1. Go to: https://vercel.com/mr-shakib/bems/logs
2. Look for runtime errors
3. Common issues:
   - Appwrite connection failures
   - Missing API keys
   - CORS errors

### Check Appwrite Configuration
1. Go to your Appwrite Console
2. Navigate to your project
3. Check "Platforms" → Add web platform
4. Add these domains:
   - `https://bems.space`
   - `https://*.vercel.app` (for preview deployments)

### Check Build Output
Look for these in build logs:
- ✅ "Creating optimized production build"
- ✅ "Compiled successfully"
- ✅ "Build successful"
- ❌ Any error messages about missing variables

---

## Quick Fix Commands

If variables are correct but still getting errors:

1. **Clear Vercel Cache:**
   - Go to Settings → General
   - Scroll to "Build & Development Settings"
   - Click "Clear Build Cache"
   - Redeploy

2. **Force Fresh Deploy:**
   - Make a small change to any file
   - Commit and push
   - Vercel will deploy with fresh environment

---

## Need Help?

If you're still stuck, provide:
1. Screenshot of your Vercel environment variables (hide the APPWRITE_KEY value)
2. Build logs from the latest deployment
3. Runtime logs from Vercel Functions
4. Any error messages in browser console
