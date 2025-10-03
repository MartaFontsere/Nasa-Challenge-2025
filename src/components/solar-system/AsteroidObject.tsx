"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Text } from "@react-three/drei";
import * as THREE from "three";
import type { Asteroid } from "@/types/asteroid";

interface AsteroidObjectProps {
  asteroid: Asteroid;
  onSelect: (asteroid: Asteroid) => void;
}

export function AsteroidObject({ asteroid, onSelect }: AsteroidObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Orbit animation
  useFrame(({ clock }) => {
    if (meshRef.current && asteroid.orbitRadius) {
      const time = clock.getElapsedTime() * 0.2;
      const angle = time + (Number.parseInt(asteroid.id) % 100) / 10;
      meshRef.current.position.x = Math.cos(angle) * asteroid.orbitRadius;
      meshRef.current.position.z = Math.sin(angle) * asteroid.orbitRadius;
      meshRef.current.rotation.y += 0.01;
    }
  });

  // Scale based on diameter (logarithmic for better visualization)
  const scale = Math.log10(asteroid.diameter / 100) * 2 + 1;

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
        onClick={() => onSelect(asteroid)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={asteroid.color || "#8B7355"}
          roughness={0.8}
          metalness={asteroid.composition === "metallic" ? 0.9 : 0.1}
          emissive={hovered ? "#ffffff" : "#000000"}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </Sphere>
      {hovered && (
        <Text
          position={[
            asteroid.position?.x || 0,
            (asteroid.position?.y || 0) + scale + 2,
            asteroid.position?.z || 0,
          ]}
          fontSize={2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {asteroid.name}
        </Text>
      )}
    </group>
  );
}
