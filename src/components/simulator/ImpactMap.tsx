"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ImpactLocation } from "@/types/asteroid";
import type { ImpactZone } from "@/types/impact";
import type * as L from "leaflet";

interface ImpactMapProps {
  location: ImpactLocation;
  zones: ImpactZone[];
  onLocationChange: (location: ImpactLocation) => void;
  showMarker?: boolean;
  disableClick?: boolean;
}

export function ImpactMap({
  location,
  zones,
  onLocationChange,
  showMarker = true,
  disableClick = false,
}: ImpactMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const circlesRef = useRef<L.Circle[]>([]);
  const markerRef = useRef<L.Marker | null>(null);

  // Store callbacks in refs to avoid re-initialization
  const onLocationChangeRef = useRef(onLocationChange);
  const disableClickRef = useRef(disableClick);

  useEffect(() => {
    onLocationChangeRef.current = onLocationChange;
    disableClickRef.current = disableClick;
  });

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
        if (!disableClickRef.current) {
          onLocationChangeRef.current({
            lat: e.latlng.lat,
            lng: e.latlng.lng,
          });
        }
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

  // Update map center and marker when location changes
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    map.setView([location.lat, location.lng], map.getZoom());

    // Update or create marker
    import("leaflet").then((L) => {
      // Remove existing marker
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }

      // Only show marker if showMarker is true
      if (showMarker) {
        // Create custom icon for impact location
        const icon = L.divIcon({
          className: "custom-marker",
          html: `<div style="background: red; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });

        // Add new marker
        const marker = L.marker([location.lat, location.lng], { icon })
          .addTo(map)
          .bindPopup("Impact Location");

        markerRef.current = marker;
      }
    });
  }, [location.lat, location.lng, showMarker]);

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
      if (zones.length > 0) {
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

        // Find the crater zone specifically for zoom calculation
        const craterZone = zones.find((z) => z.type === "crater");
        if (craterZone) {
          // Calculate bounds to show ONLY the crater prominently
          const craterRadiusKm = craterZone.radius;
          const radiusForBounds = craterRadiusKm * 1.2; // 1.2x for minimal padding

          // Calculate bounds manually using Leaflet's LatLngBounds
          // Convert radius from km to degrees (approximate)
          const radiusInDegrees = radiusForBounds / 111; // 1 degree ≈ 111 km

          const bounds = L.latLngBounds(
            [location.lat - radiusInDegrees, location.lng - radiusInDegrees],
            [location.lat + radiusInDegrees, location.lng + radiusInDegrees]
          );

          // Fit map to show only the crater
          map.fitBounds(bounds, {
            padding: [20, 20],
            maxZoom: 18, // Allow closer zoom
            animate: true,
            duration: 1,
          });
        }
      }
    });
  }, [zones, location.lat, location.lng]);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Impact Map</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          ref={mapRef}
          className="w-full h-[500px] rounded-lg overflow-hidden"
          style={{ zIndex: 0 }}
        />
        <p className="text-xs text-muted-foreground">
          Click anywhere on the map to set the impact location
        </p>

        {/* Legend */}
        {zones.length > 0 && (
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-semibold text-sm mb-3">Impact Zone Legend</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {zones.map((zone) => (
                <div key={zone.type} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white"
                    style={{ backgroundColor: zone.color }}
                  />
                  <span className="text-xs font-medium capitalize">
                    {zone.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
