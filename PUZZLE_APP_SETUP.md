# Puzzle Reward Application Setup Guide

## Overview

This is a Next.js 15 application that implements a puzzle reward system with Firebase authentication and Firestore database. Users solve a puzzle to unlock a temporary password and claim rewards via UPI or bank transfer.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS 4, TypeScript
- **Backend**: Firebase 10+ (Authentication + Firestore)
- **Form Handling**: React Hook Form + Zod
- **UI Components**: shadcn/ui
- **Notifications**: Sonner

## Prerequisites

1. **Node.js 18+** and **pnpm** (or npm/yarn)
2. **Firebase Project** - Create one at [console.firebase.google.com](https://console.firebase.google.com)
3. **Firebase CLI** (optional) - For deploying Firestore rules

## Setup Instructions

### 1. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select an existing one
3. Enable **Authentication** (Email/Password method)
4. Create a **Firestore Database** in test mode or production mode
5. Copy your Firebase config from Project Settings

### 2. Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your Firebase configuration in `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

### 3. Deploy Firestore Rules

1. Install Firebase CLI (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init firestore
   ```

4. Deploy the security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

### 4. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 5. Run Development Server

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## App Flow

### User Journey

1. **Sign Up** (`/signup`) - Create account with email & password
2. **Dashboard** (`/dashboard`) - Solve the puzzle with 2 free attempts
3. **Attempt Management** - Earn more attempts by watching ads (simulated)
4. **Puzzle Solving** - Submit answer in correct format
5. **Temp Password** - Receive 8-character temporary password on correct answer
6. **Login with Temp Password** (`/login`) - Use temp password to authenticate
7. **Claim Reward** (`/claim`) - Provide UPI ID or bank details
8. **Success** (`/reward-submitted`) - Confirmation message

## Configuration

### Customize the Puzzle

Edit `/lib/puzzle-logic.ts`:

```typescript
// Change the correct answer
export const CORRECT_ANSWER = '42'; // Your answer here

// Change the format regex
export const FORMAT_REGEX = /^[\d\w\s\.\-\@\:]+$/; // Your pattern here
```

### Update the Riddle Text

Edit `/components/forms/PuzzleAnswerForm.tsx`:

```tsx
<p>
  <strong>Question:</strong> Your puzzle question here
</p>
<p className="text-sm italic">
  Hint: Your hint here
</p>
```

## File Structure

```
/app
  /(auth)/ - Public authentication routes
    /signup - Sign up page
    /login - Login page
    /terms - Terms & conditions
  /(protected)/ - Protected routes (require authentication)
    /dashboard - Puzzle page
    /claim - Reward claim page
    /reward-submitted - Success page
  /layout.tsx - Root layout with Firebase provider
  /page.tsx - Landing page (redirects based on auth)

/components
  /auth - Authentication components
    /FirebaseProvider.tsx - Firebase auth provider
    /ProtectedRoute.tsx - Route protection component
  /forms - Form components
    /SignupForm.tsx
    /LoginForm.tsx
    /PuzzleAnswerForm.tsx
    /ClaimRewardForm.tsx
  /puzzle - Puzzle-related components
    /PuzzleCanvas.tsx - Canvas with puzzle image
    /AttemptCounter.tsx - Displays remaining attempts
    /FeedbackMessage.tsx - Answer feedback display
    /RewardedAdModal.tsx - Ad video modal
  /layout - Layout components
    /AuthLayout.tsx - Centered auth layout

/lib
  /firebase.ts - Firebase initialization
  /firebase-auth.ts - Auth helper functions
  /firebase-firestore.ts - Firestore helper functions
  /puzzle-logic.ts - Puzzle validation logic
  /password-generator.ts - Temp password generation

/hooks
  /useAuth.ts - Auth state hook (from FirebaseProvider)
  /useAttempts.ts - Attempts management hook
  /usePuzzle.ts - Puzzle submission hook

/types
  /user.ts - User document interfaces
```

## Anti-Cheat Measures

The app includes several anti-cheat protections:

1. **Right-click disabled** - Prevents context menu on puzzle canvas
2. **Text selection disabled** - CSS `user-select: none` on puzzle area
3. **Copy/paste disabled** - Keyboard event listeners prevent Ctrl+C/V/X
4. **Canvas watermark** - Repeating "WATERMARK" text overlay
5. **Noise overlay** - Random noise pattern on puzzle image
6. **Firestore Rules** - Server-side validation of user data

## Security Best Practices

1. **Never expose the puzzle answer in client code** - In production, verify answers server-side via Cloud Functions
2. **Firestore Rules** - Enforce user data ownership with RLS
3. **Rate limiting** - Consider adding rate limiting per IP/user
4. **One-time temp passwords** - Delete/invalidate after first use
5. **HTTPS only** - Deploy on production HTTPS
6. **Input validation** - All inputs validated with Zod

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel Settings
4. Deploy!

### Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

## Troubleshooting

### "Firebase config is undefined"
- Check `.env.local` has all required variables
- Variables must start with `NEXT_PUBLIC_` to be accessible in browser

### "User document not found"
- Ensure Firestore collection name is `users`
- Check Firestore security rules are deployed correctly

### "Attempt counter not updating"
- Verify user document exists in Firestore with `attemptsLeft` field
- Check browser console for errors

### "Ad modal not appearing"
- RewardedAdModal only shows when `attemptsLeft === 0`
- Test by submitting 2 incorrect answers first

## Future Enhancements

- Real rewarded video integration (Google Ad Manager / AdMob)
- Server-side answer verification via Cloud Functions
- Admin dashboard for puzzle management
- Email notifications for payout status
- Analytics dashboard
- CAPTCHA integration for additional bot prevention
- IP-based rate limiting
- Multi-language support

## Support & Questions

For issues or questions:
1. Check the troubleshooting section above
2. Review Firebase Console for errors
3. Check browser console for client-side errors
4. Verify environment variables are set correctly

## License

This project is provided as-is for educational and development purposes.
