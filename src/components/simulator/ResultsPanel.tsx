"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResultCard } from "./ResultCard";
import type { ImpactResults } from "@/types/impact";

interface ResultsPanelProps {
  results: ImpactResults | null;
}

export function ResultsPanel({ results }: ResultsPanelProps) {
  if (!results) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Impact Results</CardTitle>
          <CardDescription>
            Select an asteroid and location to see impact calculations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No simulation data available. Configure the parameters above and
            click "Calculate Impact".
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatNumber = (num: number, decimals = 2): string => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(decimals)} billion`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(decimals)} million`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(decimals)}k`;
    return num.toFixed(decimals);
  };

  const formatEnergy = (joules: number): string => {
    if (joules >= 1e18) return `${(joules / 1e18).toFixed(2)} EJ`;
    if (joules >= 1e15) return `${(joules / 1e15).toFixed(2)} PJ`;
    if (joules >= 1e12) return `${(joules / 1e12).toFixed(2)} TJ`;
    return `${joules.toExponential(2)} J`;
  };

  return (
    <div className="col-span-2 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-black">Impact Results</CardTitle>
          <CardDescription className="text-gray-700">
            Calculated consequences of the asteroid impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Basic Properties */}
            <ResultCard
              title="Asteroid Mass"
              value={`${formatNumber(results.asteroidMass)} kg`}
            />
            <ResultCard
              title="Kinetic Energy"
              value={formatEnergy(results.kineticEnergy)}
            />
            <ResultCard
              title="Impact Velocity"
              value={`${results.impactVelocity} km/s`}
            />

            {/* Energy Comparisons */}
            <ResultCard
              title="TNT Equivalent"
              value={`${formatNumber(results.tntEquivalent)} MT`}
            />
            <ResultCard
              title="Tsar Bomba Equivalent"
              value={`${results.tsarBombaEquivalent.toFixed(1)}x`}
            />
            <ResultCard
              title="Impact Angle"
              value={`${results.impactAngle}°`}
            />

            {/* Crater Effects */}
            <ResultCard
              title="Crater Diameter"
              value={
                results.craterDiameter >= 1000
                  ? `${(results.craterDiameter / 1000).toFixed(2)} km`
                  : `${results.craterDiameter.toFixed(0)} m`
              }
            />
            <ResultCard
              title="Crater Depth"
              value={
                results.craterDepth >= 1000
                  ? `${(results.craterDepth / 1000).toFixed(2)} km`
                  : `${results.craterDepth.toFixed(0)} m`
              }
            />
            <ResultCard
              title="Earthquake Magnitude"
              value={results.earthquakeMagnitude.toFixed(1)}
            />

            {/* Blast Effects */}
            <ResultCard
              title="Fireball Radius"
              value={`${results.fireballRadius.toFixed(2)} km`}
            />
            <ResultCard
              title="Shockwave Radius"
              value={`${results.shockwaveRadius.toFixed(2)} km`}
            />
            <ResultCard
              title="Thermal Radiation Radius"
              value={`${results.thermalRadiationRadius.toFixed(2)} km`}
            />

            {/* Tsunami */}
            {results.tsunamiHeight !== null && (
              <ResultCard
                title="Tsunami Height"
                value={`${results.tsunamiHeight.toFixed(1)} m`}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Casualties */}
      <Card>
        <CardHeader>
          <CardTitle>Estimated Casualties</CardTitle>
          <CardDescription>
            Based on urban population density (rough estimates)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResultCard
              title="Fireball Zone"
              value={formatNumber(results.casualties.fireball, 0)}
            />
            <ResultCard
              title="Shockwave Zone"
              value={formatNumber(results.casualties.shockwave, 0)}
            />
            <ResultCard
              title="Thermal Zone"
              value={formatNumber(results.casualties.thermalRadiation, 0)}
            />
            {results.casualties.tsunami !== null && (
              <ResultCard
                title="Tsunami Zone"
                value={formatNumber(results.casualties.tsunami, 0)}
              />
            )}
            <ResultCard
              title="Total Estimated"
              value={formatNumber(results.casualties.total, 0)}
            />
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            ⚠️ These are rough estimates based on urban population density.
            Actual casualties depend on local population distribution, building
            infrastructure, and warning time.
            {results.casualties.tsunami !== null && (
              <span className="block mt-1">
                🌊 Tsunami casualties are prototype estimates for coastal areas
                and don't account for specific geographic features or
                evacuation.
              </span>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
