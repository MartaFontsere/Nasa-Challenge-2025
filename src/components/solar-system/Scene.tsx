"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { AsteroidObject } from "./AsteroidObject";
import type { Asteroid } from "@/types/asteroid";

interface SceneProps {
  asteroids: Asteroid[];
  onAsteroidSelect: (asteroid: Asteroid) => void;
}

export function Scene({ asteroids, onAsteroidSelect }: SceneProps) {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 50, 200], fov: 60 }}>
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 0, 0]} intensity={2} />
        <pointLight position={[100, 100, 100]} intensity={0.5} />

        {/* Stars background */}
        <Stars
          radius={300}
          depth={60}
          count={5000}
          factor={7}
          saturation={0}
          fade
          speed={1}
        />

        {/* Sun (just a simple sphere at center) */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[15, 32, 32]} />
          <meshBasicMaterial color="#FDB813" />
        </mesh>

        {/* Asteroids */}
        {asteroids.map((asteroid) => (
          <AsteroidObject
            key={asteroid.id}
            asteroid={asteroid}
            onSelect={onAsteroidSelect}
          />
        ))}

        {/* Camera controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={50}
          maxDistance={500}
        />
      </Canvas>
    </div>
  );
}
