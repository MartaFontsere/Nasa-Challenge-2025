"use client";

import { useState } from "react";
import { Scene } from "@/components/solar-system/Scene";
import { AsteroidModal } from "@/components/solar-system/AsteroidModal";
import { mockAsteroids } from "@/lib/mock-data";
import type { Asteroid } from "@/types/asteroid";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  const handleAsteroidSelect = (asteroid: Asteroid) => {
    setSelectedAsteroid(asteroid);
    setModalOpen(true);
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Asteroid Impact Simulator
          </h1>
          <p className="text-sm text-gray-300 mt-1">
            Explore the solar system and simulate asteroid impacts
          </p>
        </div>
        <Link href="/simulator">
          <Button size="lg" variant="default">
            Go to Simulator
          </Button>
        </Link>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-6 left-6 z-10 bg-black/60 backdrop-blur-sm p-4 rounded-lg max-w-md">
        <p className="text-white text-sm">
          <span className="font-semibold">Click</span> on asteroids to view
          details and simulate impact
          <br />
          <span className="font-semibold">Drag</span> to rotate •{" "}
          <span className="font-semibold">Scroll</span> to zoom
        </p>
      </div>

      {/* 3D Scene */}
      <Scene
        asteroids={mockAsteroids}
        onAsteroidSelect={handleAsteroidSelect}
      />

      {/* Asteroid Modal */}
      <AsteroidModal
        asteroid={selectedAsteroid}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </main>
  );
}
