# 🌍 Asteroid Impact Simulator

An interactive 3D visualization and impact simulation tool for Near-Earth Objects (NEOs) built for the NASA Space Apps Challenge 2025.

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![React](https://img.shields.io/badge/React-19-blue)
![Three.js](https://img.shields.io/badge/Three.js-3D-orange)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🪐 Solar System Visualization

- **Interactive 3D Scene**: Explore the solar system in a beautifully rendered Three.js environment
- **Real NASA Data**: Integration with NASA NEO API for authentic asteroid information
- **Asteroid Discovery**: Click on asteroids to view detailed information including diameter, velocity, and composition
- **Real-time Orbits**: Watch asteroids orbit around the sun with realistic animations
- **Smooth Navigation**: Intuitive camera controls with zoom, pan, and rotate capabilities
- **Composition-based Colors**: Visual differentiation of rocky, metallic, and icy asteroids

### 💥 Impact Simulation

- **Asteroid Selection**: Choose from real NASA NEO database or create custom asteroids
- **Customizable Parameters**:
  - Diameter (meters)
  - Velocity (km/s)
  - Impact angle (degrees)
  - Composition (rocky, metallic, icy)
- **Location Targeting**:
  - Manual coordinate input
  - Interactive OpenStreetMap click-to-select
  - Pre-populated with Barcelona coordinates
- **Real-time Calculations**: Instant impact analysis with visual feedback on the map
- **Interactive Impact Map**: Visual representation of impact zones with Leaflet maps

### 📊 Impact Consequences

The simulator calculates and displays:

- **Asteroid Mass**: Calculated from diameter and composition
- **Kinetic Energy**: Total energy at impact (in joules)
- **TNT Equivalent**: Comparison to conventional explosives (megatons)
- **Tsar Bomba Equivalent**: Comparison to largest nuclear weapon
- **Crater Dimensions**: Diameter and depth of impact crater
- **Fireball Radius**: Area of intense thermal radiation
- **Shockwave Radius**: Area affected by blast wave
- **Thermal Radiation Radius**: Area receiving dangerous heat
- **Seismic Activity**: Estimated earthquake magnitude (Richter scale)
- **Earthquake Zones**: Severe and moderate earthquake impact areas
- **Casualty Estimates**: Population-based impact assessment by zone
- **Population Density Analysis**: Real-time casualty calculations

### 🛡️ Planetary Defense Systems

- **Kinetic Impactor**: High-speed spacecraft collision (like NASA's DART mission)
  - Best for small-medium asteroids with adequate warning time
  - 6 months to 10 years timeline
  - Direct momentum transfer efficiency
- **Gravity Tractor**: Spacecraft hovers near asteroid using gravitational pull
  - Best for very long lead times (5-20 years)
  - Precise but slow trajectory modification
  - High reliability with sufficient time
- **Nuclear Pulse Deflection**: Nuclear detonation near asteroid surface
  - Most powerful option for large asteroids or short warning times
  - 3 months to 5 years timeline
  - Massive energy release capability

### 🎓 Educational Content

- **Defense Strategy Videos**: Educational videos for each defense system
  - Kinetic Impactor demonstration
  - Gravity Tractor explanation
  - Nuclear Pulse Deflection overview
  - Introduction to planetary defense
- **Interactive Defense Planning**: Real-time mission cost and feasibility analysis
- **Timeline Optimization**: Interactive sliders to explore different mission timelines
- **Success Probability Calculations**: Risk assessment for each defense strategy
- **Cost Analysis**: Development and launch cost estimates in millions USD

### 📈 Advanced Analytics

- **Mission Feasibility**: Timeline vs. success probability analysis
- **Cost-Benefit Analysis**: Defense system comparison with cost estimates
- **Delta-V Calculations**: Required velocity changes for asteroid deflection
- **Spacecraft Mass Requirements**: Payload calculations for each defense system
- **Risk Assessment**: Multi-factor success probability calculations

## 🛠️ Tech Stack

### Core Framework & Language

- **Framework**: [Next.js 15.5.4](https://nextjs.org/) with App Router and Turbopack
- **Language**: TypeScript 5 with strict mode
- **Runtime**: React 19.1.0 with React DOM 19.1.0

### UI & Styling

- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) component library
- **Radix UI**: Accessible component primitives
  - Dialog, Select, Slider, Tabs, Label, Slot
- **Styling**: Tailwind CSS v4 with PostCSS
- **Icons**: Lucide React for consistent iconography
- **Styling Utilities**:
  - `clsx` for conditional classes
  - `tailwind-merge` for Tailwind class merging
  - `class-variance-authority` for component variants

### 3D Graphics & Visualization

- **3D Engine**: [Three.js](https://threejs.org/) v0.180.0
- **React Integration**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) v9.3.0
- **Three.js Helpers**: [Drei](https://github.com/pmndrs/drei) v10.7.6
- **Post-processing**: [React Three Postprocessing](https://github.com/pmndrs/react-three-postprocessing) v3.0.4

### Maps & Geographic Data

- **Mapping**: [Leaflet](https://leafletjs.com/) v1.9.4
- **React Integration**: [React Leaflet](https://react-leaflet.js.org/) v5.0.0
- **TypeScript Support**: `@types/leaflet` v1.9.20

### Development Tools

- **Linting & Formatting**: [Biome](https://biomejs.dev/) v2.2.0
- **TypeScript**: v5 with Node.js types v20
- **React Types**: `@types/react` v19, `@types/react-dom` v19
- **Build Tool**: Turbopack for fast development and builds

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm package manager

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Available Scripts

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run Biome linter checks
npm run format   # Format code with Biome
```

## 📁 Project Structure

```
nasa-challenge-2025/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Solar System 3D view page
│   │   ├── simulator/
│   │   │   └── page.tsx             # Impact simulator page
│   │   ├── layout.tsx               # Root layout with metadata
│   │   └── globals.css              # Global styles & Tailwind config
│   ├── components/
│   │   ├── ui/                      # shadcn/ui components
│   │   ├── solar-system/            # 3D solar system components
│   │   │   ├── Scene.tsx
│   │   │   ├── AsteroidObject.tsx
│   │   │   └── AsteroidModal.tsx
│   │   └── simulator/               # Simulator components
│   │       ├── AsteroidSelector.tsx
│   │       ├── LocationPicker.tsx
│   │       ├── ImpactMap.tsx
│   │       └── ResultsPanel.tsx
│   ├── lib/
│   │   ├── utils.ts                 # Utility functions (cn helper)
│   │   ├── impact-calculations.ts   # Physics calculations
│   │   └── mock-data.ts             # Mock asteroid data
│   └── types/
│       ├── asteroid.ts              # Asteroid type definitions
│       └── impact.ts                # Impact result types
├── public/                          # Static assets
├── biome.json                       # Biome configuration
├── components.json                  # shadcn/ui configuration
├── tsconfig.json                    # TypeScript configuration
└── package.json
```

## 🧮 Physics & Calculations

All impact calculations are based on peer-reviewed scientific formulas and research:

### Impact Energy

```typescript
E = 0.5 × m × v²
```

Where: E = kinetic energy (joules), m = asteroid mass (kg), v = velocity (m/s)

### Crater Formation

Based on scaling laws from:

- **Holsapple & Schmidt (1987)**: "The Scaling of Impact Processes"
- **Melosh, H.J. (1989)**: "Impact Cratering: A Geologic Process"

### Seismic Effects

Earthquake magnitude estimation using correlation between impact energy and Richter scale:

```
M = 0.67 × log₁₀(E) - 5.87
```

### Blast Effects

Fireball, shockwave, and thermal radiation radii based on:

- **Glasstone & Dolan (1977)**: "The Effects of Nuclear Weapons"
- Scaling laws adapted for kinetic impactors

### Sources

- **Collins, G.S., et al. (2005)**: "Earth Impact Effects Program" - [impact.ese.ic.ac.uk](https://impact.ese.ic.ac.uk/ImpactEarth/)
- **NASA CNEOS**: Center for Near Earth Object Studies
- **JPL Small-Body Database**: Physical parameters and orbital data

## 🌐 APIs & Data Sources

### NASA APIs (Integrated)

#### NEO Web Service

- **Base URL**: `https://api.nasa.gov/neo/rest/v1/`
- **API Key**: Required (free registration at [api.nasa.gov](https://api.nasa.gov/))
- **Endpoints Used**:
  - `neo/browse` - Browse near-Earth objects with filtering
  - `neo/{id}` - Get specific asteroid by ID
- **Data Retrieved**:
  - Asteroid diameter estimates (min/max in meters)
  - Orbital data and close approach information
  - Velocity data (kilometers per second)
  - Hazardous asteroid classification
  - Discovery circumstances and orbital elements
- **Caching**: 1-hour revalidation for optimal performance
- **Error Handling**: Graceful fallback to mock data if API unavailable

#### JPL Small-Body Database

- **Reference**: https://ssd-api.jpl.nasa.gov/doc/sbdb.html
- **Usage**: Physical parameters and orbital data reference
- **Integration**: Used for composition estimation algorithms

#### CNEOS Sentry

- **Reference**: https://cneos.jpl.nasa.gov/sentry/
- **Usage**: Impact risk assessment and probability calculations reference
- **Integration**: Risk assessment algorithms based on Sentry methodology

### Geographic & Population Data

#### OpenStreetMap

- **Service**: Nominatim reverse geocoding
- **Usage**: Convert coordinates to location names
- **Integration**: Impact location display and user interface

#### Population Density Data

- **Source**: SEDAC GPW (Gridded Population of the World)
- **Usage**: Casualty estimation calculations
- **Integration**: Real-time population density analysis for impact zones

### Data Processing & Composition Estimation

#### Asteroid Composition Algorithm

- **Method**: Heuristic-based estimation using diameter and name patterns
- **Composition Types**: Rocky, Metallic, Icy
- **Factors**:
  - Name analysis (e.g., "metal", "psyche" → metallic)
  - Size thresholds (large asteroids → icy)
  - Default classification (most NEOs → rocky)

#### 3D Position Generation

- **Method**: Distributed arrangement around solar system
- **Parameters**:
  - Radius range: 150-450 units
  - Vertical spread: -40 to +40 units
  - Angular distribution: 0 to 2π radians

## 🛡️ Planetary Defense Systems

The simulator includes three primary defense strategies based on current NASA research and real-world missions:

### 🚀 Kinetic Impactor

**Real-world Example**: NASA's DART Mission (Double Asteroid Redirection Test)

- **Method**: High-speed spacecraft collision with asteroid
- **Timeline**: 6 months to 10 years
- **Efficiency**: Direct momentum transfer (100% efficiency)
- **Cost**: $20M USD per kg payload
- **Best For**: Small to medium asteroids with adequate warning time
- **Success Rate**: 85% base probability
- **Advantages**:
  - Proven technology (DART mission success)
  - Direct and predictable results
  - No nuclear materials required
- **Limitations**:
  - Requires sufficient warning time
  - Limited effectiveness on very large asteroids

### 🛰️ Gravity Tractor

**Concept**: Spacecraft hovers near asteroid using gravitational attraction

- **Method**: Spacecraft maintains position near asteroid, using gravitational pull to slowly change trajectory
- **Timeline**: 5 to 20 years (minimum 5 years)
- **Efficiency**: Very slow but precise (0.1% efficiency)
- **Cost**: $30M USD per kg payload
- **Best For**: Very long lead times, precise trajectory modifications
- **Success Rate**: 95% with sufficient time
- **Advantages**:
  - Most precise method
  - No direct contact required
  - Works on any asteroid size
  - Very reliable with adequate time
- **Limitations**:
  - Requires very long lead times
  - Most expensive per kg
  - Complex mission requirements

### ☢️ Nuclear Pulse Deflection

**Method**: Nuclear detonation near asteroid surface

- **Method**: Nuclear device detonated at optimal distance from asteroid surface
- **Timeline**: 3 months to 5 years
- **Efficiency**: Massive energy release (5000% efficiency)
- **Cost**: $50M USD per kg payload
- **Best For**: Large asteroids or short warning times
- **Success Rate**: 90% base probability (reduced due to complexity)
- **Advantages**:
  - Most powerful option
  - Works on largest asteroids
  - Can be deployed quickly
  - High energy-to-mass ratio
- **Limitations**:
  - Political and legal complications
  - Risk of fragmentation
  - Most expensive development costs
  - Requires nuclear expertise

### 📊 Defense Mission Planning

The simulator calculates:

- **Delta-V Requirements**: Velocity change needed for deflection
- **Spacecraft Mass**: Payload requirements for each system
- **Mission Costs**: Development and launch cost estimates
- **Success Probability**: Multi-factor risk assessment
- **Timeline Optimization**: Interactive exploration of mission parameters
- **Feasibility Analysis**: Timeline vs. success probability curves

### 🎯 Mission Parameters

Each defense system considers:

- **Asteroid Mass**: Affects required momentum change
- **Timeline**: Earlier intervention requires less delta-v
- **Deflection Distance**: Approximately Earth's diameter
- **System Efficiency**: How well each method transfers momentum
- **Development Complexity**: Technology readiness and cost factors
- **Risk Factors**: Timeline constraints, asteroid size, mission complexity

## 🎓 Educational Content & Media

### 📹 Defense Strategy Videos

The simulator includes educational videos demonstrating each defense system:

- **`Intro.mp4`**: Introduction to planetary defense concepts
- **`KineticImpactor.mp4`**: NASA DART mission demonstration and kinetic impactor technology
- **`gravityTractor.mp4`**: Gravity tractor concept and implementation
- **`NuclearPulse.mp4`**: Nuclear pulse deflection strategy overview

### 🎮 Interactive Learning Features

- **Real-time Defense Planning**: Interactive sliders to explore mission timelines
- **Cost-Benefit Analysis**: Visual comparison of defense system costs and effectiveness
- **Success Probability Visualization**: Risk assessment charts for each defense strategy
- **Mission Feasibility Explorer**: Timeline vs. success probability analysis
- **Educational Tooltips**: Contextual help and explanations throughout the interface

### 📚 Scientific Accuracy

All calculations and visualizations are based on:

- **Peer-reviewed Research**: Impact effects algorithms from scientific literature
- **NASA Mission Data**: Real-world examples like the DART mission
- **Current Technology**: State-of-the-art spacecraft and propulsion systems
- **Risk Assessment Models**: Multi-factor probability calculations
- **Cost Estimation**: Based on current space industry pricing

### 🎯 Learning Objectives

The simulator helps users understand:

- **Asteroid Threat Assessment**: Size, velocity, and composition impact
- **Defense Strategy Selection**: Choosing appropriate methods for different scenarios
- **Mission Planning**: Timeline, cost, and feasibility considerations
- **Risk Management**: Success probability and failure mode analysis
- **Resource Requirements**: Mass, energy, and cost calculations

## 🎯 Features in Development

- [ ] More accurate population density calculations using GIS data
- [ ] Ocean vs. land impact detection
- [ ] Historical impact comparison (e.g., Chicxulub, Tunguska)
- [ ] Export results as PDF report
- [ ] Mobile responsive design improvements
- [ ] Atmospheric entry calculations
- [ ] Long-term climate impact modeling
- [ ] Real-time asteroid tracking integration
- [ ] Advanced orbital mechanics visualization
- [ ] Multi-asteroid impact scenarios

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- NASA Space Apps Challenge organizers
- NASA's Center for Near Earth Object Studies (CNEOS)
- The Three.js and React Three Fiber communities
- OpenStreetMap contributors
- Impact effects algorithms by Dr. Gareth Collins and Dr. Robert Marcus
- shadcn for the amazing UI component library

## 📬 Contact

Built with ❤️ for NASA Space Apps Challenge 2025

---

**⚠️ Educational Purpose**: This simulator is designed for educational and awareness purposes. Real asteroid impact predictions require complex modeling, extensive data, and expert analysis from organizations like NASA JPL.
