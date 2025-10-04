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
 * Calculate tsunami parameters for ocean impacts
 * Based on Ward & Asphaug (2000) and Korycansky & Lynett (2005)
 *
 * Simplified model:
 * 1. Initial wave height at source ~ crater depth
 * 2. Wave propagates radially from impact
 * 3. Wave height decreases with distance but amplifies near coast
 * 4. Coastal run-up height is 2-4x the offshore wave height
 *
 * Returns null for land impacts
 */
export function calculateTsunamiHeight(
  craterDiameter: number,
  isOceanImpact: boolean
): number | null {
  if (!isOceanImpact) return null;

  // Initial wave height is roughly equal to crater depth
  const craterDepth = calculateCraterDepth(craterDiameter);

  // Deep ocean wave height (meters)
  // Decreases as wave spreads out, but we calculate at ~100km from impact
  const deepOceanWaveHeight = craterDepth * 0.3;

  // Coastal run-up amplification factor (2-4x)
  // Depends on bathymetry and coastal slope
  const runUpFactor = 3.0;

  const coastalHeight = deepOceanWaveHeight * runUpFactor;

  // Cap at realistic maximum (2004 Indian Ocean tsunami was ~30m in some places)
  return Math.min(coastalHeight, 50);
}

/**
 * Calculate tsunami propagation radius
 * Tsunamis can travel thousands of km across oceans
 * Simplified: based on energy and ocean depth
 */
export function calculateTsunamiRadius(craterDiameter: number): number {
  // Tsunami propagation distance in km
  // Larger impacts create tsunamis that travel further
  // Using square root scaling for energy dissipation
  const baseRadius = Math.sqrt(craterDiameter / 1000) * 500; // km

  // Cap at reasonable ocean-crossing distance
  return Math.min(baseRadius, 5000); // Max 5000 km
}

/**
 * Estimate tsunami casualties for ocean impacts
 * Simplified model considering:
 * - Coastal population within tsunami reach
 * - Wave height impact on mortality
 * - Assumes some warning time for evacuation
 */
export function estimateTsunamiCasualties(
  tsunamiHeight: number | null,
  craterDiameter: number
): number | null {
  if (!tsunamiHeight) return null;

  // Calculate affected coastal perimeter
  const tsunamiRadius = calculateTsunamiRadius(craterDiameter);

  // Approximate affected coastline (assuming tsunami spreads in all directions)
  // But only ~30% of the perimeter is likely to be coastline
  const potentialCoastlineKm = 2 * Math.PI * tsunamiRadius * 0.3;

  // Average coastal population density (people per km of coastline)
  // Global average for populated coasts: ~5000 people/km
  const coastalPopDensity = 5000;

  // Inundation distance inland (how far the wave travels on land)
  // Roughly proportional to wave height
  const inundationDistanceKm = tsunamiHeight * 0.1; // 10m wave goes ~1km inland

  // Total affected coastal population
  const affectedPopulation = potentialCoastlineKm * coastalPopDensity;

  // Mortality rate based on wave height and assuming some warning/evacuation
  let mortalityRate = 0.05; // 5% baseline (with some warning)
  if (tsunamiHeight > 5) mortalityRate = 0.15; // 15% for 5-10m
  if (tsunamiHeight > 10) mortalityRate = 0.3; // 30% for 10-20m
  if (tsunamiHeight > 20) mortalityRate = 0.5; // 50% for >20m

  const casualties = Math.floor(affectedPopulation * mortalityRate);

  // Cap at reasonable maximum
  return Math.min(casualties, 10_000_000); // Max 10 million
}

