# 🏠 ZephyrAI IDX

<div align="center">

![ZephyrAI IDX Banner](https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=400&fit=crop&q=80)

<br/>

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/zephyr_ai_idx)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![SparkAPI](https://img.shields.io/badge/SparkAPI-FBS-ff4444?style=for-the-badge)](https://sparkplatform.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

### A beautiful, Realtor.com-inspired IDX property search portal
### powered by SparkAPI (FBS) + Next.js + Tailwind CSS

[🚀 Live Demo](#) · [🐛 Report Bug](../../issues) · [✨ Request Feature](../../issues)

</div>

---

## ✨ What Is This?

**ZephyrAI IDX** is a full-featured, production-ready real estate search portal that looks and feels just like Realtor.com — but it's **yours**. It connects directly to live MLS data via [SparkAPI by FBS](https://sparkplatform.com/) and auto-falls back to polished demo listings while you're getting set up.

🔍 Search any city, zip, or address
🏡 Filter by price, beds, baths, home type
🗺️ List view, split view, and map view
💾 Save favorite listings
📱 Fully mobile responsive
⚡ Blazing fast with Next.js 14

---

## 📸 Screenshots

<div align="center">

| List View | Map View | Split View |
|-----------|----------|------------|
| ![List View](https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop&q=80) | ![Map View](https://images.unsplash.com/photo-1524813686514-a57563d77965?w=400&h=250&fit=crop&q=80) | ![Split View](https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop&q=80) |

</div>

---

## 🗂️ Project Structure

zephyr_ai_idx/
├── 📁 app/
│   ├── 📁 api/listings/
│   │   └── 📄 route.js          ← API endpoint
│   ├── 📄 globals.css           ← Global styles
│   ├── 📄 layout.js             ← Root layout + metadata
│   └── 📄 page.js               ← Home page
├── 📁 components/
│   ├── 📄 FilterBar.js          ← Price/Beds/Baths/Type filters
│   ├── 📄 Header.js             ← Top nav bar
│   ├── 📄 ListingCard.js        ← Individual property card
│   ├── 📄 ListingsGrid.js       ← Grid + pagination
│   ├── 📄 MapView.js            ← Map with price pins
│   ├── 📄 SearchBar.js          ← Search input + suggestions
│   ├── 📄 SearchPage.js         ← Main page orchestrator
│   └── 📄 SkeletonCard.js       ← Loading skeleton
├── 📁 lib/
│   └── 📄 sparkApi.js           ← SparkAPI integration ⭐
├── 📄 .env.example              ← Environment variable template
├── 📄 next.config.js
├── 📄 package.json
├── 📄 postcss.config.js
└── 📄 tailwind.config.js

---

## 🔑 The Most Important Part — Your API Keys

> 💡 **This is the step most people miss. Read this carefully and you'll be live in minutes!**

### Where do the keys go?

Your SparkAPI credentials live in **environment variables**. Think of them as secret passwords that your app reads automatically — they **never** get committed to GitHub (they're in `.gitignore`).

You have **two ways** to set them:

---

### 🟢 Option A — Setting Keys DURING Vercel Deployment (Recommended for first deploy)

This is the easiest way. When you import your project into Vercel, there's a screen that looks like this **before** you hit the Deploy button:

┌─────────────────────────────────────────────────────────┐
│                                                         │
│   Configure Project                                     │
│   ─────────────────────────────────────────────        │
│                                                         │
│   Framework Preset:  [ Next.js ▾ ]                      │
│                                                         │
│   Root Directory:    ./                                 │
│                                                         │
│   ▼ Environment Variables          ← CLICK THIS         │
│   ┌──────────────────┬───────────────────────────┐     │
│   │ NAME             │ VALUE                     │     │
│   ├──────────────────┼───────────────────────────┤     │
│   │ SPARK_API_KEY    │ paste your key here  ✏️   │     │
│   ├──────────────────┼───────────────────────────┤     │
│   │ SPARK_API_SECRET │ paste your secret here ✏️ │     │
│   ├──────────────────┼───────────────────────────┤     │
│   │ SPARK_API_ENDPOINT│ https://replication...  ✏️│     │
│   └──────────────────┴───────────────────────────┘     │
│                           [+ Add Another]               │
│                                                         │
│                              [ Deploy ] ← THEN THIS     │
│                                                         │
└─────────────────────────────────────────────────────────┘

**Step by step:**

**1.** Go to [vercel.com/new](https://vercel.com/new) and import your `zephyr_ai_idx` repo

**2.** On the configuration screen, scroll down and click **▼ Environment Variables**

**3.** Add the first variable:

NAME  →  SPARK_API_KEY
VALUE →  (paste your SparkAPI key here)

Click **Add**

**4.** Add the second variable:

NAME  →  SPARK_API_SECRET
VALUE →  (paste your SparkAPI secret here)

Click **Add**

**5.** Add the third variable:

NAME  →  SPARK_API_ENDPOINT
VALUE →  https://replication.sparkapi.com

Click **Add**

**6.** Click **Deploy** 🚀

---

### 🔵 Option B — Setting Keys AFTER Deployment (Updating existing project)

Already deployed but need to update your keys? No problem:

**1.** Go to your project dashboard on [vercel.com](https://vercel.com)

**2.** Click **Settings** (in the top tab bar)

**3.** Click **Environment Variables** (in the left sidebar)

┌─────────────────────────────────────────────────────────┐
│  Project Settings                                       │
│                                                         │
│  General          │                                     │
│  Domains          │  Environment Variables              │
│  Environment ◄────│  ─────────────────────────         │
│  Variables        │                                     │
│  Integrations     │  Key              Value             │
│  Git              │  ─────────────── ──────────────     │
│  Security         │  SPARK_API_KEY   ••••••••••• ✏️    │
│                   │  SPARK_API_SECRET ••••••••••• ✏️   │
│                   │  SPARK_API_ENDPOINT https://... ✏️  │
│                   │                                     │
│                   │          [+ Add New]                │
└─────────────────────────────────────────────────────────┘

**4.** Click **+ Add New** and enter each variable

**5.** After saving, go to **Deployments** tab → click the **⋯ menu** on the latest deploy → **Redeploy**

---

### 🏠 Local Development Keys

For running on your own computer, create a file called `.env.local` in the root of the project:

> ⚠️ Never commit this file! It's already in `.gitignore` so you're safe.

```bash
# .env.local
# Copy this and fill in your real values

SPARK_API_KEY=your_actual_key_goes_here
SPARK_API_SECRET=your_actual_secret_goes_here
SPARK_API_ENDPOINT=https://replication.sparkapi.com

Then run:

npm run dev

🌐 SparkAPI Endpoint Reference
Environment	Endpoint URL	When to Use
🧪 Sandbox	https://sparkplatform.com/api/v1	Testing & development
🏠 Replication	https://replication.sparkapi.com	Live MLS data
🔴 Production	https://api.sparkapi.com	Direct live feed
Start with Sandbox → test everything → switch to Replication for production.

🚀 Full Deployment Guide
Prerequisites
✅ GitHub account
✅ Vercel account (free tier works!)
✅ SparkAPI developer account (register here)
Step 1 — Get Your SparkAPI Credentials

1. Visit → https://sparkplatform.com/register
2. Create a free developer/sandbox account
3. Check your email for approval (can take 24-48hrs)
4. Log in → Dashboard → API Keys
5. Copy your:
      API Key    → looks like: 20e0c88d-xxxx-xxxx-xxxx-xxxxxxxxxxxx
      API Secret → looks like: a1b2c3d4e5f6g7h8i9j0...

Step 2 — Fork & Deploy

1. Fork this repo to your GitHub account
2. Go to vercel.com/new
3. Import zephyr_ai_idx
4. ⭐ ADD YOUR ENV VARIABLES (see section above!)
5. Click Deploy
6. Wait ~2 minutes
7. Visit your live URL 🎉

Step 3 — Watch It Go Live

Building... ████████████████████ 100%

✓ Compiled successfully
✓ Environment variables loaded
✓ SparkAPI connection tested
✓ 12 demo listings ready

🌐 Your site is live at:
   https://zephyr-ai-idx.vercel.app

🎛️ All Environment Variables
Variable	Required	Description	Example
SPARK_API_KEY	✅ Yes	Your SparkAPI API key	20e0c88d-xxxx...
SPARK_API_SECRET	✅ Yes	Your SparkAPI secret	a1b2c3d4e5...
SPARK_API_ENDPOINT	✅ Yes	SparkAPI base URL	https://replication.sparkapi.com
🛡️ No API key? No problem! The app automatically shows 12 beautiful demo listings until your SparkAPI account is approved. Zero blank screens.

🧰 Tech Stack
Technology	Version	Purpose
Next.js	14.2	React framework + routing
React	18	UI library
Tailwind CSS	3.3	Utility-first styling
Axios	1.6	HTTP requests to SparkAPI
Lucide React	0.378	Beautiful icons
SparkAPI / FBS	v1 / RESO	Live MLS data

╔═══════════════════════════════════════════════╗
║              ZephyrAI IDX Features            ║
╠═══════════════════════════════════════════════╣
║  🔍  Smart search with autocomplete           ║
║  💰  Price range filter (min/max)             ║
║  🛏️  Bedroom filter (1+ through 5+)           ║
║  🚿  Bathroom filter (1+ through 4+)          ║
║  🏠  Property type filter                     ║
║  ↕️  Sort by price, date, size                ║
║  📋  List view — scrollable card grid         ║
║  🗺️  Map view — clickable price pins          ║
║  ⚡  Split view — cards + map side by side    ║
║  ❤️  Save/unsave favorite listings            ║
║  📄  Pagination (20 per page)                 ║
║  💀  Skeleton loading states                  ║
║  📱  Mobile responsive                        ║
║  🔄  Auto fallback to demo data               ║
╚═══════════════════════════════════════════════╝

🐛 Troubleshooting
<details> <summary>🔴 <strong>Site shows demo listings instead of real MLS data</strong></summary> <br/>
This means SparkAPI isn't connecting. Check:

Your SPARK_API_KEY is set in Vercel environment variables
Your SPARK_API_ENDPOINT matches your account type (sandbox vs replication)
Your SparkAPI account has been approved
You redeployed after adding the variables

# To verify in Vercel logs, check for:
[ZephyrAI IDX] SparkAPI error: ...

</details> <details> <summary>🟡 <strong>Build fails on Vercel</strong></summary> <br/>

Make sure all files are committed to GitHub
Check that package.json is in the root directory
Verify the framework is set to Next.js in Vercel settings
Check the build logs for specific errors
</details> <details> <summary>🟡 <strong>Environment variables not working locally</strong></summary> <br/>
Make sure your local file is named exactly .env.local (with the dot, no spaces):

# ✅ Correct
.env.local

# ❌ Wrong
env.local
.env
env_local.txt

After creating or editing .env.local, restart your dev server:

</details> <details> <summary>🔵 <strong>Images not loading</strong></summary> <br/>
This is a Next.js image domain configuration issue. Open next.config.js and verify:

images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**',  // ← This allows all domains
    },
  ],
},

</details>

🔐 Security Notes

✅ API keys are stored as environment variables — never in code
✅ .env.local is gitignored — never committed to GitHub
✅ Vercel encrypts all environment variables at rest
✅ API requests happen server-side — keys never exposed to browser
⚠️ Never paste your API key directly into any .js file
⚠️ Never share your .env.local file

📝 License

MIT License — do whatever you want with this.
Just don't blame us if you sell too many houses. 🏡

🙌 Contributing
Pull requests are welcome! For major changes, please open an issue first.

# Fork the repo
git clone https://github.com/YOUR_USERNAME/zephyr_ai_idx.git
cd zephyr_ai_idx

# Install dependencies
npm install

# Create your env file
cp .env.example .env.local
# Then edit .env.local with your keys

# Start dev server
npm run dev

<div align="center">
Made with ❤️ and way too much coffee
ZephyrAI IDX — Because finding your dream home should feel like a breeze.

Deploy with Vercel

<br/>
⭐ Star this repo if it helped you! ⭐

</div> ```
Click Commit changes

What's In This README

Section	What it does
🎨 Badges + Banner	Looks professional instantly
🔑 ASCII diagram of Vercel UI	Shows exactly where to paste keys
🟢 Option A	Keys during first deploy (most common)
🔵 Option B	Keys after deploy (for updates)
🏠 Local dev keys	.env.local instructions
📊 Endpoint table	Sandbox vs live URLs
🐛 Troubleshooting dropdowns	Self-service fixes
🔐 Security notes	Best practices reminder
One thing to update: Replace YOUR_USERNAME with your actual GitHub username in the two deploy button links at the top and bottom of the README
