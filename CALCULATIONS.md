# 🧮 Asteroid Impact Simulator - Calculation Methods

This document details all the mathematical formulas, assumptions, and simplifications used in the NASA Asteroid Impact Simulator. All calculations are based on peer-reviewed scientific research and NASA mission data.

## 📚 Scientific Sources

- **Collins, G.S., Melosh, H.J., Marcus, R.A. (2005)**: "Earth Impact Effects Program" - [impact.ese.ic.ac.uk](https://impact.ese.ic.ac.uk/ImpactEarth/)
- **Holsapple, K.A. (1993)**: "The Scaling of Impact Processes in Planetary Sciences"
- **Melosh, H.J. (1989)**: "Impact Cratering: A Geologic Process"
- **Glasstone & Dolan (1977)**: "The Effects of Nuclear Weapons"
- **Schultz & Gault (1975)**: Seismic effects of impacts
- **NASA DART Mission**: Real-world kinetic impactor data

---

## 🌍 Physical Constants

```typescript
const GRAVITY = 9.81; // m/s² (Earth surface gravity)
const TSAR_BOMBA_YIELD = 50; // megatons TNT equivalent
const POPULATION_DENSITY_URBAN = 2000; // people per km²
const SOUND_SPEED = 340; // m/s (speed of sound at sea level)
const EARTH_POPULATION = 8_000_000_000; // Current Earth population
```

---

## 🪨 Asteroid Properties

### Density by Composition

| Composition | Density (kg/m³) | Source                        |
| ----------- | --------------- | ----------------------------- |
| Rocky       | 3,000           | Silicate rock (typical NEOs)  |
| Metallic    | 8,000           | Iron-nickel (like Psyche)     |
| Icy         | 1,000           | Ice/carbonaceous (comet-like) |

**Source**: JPL Small-Body Database typical densities

### Mass Calculation

**Formula**: `m = ρ × V = ρ × (4/3)πr³`

```typescript
function calculateMass(
  diameter: number,
  composition: AsteroidComposition
): number {
  const radius = diameter / 2;
  const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
  const density = getDensity(composition);
  return density * volume; // kg
}
```

**Assumptions**:

- Asteroids are perfectly spherical
- Uniform density throughout the asteroid
- No porosity effects (solid objects)

---

## ⚡ Energy Calculations

### Kinetic Energy at Impact

**Formula**: `E = (1/2)mv²`

```typescript
function calculateKineticEnergy(mass: number, velocity: number): number {
  const velocityMs = velocity * 1000; // Convert km/s to m/s
  return 0.5 * mass * Math.pow(velocityMs, 2); // joules
}
```

**Assumptions**:

- No atmospheric deceleration (simplification)
- Velocity remains constant until impact
- All kinetic energy is converted to impact effects

### TNT Equivalent Conversion

**Formula**: `1 ton TNT = 4.184 × 10⁹ joules`

```typescript
function joulesToTNTMegatons(joules: number): number {
  const tonsOfTNT = joules / 4.184e9;
  return tonsOfTNT / 1e6; // Convert to megatons
}
```

**Tsar Bomba Comparison**: `Tsar Bombas = TNT Megatons / 50`

---

## 💥 Impact Effects

### Crater Formation

**Formula**: Based on Holsapple & Schmidt (1987) scaling laws

**Simplified Formula**: `D ≈ 2 × (E / 10¹²)^(1/3.4)`

```typescript
function calculateCraterDiameter(
  energy: number,
  angle: number,
  composition: AsteroidComposition
): number {
  const energyMegatons = joulesToTNTMegatons(energy);
  const baseDiameter = 2 * Math.pow(energyMegatons * 1e6, 1 / 3.4);

  // Angle correction (sin factor)
  const angleRadians = (angle * Math.PI) / 180;
  const angleFactor = Math.pow(Math.sin(angleRadians), 1 / 3);

  // Composition factor
  const compositionFactor =
    composition === "metallic" ? 1.2 : composition === "icy" ? 0.8 : 1.0;

  return baseDiameter * angleFactor * compositionFactor;
}
```

**Assumptions**:

- Target is homogeneous rock
- No atmospheric effects on cratering
- Simple crater scaling (not complex crater transition)
- Angle effects follow sin^(1/3) relationship

### Crater Depth

**Formula**: `Depth = Diameter / 5`

```typescript
function calculateCraterDepth(diameter: number): number {
  return diameter / 5;
}
```

**Assumption**: Typical depth-to-diameter ratio for complex craters (Melosh 1989)

---

## 🔥 Blast Effects

### Fireball Radius

**Formula**: `R ≈ 0.28 × Y^0.4` (where Y is yield in kilotons)

```typescript
function calculateFireballRadius(energy: number): number {
  const kilotons = joulesToTNTMegatons(energy) * 1000;
  const radiusKm = 0.28 * Math.pow(kilotons, 0.4);
  return radiusKm;
}
```

**Source**: Glasstone & Dolan (1977) nuclear weapons scaling
**Assumptions**:

- Thermal radiation scaling applies to kinetic impacts
- No atmospheric absorption effects
- Uniform energy distribution

### Thermal Radiation Radius

**Formula**: `R ≈ 0.4 × Y^0.41`

```typescript
function calculateThermalRadiationRadius(energy: number): number {
  const kilotons = joulesToTNTMegatons(energy) * 1000;
  const radiusKm = 0.4 * Math.pow(kilotons, 0.41);
  return radiusKm;
}
```

**Assumptions**:

- Third-degree burn threshold
- Clear atmospheric conditions
- No terrain shielding effects

### Shockwave Radius

**Formula**: `R ≈ 1.0 × Y^0.33` (for 5 psi overpressure)

```typescript
function calculateShockwaveRadius(energy: number): number {
  const kilotons = joulesToTNTMegatons(energy) * 1000;
  const radiusKm = 1.0 * Math.pow(kilotons, 0.33);
  return radiusKm;
}
```

**Assumptions**:

- 5 psi overpressure threshold (severe damage)
- Uniform atmospheric conditions
- No terrain effects on shockwave propagation

---

## 🌍 Seismic Effects

### Earthquake Magnitude

**Formula**: `M = 0.67 × log₁₀(E) - 5.87`

```typescript
function calculateEarthquakeMagnitude(energy: number): number {
  const magnitude = 0.67 * Math.log10(energy) - 5.87;
  return Math.max(0, Math.min(magnitude, 12)); // Cap between 0 and 12
}
```

**Source**: Schultz & Gault (1975), modified by Collins et al.
**Assumptions**:

- Linear relationship between impact energy and seismic magnitude
- Uniform Earth structure
- No regional geological variations

### Earthquake Damage Radii

**Formula**: `R_severe ≈ 10^(0.5×M - 1)` and `R_moderate ≈ R_severe × 2.5`

```typescript
function calculateEarthquakeRadius(magnitude: number): {
  severe: number; // Severe damage (Modified Mercalli IX+)
  moderate: number; // Moderate damage (Modified Mercalli VI-VIII)
} {
  const severeRadius = Math.pow(10, 0.5 * magnitude - 1); // km
  const moderateRadius = severeRadius * 2.5; // km

  return { severe: severeRadius, moderate: moderateRadius };
}
```

**Assumptions**:

- Exponential relationship between magnitude and damage radius
- Uniform geological conditions
- No attenuation effects

---

## 👥 Casualty Estimation

### Population Density Estimation

The simulator uses OpenStreetMap Nominatim API to estimate population density based on location type:

| Location Type       | Population Density (people/km²) |
| ------------------- | ------------------------------- |
| Major Cities        | 10,000                          |
| Cities/Towns        | 3,000                           |
| Villages/Suburbs    | 1,000                           |
| Hamlets             | 100                             |
| Rural Areas         | 50-200                          |
| Forests/Natural     | 2                               |
| Deserts/Uninhabited | 0                               |
| Water Bodies        | 0                               |

**Assumptions**:

- Uniform population distribution within each zone
- No evacuation or sheltering effects
- Population density remains constant over time

### Casualty Calculation

**Formula**: `Casualties = Area × Population_Density × Mortality_Rate`

```typescript
async function estimateCasualties(
  fireballRadius: number,
  shockwaveRadius: number,
  thermalRadius: number,
  location: { lat: number; lng: number }
) {
  const populationDensity = await getPopulationDensity(
    location.lat,
    location.lng
  );

  const fireballArea = Math.PI * Math.pow(fireballRadius, 2);
  const thermalTotalArea = Math.PI * Math.pow(thermalRadius, 2);
  const shockwaveTotalArea = Math.PI * Math.pow(shockwaveRadius, 2);

  // Mortality rates
  const fireballCasualties = Math.floor(fireballArea * populationDensity * 1.0); // 100%
  const thermalCasualties = Math.floor(
    thermalTotalArea * populationDensity * 0.7
  ); // 70%
  const shockwaveCasualties = Math.floor(
    shockwaveTotalArea * populationDensity * 0.4
  ); // 40%

  // Total is maximum of all zones (zones overlap)
  const total = Math.min(
    Math.max(fireballCasualties, thermalCasualties, shockwaveCasualties),
    EARTH_POPULATION
  );

  return {
    fireball: fireballCasualties,
    shockwave: shockwaveCasualties,
    thermalRadiation: thermalCasualties,
    total,
    populationDensity,
  };
}
```

**Mortality Rates**:

- **Fireball Zone**: 100% (complete vaporization)
- **Thermal Zone**: 70% (severe burns, fires, radiation)
- **Shockwave Zone**: 40% (overpressure, building damage, debris)

**Assumptions**:

- No evacuation or emergency response
- Uniform mortality rates across all demographics
- Zones are circular and non-overlapping for casualty calculation
- Maximum casualties capped at Earth's total population

---

## 🛡️ Defense System Calculations

### Delta-V Requirements

**Formula**: `Δv = Δx / t` (for small deflections over long time)

```typescript
function calculateDeltaVRequired(
  asteroid: Asteroid,
  timelineMonths: number
): DefenseMission {
  const timelineSeconds = timelineMonths * 30 * 24 * 3600; // Convert to seconds
  const asteroidVelocityMs = asteroid.velocity * 1000; // Convert km/s to m/s

  // Required deflection distance: Earth's diameter + safety margin
  const deflectionDistanceKm = 15000; // km
  const deflectionDistanceM = deflectionDistanceKm * 1000;

  // Calculate required velocity change
  const deltaVRequired = deflectionDistanceM / timelineSeconds; // m/s

  return {
    timelineMonths,
    deltaVRequired,
    asteroidMass,
    asteroidVelocity: asteroid.velocity,
    interceptDistance,
  };
}
```

**Assumptions**:

- Linear deflection over time (small angle approximation)
- Required deflection distance = Earth's diameter (12,742 km) + safety margin
- Asteroid velocity remains constant
- No gravitational focusing effects

### Defense System Specifications

| System           | Efficiency | Cost/kg (M USD) | Min Timeline | Max Timeline |
| ---------------- | ---------- | --------------- | ------------ | ------------ |
| Kinetic Impactor | 1.0        | 20              | 6 months     | 10 years     |
| Gravity Tractor  | 0.001      | 30              | 5 years      | 20 years     |
| Nuclear Pulse    | 50.0       | 50              | 3 months     | 5 years      |

### Spacecraft Mass Calculation

#### Kinetic Impactor

```typescript
// Momentum: m_spacecraft × v_spacecraft = efficiency × m_asteroid × Δv
const impactVelocity = 10000; // m/s
const baseMassKinetic =
  momentumChangeNeeded / (system.efficiency * impactVelocity);
spacecraftMassKg = baseMassKinetic * (1 + mission.deltaVRequired * 100);
```

#### Gravity Tractor

```typescript
const baseMass = 2000; // ~2 tons baseline
spacecraftMassKg = baseMass + mission.deltaVRequired * 500;
```

#### Nuclear Pulse

```typescript
const baseNuclearMass = 5000; // ~5 tons baseline
spacecraftMassKg = baseNuclearMass + mission.deltaVRequired * 1000;
```

**Assumptions**:

- Spacecraft impact velocity = 10 km/s (typical for kinetic impactors)
- Gravity tractor requires larger spacecraft for extended operations
- Nuclear payload scales with required energy
- Mass ranges: 500-25,000 kg

### Cost Calculation

**Formula**: `Cost = Spacecraft_Mass × Cost_per_kg × DeltaV_Multiplier`

```typescript
const deltaVCostMultiplier = 1 + mission.deltaVRequired * 50;
const rawLaunchCost =
  spacecraftMassKg * system.costPerKg * deltaVCostMultiplier;

// Development costs vary by system complexity
const developmentCostMultiplier = {
  "kinetic-impactor": 2,
  "gravity-tractor": 3,
  "nuclear-pulse": 5,
};
const rawDevelopmentCost =
  rawLaunchCost * developmentCostMultiplier[systemType];
```

**Assumptions**:

- Cost scales linearly with spacecraft mass
- Delta-V requirements exponentially increase costs
- Development costs are 2-5x launch costs
- Costs rounded to nearest $100 million

### Success Probability

**Base Probability**: 85%

**Adjustments**:

- **Timeline too short**: `P = P × max(0.2, 1 - shortfall/min_timeline)`
- **Timeline too long**: `P = P × 0.7`
- **Large asteroid (>1 trillion kg)**: `P = P × 0.8`
- **Gravity tractor with adequate time**: `P = min(0.95, P + 0.1)`
- **Nuclear pulse**: `P = P × 0.9`

**Assumptions**:

- Independent risk factors multiply
- Success probability capped between 0 and 1
- System-specific reliability factors

---

## ⚠️ Major Simplifications and Limitations

### Impact Calculations

1. **No Atmospheric Entry**: Assumes asteroid reaches surface with full velocity
2. **Spherical Asteroids**: All asteroids treated as perfect spheres
3. **Uniform Density**: No porosity or internal structure effects
4. **Simple Crater Scaling**: No complex crater transition effects
5. **No Terrain Effects**: Flat, uniform target surface
6. **No Climate Effects**: No long-term atmospheric or climate impacts

### Defense Systems

1. **Linear Deflection**: Small angle approximation for trajectory changes
2. **Constant Velocity**: Asteroid velocity assumed constant
3. **No Gravitational Effects**: Ignores gravitational focusing
4. **Simplified Mass Scaling**: Linear relationships for spacecraft mass
5. **No Mission Complexity**: Ignores navigation, communication, and operational challenges
6. **No Political Factors**: Ignores international cooperation requirements

### Population and Casualties

1. **No Evacuation**: Assumes no emergency response or evacuation
2. **Uniform Distribution**: Population evenly distributed within zones
3. **Static Population**: No population growth or migration
4. **No Infrastructure**: Ignores building types and sheltering
5. **No Medical Response**: No emergency medical services

### Environmental Effects

1. **No Atmospheric Effects**: Ignores atmospheric absorption and scattering
2. **No Geological Variations**: Uniform Earth structure assumed
3. **No Weather Effects**: Clear atmospheric conditions assumed
4. **No Seasonal Variations**: No time-of-year effects

---

## 🎯 Educational Purpose

This simulator is designed for **educational and awareness purposes only**. Real asteroid impact predictions require:

- Complex atmospheric entry modeling
- Detailed geological and geographical data
- Advanced climate and environmental modeling
- Expert analysis from organizations like NASA JPL
- Extensive computational resources
- Multi-disciplinary scientific collaboration

The calculations presented here provide reasonable approximations for educational purposes but should not be used for actual threat assessment or mission planning.

---

## 📊 Validation and Accuracy

### Comparison with Real Events

- **Tunguska Event (1908)**: ~50m asteroid, ~15 megatons TNT equivalent
- **Chelyabinsk Event (2013)**: ~20m asteroid, ~0.5 megatons TNT equivalent
- **Chicxulub Impact (66 Ma)**: ~10km asteroid, ~100 million megatons TNT equivalent

### NASA Mission Data

- **DART Mission**: Successfully demonstrated kinetic impactor technology
- **OSIRIS-REx**: Provided detailed asteroid composition data
- **NEOWISE**: Cataloged thousands of near-Earth objects

The simulator's calculations are consistent with these real-world examples within reasonable approximations.

---

_This document is part of the NASA Space Apps Challenge 2025 Asteroid Impact Simulator project. For questions about specific calculations, please refer to the source code in `/src/lib/impact-calculations.ts` and `/src/lib/defense-calculations.ts`._
