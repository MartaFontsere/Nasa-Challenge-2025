"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

interface TrajectoryAnimationProps {
  isDeflected?: boolean;
  onAnimationComplete?: () => void;
}

export function TrajectoryAnimation({
  isDeflected = false,
  onAnimationComplete,
}: TrajectoryAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Animation parameters
    const earthRadius = 30;
    const asteroidRadius = 8;
    const trajectoryLength = 350;

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw space background
      ctx.fillStyle = "#000814";
      ctx.fillRect(0, 0, width, height);

      // Draw stars
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 100; i++) {
        const x = (i * 137.5) % width;
        const y = (i * 217.3) % height;
        const size = (i % 3) * 0.5 + 0.5;
        ctx.fillRect(x, y, size, size);
      }

      // Draw Earth
      const earthGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        earthRadius
      );
      earthGradient.addColorStop(0, "#4a90e2");
      earthGradient.addColorStop(0.7, "#2563eb");
      earthGradient.addColorStop(1, "#1e40af");
      ctx.fillStyle = earthGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw Earth outline
      ctx.strokeStyle = "#60a5fa";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw Earth atmosphere glow
      ctx.strokeStyle = "rgba(96, 165, 250, 0.3)";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadius + 3, 0, Math.PI * 2);
      ctx.stroke();

      // Calculate asteroid position
      const t = progress;
      let asteroidX: number;
      let asteroidY: number;

      if (!isDeflected) {
        // Direct collision trajectory
        asteroidX = centerX + trajectoryLength * (1 - t) - 100;
        asteroidY = centerY - trajectoryLength * (1 - t) * 0.6 + 60;
      } else {
        // Deflected trajectory (curves away)
        const deflectionStart = 0.5; // Start deflection halfway
        if (t < deflectionStart) {
          // Normal approach
          asteroidX = centerX + trajectoryLength * (1 - t) - 100;
          asteroidY = centerY - trajectoryLength * (1 - t) * 0.6 + 60;
        } else {
          // Deflection curve
          const deflectionT = (t - deflectionStart) / (1 - deflectionStart);
          const baseX =
            centerX + trajectoryLength * (1 - deflectionStart) - 100;
          const baseY =
            centerY - trajectoryLength * (1 - deflectionStart) * 0.6 + 60;

          asteroidX = baseX - deflectionT * 150 + deflectionT * 50;
          asteroidY = baseY - deflectionT * 80;
        }
      }

      // Draw trajectory line
      ctx.strokeStyle = isDeflected
        ? "rgba(34, 197, 94, 0.5)"
        : "rgba(239, 68, 68, 0.5)";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(asteroidX, asteroidY);

      if (!isDeflected) {
        ctx.lineTo(centerX, centerY);
      } else {
        // Draw curved deflection path
        ctx.quadraticCurveTo(
          centerX - 50,
          centerY - 80,
          centerX - 200,
          centerY - 150
        );
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw asteroid
      const asteroidGradient = ctx.createRadialGradient(
        asteroidX,
        asteroidY,
        0,
        asteroidX,
        asteroidY,
        asteroidRadius
      );
      asteroidGradient.addColorStop(0, "#9ca3af");
      asteroidGradient.addColorStop(0.7, "#6b7280");
      asteroidGradient.addColorStop(1, "#374151");
      ctx.fillStyle = asteroidGradient;
      ctx.beginPath();
      ctx.arc(asteroidX, asteroidY, asteroidRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw asteroid direction indicator
      const angle = Math.atan2(centerY - asteroidY, centerX - asteroidX);
      const arrowLength = 15;
      ctx.strokeStyle = isDeflected ? "#22c55e" : "#ef4444";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(asteroidX, asteroidY);
      ctx.lineTo(
        asteroidX + Math.cos(angle) * arrowLength,
        asteroidY + Math.sin(angle) * arrowLength
      );
      ctx.stroke();

      // Draw defense spacecraft (if deflected and in range)
      if (isDeflected && t >= 0.4 && t <= 0.6) {
        const spacecraftX = asteroidX - 20;
        const spacecraftY = asteroidY - 20;

        // Spacecraft body
        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.arc(spacecraftX, spacecraftY, 4, 0, Math.PI * 2);
        ctx.fill();

        // Impact flash
        const flashAlpha = 1 - Math.abs(t - 0.5) * 10;
        if (flashAlpha > 0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
          ctx.beginPath();
          ctx.arc(
            spacecraftX,
            spacecraftY,
            15 * (1 - flashAlpha),
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }

      // Draw labels
      ctx.fillStyle = "#ffffff";
      ctx.font = "14px sans-serif";
      ctx.fillText("Earth", centerX - 20, centerY + earthRadius + 20);

      if (t < 0.95) {
        ctx.fillText(
          "Asteroid",
          asteroidX - 25,
          asteroidY + asteroidRadius + 20
        );
      }

      // Draw status text
      ctx.font = "16px sans-serif";
      if (isDeflected) {
        ctx.fillStyle = "#22c55e";
        if (t >= 0.5) {
          ctx.fillText("✓ Deflection Successful!", width / 2 - 90, 30);
        } else {
          ctx.fillText("Defense System Approaching...", width / 2 - 110, 30);
        }
      } else {
        ctx.fillStyle = "#ef4444";
        ctx.fillText("Collision Course", width / 2 - 60, 30);
      }

      // Update progress
      if (isPlaying && t < 1) {
        setProgress((prev) => Math.min(prev + 0.005, 1));
        animationFrameRef.current = requestAnimationFrame(animate);
      } else if (t >= 1) {
        setIsPlaying(false);
        onAnimationComplete?.();
      }
    };

    if (isPlaying) {
      animate();
    } else {
      // Draw single frame when paused
      animate();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, progress, isDeflected, onAnimationComplete]);

  const handlePlayPause = () => {
    if (progress >= 1) {
      setProgress(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        width={700}
        height={400}
        className="border border-gray-700 rounded-lg bg-slate-900"
      />
      <div className="flex gap-2">
        <Button onClick={handlePlayPause} variant="default">
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Play
            </>
          )}
        </Button>
        <Button onClick={handleReset} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
}
