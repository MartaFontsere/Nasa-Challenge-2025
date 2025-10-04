"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Rocket, Globe } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b ${
        isHomePage
          ? "bg-black/80 border-slate-700 backdrop-blur"
          : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Rocket className={`w-6 h-6 ${isHomePage ? "text-white" : ""}`} />
          <h1 className={`text-xl font-bold ${isHomePage ? "text-white" : ""}`}>
            Asteroid Impact Simulator
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button
              variant={pathname === "/" ? "default" : "ghost"}
              size="sm"
              className={
                isHomePage
                  ? "text-white hover:bg-slate-800 hover:text-white"
                  : ""
              }
            >
              <Globe className="w-4 h-4 mr-2" />
              Solar System
            </Button>
          </Link>
          <Link href="/simulator">
            <Button
              variant={pathname === "/simulator" ? "default" : "ghost"}
              size="sm"
              className={
                isHomePage
                  ? "text-white hover:bg-slate-800 hover:text-white"
                  : ""
              }
            >
              <Rocket className="w-4 h-4 mr-2" />
              Simulator
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
