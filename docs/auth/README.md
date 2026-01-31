# Galactly Authentication System

Complete authentication and onboarding flow with AI-powered company validation.

## 📚 Overview

This authentication system provides a seamless signup and login experience for packaging suppliers, with AI-powered business validation and enriched company data.

## 📁 File Structure

```
docs/auth/
├── index.html              # Landing/Router page
├── signup/
│   └── index.html       # Sign up page
├── login/
│   └── index.html       # Sign in page
├── verified/
│   └── index.html       # Verification success
├── bridge/
│   └── index.html       # Company confirmation
└── README.md            # This file
```

## 🔄 User Flows

### New User Journey

```
1. Landing (/auth/)
   ↓
2. Sign Up (/auth/signup/)
   - Email, password, company name, website
   - AI validation (2-5 seconds)
   ↓
3. Verified (/auth/verified/)
   - Success confirmation
   - Auto-redirect after 2.5s
   ↓
4. Bridge (/auth/bridge/)
   - Company data confirmation
   - Product selection (1-3 products)
   ↓
5. Onboarding (/docs/)
   - Role selection
   - Company details
   ↓
6. Dashboard
```

### Returning User Journey

```
1. Landing (/auth/)
   ↓
2. Sign In (/auth/login/)
   - Email and password
   ↓
3. Check bridge completion:
   ├─ Complete → Dashboard
   └─ Incomplete → Bridge page first
```

## 🔑 Key Features

### Landing Page (`/auth/`)
- Clean, centered design
- Auto-redirect if already authenticated
- Sign up and sign in buttons

### Sign Up Page (`/auth/signup/`)
- **Email validation**: Blocks personal email domains (Gmail, Yahoo, etc.)
- **Password strength**: Minimum 8 characters
- **Website validation**: Ensures valid URL format
- **Google OAuth**: One-click signup
- **AI validation**: Backend validates business type
- **Rejection handling**: Shows "Talk to Founder" option

### Verified Page (`/auth/verified/`)
- Animated checkmark (scale + fade)
- Success message
- Animated progress dots
- Auto-redirect to bridge after 2.5 seconds

### Bridge Page (`/auth/bridge/`)
- Displays company logo, name, website
- Shows up to 3 products from enrichment
- **Product management**:
  - Delete products (minimum 1 must remain)
  - Add back removed products (maximum 3 total)
- Confirmation saves validated data
- Exchanges temp token for permanent token

### Sign In Page (`/auth/login/`)
- Email and password authentication
- Password visibility toggle
- Forgot password link
- Google OAuth option
- Bridge completion check on success

## 🔌 API Integration Points

### Required Backend Endpoints

#### Authentication
```
POST /api/auth/signup
  Request: { email, password, companyName, website }
  Response: { status: 'approved'|'rejected', tempToken?, companyData? }

POST /api/auth/signin
  Request: { email, password }
  Response: { authToken, bridgeCompleted: boolean, companyData? }

POST /api/auth/google/authorize
  Request: { redirect_uri }
  Response: OAuth authorization URL

POST /api/auth/google/callback
  Request: { code }
  Response: { status, tempToken?, companyData? }
```

#### Bridge
```
POST /api/auth/bridge/confirm
  Headers: { Authorization: Bearer <tempToken> }
  Request: { confirmed: true, selectedProducts: [...] }
  Response: { authToken, userId, companyId }
```

#### Onboarding
```
POST /api/onboarding/complete
  Headers: { Authorization: Bearer <authToken> }
  Request: { role, companyDetails }
  Response: { success: true }
```

## 💾 LocalStorage Keys

### During Signup Flow
- `galactly_temp_token` - Temporary token after AI validation
- `galactly_company_data` - Enriched company data (logo, products, etc.)

### After Authentication
- `galactly_auth_token` - Permanent authentication token
- `galactly_bridge_completed` - Flag indicating bridge completion

### Cleanup
Temp keys are removed after bridge confirmation.

## 🎨 Design System

All pages use consistent design tokens:

```css
:root {
  /* Colors */
  --bg-primary: #FAFAFA;
  --bg-secondary: #FFFFFF;
  --text-primary: #0F172A;
  --text-secondary: #475569;
  --accent-primary: #3B82F6;
  --accent-hover: #2563EB;
  --success: #22C55E;
  --error: #EF4444;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  
  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
}
```

### Component Patterns
- **Cards**: White background, subtle border, hover elevation
- **Buttons**: Primary (blue), Secondary (outlined)
- **Inputs**: Icon prefix, focus ring, validation states
- **Animations**: Smooth transitions (250ms cubic-bezier)

## ⚡ Validation Rules

### Email Validation
```javascript
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const personalDomains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
    'aol.com', 'icloud.com', 'protonmail.com'
  ];
  const domain = email.split('@')[1]?.toLowerCase();
  return re.test(email) && !personalDomains.includes(domain);
}
```

