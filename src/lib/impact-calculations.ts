import type { Asteroid, AsteroidComposition } from "@/types/asteroid";
import type { ImpactResults, ImpactZone } from "@/types/impact";

/**
 * Impact Calculation Utilities
 *
 * Based on scientific formulas from:
 * - Collins, G.S., Melosh, H.J., Marcus, R.A. (2005) "Earth Impact Effects Program"
 *   Available at: https://impact.ese.ic.ac.uk/ImpactEarth/
 * - Holsapple, K.A. (1993) "The Scaling of Impact Processes in Planetary Sciences"
 * - Melosh, H.J. (1989) "Impact Cratering: A Geologic Process"
 *
 * Useful APIs for real data:
 * - NASA NEO Web Service: https://api.nasa.gov/ (API key required)
 * - JPL Small-Body Database: https://ssd-api.jpl.nasa.gov/doc/sbdb.html
 * - CNEOS Sentry: https://cneos.jpl.nasa.gov/sentry/
 * - Population Data: https://sedac.ciesin.columbia.edu/data/set/gpw-v4-population-density
 */

// Physical constants
const GRAVITY = 9.81; // m/s² (Earth surface gravity)
const TSAR_BOMBA_YIELD = 50; // megatons TNT equivalent
const POPULATION_DENSITY_URBAN = 2000; // people per km² (rough estimate for urban areas)
const SOUND_SPEED = 340; // m/s (speed of sound at sea level)
const EARTH_POPULATION = 8_000_000_000; // Current Earth population (8 billion)

/**
 * Get asteroid density based on composition
 * Source: JPL Small-Body Database typical densities
 */
function getDensity(composition: AsteroidComposition): number {
  switch (composition) {
    case "rocky":
      return 3000; // kg/m³ (silicate rock)
    case "metallic":
      return 8000; // kg/m³ (iron-nickel)
    case "icy":
      return 1000; // kg/m³ (ice/carbonaceous)
  }
}

/**
 * Calculate asteroid mass
 * Formula: m = ρ × V = ρ × (4/3)πr³
 */
export function calculateMass(
  diameter: number,
  composition: AsteroidComposition
): number {
  const radius = diameter / 2;
  const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
  const density = getDensity(composition);
  return density * volume; // kg
}

/**
 * Calculate kinetic energy at impact
 * Formula: E = (1/2)mv²
 * Source: Basic physics, adjusted for atmospheric entry
 */
export function calculateKineticEnergy(mass: number, velocity: number): number {
  const velocityMs = velocity * 1000; // Convert km/s to m/s
  return 0.5 * mass * Math.pow(velocityMs, 2); // joules
}

/**
 * Convert joules to TNT equivalent
 * 1 ton of TNT = 4.184 × 10^9 joules
 */
export function joulesToTNTMegatons(joules: number): number {
  const tonsOfTNT = joules / 4.184e9;
  return tonsOfTNT / 1e6; // Convert to megatons
}

/**
 * Calculate crater diameter
 * Based on Holsapple & Schmidt (1987) scaling laws
 * Formula: D = 1.161 * ρ_a^0.167 * ρ_t^-0.333 * g^-0.167 * W^0.333 * sin(θ)^0.333
 *
 * Simplified for Earth impacts:
 * D ≈ 2 * (E / 10^12)^0.333 for rocky targets
 */
export function calculateCraterDiameter(
  energy: number,
  angle: number,
  composition: AsteroidComposition
): number {
  const energyMegatons = joulesToTNTMegatons(energy);

  // Simplified crater scaling (Collins et al. 2005)
  // Crater diameter in meters ≈ 2 * energy^(1/3.4)
  const baseDiameter = 2 * Math.pow(energyMegatons * 1e6, 1 / 3.4);

  // Angle correction (sin factor)
  const angleRadians = (angle * Math.PI) / 180;
  const angleFactor = Math.pow(Math.sin(angleRadians), 1 / 3);

  // Composition factor
  const compositionFactor =
    composition === "metallic" ? 1.2 : composition === "icy" ? 0.8 : 1.0;

  return baseDiameter * angleFactor * compositionFactor;
}

