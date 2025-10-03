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
    description:
      "Near-Earth asteroid that will make a close approach to Earth in 2029",
    position: { x: 150, y: 0, z: 80 },
    orbitRadius: 170,
    color: "#8B7355",
  },
  {
    id: "101955",
    name: "Bennu",
    diameter: 490, // meters
    velocity: 27.7, // km/s
    composition: "rocky",
    description:
      "Potentially hazardous asteroid and target of NASA's OSIRIS-REx mission",
    position: { x: -120, y: 20, z: -90 },
    orbitRadius: 150,
    color: "#6B5D52",
  },
  {
    id: "433",
    name: "Eros",
    diameter: 16700, // meters (16.7 km)
    velocity: 22.4, // km/s
    composition: "rocky",
    description: "First near-Earth asteroid to be visited by a spacecraft",
    position: { x: 200, y: -30, z: 150 },
    orbitRadius: 250,
    color: "#9D8B7A",
  },
  {
    id: "25143",
    name: "Itokawa",
    diameter: 330, // meters
    velocity: 19.8, // km/s
    composition: "rocky",
    description: "Peanut-shaped asteroid visited by Japan's Hayabusa mission",
    position: { x: -80, y: 15, z: 120 },
    orbitRadius: 145,
    color: "#A89582",
  },
  {
    id: "16",
    name: "Psyche",
    diameter: 226000, // meters (226 km)
    velocity: 17.5, // km/s
    composition: "metallic",
    description:
      "Metal-rich asteroid, possibly the exposed core of a protoplanet",
    position: { x: 280, y: 50, z: -200 },
    orbitRadius: 350,
    color: "#C0C0C0",
  },
  {
    id: "1",
    name: "Ceres",
    diameter: 939000, // meters (939 km)
    velocity: 17.9, // km/s
    composition: "icy",
    description: "Dwarf planet and largest object in the asteroid belt",
    position: { x: -300, y: -40, z: 250 },
    orbitRadius: 390,
    color: "#D3D3D3",
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

/**
 * Other notable locations for testing
 */
export const NOTABLE_LOCATIONS = [
  { lat: 40.7128, lng: -74.006, name: "New York, USA" },
  { lat: 35.6762, lng: 139.6503, name: "Tokyo, Japan" },
  { lat: 51.5074, lng: -0.1278, name: "London, UK" },
  { lat: -33.8688, lng: 151.2093, name: "Sydney, Australia" },
  { lat: 41.3874, lng: 2.1686, name: "Barcelona, Spain" },
];
