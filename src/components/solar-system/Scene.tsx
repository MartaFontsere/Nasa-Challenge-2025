"use client";

import { useRef, useState } from "react";
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

// Sun is stationary at a position
function Sun() {
  const sunGroupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (sunGroupRef.current) {
      sunGroupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={sunGroupRef} position={[-200, 0, 0]}>
      {/* Sun core */}
      <mesh>
        <sphereGeometry args={[20, 32, 32]} />
        <meshBasicMaterial color="#FDB813" />
      </mesh>
      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[22, 32, 32]} />
        <meshBasicMaterial color="#FFA500" transparent opacity={0.3} />
      </mesh>
      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[24, 32, 32]} />
        <meshBasicMaterial color="#FF8C00" transparent opacity={0.15} />
      </mesh>
      {/* Add point light at sun position */}
      <pointLight intensity={3} distance={1000} />
    </group>
  );
}

// Earth orbits around the Sun
function Earth({
  orbitSpeed,
  earthPositionRef,
  onHover,
}: {
  orbitSpeed: number;
  earthPositionRef: React.MutableRefObject<THREE.Vector3>;
  onHover?: (hovered: boolean) => void;
}) {
  const earthRef = useRef<THREE.Mesh>(null);
  const earthOrbitRadius = 150;
  const sunPosition = new THREE.Vector3(-200, 0, 0);

  useFrame(({ clock }) => {
    if (earthRef.current) {
      // Earth orbits around the Sun
      const time = clock.getElapsedTime() * orbitSpeed * 0.3;
      const x = sunPosition.x + Math.cos(time) * earthOrbitRadius;
      const z = sunPosition.z + Math.sin(time) * earthOrbitRadius;

      earthRef.current.position.set(x, 0, z);
      earthRef.current.rotation.y += 0.002;

      // Update the position reference so camera can follow
      earthPositionRef.current.set(x, 0, z);
    }
  });

  return (
    <mesh
      ref={earthRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "crosshair";
        onHover?.(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
        onHover?.(false);
      }}
    >
      <sphereGeometry args={[12, 64, 64]} />
      <meshStandardMaterial
        color="#2B65EC"
        roughness={0.8}
        metalness={0.1}
        emissive="#1a4d8f"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

function OrbitLine({ radius }: { radius: number }) {
  const points = [];
  const segments = 128;

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(
      new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius),
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

// Dynamic orbit line that follows Earth's position
function AsteroidOrbitLine({
  radius,
  yOffset,
  earthPositionRef,
  visible,
}: {
  radius: number;
  yOffset: number;
  earthPositionRef: React.MutableRefObject<THREE.Vector3>;
  visible: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      // Position at Earth's X/Z but with the asteroid's Y offset
      groupRef.current.position.set(
        earthPositionRef.current.x,
        yOffset,
        earthPositionRef.current.z,
      );
    }
  });

  if (!visible) return null;

  return (
    <group ref={groupRef}>
      <OrbitLine radius={radius} />
    </group>
  );
}

// Component to dynamically update OrbitControls target
function CameraController({
  earthPositionRef,
}: {
  earthPositionRef: React.MutableRefObject<THREE.Vector3>;
}) {
  const controlsRef = useRef<any>(null);

  useFrame(() => {
    if (controlsRef.current) {
      // Smoothly follow Earth
      controlsRef.current.target.lerp(earthPositionRef.current, 0.1);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={true}
      enablePan={false}
      enableRotate={true}
      minDistance={50}
      maxDistance={600}
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      }}
    />
  );
}

export function Scene({ asteroids, onAsteroidSelect, orbitSpeed }: SceneProps) {
  const earthPositionRef = useRef(new THREE.Vector3(0, 0, 0));
  const [hoveredAsteroidId, setHoveredAsteroidId] = useState<string | null>(
    null,
  );
  const [earthHovered, setEarthHovered] = useState(false);

  // Get asteroids with their orbit info (radius + Y offset) for rendering orbit lines
  const asteroidOrbits = asteroids
    .filter((a) => a.orbitRadius && a.position)
    .map((a) => ({
      radius: a.orbitRadius as number,
      yOffset: a.position?.y || 0,
      id: a.id, // Use id as unique key
    }));

  // Earth's orbit radius for the orbit line
  const earthOrbitRadius = 150;
  const sunPosition = { x: -200, z: 0 };

  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 80, 200], fov: 60 }}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[100, 100, 100]} intensity={0.5} />

        {/* Stars background */}
        <Stars
          radius={500}
          depth={80}
          count={5000}
          factor={7}
          saturation={0}
          fade
          speed={1}
        />

        {/* Sun - stationary */}
        <Sun />

        {/* Earth orbits around Sun */}
        <Earth
          orbitSpeed={orbitSpeed}
          earthPositionRef={earthPositionRef}
          onHover={setEarthHovered}
        />

        {/* Earth's orbit line around the Sun - only visible on hover */}
        {earthHovered && (
          <group position={[sunPosition.x, 0, sunPosition.z]}>
            <OrbitLine radius={earthOrbitRadius} />
          </group>
        )}

        {/* Asteroids orbit around Earth */}
        {asteroids.map((asteroid) => (
          <AsteroidObject
            key={asteroid.id}
            asteroid={asteroid}
            onSelect={onAsteroidSelect}
            orbitSpeed={orbitSpeed}
            earthPositionRef={earthPositionRef}
            onHover={setHoveredAsteroidId}
          />
        ))}

        {/* Asteroid orbit lines (relative to Earth) - only visible on hover */}
        {asteroidOrbits.map((orbit) => (
          <AsteroidOrbitLine
            key={orbit.id}
            radius={orbit.radius}
            yOffset={orbit.yOffset}
            earthPositionRef={earthPositionRef}
            visible={hoveredAsteroidId === orbit.id}
          />
        ))}

        {/* Camera controls - follow Earth */}
        <CameraController earthPositionRef={earthPositionRef} />
      </Canvas>
    </div>
  );
}