/**
 * Calculate crater depth
 * Typical depth-to-diameter ratio is ~1:5 for complex craters
 * Source: Melosh (1989)
 */
export function calculateCraterDepth(diameter: number): number {
  return diameter / 5;
}

/**
 * Calculate fireball radius
 * Based on the scaling of thermal radiation from nuclear weapons
 * Formula: R ≈ 0.28 * Y^0.4 (where Y is yield in kilotons)
 * Source: Glasstone & Dolan (1977) "The Effects of Nuclear Weapons"
 */
export function calculateFireballRadius(energy: number): number {
  const kilotons = joulesToTNTMegatons(energy) * 1000;
  const radiusKm = 0.28 * Math.pow(kilotons, 0.4);
  return radiusKm;
}

/**
 * Calculate thermal radiation radius
 * Radius where thermal radiation causes third-degree burns
 * Formula: R ≈ 0.4 * Y^0.41
 * Thermal radiation travels in straight lines and is affected by atmosphere
 */
export function calculateThermalRadiationRadius(energy: number): number {
  const kilotons = joulesToTNTMegatons(energy) * 1000;
  const radiusKm = 0.4 * Math.pow(kilotons, 0.41);
  return radiusKm;
}

/**
 * Calculate shockwave (overpressure) radius
 * Radius where overpressure causes significant damage (~5 psi)
 * Formula: R ≈ 1.0 * Y^0.33
 * Shockwave travels through air and extends further than thermal effects
 * Source: Based on Glasstone & Dolan scaling laws, adjusted for 5 psi overpressure
 */
export function calculateShockwaveRadius(energy: number): number {
  const kilotons = joulesToTNTMegatons(energy) * 1000;
  // Using 5 psi overpressure threshold (severe damage) instead of 20 psi
  // This gives a more realistic shockwave extent
  const radiusKm = 1.0 * Math.pow(kilotons, 0.33);
  return radiusKm;
}

/**
 * Calculate earthquake magnitude
 * Correlation between impact energy and seismic magnitude
 * Formula: M = 0.67 * log10(E) - 5.87
 * Source: Schultz & Gault (1975), modified by Collins et al.
 */
export function calculateEarthquakeMagnitude(energy: number): number {
  const magnitude = 0.67 * Math.log10(energy) - 5.87;
  return Math.max(0, Math.min(magnitude, 12)); // Cap between 0 and 12
}

/**
 * Calculate earthquake damage radius based on magnitude
 * Different damage levels at different distances
 * Based on seismic attenuation models
 */
export function calculateEarthquakeRadius(magnitude: number): {
  severe: number; // Severe damage (Modified Mercalli IX+)
  moderate: number; // Moderate damage (Modified Mercalli VI-VIII)
} {
  // Empirical formula: radius increases exponentially with magnitude
  // R ≈ 10^(0.5*M - 1) for severe damage
  const severeRadius = Math.pow(10, 0.5 * magnitude - 1); // km
  const moderateRadius = severeRadius * 2.5; // km

  return {
    severe: severeRadius,
    moderate: moderateRadius,
  };
}

/**
 * Fetch population density for a location using OpenStreetMap data
 * Falls back to reasonable estimates based on location type
 */
