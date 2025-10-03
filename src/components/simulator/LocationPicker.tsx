"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { ImpactLocation } from "@/types/asteroid";

interface LocationPickerProps {
  location: ImpactLocation;
  onLocationChange: (location: ImpactLocation) => void;
}

export function LocationPicker({
  location,
  onLocationChange,
}: LocationPickerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Impact Location</CardTitle>
        <CardDescription>
          Enter coordinates or click on the map below
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Latitude</Label>
            <Input
              type="number"
              value={location.lat}
              onChange={(e) =>
                onLocationChange({
                  ...location,
                  lat: Number.parseFloat(e.target.value) || 0,
                })
              }
              placeholder="e.g., 41.3874"
              step="0.0001"
            />
          </div>
          <div className="space-y-2">
            <Label>Longitude</Label>
            <Input
              type="number"
              value={location.lng}
              onChange={(e) =>
                onLocationChange({
                  ...location,
                  lng: Number.parseFloat(e.target.value) || 0,
                })
              }
              placeholder="e.g., 2.1686"
              step="0.0001"
            />
          </div>
        </div>
        {location.name && (
          <div className="text-sm text-muted-foreground">
            Location: <span className="font-semibold">{location.name}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
