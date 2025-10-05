import type { Asteroid, AsteroidComposition } from "@/types/asteroid";
import type { NASANearEarthObject, NASABrowseResponse } from "@/types/nasa-api";

const NASA_API_KEY = "9q1BIrXXNJuWvxQLWkedidQgYXlPNOJFtodj6gTl";
const BROWSE_URL = "https://api.nasa.gov/neo/rest/v1/neo/browse";

/**
 * Estimate composition based on asteroid properties
 * In a real scenario, this would require more detailed spectroscopic data
 */
function estimateComposition(
  diameter: number,
  name: string
): AsteroidComposition {
  // Very simple heuristic for demo purposes
  if (
    name.toLowerCase().includes("metal") ||
    name.toLowerCase().includes("psyche")
  ) {
    return "metallic";
  }
  if (diameter > 500000) {
    // Very large asteroids might be icy (like Ceres)
    return "icy";
  }
  return "rocky"; // Most NEOs are rocky
}

/**
 * Generate a 3D position for visualization
 * Creates a distributed arrangement around the solar system
 */
function generatePosition(index: number, total: number) {
  const angle = (index / total) * Math.PI * 2;
  // Spread asteroids across a wider range of radii (150-450)
  const radius = 150 + index * 15; // Linear distribution
  return {
    x: Math.cos(angle) * radius,
    // Spread vertically more (-40 to +40)
    y: ((index % 9) - 4) * 10,
    z: Math.sin(angle) * radius,
  };
}

/**
 * Generate a color based on composition
 */
function getColorForComposition(composition: AsteroidComposition): string {
  switch (composition) {
    case "metallic":
      return "#E8E8E8"; // Silver
    case "icy":
      return "#F0F0F0"; // Light gray
    case "rocky":
    default:
      return "#D4A574"; // Sandy brown
  }
}

/**
 * Fetch hazardous asteroids from NASA NEO API
 */
export async function fetchHazardousAsteroids(limit = 5): Promise<Asteroid[]> {
  try {
    const params = new URLSearchParams({
      api_key: NASA_API_KEY,
    });

    const response = await fetch(`${BROWSE_URL}?${params}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`);
    }

    const data: NASABrowseResponse = await response.json();
    const neos = data.near_earth_objects;

    // Filter for potentially hazardous asteroids first, but include other asteroids if needed
    const hazardousAsteroids = neos.filter(
      (neo) => neo.is_potentially_hazardous_asteroid
    );

    // If we don't have enough hazardous asteroids, include some regular ones
    const selectedAsteroids =
      hazardousAsteroids.length >= limit
        ? hazardousAsteroids.slice(0, limit)
        : [
            ...hazardousAsteroids,
            ...neos
              .filter((neo) => !neo.is_potentially_hazardous_asteroid)
              .slice(0, limit - hazardousAsteroids.length),
          ];

    // Transform to our Asteroid type
    const asteroids: Asteroid[] = selectedAsteroids.map((neo, index) => {
      const diameter = neo.estimated_diameter.meters.estimated_diameter_max;
      const velocity = neo.close_approach_data?.[0]
        ? parseFloat(
            neo.close_approach_data[0].relative_velocity.kilometers_per_second
          )
        : 20; // Default velocity if not available

      const composition = estimateComposition(diameter, neo.name);
      const position = generatePosition(index, limit);
      // Match orbit radius with initial position spread (150-450 range)
      const orbitRadius = 150 + index * 15;

      return {
        id: neo.id,
        name: neo.name,
        diameter,
        velocity,
        orbitalData: neo.orbital_data,
        composition,
        position,
        orbitRadius,
        color: getColorForComposition(composition),
      };
    });

    return asteroids;
  } catch (error) {
    throw error;
  }
}

/**
 * Get a specific asteroid by ID
 */
export async function fetchAsteroidById(id: string): Promise<Asteroid | null> {
  try {
    const params = new URLSearchParams({
      api_key: NASA_API_KEY,
    });

    const response = await fetch(
      `https://api.nasa.gov/neo/rest/v1/neo/${id}?${params}`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      return null;
    }

    const neo: NASANearEarthObject = await response.json();
    const diameter = neo.estimated_diameter.meters.estimated_diameter_max;
    const velocity = neo.close_approach_data?.[0]
      ? parseFloat(
          neo.close_approach_data[0].relative_velocity.kilometers_per_second
        )
      : 20;

    const composition = estimateComposition(diameter, neo.name);

    return {
      id: neo.id,
      name: neo.name,
      diameter,
      velocity,
      composition,
      position: { x: 150, y: 0, z: 80 },
      orbitRadius: 170,
      color: getColorForComposition(composition),
    };
  } catch (error) {
    return null;
  }
}
