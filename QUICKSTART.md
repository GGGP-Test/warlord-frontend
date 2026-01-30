# WARLORD Frontend - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Clone and Install

```bash
git clone https://github.com/GGGP-Test/warlord-frontend.git
cd warlord-frontend
npm install
```

### Step 2: Set Up Firebase

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Name it "warlord-dev" or similar
   - Enable Google Analytics (optional)

2. **Enable Firestore**
   - In Firebase Console: Build → Firestore Database
   - Click "Create database"
   - Start in **test mode** (we'll add rules later)
   - Choose location (us-central1 recommended)

3. **Get Firebase Config**
   - Project Settings → General
   - Under "Your apps" → Add app → Web
   - Copy the config object

### Step 3: Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=warlord-dev.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=warlord-dev
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=warlord-dev.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:...
```

### Step 4: Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### Step 5: Initialize Firebase Functions

```bash
firebase init functions
# Choose:
# - Use existing project: warlord-dev
# - Language: TypeScript
# - ESLint: Yes
# - Install dependencies: Yes
```

### Step 6: Run Development Server

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Cloud Functions:**
```bash
cd functions
npm run serve
```

### Step 7: Test the Flow

1. Open [http://localhost:3000](http://localhost:3000)
2. Enter a business email (not Gmail/Yahoo)
3. Check Firebase Console → Firestore to see user document created
4. For now, magic link won't work (SendGrid not configured)

---

## 🔧 Optional: Full Setup

### SendGrid (for magic links)

1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create API key: Settings → API Keys
3. Add to `.env.local`:
   ```env
   SENDGRID_API_KEY=SG.xxx
   SENDGRID_FROM_EMAIL=noreply@yourdomain.com
   ```

### Google Custom Search (FREE tier)

1. Get API key: [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Custom Search API
3. Create search engine: [Programmable Search Engine](https://programmablesearchengine.google.com/)
4. Add to `.env.local`:
   ```env
   GOOGLE_CUSTOM_SEARCH_API_KEY=AIza...
   GOOGLE_CUSTOM_SEARCH_ENGINE_ID=abc123...
   ```

### Apify (web scraping)

1. Sign up at [Apify](https://apify.com/)
2. Get API token: Settings → Integrations
3. Add to `.env.local`:
   ```env
   APIFY_API_TOKEN=apify_api_...
   ```

### OpenAI GPT-4 (AI extraction)

1. Get API key: [OpenAI Platform](https://platform.openai.com/)
2. Add to `.env.local`:
   ```env
   OPENAI_API_KEY=sk-...
   ```

---

## 📊 CASCADE Test Scenarios

### Test Email Validation CASCADE

```bash
# FREE tier (should pass)
curl -X POST http://localhost:5001/warlord-dev/us-central1/submitEmail \
  -H "Content-Type: application/json" \
  -d '{"email":"test@acme-manufacturing.com"}'

# FREE tier (should fail - consumer email)
curl -X POST http://localhost:5001/warlord-dev/us-central1/submitEmail \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com"}'
```

### Check Cost Logs

```javascript
// In Firebase Console → Firestore
// Navigate to: cost_tracking/email_validation/logs
// You'll see:
{
  method: 'FREE',
  status: 'PASS',
  cost: 0,
  timeMs: 45,
  timestamp: ...
}
```

---

## 🛠️ Troubleshooting

### "Firebase not initialized"

- Check `.env.local` has all Firebase config
- Restart dev server after adding env vars

### "Function not found"

- Make sure `firebase serve` is running
- Check functions are exported in `functions/src/index.ts`

### "CORS error"

- Add your localhost to Firebase Auth allowed domains:
  - Firebase Console → Authentication → Settings → Authorized domains
  - Add `localhost`

### "Module not found"

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

cd functions
rm -rf node_modules package-lock.json
npm install
```

---

## 🚀 Deploy to Production

### Deploy Functions

```bash
firebase deploy --only functions
```

### Deploy Frontend (Vercel)

```bash
npm install -g vercel
vercel
# Follow prompts, add environment variables
```

### Update Firestore Rules

```bash
firebase deploy --only firestore:rules
```

---

## 📚 Next Steps

1. **Test email flow** (requires SendGrid)
2. **Test domain verification** (requires Google Search + Apify + OpenAI)
3. **Monitor costs** in Firestore cost_tracking collection
4. **Build Phase 2** - Onboarding AI (Bundle 5)

---

## 💬 Need Help?

Check:
- [README.md](./README.md) - Full documentation
- [Architecture Docs](https://github.com/GGGP-Test/warlord-backend/tree/main/docs)
- [COST-OPTIMIZATION-CASCADE.md](https://github.com/GGGP-Test/warlord-backend/blob/main/docs/COST-OPTIMIZATION-CASCADE.md)
