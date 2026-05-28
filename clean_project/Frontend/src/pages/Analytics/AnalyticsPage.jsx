import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Activity, Package, Clock, ShieldAlert } from "lucide-react";
import { SupplyChainMap } from "@/components/charts/SupplyChainMap";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Supply Chain Analytics</h1>
        <p className="text-muted-foreground mt-1">Live, end-to-end visibility into your global supply chain network.</p>
      </div>

      {/* KPI Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        <Card className="glass-panel border-white/5 bg-surface/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Package size={64} />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">1,248</div>
            <p className="text-xs text-emerald-400 mt-1 flex items-center">
              +142 this week
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/5 bg-surface/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Activity size={64} />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Network Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">96.4%</div>
            <p className="text-xs text-emerald-400 mt-1 flex items-center">
              Optimal operating levels
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/5 bg-surface/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Clock size={64} />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Avg Transit Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">4.2 Days</div>
            <p className="text-xs text-amber-400 mt-1 flex items-center">
              -0.4 days vs last month
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-rose-500/20 bg-surface/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <ShieldAlert size={64} />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-rose-400">Critical Delays</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">2</div>
            <p className="text-xs text-rose-400 mt-1 flex items-center">
              Affecting 12% of cargo volume
            </p>
          </CardContent>
        </Card>

      </div>

      {/* Global Delay Tracker Map */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 md:col-span-2 lg:col-span-3 glass-panel border-white/5 bg-[#050508]/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-400" />
              Global Delay Tracker Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* The SVG Map is embedded here */}
            <SupplyChainMap />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
