"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Asteroid } from "@/types/asteroid";

interface AsteroidModalProps {
  asteroid: Asteroid | null;
  open: boolean;
  onClose: () => void;
}

export function AsteroidModal({ asteroid, open, onClose }: AsteroidModalProps) {
  const router = useRouter();

  if (!asteroid) return null;

  const handleSimulate = () => {
    // Navigate to simulator with asteroid data
    router.push(`/simulator?asteroidId=${asteroid.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {asteroid.name}
          </DialogTitle>
          <DialogDescription>Asteroid ID: {asteroid.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Diameter</p>
                  <p className="text-lg font-semibold">
                    {asteroid.diameter >= 1000
                      ? `${(asteroid.diameter / 1000).toFixed(1)} km`
                      : `${asteroid.diameter.toLocaleString()} m`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Velocity</p>
                  <p className="text-lg font-semibold">
                    {asteroid.velocity} km/s
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Composition</p>
                  <p className="text-lg font-semibold capitalize">
                    {asteroid.composition}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="text-lg font-semibold">Near-Earth Object</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {asteroid.description && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">
                  Description
                </p>
                <p className="text-sm">{asteroid.description}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleSimulate}>Simulate Impact</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
