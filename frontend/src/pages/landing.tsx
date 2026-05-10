import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/30 px-4">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-6 text-center">
        <Logo size="xl" />
        <h1 className="text-4xl font-bold tracking-tight">TripSync</h1>
        <p className="text-lg text-muted-foreground">
          Plan trips together. Organize itineraries, split expenses, and keep everyone on the same page.
        </p>
        <div className="flex gap-3">
          <Button asChild size="lg">
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/register">Create account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
