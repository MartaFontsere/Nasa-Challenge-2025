"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Asteroid } from "@/types/asteroid";
import {
  calculateDeltaVRequired,
  calculateDefenseCost,
  getTimelineRange,
  DEFENSE_SYSTEMS,
  type DefenseSystemOption,
  type DefenseMission,
  type DefenseCost,
} from "@/lib/defense-calculations";
import {
  Shield,
  Rocket,
  DollarSign,
  CheckCircle,
  Target,
  Zap,
  RotateCcw,
} from "lucide-react";

interface DefenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asteroid: Asteroid;
}

export function DefenseModal({
  open,
  onOpenChange,
  asteroid,
}: DefenseModalProps) {
  const timelineRange = getTimelineRange(asteroid);

  const [timeline, setTimeline] = useState<number>(timelineRange.recommended);
  const [selectedSystem, setSelectedSystem] = useState<
    DefenseSystemOption["type"] | null
  >(null);
  const [mission, setMission] = useState<DefenseMission | null>(null);
  const [cost, setCost] = useState<DefenseCost | null>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Calculate mission parameters when timeline changes
  useEffect(() => {
    if (asteroid && timeline) {
      const calculatedMission = calculateDeltaVRequired(asteroid, timeline);
      setMission(calculatedMission);

      // Recalculate cost if system is selected
      if (selectedSystem) {
        const calculatedCost = calculateDefenseCost(
          calculatedMission,
          selectedSystem
        );
        setCost(calculatedCost);
      }
    }
  }, [asteroid, timeline, selectedSystem]);

  const handleSystemSelect = (systemType: DefenseSystemOption["type"]) => {
    setSelectedSystem(systemType);
    setVideoEnded(false); // Reset video state when selecting new system
    if (mission) {
      const calculatedCost = calculateDefenseCost(mission, systemType);
      setCost(calculatedCost);
    }
  };

  const handleReplayVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setVideoEnded(false);
    }
  };

  const handleVideoEnded = () => {
    setVideoEnded(true);
  };

  // Video mapping for defense systems
  const getSystemVideo = (
    systemType: DefenseSystemOption["type"] | null
  ): string | undefined => {
    switch (systemType) {
      case "kinetic-impactor":
        return "/videos/KineticImpactor.mp4";
      case "gravity-tractor":
        return "/videos/gravityTractor.mp4";
      case "nuclear-pulse":
        return "/videos/NuclearPulse.mp4";
      default:
        return undefined;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-500" />
            Planetary Defense Mission
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Mission Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Mission Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Mission Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Planetary Defense Scenario
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      An asteroid has been detected on a collision course with
                      Earth. Your mission is to design and deploy a deflection
                      system to alter its trajectory and prevent catastrophic
                      impact.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Asteroid Characteristics
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Name</p>
                        <p className="font-semibold">{asteroid.name}</p>
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          Diameter
                        </p>
                        <p className="font-semibold">{asteroid.diameter} m</p>
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          Velocity
                        </p>
                        <p className="font-semibold">
                          {asteroid.velocity} km/s
                        </p>
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          Composition
                        </p>
                        <p className="font-semibold capitalize">
                          {asteroid.composition}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <p className="text-sm text-red-800">
                      <strong>⚠️ Threat Level:</strong> This asteroid poses a
                      significant threat to life on Earth. Immediate action is
                      required to prevent impact.
                    </p>
                  </div>
                </div>

                {/* Right Column - Video */}
                <div className="flex items-center justify-center bg-slate-900 rounded-lg overflow-hidden">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    style={{ maxHeight: "400px" }}
                  >
                    <source src="/videos/Intro.mp4" type="video/mp4" />
                    <div className="flex items-center justify-center h-full text-white">
                      <p>Video not available</p>
                    </div>
                  </video>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mission Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                Mission Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Label>Warning Time: {timeline} months</Label>
                  <span className="text-sm text-muted-foreground">
                    ({(timeline / 12).toFixed(1)} years)
                  </span>
                </div>
                <Slider
                  value={[timeline]}
                  onValueChange={(value) => setTimeline(value[0])}
                  min={timelineRange.min}
                  max={timelineRange.max}
                  step={3}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{timelineRange.min} months</span>
                  <span>{timelineRange.max} months</span>
                </div>
              </div>

              {mission && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Required Δv</p>
                    <p className="text-lg font-semibold">
                      {mission.deltaVRequired.toFixed(3)} m/s
                    </p>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      Intercept Distance
                    </p>
                    <p className="text-lg font-semibold">
                      {mission.interceptDistance.toFixed(1)} million km
                    </p>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      Asteroid Mass
                    </p>
                    <p className="text-lg font-semibold">
                      {(mission.asteroidMass / 1e9).toFixed(2)} million tons
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Defense System Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Defense System</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - System Options */}
                <div className="space-y-3">
                  {DEFENSE_SYSTEMS.map((system) => {
                    const isAvailable =
                      timeline >= system.minTimelineMonths &&
                      timeline <= system.maxTimelineMonths;
                    const isSelected = selectedSystem === system.type;

                    return (
                      <button
                        key={system.type}
                        onClick={() =>
                          isAvailable && handleSystemSelect(system.type)
                        }
                        disabled={!isAvailable}
                        className={`text-left p-4 rounded-lg border-2 transition-all w-full ${
                          isSelected
                            ? "border-blue-500 bg-blue-50"
                            : isAvailable
                            ? "border-gray-300 hover:border-blue-300 bg-white"
                            : "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                              {system.type === "kinetic-impactor" && (
                                <Rocket className="w-5 h-5" />
                              )}
                              {system.type === "gravity-tractor" && (
                                <Shield className="w-5 h-5" />
                              )}
                              {system.type === "nuclear-pulse" && (
                                <Zap className="w-5 h-5" />
                              )}
                              {system.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {system.description}
                            </p>
                            <div className="flex gap-4 mt-2 text-xs">
                              <span className="text-muted-foreground">
                                Timeline: {system.minTimelineMonths}-
                                {system.maxTimelineMonths} months
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0" />
                          )}
                        </div>
                        {!isAvailable && (
                          <div className="mt-2 text-sm text-amber-600">
                            ⚠️ Not available for this timeline
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Right Column - System Video */}
                <div className="relative flex items-center justify-center bg-slate-900 rounded-lg overflow-hidden">
                  {selectedSystem ? (
                    <>
                      <video
                        ref={videoRef}
                        key={selectedSystem}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                        style={{ minHeight: "300px" }}
                        onEnded={handleVideoEnded}
                      >
                        <source
                          src={getSystemVideo(selectedSystem)}
                          type="video/mp4"
                        />
                        <div className="flex flex-col items-center justify-center h-full text-white p-8 text-center">
                          <Shield className="w-12 h-12 mb-4 opacity-50" />
                          <p className="text-lg">System Visualization</p>
                          <p className="text-sm opacity-75 mt-2">
                            {
                              DEFENSE_SYSTEMS.find(
                                (s) => s.type === selectedSystem
                              )?.name
                            }
                          </p>
                        </div>
                      </video>
                      {videoEnded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                          <Button
                            onClick={handleReplayVideo}
                            size="lg"
                            className="gap-2"
                          >
                            <RotateCcw className="w-5 h-5" />
                            Replay
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-white p-8 text-center min-h-[300px]">
                      <Shield className="w-16 h-16 mb-4 opacity-30" />
                      <p className="text-lg opacity-75">
                        Select a defense system
                      </p>
                      <p className="text-sm opacity-50 mt-2">
                        Choose from the options on the left to see details
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost Analysis */}
          {cost && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Mission Cost & Feasibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      Spacecraft Mass
                    </p>
                    <p className="text-lg font-semibold">
                      {cost.spacecraftMassKg.toLocaleString()} kg
                    </p>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Launch Cost</p>
                    <p className="text-lg font-semibold">
                      ${cost.launchCostMillionUSD.toLocaleString()}M
                    </p>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Development</p>
                    <p className="text-lg font-semibold">
                      ${cost.developmentCostMillionUSD.toLocaleString()}M
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg border border-blue-300">
                    <p className="text-xs text-blue-700 font-medium">
                      Total Cost
                    </p>
                    <p className="text-lg font-bold text-blue-900">
                      ${cost.totalCostMillionUSD.toLocaleString()}M
                    </p>
                  </div>
                </div>

                {/* Success Probability */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Success Probability</span>
                    <span className="text-2xl font-bold text-green-700">
                      {(cost.successProbability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-green-500 h-full transition-all duration-500 rounded-full"
                      style={{ width: `${cost.successProbability * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {cost.description}
                  </p>
                </div>

                {/* Cost Comparison */}
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <p className="text-sm">
                    <strong>For perspective:</strong> This mission costs
                    approximately {(cost.totalCostMillionUSD / 1000).toFixed(1)}{" "}
                    billion USD. The estimated cost of the asteroid impact would
                    be hundreds of billions to trillions in damages, plus
                    countless lives lost.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
