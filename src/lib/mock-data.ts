import type { Asteroid } from "@/types/asteroid";

/**
 * Mock asteroid data for development
 * In production, fetch from NASA NEO API:
 * https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=YOUR_API_KEY
 */

export const mockAsteroids: Asteroid[] = [
  {
    id: "99942",
    name: "Apophis",
    diameter: 370, // meters
    velocity: 12.6, // km/s
    composition: "rocky",
    position: { x: 150, y: 0, z: 80 },
    orbitRadius: 170,
    color: "#D4A574", // Brighter sandy brown
  },
  {
    id: "101955",
    name: "Bennu",
    diameter: 490, // meters
    velocity: 27.7, // km/s
    composition: "rocky",
    position: { x: -120, y: 20, z: -90 },
    orbitRadius: 150,
    color: "#B8967D", // Brighter tan
  },
  {
    id: "433",
    name: "Eros",
    diameter: 16700, // meters (16.7 km)
    velocity: 22.4, // km/s
    composition: "rocky",
    position: { x: 200, y: -30, z: 150 },
    orbitRadius: 250,
    color: "#C9A882", // Brighter beige
  },
  {
    id: "25143",
    name: "Itokawa",
    diameter: 330, // meters
    velocity: 19.8, // km/s
    composition: "rocky",
    position: { x: -80, y: 15, z: 120 },
    orbitRadius: 145,
    color: "#D4B896", // Brighter wheat
  },
  {
    id: "16",
    name: "Psyche",
    diameter: 226000, // meters (226 km)
    velocity: 17.5, // km/s
    composition: "metallic",
    position: { x: 280, y: 50, z: -200 },
    orbitRadius: 350,
    color: "#E8E8E8", // Brighter silver
  },
  {
    id: "1",
    name: "Ceres",
    diameter: 939000, // meters (939 km)
    velocity: 17.9, // km/s
    composition: "icy",
    position: { x: -300, y: -40, z: 250 },
    orbitRadius: 390,
    color: "#F0F0F0", // Brighter light gray
  },
];

/**
 * Barcelona coordinates for default location
 */
export const BARCELONA_COORDS = {
  lat: 41.3874,
  lng: 2.1686,
  name: "Barcelona, Spain",
};