/**
 * Fetch population density for a location using OpenStreetMap data
 * Falls back to default urban density if API fails
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

      // Estimate population density based on location type
      const addressType = data.addresstype || data.type;

      // Urban areas
      if (addressType === "city" || addressType === "town") {
        return 3000; // High density urban
      }
      if (addressType === "village" || addressType === "suburb") {
        return 1000; // Medium density
      }
      if (addressType === "hamlet" || addressType === "isolated_dwelling") {
        return 100; // Low density rural
      }

      // Check if it's a major city by name
      const cityName = data.address?.city || data.address?.town || "";
      const majorCities = [
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
      ];
      if (majorCities.some((city) => cityName.toLowerCase().includes(city))) {
        return 10000; // Very high density for major cities
      }

      // Ocean or uninhabited
      if (!data.address || data.type === "sea" || data.type === "ocean") {
        return 0;
      }
    }
  } catch (error) {
    console.warn("Failed to fetch population density, using default", error);
  }

  // Default to moderate urban density
  return POPULATION_DENSITY_URBAN;
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
  tsunamiHeight: number | null,
  craterDiameter: number,
  location: { lat: number; lng: number }
): Promise<{
  fireball: number;
  shockwave: number;
  thermalRadiation: number;
  tsunami: number | null;
  total: number;
  populationDensity: number;
}> {
  // Get population density for the impact location
  const populationDensity = await getPopulationDensity(
    location.lat,
    location.lng
  );

  // Calculate areas for each zone
  // Ensure proper ordering: fireball < thermal < shockwave
  const fireballArea = Math.PI * Math.pow(fireballRadius, 2);
  const thermalTotalArea = Math.PI * Math.pow(thermalRadius, 2);
  const shockwaveTotalArea = Math.PI * Math.pow(shockwaveRadius, 2);

  // Non-overlapping areas (ensure no negative values)
  const thermalArea = Math.max(0, thermalTotalArea - fireballArea);
  const shockwaveArea = Math.max(0, shockwaveTotalArea - thermalTotalArea);

  // Improved mortality rates based on blast effects research
  // Fireball: 100% mortality (complete vaporization)
  // Thermal: 70% mortality (severe burns, fires, radiation)
  // Shockwave: 40% mortality (overpressure, building damage, debris)
  const fireballCasualties = Math.floor(fireballArea * populationDensity * 1.0);
  const thermalCasualties = Math.floor(thermalArea * populationDensity * 0.7);
  const shockwaveCasualties = Math.floor(
    shockwaveArea * populationDensity * 0.4
  );

  // Tsunami casualties (if ocean impact)
  const tsunamiCasualties = estimateTsunamiCasualties(
    tsunamiHeight,
    craterDiameter
  );

  // Calculate total and cap at Earth's population
  const uncappedTotal =
    fireballCasualties +
    shockwaveCasualties +
    thermalCasualties +
    (tsunamiCasualties || 0);

  const total = Math.min(uncappedTotal, EARTH_POPULATION);

  return {
    fireball: fireballCasualties,
    shockwave: shockwaveCasualties,
    thermalRadiation: thermalCasualties,
    tsunami: tsunamiCasualties,
    total,
    populationDensity, // Include for debugging/display
  };
}

/**
 * Check if impact location is in ocean
 * Uses a simple heuristic based on major ocean areas
 * For production: use OpenStreetMap Nominatim reverse geocoding
 * https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lng}
 */
export async function isOceanImpact(
  lat: number,
  lng: number
): Promise<boolean> {
  // Try to use a free reverse geocoding API
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=3`,
      {
        headers: {
          "User-Agent": "NASA-Challenge-Impact-Simulator",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      // Check if the location is in ocean (no address components or specific ocean markers)
      const isOcean =
        !data.address ||
        data.type === "sea" ||
        data.type === "ocean" ||
        (data.class === "natural" && data.type === "water");
      return isOcean;
    }
  } catch (error) {
    console.warn("Failed to fetch ocean data, using fallback heuristic", error);
  }

  // Fallback: Simple heuristic based on major ocean areas
  // This is approximate and not accurate for all cases
  return isOceanImpactHeuristic(lat, lng);
}

/**
 * Fallback heuristic for ocean detection
 * Based on approximate ocean coverage
 */
function isOceanImpactHeuristic(lat: number, lng: number): boolean {
  // Major ocean areas (very simplified)
  // Pacific Ocean: large area
  if (lat > -60 && lat < 60 && lng > 120 && lng < -70) return true;
  if (lat > -60 && lat < 60 && lng > -180 && lng < -100) return true;

  // Atlantic Ocean
  if (lat > -60 && lat < 60 && lng > -70 && lng < 20) {
    // Exclude Americas and Europe/Africa
    if (!(lng > -100 && lng < -30 && lat > -55 && lat < 70)) {
      if (!(lng > -20 && lng < 50 && lat > -35 && lat < 70)) {
        return true;
      }
    }
  }

  // Indian Ocean
  if (lat > -60 && lat < 30 && lng > 20 && lng < 120) {
    // Exclude Africa, Middle East, and Asia
    if (!(lng > 20 && lng < 60 && lat > -35 && lat < 40)) {
      if (!(lng > 60 && lng < 100 && lat > 0 && lat < 40)) {
        return true;
      }
    }
  }

  // Default to land
  return false;
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
  const isOcean = await isOceanImpact(location.lat, location.lng);
  const tsunamiHeight = calculateTsunamiHeight(craterDiameter, isOcean);

  // Estimate casualties with location-based population density
  const casualties = await estimateCasualties(
    fireballRadius,
    shockwaveRadius,
    thermalRadius,
    tsunamiHeight,
    craterDiameter,
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
    tsunamiHeight,
    casualties,
    impactAngle: angle,
    impactVelocity: asteroid.velocity,
    isOceanImpact: isOcean,
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
      color: "#000000",
      label: "Crater",
    },
    {
      type: "fireball",
      radius: results.fireballRadius,
      color: "#ff0000",
      label: `Fireball (${results.casualties.fireball.toLocaleString()} casualties)`,
      casualties: results.casualties.fireball,
    },
    {
      type: "thermal",
      radius: results.thermalRadiationRadius,
      color: "#ff8800",
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

  // Add tsunami zone only for ocean impacts
  if (
    results.isOceanImpact &&
    results.tsunamiHeight !== null &&
    results.casualties.tsunami !== null
  ) {
    // Calculate realistic tsunami propagation radius
    const tsunamiRadius = calculateTsunamiRadius(results.craterDiameter);
    zones.push({
      type: "tsunami",
      radius: tsunamiRadius,
      color: "#0088ff",
      label: `Tsunami Affected Area (${results.casualties.tsunami.toLocaleString()} casualties, ${results.tsunamiHeight.toFixed(
        1
      )}m coastal waves)`,
      casualties: results.casualties.tsunami,
      isCoastal: true,
    });
  }

  return zones;
}
