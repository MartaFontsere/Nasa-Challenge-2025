"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ImpactLocation } from "@/types/asteroid";
import type { ImpactZone } from "@/types/impact";
import type * as L from "leaflet";

interface ImpactMapProps {
  location: ImpactLocation;
  zones: ImpactZone[];
  onLocationChange: (location: ImpactLocation) => void;
}

export function ImpactMap({
  location,
  zones,
  onLocationChange,
}: ImpactMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const circlesRef = useRef<L.Circle[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Dynamically import Leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      if (!mapRef.current || leafletMapRef.current) return;

      // Initialize map
      const map = L.map(mapRef.current).setView(
        [location.lat, location.lng],
        10
      );

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add click handler
      map.on("click", (e: L.LeafletMouseEvent) => {
        onLocationChange({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
      });

      leafletMapRef.current = map;
    });

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Update map center when location changes
  useEffect(() => {
    if (leafletMapRef.current) {
      leafletMapRef.current.setView(
        [location.lat, location.lng],
        leafletMapRef.current.getZoom()
      );
    }
  }, [location.lat, location.lng]);

  // Update impact zones
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    import("leaflet").then((L) => {
      // Remove existing circles
      for (const circle of circlesRef.current) {
        circle.remove();
      }
      circlesRef.current = [];

      // Add new circles (in reverse order so smallest is on top)
      for (const zone of [...zones].reverse()) {
        const circle = L.circle([location.lat, location.lng], {
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: 0.2,
          radius: zone.radius * 1000, // Convert km to meters
        })
          .addTo(map)
          .bindPopup(zone.label);

        circlesRef.current.push(circle);
      }
    });
  }, [zones, location.lat, location.lng]);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Impact Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={mapRef}
          className="w-full h-[500px] rounded-lg overflow-hidden"
          style={{ zIndex: 0 }}
        />
        <p className="text-xs text-muted-foreground mt-2">
          Click anywhere on the map to set the impact location
        </p>
      </CardContent>
    </Card>
  );
}
