import { AuthLayout } from '@/components/layout/AuthLayout';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <AuthLayout>
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Terms & Conditions</h1>
          <p className="text-sm text-muted-foreground">
            Please read and accept our terms before proceeding
          </p>
        </div>

        <div className="bg-card rounded-lg border p-4 max-h-96 overflow-y-auto space-y-4 text-sm">
          <div>
            <h2 className="font-semibold mb-2">1. Eligibility</h2>
            <p className="text-muted-foreground">
              You must be at least 18 years old and reside in a supported jurisdiction to participate
              in this puzzle reward program. By participating, you represent that you meet these
              eligibility requirements.
            </p>
          </div>

          <div>
            <h2 className="font-semibold mb-2">2. Puzzle Rules</h2>
            <p className="text-muted-foreground">
              Each account is allocated 2 free attempts to solve the puzzle. Additional attempts can
              be earned by watching rewarded advertisements. The correct answer must be submitted in
              the specified format. Attempts are consumed regardless of answer correctness.
            </p>
          </div>

          <div>
            <h2 className="font-semibold mb-2">3. Temporary Password</h2>
            <p className="text-muted-foreground">
              Upon solving the puzzle correctly, you will receive a temporary password. This password
              is for single-use authentication only and must be used within 7 days of generation. You
              are responsible for keeping your temporary password confidential.
            </p>
          </div>

          <div>
            <h2 className="font-semibold mb-2">4. Reward Claim</h2>
            <p className="text-muted-foreground">
              To claim your reward, you must log in with the temporary password and provide valid
              payment details (UPI ID or Bank Account). Rewards are typically processed within 24-72
              business hours. We reserve the right to verify payment details and may request
              additional documentation.
            </p>
          </div>

          <div>
            <h2 className="font-semibold mb-2">5. Prohibited Activities</h2>
            <p className="text-muted-foreground">
              The following are strictly prohibited: attempting to manipulate or cheat the puzzle
              system, sharing accounts or temporary passwords, using bots or automated tools,
              exploiting security vulnerabilities, and attempting multiple account registrations.
              Violations may result in immediate account termination and forfeiture of rewards.
            </p>
          </div>

          <div>
            <h2 className="font-semibold mb-2">6. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              We provide this service "as is" without warranties. We are not responsible for
              technical issues, data loss, or payment processing failures. Your use of this service
              is at your own risk.
            </p>
          </div>

          <div>
            <h2 className="font-semibold mb-2">7. Privacy</h2>
            <p className="text-muted-foreground">
              We collect and process personal data (email, payment details) for reward processing and
              fraud prevention. Your data is protected according to applicable privacy laws and will
              not be shared with third parties without consent.
            </p>
          </div>

          <div>
            <h2 className="font-semibold mb-2">8. Dispute Resolution</h2>
            <p className="text-muted-foreground">
              Any disputes arising from this program are subject to binding arbitration. You agree to
              waive your right to class action lawsuits.
            </p>
          </div>
        </div>

        <Link
          href="/signup"
          className="block text-center bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          Back to Sign Up
        </Link>

        <p className="text-center text-xs text-muted-foreground">
          Please sign up and accept the terms and conditions to continue.
        </p>
      </div>
    </AuthLayout>
  );
}
