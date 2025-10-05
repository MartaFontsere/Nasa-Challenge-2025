"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Line, useTexture } from "@react-three/drei";
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
  const sunRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={sunRef} position={[-200, 0, 0]}>
      {/* Sun core */}
      <mesh>
        <sphereGeometry args={[20, 32, 32]} />
        <SunMaterial />
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
    </group>
  );
}

function SunMaterial() {
  // ✅ Load texture with proper Suspense handling
  const suncolorMap = useTexture("/textures/sun/sun_texture_2k.jpg");

  // ✅ Dispose texture on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (suncolorMap) {
        suncolorMap.dispose();
      }
    };
  }, [suncolorMap]);

  return <meshBasicMaterial map={suncolorMap} />;
}

// Earth orbits around the Sun
export function Earth({
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
    const time = clock.getElapsedTime() * orbitSpeed * 0.3;
    const x = sunPosition.x + Math.cos(time) * earthOrbitRadius;
    const z = sunPosition.z + Math.sin(time) * earthOrbitRadius;

    if (earthRef.current) {
      earthRef.current.position.set(x, 0, z);
      earthRef.current.rotation.y += 0.0015;
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
      <EarthMaterial />
    </mesh>
  );
}

// Separate component to handle texture loading with proper caching
function EarthMaterial() {
  // ✅ Load texture with proper Suspense handling
  const colorMap = useTexture("/textures/earth/earth_daymap_2k.jpg");

  // ✅ Dispose texture on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (colorMap) {
        colorMap.dispose();
      }
    };
  }, [colorMap]);

  return (
    <meshStandardMaterial
      map={colorMap}
      roughness={1}
      metalness={0}
      emissive="#0a1a3f"
      emissiveIntensity={0.15}
    />
  );
}

function OrbitLine({ radius }: { radius: number }) {
  const points = [];
  const segments = 32;

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

// Dynamic orbit line that follows Sun's position
function AsteroidOrbitLine({
  radius,
  yOffset,
  visible,
}: {
  radius: number;
  yOffset: number;
  visible: boolean;
}) {
  // Sun position (stationary)
  const sunPosition = new THREE.Vector3(-200, 0, 0);

  if (!visible) return null;

  return (
    <group position={[sunPosition.x, yOffset, sunPosition.z]}>
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
    null
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
      <Canvas
        shadows
        dpr={[1, 1.1]} // ✅ limit pixel ratio
        gl={{
          antialias: true, // smooth edges
          powerPreference: "low-power", // ✅ ask GPU to chill
          preserveDrawingBuffer: false,
        }}
        camera={{ position: [0, 80, 200], fov: 60 }}
      >
        {/* subtle background/fog */}
        <color attach="background" args={["#03040a"]} />
        <fog attach="fog" args={["#03040a", 300, 1200]} />

        {/* Minimal ambient light - just enough to see dark sides */}
        <ambientLight intensity={0.5} />

        {/* Keep your Sun visual (stationary) */}
        <Suspense fallback={null}>
          <Sun />
        </Suspense>

        {/* Point light at sun position - radiates in all directions */}
        <pointLight
          position={[sunPosition.x, 0, sunPosition.z]}
          intensity={100}
          distance={2000}
          decay={0.8}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0005}
          shadow-camera-near={10}
          shadow-camera-far={2000}
        />

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

        {/* Earth (will receive shadows) */}
        <Suspense fallback={null}>
          <Earth
            orbitSpeed={orbitSpeed}
            earthPositionRef={earthPositionRef}
            onHover={setEarthHovered}
          />
        </Suspense>

        {/* rest of your scene: asteroids, orbit lines, camera controller, etc. */}
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

        {asteroidOrbits.map((orbit) => (
          <AsteroidOrbitLine
            key={orbit.id}
            radius={orbit.radius}
            yOffset={orbit.yOffset}
            visible={hoveredAsteroidId === orbit.id}
          />
        ))}

        <CameraController earthPositionRef={earthPositionRef} />
      </Canvas>
    </div>
  );
}
