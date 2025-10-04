"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResultCardProps {
  title: string;
  value: string;
  variant?: "default" | "amber" | "rose" | "yellow" | "blue";
}

export function ResultCard({
  title,
  value,
  variant = "default",
}: ResultCardProps) {
  const variantStyles = {
    default: "bg-white border-slate-300",
    amber: "bg-white border-2 border-amber-400",
    rose: "bg-white border-2 border-rose-400",
    yellow: "bg-white border-2 border-yellow-400",
    blue: "bg-white border-2 border-blue-400",
  };

  const titleStyles = {
    default: "text-slate-600 text-sm",
    amber: "text-amber-700 text-sm",
    rose: "text-rose-700 text-sm",
    yellow: "text-yellow-700 text-sm",
    blue: "text-blue-700 text-sm",
  };

  const valueStyles = {
    default: "text-slate-900",
    amber: "text-amber-900",
    rose: "text-rose-900",
    yellow: "text-yellow-900",
    blue: "text-blue-900",
  };

  return (
    <Card className={`shadow-sm ${variantStyles[variant]}`}>
      <CardHeader className="pb-2">
        <CardTitle className={titleStyles[variant]}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-bold ${valueStyles[variant]}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
