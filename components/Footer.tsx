export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built with ❤️ using Next.js and Firebase. Solve puzzles, claim rewards!
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Puzzle Reward App. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}