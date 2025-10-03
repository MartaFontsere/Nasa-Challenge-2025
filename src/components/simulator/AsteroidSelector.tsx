"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  Asteroid,
  AsteroidComposition,
  CustomAsteroidInput,
} from "@/types/asteroid";
import { mockAsteroids } from "@/lib/mock-data";

interface AsteroidSelectorProps {
  selectedAsteroid: Asteroid | null;
  customAsteroid: CustomAsteroidInput;
  onAsteroidSelect: (asteroid: Asteroid) => void;
  onCustomChange: (custom: CustomAsteroidInput) => void;
}

export function AsteroidSelector({
  selectedAsteroid,
  customAsteroid,
  onAsteroidSelect,
  onCustomChange,
}: AsteroidSelectorProps) {
  const [activeTab, setActiveTab] = useState<"preset" | "custom">("preset");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Asteroid</CardTitle>
        <CardDescription>
          Choose a known asteroid or create a custom one
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "preset" | "custom")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preset">Known Asteroids</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>

          <TabsContent value="preset" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Asteroid</Label>
              <Select
                value={selectedAsteroid?.id || ""}
                onValueChange={(id) => {
                  const asteroid = mockAsteroids.find((a) => a.id === id);
                  if (asteroid) onAsteroidSelect(asteroid);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an asteroid" />
                </SelectTrigger>
                <SelectContent>
                  {mockAsteroids.map((asteroid) => (
                    <SelectItem key={asteroid.id} value={asteroid.id}>
                      {asteroid.name} (
                      {asteroid.diameter >= 1000
                        ? `${(asteroid.diameter / 1000).toFixed(1)} km`
                        : `${asteroid.diameter} m`}
                      )
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedAsteroid && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Diameter:</span>
                    <span className="ml-2 font-semibold">
                      {selectedAsteroid.diameter >= 1000
                        ? `${(selectedAsteroid.diameter / 1000).toFixed(1)} km`
                        : `${selectedAsteroid.diameter} m`}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Velocity:</span>
                    <span className="ml-2 font-semibold">
                      {selectedAsteroid.velocity} km/s
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Composition:</span>
                    <span className="ml-2 font-semibold capitalize">
                      {selectedAsteroid.composition}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="custom" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Diameter (meters)</Label>
              <Input
                type="number"
                value={customAsteroid.diameter}
                onChange={(e) =>
                  onCustomChange({
                    ...customAsteroid,
                    diameter: Number.parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="e.g., 500"
              />
            </div>

            <div className="space-y-2">
              <Label>Velocity (km/s)</Label>
              <Input
                type="number"
                value={customAsteroid.velocity}
                onChange={(e) =>
                  onCustomChange({
                    ...customAsteroid,
                    velocity: Number.parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="e.g., 20"
              />
              <p className="text-xs text-muted-foreground">
                Typical range: 11-70 km/s
              </p>
            </div>

            <div className="space-y-2">
              <Label>Impact Angle (degrees from horizontal)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[customAsteroid.angle]}
                  onValueChange={([value]) =>
                    onCustomChange({ ...customAsteroid, angle: value })
                  }
                  min={15}
                  max={90}
                  step={5}
                  className="flex-1"
                />
                <span className="text-sm font-semibold w-12 text-right">
                  {customAsteroid.angle}°
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Composition</Label>
              <Select
                value={customAsteroid.composition}
                onValueChange={(value) =>
                  onCustomChange({
                    ...customAsteroid,
                    composition: value as AsteroidComposition,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rocky">Rocky (3000 kg/m³)</SelectItem>
                  <SelectItem value="metallic">
                    Metallic (8000 kg/m³)
                  </SelectItem>
                  <SelectItem value="icy">Icy (1000 kg/m³)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
