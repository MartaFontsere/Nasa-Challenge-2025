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
      <DialogContent className="sm:max-w-[600px] bg-slate-900 border-2 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            {asteroid.name}
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Asteroid ID: {asteroid.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400">Diameter</p>
                  <p className="text-lg font-semibold text-white">
                    {asteroid.diameter >= 1000
                      ? `${(asteroid.diameter / 1000).toFixed(1)} km`
                      : `${asteroid.diameter.toLocaleString()} m`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Velocity</p>
                  <p className="text-lg font-semibold text-white">
                    {asteroid.velocity} km/s
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Composition</p>
                  <p className="text-lg font-semibold capitalize text-white">
                    {asteroid.composition}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Type</p>
                  <p className="text-lg font-semibold text-white">
                    Near-Earth Object
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {asteroid.description && (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <p className="text-sm text-slate-400 mb-2">Description</p>
                <p className="text-sm text-slate-200">{asteroid.description}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-600 text-white hover:bg-slate-800"
          >
            Close
          </Button>
          <Button
            onClick={handleSimulate}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Simulate Impact
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
