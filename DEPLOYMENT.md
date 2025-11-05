# 🚀 Tantalize 2025 - Deployment Guide

## Quick Deploy to Vercel with Custom Domain

### Step 1: Deploy to Vercel

Run this command in your terminal:

```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No
- **What's your project's name?** → tantalize-2025
- **In which directory is your code located?** → ./
- **Want to override the settings?** → No

### Step 2: Add Your Custom Domain

After deployment, add your custom domain:

```bash
vercel domains add yourdomain.com
```

Or use the Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Select your project "tantalize-2025"
3. Go to **Settings** → **Domains**
4. Add your domain (e.g., `tantalize.lk` or `www.tantalize.lk`)

### Step 3: Configure DNS Records

Add these DNS records in your domain registrar (e.g., Namecheap, GoDaddy, Cloudflare):

**For root domain (tantalize.lk):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Alternative: Using Vercel Nameservers (Recommended)**
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

### Step 4: Production Deploy

```bash
vercel --prod
```

---

## Alternative: Deploy via GitHub (Continuous Deployment)

### Step 1: Connect GitHub to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repo: `Dulainmu/Tantalize`
4. Configure:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Click **Deploy**

### Step 2: Add Custom Domain

Same as above - go to Settings → Domains

### Step 3: Auto-deploy on Push

Every time you push to `main` branch, Vercel will automatically deploy! 🎉

---

## Environment Variables (if needed)

If you need to add any API keys or secrets:

```bash
vercel env add VARIABLE_NAME
```

Or in Vercel Dashboard: Settings → Environment Variables

---

## Performance Optimizations

Your site is already optimized with:
- ✅ Static page generation
- ✅ Image optimization ready
- ✅ Automatic code splitting
- ✅ Edge caching via Vercel CDN

---

## Custom Domain SSL

Vercel automatically provides free SSL certificates for all custom domains. No configuration needed!

---

## Monitoring & Analytics

Enable Vercel Analytics:
```bash
npm install @vercel/analytics
```

Then add to `src/app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';

// In your return statement:
<Analytics />
```

---

## Common Domains for Sri Lanka

- `.lk` - Sri Lanka
- `.com.lk` - Commercial
- `.org.lk` - Organizations
- `.edu.lk` - Educational

---

## Support Resources

- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Custom Domains: https://vercel.com/docs/concepts/projects/custom-domains

---

## Quick Commands Reference

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Add domain
vercel domains add tantalize.lk

# List domains
vercel domains ls

# View project details
vercel inspect

# View logs
vercel logs
```

---

**Your site will be live at:** `https://tantalize-2025.vercel.app` (and your custom domain once configured)

🎉 Good luck with Tantalize 2025!