async function getPopulationDensity(lat: number, lng: number): Promise<number> {
  try {
    // Try to get location details from Nominatim
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`,
      {
        headers: {
          "User-Agent": "NASA-Challenge-Impact-Simulator",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Nominatim response:", data); // Debug logging

      // Check for ocean/water bodies first
      if (
        data.type === "sea" ||
        data.type === "ocean" ||
        data.class === "waterway" ||
        (data.class === "natural" && data.type === "water")
      ) {
        console.log("Detected water body");
        return 0;
      }

      // Check if no address found (remote/uninhabited areas)
      if (!data.address) {
        console.log("No address found - uninhabited area");
        return 5; // Very sparse population
      }

      // Estimate population density based on location type
      const addressType = data.addresstype || data.type;
      const placeType = data.class;

      // Check for major cities by name first
      const cityName = (
        data.address?.city ||
        data.address?.town ||
        data.address?.municipality ||
        data.display_name ||
        ""
      ).toLowerCase();

      const majorCities = [
        "barcelona",
        "london",
        "paris",
        "tokyo",
        "new york",
        "beijing",
        "delhi",
        "shanghai",
        "mumbai",
        "seoul",
        "jakarta",
        "moscow",
        "istanbul",
        "los angeles",
        "mexico city",
        "cairo",
        "buenos aires",
      ];

      if (majorCities.some((city) => cityName.includes(city))) {
        console.log("Major city detected:", cityName);
        return 10000; // Very high density for major cities
      }

      // Check for cities and urban areas
      if (
        addressType === "city" ||
        addressType === "town" ||
        data.address?.city ||
        data.address?.town
      ) {
        console.log("City/town detected");
        return 3000; // High density urban
      }

      // Villages and suburbs
      if (
        addressType === "village" ||
        addressType === "suburb" ||
        data.address?.village ||
        data.address?.suburb
      ) {
        console.log("Village/suburb detected");
        return 1000; // Medium density
      }

      // Small settlements
      if (
        addressType === "hamlet" ||
        addressType === "isolated_dwelling" ||
        data.address?.hamlet
      ) {
        console.log("Hamlet detected");
        return 100; // Low density rural
      }

      // Check for uninhabited natural features
      if (placeType === "natural") {
        if (
          data.type === "desert" ||
          data.type === "sand" ||
          data.type === "bare_rock"
        ) {
          console.log("Desert/uninhabited natural area detected");
          return 0;
        }
        if (
          data.type === "forest" ||
          data.type === "wood" ||
          data.type === "grassland"
        ) {
          console.log("Forest/natural area detected");
          return 2; // Very sparse
        }
      }

      // Check for county, state, or country level (rural areas)
      if (
        (data.address?.country && !data.address?.city && !data.address?.town) ||
        data.address?.state ||
        data.address?.county
      ) {
        // If we only have country/state/county level, it's likely rural
        console.log("Rural area detected (state/county level)");
        return 50; // Rural/agricultural
      }

      // If we have some address but couldn't categorize, assume rural
      console.log("Unclassified location, assuming rural:", addressType);
      return 200; // Low-medium rural density
    }
  } catch (error) {
    console.warn("Failed to fetch population density, using default", error);
  }

  // Default to low density if API fails
  console.log("API failed, using default");
  return 200;
}

/**
 * Estimate casualties based on impact zones and population density
 * Improved with better mortality rates and Earth population cap
 * Now uses location-based population density estimation
 */
export async function estimateCasualties(
  fireballRadius: number,
  shockwaveRadius: number,
  thermalRadius: number,
  location: { lat: number; lng: number }
): Promise<{
  fireball: number;
  shockwave: number;
  thermalRadiation: number;
  total: number;
  populationDensity: number;
}> {
  // Get population density for the impact location
  const populationDensity = await getPopulationDensity(
    location.lat,
    location.lng
  );

  // Calculate total areas for each zone (full circles)
  const fireballArea = Math.PI * Math.pow(fireballRadius, 2);
  const thermalTotalArea = Math.PI * Math.pow(thermalRadius, 2);
  const shockwaveTotalArea = Math.PI * Math.pow(shockwaveRadius, 2);

  // Mortality rates for each zone
  // Fireball: 100% mortality (complete vaporization)
  // Thermal: 70% mortality (severe burns, fires, radiation)
  // Shockwave: 40% mortality (overpressure, building damage, debris)
  const fireballCasualties = Math.floor(fireballArea * populationDensity * 1.0);
  const thermalCasualties = Math.floor(
    thermalTotalArea * populationDensity * 0.7
  );
  const shockwaveCasualties = Math.floor(
    shockwaveTotalArea * populationDensity * 0.4
  );

  // Total is the maximum of all zones (zones overlap, so we don't sum)
  // People in inner zones are also in outer zones, so take the max
  const total = Math.min(
    Math.max(fireballCasualties, thermalCasualties, shockwaveCasualties),
    EARTH_POPULATION
  );

  return {
    fireball: fireballCasualties,
    shockwave: shockwaveCasualties,
    thermalRadiation: thermalCasualties,
    total,
    populationDensity, // Include for debugging/display
  };
}

/**
 * Main function to calculate all impact effects
 */
export async function calculateImpactEffects(
  asteroid: Asteroid,
  angle: number,
  location: { lat: number; lng: number }
): Promise<ImpactResults> {
  // Calculate basic properties
  const mass = calculateMass(asteroid.diameter, asteroid.composition);
  const energy = calculateKineticEnergy(mass, asteroid.velocity);

  // Calculate crater
  const craterDiameter = calculateCraterDiameter(
    energy,
    angle,
    asteroid.composition
  );
  const craterDepth = calculateCraterDepth(craterDiameter);

  // Calculate blast effects
  const fireballRadius = calculateFireballRadius(energy);
  const shockwaveRadius = calculateShockwaveRadius(energy);
  const thermalRadius = calculateThermalRadiationRadius(energy);

  // Calculate environmental effects
  const magnitude = calculateEarthquakeMagnitude(energy);
  const earthquakeRadii = calculateEarthquakeRadius(magnitude);

  // Estimate casualties with location-based population density
  const casualties = await estimateCasualties(
    fireballRadius,
    shockwaveRadius,
    thermalRadius,
    location
  );

  // Energy comparisons
  const tntMegatons = joulesToTNTMegatons(energy);
  const tsarBombas = tntMegatons / TSAR_BOMBA_YIELD;

  return {
    asteroidMass: mass,
    kineticEnergy: energy,
    tntEquivalent: tntMegatons,
    tsarBombaEquivalent: tsarBombas,
    craterDiameter,
    craterDepth,
    fireballRadius,
    shockwaveRadius,
    thermalRadiationRadius: thermalRadius,
    earthquakeMagnitude: magnitude,
    earthquakeRadii,
    casualties,
    impactAngle: angle,
    impactVelocity: asteroid.velocity,
  };
}

/**
 * Get impact zones for map visualization
 * Zones are ordered from smallest to largest for proper legend display
 */
export function getImpactZones(results: ImpactResults): ImpactZone[] {
  const zones: ImpactZone[] = [
    {
      type: "crater",
      radius: results.craterDiameter / 2000, // Convert meters to km
      color: "#1a1a1a",
      label: "Crater",
    },
    {
      type: "fireball",
      radius: results.fireballRadius,
      color: "#dc2626",
      label: `Fireball (${results.casualties.fireball.toLocaleString()} casualties)`,
      casualties: results.casualties.fireball,
    },
    {
      type: "thermal",
      radius: results.thermalRadiationRadius,
      color: "#f97316",
      label: `Thermal Radiation (${results.casualties.thermalRadiation.toLocaleString()} casualties)`,
      casualties: results.casualties.thermalRadiation,
    },
    {
      type: "shockwave",
      radius: results.shockwaveRadius,
      color: "#facc15",
      label: `Shockwave (${results.casualties.shockwave.toLocaleString()} casualties)`,
      casualties: results.casualties.shockwave,
    },
    {
      type: "earthquake-severe",
      radius: results.earthquakeRadii.severe,
      color: "#7c2d12",
      label: `Earthquake - Severe Damage (Magnitude ${results.earthquakeMagnitude.toFixed(
        1
      )})`,
    },
    {
      type: "earthquake-moderate",
      radius: results.earthquakeRadii.moderate,
      color: "#ea580c",
      label: `Earthquake - Moderate Damage`,
    },
  ];

  return zones;
}
