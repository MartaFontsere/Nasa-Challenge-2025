import { Suspense } from "react";
import { AsteroidService } from "@/lib/asteroid-service";
import type { Asteroid } from "@/types/asteroid";
import SimulatorClient from "./SimulatorClient";

async function SimulatorContent() {
  const asteroids = await AsteroidService.getAsteroids();
  return <SimulatorClient asteroids={asteroids} />;
}

export default function SimulatorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              Loading asteroid data from NASA...
            </p>
          </div>
        </div>
      }
    >
      <SimulatorContent />
    </Suspense>
  );
}
