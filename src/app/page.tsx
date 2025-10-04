import { Suspense } from "react";
import { AsteroidService } from "@/lib/asteroid-service";
import HomeClient from "./HomeClient";

async function HomeContent() {
  const asteroids = await AsteroidService.getSolarSystemAsteroids();
  return <HomeClient asteroids={asteroids} />;
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <main className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white/80">Loading asteroid data from NASA...</p>
          </div>
        </main>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
