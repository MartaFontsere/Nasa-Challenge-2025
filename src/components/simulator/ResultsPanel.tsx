"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
          <CardTitle>Impact Results</CardTitle>
          <CardDescription>
            Calculated consequences of the asteroid impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Basic Properties */}
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Asteroid Mass</p>
              <p className="text-2xl font-bold">
                {formatNumber(results.asteroidMass)} kg
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Kinetic Energy</p>
              <p className="text-2xl font-bold">
                {formatEnergy(results.kineticEnergy)}
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Impact Velocity</p>
              <p className="text-2xl font-bold">
                {results.impactVelocity} km/s
              </p>
            </div>

            {/* Energy Comparisons */}
            <div className="p-4 bg-orange-100 dark:bg-orange-950 rounded-lg">
              <p className="text-sm text-muted-foreground">TNT Equivalent</p>
              <p className="text-2xl font-bold">
                {formatNumber(results.tntEquivalent)} MT
              </p>
            </div>

            <div className="p-4 bg-orange-100 dark:bg-orange-950 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Tsar Bomba Equivalent
              </p>
              <p className="text-2xl font-bold">
                {results.tsarBombaEquivalent.toFixed(1)}x
              </p>
            </div>

            <div className="p-4 bg-orange-100 dark:bg-orange-950 rounded-lg">
              <p className="text-sm text-muted-foreground">Impact Angle</p>
              <p className="text-2xl font-bold">{results.impactAngle}°</p>
            </div>

            {/* Crater Effects */}
            <div className="p-4 bg-red-100 dark:bg-red-950 rounded-lg">
              <p className="text-sm text-muted-foreground">Crater Diameter</p>
              <p className="text-2xl font-bold">
                {results.craterDiameter >= 1000
                  ? `${(results.craterDiameter / 1000).toFixed(2)} km`
                  : `${results.craterDiameter.toFixed(0)} m`}
              </p>
            </div>

            <div className="p-4 bg-red-100 dark:bg-red-950 rounded-lg">
              <p className="text-sm text-muted-foreground">Crater Depth</p>
              <p className="text-2xl font-bold">
                {results.craterDepth >= 1000
                  ? `${(results.craterDepth / 1000).toFixed(2)} km`
                  : `${results.craterDepth.toFixed(0)} m`}
              </p>
            </div>

            <div className="p-4 bg-yellow-100 dark:bg-yellow-950 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Earthquake Magnitude
              </p>
              <p className="text-2xl font-bold">
                {results.earthquakeMagnitude.toFixed(1)}
              </p>
            </div>

            {/* Blast Effects */}
            <div className="p-4 bg-red-200 dark:bg-red-900 rounded-lg">
              <p className="text-sm text-muted-foreground">Fireball Radius</p>
              <p className="text-2xl font-bold">
                {results.fireballRadius.toFixed(2)} km
              </p>
            </div>

            <div className="p-4 bg-orange-200 dark:bg-orange-900 rounded-lg">
              <p className="text-sm text-muted-foreground">Shockwave Radius</p>
              <p className="text-2xl font-bold">
                {results.shockwaveRadius.toFixed(2)} km
              </p>
            </div>

            <div className="p-4 bg-yellow-200 dark:bg-yellow-900 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Thermal Radiation Radius
              </p>
              <p className="text-2xl font-bold">
                {results.thermalRadiationRadius.toFixed(2)} km
              </p>
            </div>

            {/* Tsunami */}
            {results.tsunamiHeight !== null && (
              <div className="p-4 bg-blue-100 dark:bg-blue-950 rounded-lg">
                <p className="text-sm text-muted-foreground">Tsunami Height</p>
                <p className="text-2xl font-bold">
                  {results.tsunamiHeight.toFixed(1)} m
                </p>
              </div>
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
            <div className="p-4 bg-red-100 dark:bg-red-950 rounded-lg">
              <p className="text-sm text-muted-foreground">Fireball Zone</p>
              <p className="text-2xl font-bold">
                {formatNumber(results.casualties.fireball, 0)}
              </p>
            </div>

            <div className="p-4 bg-orange-100 dark:bg-orange-950 rounded-lg">
              <p className="text-sm text-muted-foreground">Shockwave Zone</p>
              <p className="text-2xl font-bold">
                {formatNumber(results.casualties.shockwave, 0)}
              </p>
            </div>

            <div className="p-4 bg-yellow-100 dark:bg-yellow-950 rounded-lg">
              <p className="text-sm text-muted-foreground">Thermal Zone</p>
              <p className="text-2xl font-bold">
                {formatNumber(results.casualties.thermalRadiation, 0)}
              </p>
            </div>

            <div className="p-4 bg-gray-800 text-white rounded-lg">
              <p className="text-sm text-gray-300">Total Estimated</p>
              <p className="text-2xl font-bold">
                {formatNumber(results.casualties.total, 0)}
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            ⚠️ These are rough estimates based on urban population density.
            Actual casualties depend on local population distribution, building
            infrastructure, and warning time.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
