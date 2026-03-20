import { PuzzleAnswerForm } from '@/components/forms/PuzzleAnswerForm';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Solve the Puzzle</h1>
        <p className="text-muted-foreground">
          Crack the code and claim your reward. You have limited attempts, so think carefully!
        </p>
      </div>

      <PuzzleAnswerForm />
    </div>
  );
}
