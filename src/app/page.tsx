"use client";

import { useState } from "react";
import { Scene } from "@/components/solar-system/Scene";
import { AsteroidModal } from "@/components/solar-system/AsteroidModal";
import { mockAsteroids } from "@/lib/mock-data";
import type { Asteroid } from "@/types/asteroid";
import { Navigation } from "@/components/Navigation";

export default function Home() {
  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [orbitSpeed, setOrbitSpeed] = useState(0.1);

  const handleAsteroidSelect = (asteroid: Asteroid) => {
    setSelectedAsteroid(asteroid);
    setModalOpen(true);
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* Navigation */}
      <Navigation />

      {/* Instructions & Speed Control */}
      <div className="absolute bottom-6 left-6 z-10 bg-black/60 backdrop-blur-sm p-4 rounded-lg max-w-md space-y-3">
        <p className="text-white text-sm">
          <span className="font-semibold">Click</span> on asteroids to view
          details and simulate impact
          <br />
          <span className="font-semibold">Drag</span> to rotate •{" "}
          <span className="font-semibold">Scroll</span> to zoom
        </p>
        <div className="space-y-1">
          <label className="text-white text-xs font-semibold">
            Orbit Speed: {orbitSpeed.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={orbitSpeed}
            onChange={(e) => setOrbitSpeed(Number.parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* 3D Scene */}
      <Scene
        asteroids={mockAsteroids}
        onAsteroidSelect={handleAsteroidSelect}
        orbitSpeed={orbitSpeed}
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
