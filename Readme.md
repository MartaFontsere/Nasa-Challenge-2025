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
- **Asteroid Discovery**: Click on asteroids to view detailed information including diameter, velocity, and composition
- **Real-time Orbits**: Watch asteroids orbit around the sun with realistic animations
- **Smooth Navigation**: Intuitive camera controls with zoom, pan, and rotate capabilities

### 💥 Impact Simulation

- **Asteroid Selection**: Choose from a database of known NEOs or create custom asteroids
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
- **Tsunami Height**: Wave height for ocean impacts (if applicable)
- **Casualty Estimates**: Population-based impact assessment by zone

## 🛠️ Tech Stack

- **Framework**: [Next.js 15.5.4](https://nextjs.org/) with App Router
- **Language**: TypeScript with strict mode
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **3D Graphics**: [Three.js](https://threejs.org/) with [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) and [Drei](https://github.com/pmndrs/drei)
- **Styling**: Tailwind CSS v4
- **Maps**: [Leaflet](https://leafletjs.com/) with OpenStreetMap
- **Linting/Formatting**: [Biome](https://biomejs.dev/)

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

## 🌐 Useful APIs & Data Sources

### NASA APIs

- **NEO Web Service**: https://api.nasa.gov/

  - Browse near-Earth objects
  - Get asteroid data by ID
  - Requires free API key

- **JPL Small-Body Database**: https://ssd-api.jpl.nasa.gov/doc/sbdb.html

  - Detailed physical parameters
  - Orbital elements
  - Discovery circumstances

- **CNEOS Sentry**: https://cneos.jpl.nasa.gov/sentry/
  - Impact risk assessment
  - Probability calculations

### Geographic Data

- **OpenStreetMap Nominatim**: Reverse geocoding for impact locations
- **SEDAC GPW**: Population density data for casualty estimates

## 🎯 Features in Development

- [ ] Integration with NASA NEO API for real asteroid data
- [ ] More accurate population density calculations using GIS data
- [ ] Ocean vs. land impact detection
- [ ] Historical impact comparison (e.g., Chicxulub, Tunguska)
- [ ] Export results as PDF report
- [ ] Mobile responsive design improvements
- [ ] Atmospheric entry calculations
- [ ] Long-term climate impact modeling

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
