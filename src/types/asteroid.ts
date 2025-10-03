export type AsteroidComposition = "rocky" | "metallic" | "icy";

export interface Asteroid {
  id: string;
  name: string;
  diameter: number; // meters
  velocity: number; // km/s
  composition: AsteroidComposition;
  description?: string;
  // 3D position for solar system view
  position?: {
    x: number;
    y: number;
    z: number;
  };
  orbitRadius?: number;
  color?: string;
}

export interface CustomAsteroidInput {
  diameter: number;
  velocity: number;
  angle: number;
  composition: AsteroidComposition;
}

export interface ImpactLocation {
  lat: number;
  lng: number;
  name?: string;
}
