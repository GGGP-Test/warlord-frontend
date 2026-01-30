# WARLORD Frontend

**Supplier Intelligence Platform - Pre-Onboarding AI (Bundle 4)**

Next.js 14 frontend + Firebase Cloud Functions backend implementing AI-powered supplier verification with cost-optimized CASCADE strategy.

## Architecture

See [warlord-backend/docs](https://github.com/GGGP-Test/warlord-backend/tree/main/docs) for complete architecture:
- [ONBOARDING-ARCHITECTURE.md](https://github.com/GGGP-Test/warlord-backend/blob/main/docs/ONBOARDING-ARCHITECTURE.md) - 3-phase onboarding journey
- [COST-OPTIMIZATION-CASCADE.md](https://github.com/GGGP-Test/warlord-backend/blob/main/docs/COST-OPTIMIZATION-CASCADE.md) - 85% cost reduction strategy
- [Bundle-4-PreOnboarding-AI.md](https://github.com/GGGP-Test/warlord-backend/blob/main/docs/Bundle-4-PreOnboarding-AI.md) - Detailed specification

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Auth**: Firebase Auth
- **Database**: Firestore

### Backend (Cloud Functions)
- **Runtime**: Node.js 20
- **Language**: TypeScript
- **Email**: SendGrid
- **Scraping**: Apify
- **AI**: OpenAI GPT-4
- **Search**: Google Custom Search API

## CASCADE Cost Optimization

**Every automation follows FREE → CHEAP → EXPENSIVE strategy:**

### Email Verification
1. ✅ **FREE**: DNS MX check (blocks 40%, $0)
2. ✅ **CHEAP**: SMTP handshake (blocks 50% more, $0.0001)
3. ✅ **EXPENSIVE**: SendGrid magic link ($0.001)

**Result**: 75% cost savings vs sending email to every submission

### Domain Verification
1. ✅ **FREE**: Google Custom Search (100/day free, $0)
2. ✅ **CHEAP**: Apify web scraper ($0.05)
3. ✅ **EXPENSIVE**: GPT-4 extraction ($0.20)

**Result**: 80% cost savings vs using GPT-4 for everything

## Project Structure

```
warlord-frontend/
├── app/                    # Next.js 14 App Router
│   ├── page.tsx           # Landing page
│   ├── verify-email/      # Email verification
│   ├── verifying/         # Domain verification
│   └── choose-path/       # AI vs Founder decision
├── components/
│   ├── EmailForm.tsx      # Business email capture
│   ├── CompanyProfile.tsx # Display extracted data
│   └── LoadingSpinner.tsx # Progress animation
├── lib/
│   ├── firebase.ts        # Firebase config
│   ├── validation.ts     # Email/domain validation
│   ├── api.ts            # API client
│   └── types.ts          # TypeScript types
├── functions/             # Firebase Cloud Functions
│   ├── src/
│   │   ├── submitEmail.ts     # Email verification
│   │   ├── verifyEmail.ts     # Token validation
│   │   ├── verifyDomain.ts    # Domain verification
│   │   ├── getCompanyProfile.ts
│   │   └── utils/
│   │       ├── emailValidation.ts
│   │       ├── companyExtraction.ts
│   │       ├── email.ts
│   │       └── costTracking.ts
│   └── package.json
└── README.md
```

## Setup

### 1. Clone and Install

```bash
git clone https://github.com/GGGP-Test/warlord-frontend.git
cd warlord-frontend
npm install
```

### 2. Configure Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in your credentials:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# SendGrid
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=noreply@warlord.ai

# OpenAI
OPENAI_API_KEY=

# Apify
APIPY_API_TOKEN=

# Google Custom Search
GOOGLE_CUSTOM_SEARCH_API_KEY=
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=
```

### 3. Initialize Firebase

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize project
firebase init
# Select:
# - Firestore
# - Functions (Node.js 20, TypeScript)
# - Hosting (optional)
```

### 4. Install Cloud Functions Dependencies

```bash
cd functions
npm install
cd ..
```

## Development

### Run Frontend (Next.js)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Run Cloud Functions Locally

```bash
cd functions
npm run serve
```

Functions available at `http://localhost:5001/{project-id}/us-central1/{function-name}`

### Test End-to-End Flow

1. **Landing Page** (`/`)
   - Enter business email
   - Client validates format
   - Backend validates MX records

2. **Email Verification** (`/verify-email`)
   - Magic link sent via SendGrid
   - Click link in email

3. **Domain Verification** (`/verifying`)
   - Automatic domain lookup
   - CASCADE: Google → Apify → GPT-4
   - Extract company profile

4. **Decision Point** (`/choose-path`)
   - View extracted profile
   - Choose: AI onboarding OR Founder call

## Deployment

### Deploy Cloud Functions

```bash
firebase deploy --only functions
```

### Deploy Frontend (Vercel)

```bash
npm install -g vercel
vercel
```

Or push to GitHub and connect to Vercel.

## Firestore Schema

### `users/{userId}`

```typescript
{
  email: string
  email_verified: boolean
  domain_verified: boolean
  created_at: timestamp
  company_profile: {
    name: string
    industry: string
    size: 'Small' | 'Medium' | 'Large'
    location: string
    products: string[]
    confidence: number (0-1)
    extraction_method: 'FREE' | 'CHEAP' | 'EXPENSIVE'
    extraction_cost: number
    extraction_time_ms: number
  }
  verification_token: {
    token: string (hashed)
    expires_at: timestamp
    used: boolean
  }
}
```

### `cost_tracking/{operation}/logs/{logId}`

```typescript
{
  method: 'FREE' | 'CHEAP' | 'EXPENSIVE'
  status: 'PASS' | 'FAIL'
  cost: number
  timeMs: number
  timestamp: timestamp
}
```

## Cost Monitoring

Access cost analytics:

```bash
# View cost logs in Firestore Console
# Or query programmatically:
```

```typescript
import { getCostStats } from './functions/src/utils/costTracking';

const stats = await getCostStats(
  db,
  'email_validation',
  new Date('2026-01-01'),
  new Date('2026-01-31')
);

console.log('Total cost:', stats.total_cost);
console.log('Avg cost:', stats.total_cost / stats.total_requests);
console.log('FREE success rate:', stats.by_method.FREE.pass / stats.by_method.FREE.count);
```

## Next Steps

1. **Phase 2: Onboarding AI** (Bundle 5)
   - Supplier search & matching
   - Interactive questionnaire
   - Map visualization

2. **Phase 3: Monetization Gates** (Bundle 6)
   - Freemium limits
   - Payment integration
   - Premium features

## Related Repositories

- [warlord-backend](https://github.com/GGGP-Test/warlord-backend) - Architecture docs
- [galactly-monorepo-v1](https://github.com/GGGP-Test/galactly-monorepo-v1) - Reference implementation

## License

Proprietary - © 2026 WARLORD