### Password Validation
- Minimum 8 characters
- No complexity requirements (for now)

### Website Validation
```javascript
function validateWebsite(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}
```

## 🛡️ Security Features

### Client-Side
- Input sanitization
- XSS prevention (no innerHTML for user input)
- HTTPS-only external links with `rel="noopener noreferrer"`
- Password visibility toggle

### Backend Requirements
- Password hashing (bcrypt, salt rounds ≥ 10)
- JWT tokens with 24h expiration
- Rate limiting on auth endpoints (5 attempts/minute)
- CSRF protection
- HTTPS only in production

## 📦 Backend Services Integration

This system integrates with existing Warlord Platform services:

### validation.service.ts
```typescript
// Use for AI-powered business validation
validateSupplier(companyData) {
  // Returns: { isValid: boolean, reason: string, confidence: number }
}
```

### enrichment.service.ts
```typescript
// Use for company data enrichment
enrichCompanyData(website) {
  // Returns: { logo, products, description, location, size }
}
```

### supplier.service.ts
```typescript
// Create supplier records
createSupplier(supplierData) {
  // Creates supplier in Firestore
}
```

## 📊 Data Models

### Users Collection (Firestore)
```typescript
interface User {
  id: string;
  email: string;
  passwordHash: string;
  companyId: string;
  role: 'supplier' | 'buyer';
  createdAt: Timestamp;
  bridgeCompleted: boolean;
  onboardingCompleted: boolean;
  emailVerified: boolean;
}
```

### Companies Collection (Firestore)
```typescript
interface Company {
  id: string;
  name: string;
  website: string;
  logo: string;
  products: Array<{
    id: string;
    name: string;
    category: string;
    image?: string;
  }>;
  enrichmentData: {
    description: string;
    employeeCount: string;
    location: string;
  };
  validationStatus: 'pending' | 'approved' | 'rejected';
  validationReason?: string;
  createdAt: Timestamp;
}
```

## 📱 Mobile Responsiveness

All pages are fully responsive:
- Breakpoint: 640px
- Mobile-first design
- Touch-friendly buttons (min 44px tap target)
- Proper viewport meta tag
- Correct input types for mobile keyboards

## ✅ Testing Checklist

### Signup Flow
- [ ] Landing page redirects if authenticated
- [ ] Email validation blocks personal domains
- [ ] Password must be 8+ characters
- [ ] Website must be valid URL
- [ ] AI validation shows loading state
- [ ] Approval redirects to verified page
- [ ] Rejection shows error + Calendly option
- [ ] Verified page auto-redirects after 2.5s
- [ ] Bridge displays company data correctly
- [ ] Product delete works (min 1 remains)
- [ ] Product add-back works (max 3 total)
- [ ] Confirmation redirects to onboarding

### Login Flow
- [ ] Email and password required
- [ ] Invalid credentials show error
- [ ] Success checks bridge completion
- [ ] Bridge incomplete redirects to bridge
- [ ] Bridge complete redirects to dashboard
- [ ] Forgot password link works

### Edge Cases
- [ ] Network errors handled gracefully
- [ ] Loading states on all async actions
- [ ] Mobile layout works (320px+)
- [ ] Keyboard navigation supported
- [ ] Screen reader compatible

## 🚀 Deployment Notes

### Environment Variables
```bash
GOOGLE_OAUTH_CLIENT_ID=your_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_secret
CALENDLY_FOUNDER_URL=https://calendly.com/founder
API_BASE_URL=https://api.galactly.com
```

### Production Checklist
- [ ] HTTPS enabled
- [ ] OAuth credentials configured
- [ ] Calendly link updated
- [ ] API endpoints correct
- [ ] Error logging enabled
- [ ] Analytics tracking setup
- [ ] Rate limiting configured
- [ ] CORS policies set

## 🐛 Known Issues / Future Enhancements

### Current Limitations
- OAuth only supports Google (add Microsoft, LinkedIn)
- No email verification on signup
- No password strength indicator
- No "Remember Me" option
- No 2FA support

### Planned Features
- Email verification flow
- Password reset functionality
- Social auth (Microsoft, LinkedIn)
- Two-factor authentication
- Magic link authentication
- Account deletion
- Data export

## 📝 Additional Resources

- **Backend Repository**: [warlord-backend](../../../warlord-backend)
- **Design System**: Based on existing onboarding page
- **API Documentation**: See backend README
- **Calendly Setup**: [Calendly Admin](https://calendly.com/admin)

## 👥 Support

For issues or questions:
- **Technical**: Create issue in GitHub
- **Business**: Contact founder via Calendly
- **Security**: Email security@galactly.com

---

**Version**: 1.0  
**Last Updated**: January 2026  
**Maintained by**: Galactly Engineering Team