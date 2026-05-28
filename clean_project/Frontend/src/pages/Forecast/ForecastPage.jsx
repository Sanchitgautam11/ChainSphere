import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { DemandForecastChart } from "@/components/charts/DemandForecastChart";

export default function ForecastPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Forecast Analytics</h1>
        <p className="text-muted-foreground">Deep dive into predictive demand models and accuracy metrics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DemandForecastChart />
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Model Accuracy</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[300px]">
             <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 shadow-[0_0_40px_rgba(139,92,246,0.3)]">
               <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
                 <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">94%</span>
               </div>
               <svg className="absolute inset-0 h-full w-full -rotate-90 transform">
                 <circle cx="80" cy="80" r="76" className="fill-none stroke-white/10" strokeWidth="8" />
                 <circle cx="80" cy="80" r="76" className="fill-none stroke-violet-500" strokeWidth="8" strokeDasharray="477" strokeDashoffset="28" strokeLinecap="round" />
               </svg>
             </div>
             <p className="mt-4 text-sm text-muted-foreground text-center">
               Overall forecast accuracy across all product lines for the last 30 days.
             </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
