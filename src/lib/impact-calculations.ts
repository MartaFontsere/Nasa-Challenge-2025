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
 * Calculate shockwave (overpressure) radius
 * Radius where overpressure causes significant damage (~20 psi)
 * Formula: R ≈ 0.5 * Y^0.33
 * Source: Based on Glasstone & Dolan scaling laws
 */
export function calculateShockwaveRadius(energy: number): number {
  const kilotons = joulesToTNTMegatons(energy) * 1000;
  const radiusKm = 0.5 * Math.pow(kilotons, 0.33);
  return radiusKm;
}

/**
 * Calculate thermal radiation radius
 * Radius where thermal radiation causes third-degree burns
 * Formula: R ≈ 0.4 * Y^0.41
 */
export function calculateThermalRadiationRadius(energy: number): number {
  const kilotons = joulesToTNTMegatons(energy) * 1000;
  const radiusKm = 0.4 * Math.pow(kilotons, 0.41);
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
 * Calculate tsunami height for ocean impacts
 * Highly dependent on water depth, distance, and bathymetry
 * Simplified formula: H ≈ 0.1 * sqrt(D) where D is crater diameter
 * Returns null for land impacts
 */
export function calculateTsunamiHeight(
  craterDiameter: number,
  isOceanImpact: boolean
): number | null {
  if (!isOceanImpact) return null;

  // Simplified tsunami height at coast (meters)
  const height = 0.1 * Math.sqrt(craterDiameter);
  return Math.min(height, 100); // Cap at 100m for realism
}

/**
 * Estimate tsunami casualties for ocean impacts
 * PROTOTYPE: Simplified model for demonstration
 * Real implementation would need:
 * - Coastal population density data
 * - Bathymetry and topography
 * - Wave propagation models
 * - Evacuation time considerations
 */
export function estimateTsunamiCasualties(
  tsunamiHeight: number | null,
  craterDiameter: number
): number | null {
  if (!tsunamiHeight) return null;

  // Estimate affected coastal area based on tsunami reach
  // Simplified: larger craters = wider tsunami impact
  // Inundation distance roughly proportional to tsunami height
  const inundationDistanceKm = tsunamiHeight * 0.5; // Very rough estimate
  const affectedCoastlineKm = Math.sqrt(craterDiameter / 1000) * 100; // Rough estimate

  // Coastal population density (people per km of coastline)
  // Averaged for coastal urban areas
  const coastalPopDensity = 10000; // people per km

  // Area affected: coastline length * inundation distance
  const affectedArea = affectedCoastlineKm * inundationDistanceKm;

  // Mortality rate based on tsunami height
  let mortalityRate = 0.1; // 10% baseline
  if (tsunamiHeight > 10) mortalityRate = 0.5; // 50% for 10-30m
  if (tsunamiHeight > 30) mortalityRate = 0.8; // 80% for >30m

  // Estimate population in affected area
  const affectedPopulation = affectedCoastlineKm * coastalPopDensity;

  return Math.floor(affectedPopulation * mortalityRate);
}

/**
 * Estimate casualties based on impact zones and population density
 * This is a very rough estimate assuming urban population density
 * Real calculations would require GIS population data
 *
 * Useful API: WorldPop or SEDAC GPW for population density grids
 */
export function estimateCasualties(
  fireballRadius: number,
  shockwaveRadius: number,
  thermalRadius: number,
  tsunamiHeight: number | null,
  craterDiameter: number,
  populationDensity: number = POPULATION_DENSITY_URBAN
): {
  fireball: number;
  shockwave: number;
  thermalRadiation: number;
  tsunami: number | null;
  total: number;
} {
  // Area in km²
  const fireballArea = Math.PI * Math.pow(fireballRadius, 2);
  const shockwaveArea = Math.PI * Math.pow(shockwaveRadius, 2) - fireballArea;
  const thermalArea =
    Math.PI * Math.pow(thermalRadius, 2) - fireballArea - shockwaveArea;

  // Casualties (100% in fireball, 80% in shockwave, 30% in thermal)
  const fireballCasualties = Math.floor(fireballArea * populationDensity * 1.0);
  const shockwaveCasualties = Math.floor(
    shockwaveArea * populationDensity * 0.8
  );
  const thermalCasualties = Math.floor(thermalArea * populationDensity * 0.3);

  // Tsunami casualties (if ocean impact)
  const tsunamiCasualties = estimateTsunamiCasualties(
    tsunamiHeight,
    craterDiameter
  );

  return {
    fireball: fireballCasualties,
    shockwave: shockwaveCasualties,
    thermalRadiation: thermalCasualties,
    tsunami: tsunamiCasualties,
    total:
      fireballCasualties +
      shockwaveCasualties +
      thermalCasualties +
      (tsunamiCasualties || 0),
  };
}

/**
 * Check if impact location is in ocean
 * This is a placeholder - in real implementation, use a geography API
 * Useful API: OpenStreetMap Nominatim reverse geocoding
 * https://nominatim.openstreetmap.org/
 */
export function isOceanImpact(lat: number, lng: number): boolean {
  // Hardcoded to true for demonstration purposes
  // In production, use a geography API or dataset
  return true;
}

/**
 * Main function to calculate all impact effects
 */
export function calculateImpactEffects(
  asteroid: Asteroid,
  angle: number,
  location: { lat: number; lng: number }
): ImpactResults {
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
  const isOcean = isOceanImpact(location.lat, location.lng);
  const tsunamiHeight = calculateTsunamiHeight(craterDiameter, isOcean);

  // Estimate casualties
  const casualties = estimateCasualties(
    fireballRadius,
    shockwaveRadius,
    thermalRadius,
    tsunamiHeight,
    craterDiameter
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
    tsunamiHeight,
    casualties,
    impactAngle: angle,
    impactVelocity: asteroid.velocity,
  };
}

/**
 * Get impact zones for map visualization
 */
export function getImpactZones(results: ImpactResults): ImpactZone[] {
  return [
    {
      type: "crater",
      radius: results.craterDiameter / 2000, // Convert to km
      color: "#000000",
      label: "Crater",
    },
    {
      type: "fireball",
      radius: results.fireballRadius,
      color: "#ff4500",
      label: `Fireball (${results.casualties.fireball.toLocaleString()} casualties)`,
      casualties: results.casualties.fireball,
    },
    {
      type: "thermal",
      radius: results.thermalRadiationRadius,
      color: "#ffa500",
      label: `Thermal Radiation (${results.casualties.thermalRadiation.toLocaleString()} casualties)`,
      casualties: results.casualties.thermalRadiation,
    },
    {
      type: "shockwave",
      radius: results.shockwaveRadius,
      color: "#ffff00",
      label: `Shockwave (${results.casualties.shockwave.toLocaleString()} casualties)`,
      casualties: results.casualties.shockwave,
    },
  ];
}
