"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AsteroidSelector } from "@/components/simulator/AsteroidSelector";
import { ImpactMap } from "@/components/simulator/ImpactMap";
import { ResultsPanel } from "@/components/simulator/ResultsPanel";
import { DefenseModal } from "@/components/defense/DefenseModal";
import { Navigation } from "@/components/Navigation";
import { BARCELONA_COORDS } from "@/lib/mock-data";
import {
  calculateImpactEffects,
  getImpactZones,
} from "@/lib/impact-calculations";
import type {
  Asteroid,
  CustomAsteroidInput,
  ImpactLocation,
} from "@/types/asteroid";
import type { ImpactResults, ImpactZone } from "@/types/impact";
import { RotateCcw, Shield } from "lucide-react";

interface SimulatorClientProps {
  asteroids: Asteroid[];
}

function SimulatorContentInner({ asteroids }: SimulatorClientProps) {
  const searchParams = useSearchParams();
  const asteroidId = searchParams?.get("asteroidId");

  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(
    null
  );
  const [customAsteroid, setCustomAsteroid] = useState<CustomAsteroidInput>({
    diameter: 500,
    velocity: 20,
    angle: 45,
    composition: "rocky",
  });
  const [location, setLocation] = useState<ImpactLocation>(BARCELONA_COORDS);
  const [locationSelected, setLocationSelected] = useState(false);
  const [results, setResults] = useState<ImpactResults | null>(null);
  const [impactZones, setImpactZones] = useState<ImpactZone[]>([]);
  const [useCustom, setUseCustom] = useState(false);
  const [defenseModalOpen, setDefenseModalOpen] = useState(false);

  // Load asteroid from URL parameter or default to first one
  useEffect(() => {
    if (asteroidId) {
      const asteroid = asteroids.find((a) => a.id === asteroidId);
      if (asteroid) {
        setSelectedAsteroid(asteroid);
      }
    } else {
      // Default to first asteroid
      setSelectedAsteroid(asteroids[0]);
    }
  }, [asteroidId, asteroids]);

  const handleCalculate = async () => {
    if (!locationSelected) return;

    try {
      if (useCustom) {
        // Create a temporary asteroid object from custom inputs
        const customAsteroidObj: Asteroid = {
          id: "custom",
          name: "Custom Asteroid",
          diameter: customAsteroid.diameter,
          velocity: customAsteroid.velocity,
          composition: customAsteroid.composition,
        };
        const impactResults = await calculateImpactEffects(
          customAsteroidObj,
          customAsteroid.angle,
          location
        );
        setResults(impactResults);
        setImpactZones(getImpactZones(impactResults));
      } else if (selectedAsteroid) {
        // Use a default impact angle of 45 degrees for preset asteroids
        const impactResults = await calculateImpactEffects(
          selectedAsteroid,
          45,
          location
        );
        setResults(impactResults);
        setImpactZones(getImpactZones(impactResults));
      }
    } catch (error) {
      console.error("Error calculating impact:", error);
      // You could add error state handling here
    }
  };

  const handleReset = () => {
    setResults(null);
    setImpactZones([]);
    setLocationSelected(false);
    setLocation(BARCELONA_COORDS);
  };

  const handleLocationChange = (newLocation: ImpactLocation) => {
    setLocation(newLocation);
    setLocationSelected(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            <AsteroidSelector
              asteroids={asteroids}
              selectedAsteroid={selectedAsteroid}
              customAsteroid={customAsteroid}
              onAsteroidSelect={(asteroid) => {
                setSelectedAsteroid(asteroid);
                setUseCustom(false);
              }}
              onCustomChange={(custom) => {
                setCustomAsteroid(custom);
                setUseCustom(true);
              }}
            />

            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full"
                onClick={handleCalculate}
                disabled={!locationSelected}
              >
                Calculate Impact
              </Button>
              {results && (
                <>
                  <Button
                    size="lg"
                    variant="default"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => setDefenseModalOpen(true)}
                    disabled={!selectedAsteroid && !useCustom}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Defense Mode
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full"
                    onClick={handleReset}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    New Impact
                  </Button>
                </>
              )}
              {!locationSelected && (
                <p className="text-xs text-center text-muted-foreground">
                  Click on the map to select an impact location
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Map */}
          <div>
            <ImpactMap
              location={location}
              zones={impactZones}
              onLocationChange={handleLocationChange}
              showMarker={!results}
              disableClick={!!results}
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="mt-6 grid grid-cols-1">
          <ResultsPanel results={results} />
        </div>
      </main>

      {/* Defense Modal */}
      {(selectedAsteroid || useCustom) && (
        <DefenseModal
          open={defenseModalOpen}
          onOpenChange={setDefenseModalOpen}
          asteroid={
            useCustom
              ? {
                  id: "custom",
                  name: "Custom Asteroid",
                  diameter: customAsteroid.diameter,
                  velocity: customAsteroid.velocity,
                  composition: customAsteroid.composition,
                }
              : selectedAsteroid!
          }
        />
      )}

      {/* Footer */}
      <footer className="border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Calculations based on scientific formulas from Collins et al.
            (2005), Holsapple (1993), and Melosh (1989)
          </p>
          <p className="mt-1">
            Data sources: NASA NEO Web Service • JPL Small-Body Database • CNEOS
            Sentry
          </p>
        </div>
      </footer>
    </div>
  );
}

/**
 * Client Component - Handles all interactive UI
 * Receives asteroid data as props from the Server Component
 */
export default function SimulatorClient({ asteroids }: SimulatorClientProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Initializing simulator...</p>
          </div>
        </div>
      }
    >
      <SimulatorContentInner asteroids={asteroids} />
    </Suspense>
  );
}
