export interface ImpactResults {
  // Basic properties
  asteroidMass: number; // kg
  kineticEnergy: number; // joules

  // Energy comparisons
  tntEquivalent: number; // megatons
  tsarBombaEquivalent: number; // number of Tsar Bombas

  // Crater effects
  craterDiameter: number; // meters
  craterDepth: number; // meters

  // Blast effects
  fireballRadius: number; // km
  shockwaveRadius: number; // km
  thermalRadiationRadius: number; // km

  // Environmental effects
  earthquakeMagnitude: number; // Richter scale
  tsunamiHeight: number | null; // meters (null if not ocean impact)

  // Casualties (estimated)
  casualties: {
    fireball: number;
    shockwave: number;
    thermalRadiation: number;
    tsunami: number | null; // null if not ocean impact
    total: number;
    populationDensity: number; // people per km²
  };

  // Additional data
  impactAngle: number; // degrees
  impactVelocity: number; // km/s
  isOceanImpact: boolean; // whether the impact is in ocean
}

export interface ImpactZone {
  type: "fireball" | "shockwave" | "thermal" | "crater" | "tsunami";
  radius: number; // km
  color: string;
  label: string;
  casualties?: number;
  isCoastal?: boolean; // For tsunami zones
}
