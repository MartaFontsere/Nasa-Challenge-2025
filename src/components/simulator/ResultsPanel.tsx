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
            <div className="p-4 bg-white rounded-lg border border-slate-300 shadow-sm">
              <p className="text-sm text-slate-600">Asteroid Mass</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatNumber(results.asteroidMass)} kg
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border border-slate-300 shadow-sm">
              <p className="text-sm text-slate-600">Kinetic Energy</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatEnergy(results.kineticEnergy)}
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border border-slate-300 shadow-sm">
              <p className="text-sm text-slate-600">Impact Velocity</p>
              <p className="text-2xl font-bold text-slate-900">
                {results.impactVelocity} km/s
              </p>
            </div>

            {/* Energy Comparisons */}
            <div className="p-4 bg-white rounded-lg border-2 border-amber-400 shadow-sm">
              <p className="text-sm text-amber-700">TNT Equivalent</p>
              <p className="text-2xl font-bold text-amber-900">
                {formatNumber(results.tntEquivalent)} MT
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border-2 border-amber-400 shadow-sm">
              <p className="text-sm text-amber-700">Tsar Bomba Equivalent</p>
              <p className="text-2xl font-bold text-amber-900">
                {results.tsarBombaEquivalent.toFixed(1)}x
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border-2 border-amber-400 shadow-sm">
              <p className="text-sm text-amber-700">Impact Angle</p>
              <p className="text-2xl font-bold text-amber-900">
                {results.impactAngle}°
              </p>
            </div>

            {/* Crater Effects */}
            <div className="p-4 bg-white rounded-lg border-2 border-rose-400 shadow-sm">
              <p className="text-sm text-rose-700">Crater Diameter</p>
              <p className="text-2xl font-bold text-rose-900">
                {results.craterDiameter >= 1000
                  ? `${(results.craterDiameter / 1000).toFixed(2)} km`
                  : `${results.craterDiameter.toFixed(0)} m`}
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border-2 border-rose-400 shadow-sm">
              <p className="text-sm text-rose-700">Crater Depth</p>
              <p className="text-2xl font-bold text-rose-900">
                {results.craterDepth >= 1000
                  ? `${(results.craterDepth / 1000).toFixed(2)} km`
                  : `${results.craterDepth.toFixed(0)} m`}
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border-2 border-yellow-400 shadow-sm">
              <p className="text-sm text-yellow-700">Earthquake Magnitude</p>
              <p className="text-2xl font-bold text-yellow-900">
                {results.earthquakeMagnitude.toFixed(1)}
              </p>
            </div>

            {/* Blast Effects */}
            <div className="p-4 bg-white rounded-lg border-2 border-red-400 shadow-sm">
              <p className="text-sm text-red-700">Fireball Radius</p>
              <p className="text-2xl font-bold text-red-900">
                {results.fireballRadius.toFixed(2)} km
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border-2 border-orange-400 shadow-sm">
              <p className="text-sm text-orange-700">Shockwave Radius</p>
              <p className="text-2xl font-bold text-orange-900">
                {results.shockwaveRadius.toFixed(2)} km
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border-2 border-yellow-400 shadow-sm">
              <p className="text-sm text-yellow-700">
                Thermal Radiation Radius
              </p>
              <p className="text-2xl font-bold text-yellow-900">
                {results.thermalRadiationRadius.toFixed(2)} km
              </p>
            </div>

            {/* Tsunami */}
            {results.tsunamiHeight !== null && (
              <div className="p-4 bg-white rounded-lg border-2 border-blue-400 shadow-sm">
                <p className="text-sm text-blue-700">Tsunami Height</p>
                <p className="text-2xl font-bold text-blue-900">
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
            <div className="p-4 bg-white rounded-lg border-2 border-red-400 shadow-sm">
              <p className="text-sm text-red-700">Fireball Zone</p>
              <p className="text-2xl font-bold text-red-900">
                {formatNumber(results.casualties.fireball, 0)}
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border-2 border-orange-400 shadow-sm">
              <p className="text-sm text-orange-700">Shockwave Zone</p>
              <p className="text-2xl font-bold text-orange-900">
                {formatNumber(results.casualties.shockwave, 0)}
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border-2 border-yellow-400 shadow-sm">
              <p className="text-sm text-yellow-700">Thermal Zone</p>
              <p className="text-2xl font-bold text-yellow-900">
                {formatNumber(results.casualties.thermalRadiation, 0)}
              </p>
            </div>

            <div className="p-4 bg-slate-900 text-white rounded-lg border-2 border-slate-700">
              <p className="text-sm text-slate-300">Total Estimated</p>
              <p className="text-2xl font-bold text-white">
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
