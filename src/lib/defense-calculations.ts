import type { Asteroid } from "@/types/asteroid";

/**
 * Defense Mission Calculations
 * Based on NASA's planetary defense strategies and mission physics
 */

export interface DefenseMission {
  timelineMonths: number; // Time until impact
  deltaVRequired: number; // m/s velocity change needed
  asteroidMass: number; // kg
  asteroidVelocity: number; // km/s
  interceptDistance: number; // million km from Earth
}

export interface DefenseSystemOption {
  type: "kinetic-impactor" | "gravity-tractor" | "nuclear-pulse";
  name: string;
  description: string;
  efficiency: number; // 0-1, how efficient at momentum transfer
  costPerKg: number; // Million USD per kg of payload
  minTimelineMonths: number; // Minimum time needed
  maxTimelineMonths: number; // Maximum effective time
}

export interface DefenseCost {
  spacecraftMassKg: number;
  launchCostMillionUSD: number;
  developmentCostMillionUSD: number;
  totalCostMillionUSD: number;
  successProbability: number; // 0-1
  description: string;
}

// Defense system specifications
export const DEFENSE_SYSTEMS: DefenseSystemOption[] = [
  {
    type: "kinetic-impactor",
    name: "Kinetic Impactor",
    description:
      "High-speed spacecraft collision. Like NASA's DART mission. Best for small-medium asteroids with adequate warning time.",
    efficiency: 1.0, // Direct momentum transfer
    costPerKg: 20, // Million USD per kg
    minTimelineMonths: 6,
    maxTimelineMonths: 120, // 10 years
  },
  {
    type: "gravity-tractor",
    name: "Gravity Tractor",
    description:
      "Spacecraft hovers near asteroid, using gravitational pull to slowly change trajectory. Best for very long lead times.",
    efficiency: 0.001, // Very slow but precise
    costPerKg: 30, // More expensive, needs long-duration systems
    minTimelineMonths: 60, // 5 years minimum
    maxTimelineMonths: 240, // 20 years
  },
  {
    type: "nuclear-pulse",
    name: "Nuclear Pulse Deflection",
    description:
      "Nuclear detonation near asteroid surface. Most powerful option for large asteroids or short warning times.",
    efficiency: 50.0, // Massive energy release
    costPerKg: 50, // Most expensive, includes nuclear payload
    minTimelineMonths: 3,
    maxTimelineMonths: 60, // 5 years
  },
];

/**
 * Calculate the delta-v (velocity change) needed to deflect the asteroid
 * Based on the Öpik approximation and planetary defense models
 *
 * Formula considerations:
 * - Earlier deflection requires less delta-v
 * - Larger asteroids need more momentum change
 * - The required deflection distance is roughly Earth's diameter
 */
export function calculateDeltaVRequired(
  asteroid: Asteroid,
  timelineMonths: number
): DefenseMission {
  const timelineSeconds = timelineMonths * 30 * 24 * 3600; // Convert to seconds
  const asteroidVelocityMs = asteroid.velocity * 1000; // Convert km/s to m/s

  // Calculate asteroid mass (assuming spherical)
  const radiusM = asteroid.diameter / 2;
  const volume = (4 / 3) * Math.PI * Math.pow(radiusM, 3);
  const density =
    asteroid.composition === "metallic"
      ? 8000
      : asteroid.composition === "rocky"
      ? 3000
      : 1000; // kg/m³
  const asteroidMass = density * volume;

  // Required deflection distance: roughly Earth's diameter (12,742 km)
  const deflectionDistanceKm = 15000; // km (with safety margin)
  const deflectionDistanceM = deflectionDistanceKm * 1000;

  // Calculate required velocity change using kinematic equations
  // Δx = v₀ * t + 0.5 * a * t²
  // For small deflections over long time: Δv = Δx / t
  const deltaVRequired = deflectionDistanceM / timelineSeconds; // m/s

  // Calculate intercept distance (further for longer timelines)
  // Rough estimate: distance = velocity × time
  const interceptDistanceKm = (asteroidVelocityMs * timelineSeconds) / 1000;
  const interceptDistanceMillionKm = interceptDistanceKm / 1_000_000;

  return {
    timelineMonths,
    deltaVRequired,
    asteroidMass,
    asteroidVelocity: asteroid.velocity,
    interceptDistance: Math.min(interceptDistanceMillionKm, 1000), // Cap at 1000 million km
  };
}

/**
 * Calculate the cost and feasibility of a defense mission
 */
