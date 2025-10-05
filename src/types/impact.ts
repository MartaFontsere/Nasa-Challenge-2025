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
  earthquakeRadii: {
    severe: number; // km
    moderate: number; // km
  };

  // Casualties (estimated)
  casualties: {
    fireball: number;
    shockwave: number;
    thermalRadiation: number;
    total: number;
    populationDensity: number; // people per km²
  };

  // Additional data
  impactAngle: number; // degrees
  impactVelocity: number; // km/s
}

export interface ImpactZone {
  type:
    | "fireball"
    | "shockwave"
    | "thermal"
    | "crater"
    | "earthquake-severe"
    | "earthquake-moderate";
  radius: number; // km
  color: string;
  label: string;
  casualties?: number;
}
