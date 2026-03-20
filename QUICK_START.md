# Quick Start Guide - Puzzle Reward App

## 30-Second Setup

1. **Copy env file**: `cp .env.local.example .env.local`
2. **Add Firebase keys** to `.env.local` from your Firebase Console
3. **Install deps**: `pnpm install`
4. **Run dev server**: `pnpm dev`
5. **Open**: http://localhost:3000

## Key Files to Customize

### 1. Puzzle Answer & Format
**File**: `/lib/puzzle-logic.ts`
```typescript
export const CORRECT_ANSWER = '42'; // Change this
export const FORMAT_REGEX = /^[\d\w\s\.\-\@\:]+$/; // Change format validation
```

### 2. Puzzle Question & Riddle
**File**: `/components/forms/PuzzleAnswerForm.tsx`
```tsx
<p><strong>Question:</strong> Your puzzle question here</p>
<p className="text-sm italic">Hint: Your hint text here</p>
```

### 3. Puzzle Image
**File**: `/components/puzzle/PuzzleCanvas.tsx`
- Currently uses emoji placeholder
- Replace with actual puzzle image via canvas API or img tag

## User Flow

```
Sign Up (/signup)
    ↓
Dashboard (/dashboard) - Solve Puzzle
    ↓
Get Temp Password (on correct answer)
    ↓
Login (/login) - Use Temp Password
    ↓
Claim Reward (/claim) - Enter Payment Details
    ↓
Success (/reward-submitted) - Done!
```

## Important Notes

⚠️ **Before Production:**
1. Move puzzle answer to backend (Cloud Function)
2. Add rate limiting on answer submissions
3. Set up Firebase Firestore Rules (in `/firestore.rules`)
4. Deploy to HTTPS only
5. Add CAPTCHA for bot prevention
6. Test security thoroughly

## Database Schema

Firestore collection: `users/{uid}`
```json
{
  "email": "user@example.com",
  "attemptsLeft": 2,
  "hasSolvedCorrectly": false,
  "tempPassword": "ABC123XY",
  "rewardClaimed": false,
  "payoutDetails": {
    "method": "upi",
    "upiId": "name@upi"
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

## Firebase Setup Checklist

- [ ] Created Firebase project
- [ ] Enabled Email/Password authentication
- [ ] Created Firestore database
- [ ] Copied credentials to `.env.local`
- [ ] Deployed Firestore rules: `firebase deploy --only firestore:rules`
- [ ] Tested sign up and puzzle submission

## Test the App

1. Sign up with test email: `test@example.com`
2. Go to dashboard
3. Submit answer: `42` (default correct answer)
4. Receive temp password
5. Use temp password to login
6. Fill claim form with fake payment details
7. See success message

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Firebase config undefined" | Check `.env.local` has `NEXT_PUBLIC_` variables |
| "User document not found" | Sign up via `/signup` page first |
| "Attempts not updating" | Clear browser cache and refresh |
| "Temporary password wrong" | Make sure answer is correct (default: `42`) |

## More Help

Full setup guide: Read `PUZZLE_APP_SETUP.md`

---

**Ready to go!** Run `pnpm dev` and visit http://localhost:3000
