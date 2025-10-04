"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";
import type { Asteroid } from "@/types/asteroid";

interface AsteroidObjectProps {
  asteroid: Asteroid;
  onSelect: (asteroid: Asteroid) => void;
  orbitSpeed: number;
  earthPositionRef: React.MutableRefObject<THREE.Vector3>;
  onHover?: (asteroidId: string | null) => void;
}

export function AsteroidObject({
  asteroid,
  onSelect,
  orbitSpeed,
  earthPositionRef,
  onHover,
}: AsteroidObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Orbit animation - asteroids orbit around Earth
  useFrame(({ clock }) => {
    if (meshRef.current && asteroid.orbitRadius) {
      const time = clock.getElapsedTime() * orbitSpeed;
      const angle = time + (Number.parseInt(asteroid.id, 10) % 100) / 10;

      // Calculate position relative to Earth
      const orbitX = Math.cos(angle) * asteroid.orbitRadius;
      const orbitZ = Math.sin(angle) * asteroid.orbitRadius;
      const orbitY = asteroid.position?.y || 0;

      // Position asteroid relative to Earth
      meshRef.current.position.x = earthPositionRef.current.x + orbitX;
      meshRef.current.position.y = orbitY;
      meshRef.current.position.z = earthPositionRef.current.z + orbitZ;
      meshRef.current.rotation.y += 0.01;
    }
  });

  // Scale based on diameter (logarithmic for better visualization)
  const scale = Math.log10(asteroid.diameter / 100) * 2 + 1;

  const handleClick = (e: any) => {
    e.stopPropagation();
    onSelect(asteroid);
  };

  return (
    <group>
      <Sphere
        ref={meshRef}
        args={[scale, 32, 32]}
        position={[
          asteroid.position?.x || 0,
          asteroid.position?.y || 0,
          asteroid.position?.z || 0,
        ]}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "crosshair";
          setHovered(true);
          onHover?.(asteroid.id);
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
          setHovered(false);
          onHover?.(null);
        }}
      >
        <meshStandardMaterial
          color={asteroid.color || "#D4A574"}
          roughness={0.7}
          metalness={asteroid.composition === "metallic" ? 0.9 : 0.2}
          emissive={hovered ? asteroid.color || "#D4A574" : "#000000"}
          emissiveIntensity={hovered ? 0.5 : 0}
        />
      </Sphere>
    </group>
  );
}
