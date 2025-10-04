import { fetchHazardousAsteroids } from "@/lib/nasa-api";
import { mockAsteroids } from "@/lib/mock-data";
import type { Asteroid } from "@/types/asteroid";

/**
 * Abstracted service for fetching asteroid data
 * Provides a consistent interface for different data sources
 */
export class AsteroidService {
  /**
   * Fetch asteroids with automatic fallback to mock data
   * @param options - Configuration options for fetching
   * @returns Promise<Asteroid[]> - Array of asteroids or fallback data
   */
  static async getAsteroids(options?: {
    source?: "nasa" | "mock";
    limit?: number;
  }): Promise<Asteroid[]> {
    // Return mock data if explicitly requested
    if (options?.source === "mock") {
      return mockAsteroids;
    }

    // Try to fetch from NASA API
    try {
      const asteroids = await fetchHazardousAsteroids(options?.limit || 6);

      if (asteroids.length > 0) {
        return asteroids;
      } else {
        // Fallback to mock if no data returned
        return mockAsteroids;
      }
    } catch (error) {
      console.warn(
        "Failed to fetch NASA asteroid data, falling back to mock data:",
        error
      );
      return mockAsteroids;
    }
  }

  /**
   * Get all mock asteroids for development/fallback
   */
  static async getMockAsteroids(): Promise<Asteroid[]> {
    return this.getAsteroids({ source: "mock" });
  }
}

/**
 * Simplified hook-like function for server components
 * Usage in server components: const asteroids = await getAsteroids('nasa', 6)
 */
export async function getAsteroids(
  source: "nasa" | "mock" = "nasa",
  limit?: number
): Promise<Asteroid[]> {
  return AsteroidService.getAsteroids({ source, limit });
}
