"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Line } from "@react-three/drei";
import { AsteroidObject } from "./AsteroidObject";
import type { Asteroid } from "@/types/asteroid";
import * as THREE from "three";

interface SceneProps {
  asteroids: Asteroid[];
  onAsteroidSelect: (asteroid: Asteroid) => void;
  orbitSpeed: number;
}

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={earthRef} position={[120, 0, 0]}>
      <sphereGeometry args={[8, 64, 64]} />
      <meshStandardMaterial color="#2B65EC" roughness={0.7} metalness={0.2} />
    </mesh>
  );
}

function OrbitLine({ radius }: { radius: number }) {
  const points = [];
  const segments = 128;

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(
      new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
    );
  }

  return (
    <Line
      points={points}
      color="#666666"
      lineWidth={1.5}
      opacity={0.6}
      transparent
    />
  );
}

export function Scene({ asteroids, onAsteroidSelect, orbitSpeed }: SceneProps) {
  // Get unique orbit radii only from asteroids that are actually rendered
  const orbitRadii = [
    ...new Set(
      asteroids
        .filter((a) => a.orbitRadius && a.position)
        .map((a) => a.orbitRadius as number)
    ),
  ];
  orbitRadii.push(120); // Add Earth's orbit

  return (
    <div className="w-full h-screen" style={{ cursor: "default" }}>
      <Canvas camera={{ position: [0, 100, 250], fov: 60 }}>
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 0, 0]} intensity={3} castShadow />
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

        {/* Sun */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[15, 32, 32]} />
          <meshBasicMaterial color="#FDB813" />
        </mesh>

        {/* Orbit lines */}
        {orbitRadii.map((radius) => (
          <OrbitLine key={radius} radius={radius} />
        ))}

        {/* Earth */}
        <Earth />

        {/* Asteroids */}
        {asteroids.map((asteroid) => (
          <AsteroidObject
            key={asteroid.id}
            asteroid={asteroid}
            onSelect={onAsteroidSelect}
            orbitSpeed={orbitSpeed}
          />
        ))}

        {/* Camera controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          minDistance={80}
          maxDistance={600}
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN,
          }}
        />
      </Canvas>
    </div>
  );
}