export function calculateDefenseCost(
  mission: DefenseMission,
  systemType: DefenseSystemOption["type"]
): DefenseCost {
  const system = DEFENSE_SYSTEMS.find((s) => s.type === systemType);
  if (!system) {
    throw new Error(`Unknown defense system: ${systemType}`);
  }

  // Check if timeline is within system's operational range
  const isTimelineTooShort = mission.timelineMonths < system.minTimelineMonths;
  const isTimelineTooLong = mission.timelineMonths > system.maxTimelineMonths;

  // Calculate required momentum change: Δp = m × Δv
  const momentumChangeNeeded = mission.asteroidMass * mission.deltaVRequired;

  // Calculate spacecraft mass needed based on system efficiency
  // All systems now heavily influenced by delta-v requirement
  let spacecraftMassKg: number;

  switch (systemType) {
    case "kinetic-impactor":
      // Momentum: m_spacecraft × v_spacecraft = efficiency × m_asteroid × Δv
      // Assuming spacecraft velocity ~10 km/s relative impact
      const impactVelocity = 10000; // m/s
      const baseMassKinetic =
        momentumChangeNeeded / (system.efficiency * impactVelocity);
      // Scale significantly with delta-v
      spacecraftMassKg = baseMassKinetic * (1 + mission.deltaVRequired * 100);
      spacecraftMassKg = Math.max(500, Math.min(spacecraftMassKg, 20000));
      // Round to nearest 100 kg
      spacecraftMassKg = Math.round(spacecraftMassKg / 100) * 100;
      break;

    case "gravity-tractor":
      // Needs larger spacecraft for extended operations
      // Heavily scaled with delta-v requirement
      const baseMass = 2000; // ~2 tons baseline
      spacecraftMassKg = baseMass + mission.deltaVRequired * 500; // Heavy scaling with Δv
      spacecraftMassKg = Math.max(1500, Math.min(spacecraftMassKg, 15000));
      // Round to nearest 100 kg
      spacecraftMassKg = Math.round(spacecraftMassKg / 100) * 100;
      break;

    case "nuclear-pulse":
      // Nuclear payload scales with required energy
      const baseNuclearMass = 5000; // ~5 tons baseline
      spacecraftMassKg = baseNuclearMass + mission.deltaVRequired * 1000; // Largest scaling
      spacecraftMassKg = Math.max(4000, Math.min(spacecraftMassKg, 25000));
      // Round to nearest 100 kg
      spacecraftMassKg = Math.round(spacecraftMassKg / 100) * 100;
      break;
  }

  // Calculate costs - significantly influenced by delta-v
  // Higher delta-v means exponentially more fuel, larger spacecraft, higher precision needed
  // Delta-v is typically 0.001 to 10 m/s, so we scale it up significantly
  const deltaVCostMultiplier = 1 + mission.deltaVRequired * 50; // Direct multiplier - makes delta-v very impactful
  const rawLaunchCost =
    spacecraftMassKg * system.costPerKg * deltaVCostMultiplier;

  // Development costs (varies by system complexity)
  const developmentCostMultiplier = {
    "kinetic-impactor": 2,
    "gravity-tractor": 3,
    "nuclear-pulse": 5,
  };
  const rawDevelopmentCost =
    rawLaunchCost * developmentCostMultiplier[systemType];

  // Round costs to nearest 100 million
  const launchCost = Math.round(rawLaunchCost / 100) * 100;
  const developmentCost = Math.round(rawDevelopmentCost / 100) * 100;
  const totalCost = launchCost + developmentCost;

  // Calculate success probability
  let successProbability = 0.85; // Base probability

  // Reduce probability if timeline is too short
  if (isTimelineTooShort) {
    const shortfall = system.minTimelineMonths - mission.timelineMonths;
    successProbability *= Math.max(
      0.2,
      1 - shortfall / system.minTimelineMonths
    );
  }

  // Reduce probability if timeline is too long (mission complexity)
  if (isTimelineTooLong) {
    successProbability *= 0.7;
  }

  // Adjust for asteroid size (larger = harder)
  if (mission.asteroidMass > 1e12) {
    // > 1 trillion kg
    successProbability *= 0.8;
  }

  // System-specific adjustments
  if (systemType === "gravity-tractor" && mission.timelineMonths >= 60) {
    successProbability = Math.min(0.95, successProbability + 0.1); // Very reliable with time
  }
  if (systemType === "nuclear-pulse") {
    successProbability *= 0.9; // Slightly more risk
  }

  let description = "";
  if (isTimelineTooShort) {
    description =
      "⚠️ Warning: Timeline is too short for optimal mission success. Risk is elevated.";
  } else if (isTimelineTooLong) {
    description =
      "ℹ️ Long timeline increases mission complexity but allows for better preparation.";
  } else {
    description = "✓ Timeline is within optimal range for this defense system.";
  }

  return {
    spacecraftMassKg: Math.round(spacecraftMassKg),
    launchCostMillionUSD: Math.round(launchCost),
    developmentCostMillionUSD: Math.round(developmentCost),
    totalCostMillionUSD: Math.round(totalCost),
    successProbability: Math.max(0, Math.min(1, successProbability)),
    description,
  };
}

/**
 * Get reasonable timeline range based on asteroid properties
 */
export function getTimelineRange(asteroid: Asteroid): {
  min: number;
  max: number;
  recommended: number;
} {
  // Smaller asteroids are easier to deflect, need less time
  // Larger asteroids need more preparation time
  const diameterKm = asteroid.diameter / 1000;

  if (diameterKm < 0.1) {
    // < 100m
    return { min: 3, max: 60, recommended: 12 }; // 3 months to 5 years
  }
  if (diameterKm < 0.5) {
    // < 500m
    return { min: 6, max: 120, recommended: 36 }; // 6 months to 10 years
  }
  if (diameterKm < 1) {
    // < 1km
    return { min: 12, max: 180, recommended: 60 }; // 1 year to 15 years
  }
  // >= 1km (extinction level)
  return { min: 24, max: 240, recommended: 120 }; // 2 years to 20 years
}
