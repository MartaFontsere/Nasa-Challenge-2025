// src/components/solar-system/AsteroidField.tsx
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import type { Asteroid } from "@/types/asteroid";

interface AsteroidFieldProps {
  asteroids: Asteroid[];
  onSelect: (asteroid: Asteroid) => void;
  orbitSpeed: number;
  earthPositionRef: React.MutableRefObject<THREE.Vector3>;
  onHover?: (asteroidId: string | null) => void;
}

export function AsteroidField({
  asteroids,
  onSelect,
  orbitSpeed,
  earthPositionRef,
  onHover,
}: AsteroidFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh | null>(null);
  const tempObj = useRef(new THREE.Object3D()).current;
  const tempColor = useRef(new THREE.Color()).current;

  // create per-instance color buffer
  useEffect(() => {
    if (!meshRef.current) return;
    const instancedCount = asteroids.length;
    const colorArray = new Float32Array(instancedCount * 3);

    for (let i = 0; i < instancedCount; i++) {
      const col = asteroids[i].color || "#D4A574";
      tempColor.set(col);
      colorArray[i * 3 + 0] = tempColor.r;
      colorArray[i * 3 + 1] = tempColor.g;
      colorArray[i * 3 + 2] = tempColor.b;
    }

    meshRef.current.geometry.setAttribute(
      "instanceColor",
      new THREE.InstancedBufferAttribute(colorArray, 3),
    );

    // ensure the geometry knows how many instances to render
    meshRef.current.count = instancedCount;
  }, [asteroids, tempColor]);

  // update positions each frame (orbit around Earth)
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const count = asteroids.length;
    const timeBase = clock.getElapsedTime() * orbitSpeed;

    for (let i = 0; i < count; i++) {
      const a = asteroids[i];

      const idNum = Number.parseInt(a.id, 10);
      const phaseOffset = Number.isFinite(idNum) ? (idNum % 100) / 10 : i * 0.1;
      const angle = timeBase + phaseOffset;
      const r = a.orbitRadius ?? 0;
      const ox = Math.cos(angle) * r;
      const oz = Math.sin(angle) * r;
      const oy = a.position?.y ?? 0;

      const diameter = Math.max(a.diameter ?? 1, 1);
      const s = Math.max(0.12, Math.log10(diameter + 1) * 0.4);

      tempObj.position.set(
        earthPositionRef.current.x + ox,
        oy,
        earthPositionRef.current.z + oz,
      );
      tempObj.scale.setScalar(s);
      tempObj.rotation.y += 0.01;
      tempObj.updateMatrix();

      meshRef.current.setMatrixAt(i, tempObj.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  // R3F pointer event type with instanceId available
  type R3FPointer = ThreeEvent<PointerEvent> & { instanceId?: number };

  const handlePointerOver = (e: R3FPointer) => {
    e.stopPropagation();
    const idx = typeof e.instanceId === "number" ? e.instanceId : undefined;
    if (idx !== undefined && asteroids[idx]) {
      onHover?.(asteroids[idx].id);
      document.body.style.cursor = "crosshair";
    }
  };

  const handlePointerOut = (e: R3FPointer) => {
    e.stopPropagation();
    onHover?.(null);
    document.body.style.cursor = "default";
  };

  const handleClick = (e: R3FPointer) => {
    e.stopPropagation();
    const idx = typeof e.instanceId === "number" ? e.instanceId : undefined;
    if (idx !== undefined && asteroids[idx]) {
      onSelect(asteroids[idx]);
    }
  };

  return (
    <instancedMesh
      ref={meshRef}
      args={[
        new THREE.SphereGeometry(1, 6, 6),
        new THREE.MeshStandardMaterial({ vertexColors: true }),
        asteroids.length,
      ]}
      castShadow={false}
      receiveShadow={false}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    />
  );
}

export default AsteroidField;