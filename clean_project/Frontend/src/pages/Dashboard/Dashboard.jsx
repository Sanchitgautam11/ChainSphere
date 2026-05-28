import React, { useEffect, useState } from "react";
import { DollarSign, AlertTriangle, PackageX, TrendingUp, Loader2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { DemandForecastChart } from "@/components/charts/DemandForecastChart";
import analyticsService from "@/services/analyticsService";
import aiService from "@/services/aiService";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";

function StatCard({ title, value, icon: Icon, trend, trendValue, color, loading, density }) {
  const pClass = density === 'compact' ? 'p-3' : density === 'spacious' ? 'p-8' : 'p-6';
  return (
    <Card className={`glass-panel border-white/5 bg-surface/60 ${pClass}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 w-24 rounded bg-white/10 animate-pulse" />
        ) : (
          <div className="text-2xl font-bold">{value ?? "—"}</div>
        )}
        {!loading && trendValue && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center">
            <span className={`mr-1 ${trend === "up" ? "text-emerald-400" : "text-rose-400"}`}>
              {trendValue}
            </span>
            {title === "Forecast Accuracy" ? "Confidence Interval" : "vs last month"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [kpis, setKpis] = useState(null);
  const [loadingKpis, setLoadingKpis] = useState(true);
  
  // AI State
  const [aiAccuracy, setAiAccuracy] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loadingRecs, setLoadingRecs] = useState(false);

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        const data = await analyticsService.getDashboardKpis();
        setKpis(data);
      } catch (err) {
        console.error("Failed to load KPIs:", err.message);
      } finally {
        setLoadingKpis(false);
      }
    };
    fetchKpis();
  }, []);

  const handleGenerateRecommendations = async () => {
    setLoadingRecs(true);
    try {
      // Send mock inventory state to optimizer with the user's Confidence Threshold
      const response = await aiService.optimizeInventory([
        { sku: "ELEC-2045", quantity: 20 },
        { sku: "APP-W9-001", quantity: 600 }
      ], settings.confidenceThreshold);
      if (response.success) {
        let recs = response.recommendations || [];
        if (!settings.demandSurgeAlerts) {
          recs = recs.filter(r => !r.action.toLowerCase().includes('surge') && !r.reason.toLowerCase().includes('surge'));
        }
        setRecommendations(recs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRecs(false);
    }
  };

  const formatCurrency = (value) => {
    if (value == null) return "—";
    const symbol = settings.currency === 'INR' ? '₹' : settings.currency === 'EUR' ? '€' : '$';
    return `${symbol}${Number(value).toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
        </h1>
        <p className="text-muted-foreground">AI-driven insights for your retail supply chain.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Inventory Value"
          value={formatCurrency(kpis?.totalInventoryValue)}
          icon={DollarSign}
          trend="up"
          trendValue="+12%"
          color="text-emerald-400"
          loading={loadingKpis}
          density={settings.density}
        />
        <StatCard
          title="Low Stock Items"
          value={kpis?.lowStockItems != null ? `${kpis.lowStockItems} Items` : "—"}
          icon={AlertTriangle}
          trend="down"
          trendValue="-4%"
          color="text-amber-400"
          loading={loadingKpis}
          density={settings.density}
        />
        <StatCard
          title="Out of Stock"
          value={kpis?.outOfStockItems != null ? `${kpis.outOfStockItems} Items` : "—"}
          icon={PackageX}
          trend="down"
          trendValue="-2"
          color="text-rose-400"
          loading={loadingKpis}
          density={settings.density}
        />
        <StatCard
          title="Forecast Accuracy"
          value={aiAccuracy ? `${(aiAccuracy.overallAccuracy * 100).toFixed(1)}%` : (kpis?.forecastAccuracy ? `${kpis.forecastAccuracy}%` : "94.2%")}
          icon={TrendingUp}
          trend="up"
          trendValue={aiAccuracy ? `RMSE: ${aiAccuracy.rmse}` : "+1.2%"}
          color="text-blue-400"
          loading={loadingKpis}
          density={settings.density}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DemandForecastChart onAccuracyUpdate={setAiAccuracy} />

        <Card className="col-span-1 flex flex-col glass-panel border-white/5 bg-surface/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>AI Decision Engine</CardTitle>
            <button
              onClick={handleGenerateRecommendations}
              disabled={loadingRecs}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-md text-xs font-medium transition-all"
            >
              {loadingRecs ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3 text-amber-400" />}
              Generate
            </button>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4 pt-2">
            
            {recommendations ? (
              recommendations.map((rec, idx) => (
                <div key={idx} className="rounded-lg bg-white/5 p-4 border border-white/10 animate-in fade-in slide-in-from-bottom-2">
                  <h4 className={`text-sm font-semibold flex items-center gap-2 ${rec.action.includes('discount') ? 'text-blue-400' : 'text-emerald-400'}`}>
                    <Sparkles className="h-4 w-4" /> {rec.action}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {rec.reason}
                  </p>
                  {rec.risk_score && (
                    <div className="mt-3 pt-2 border-t border-white/5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> {rec.risk_score}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <>
                <div className="rounded-lg bg-white/5 p-4 border border-white/10">
                  <h4 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" /> Awaiting AI...
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Click Generate to run the AI risk optimizer. Alerts below your <strong>{settings.confidenceThreshold}%</strong> confidence threshold will be safely filtered out.
                  </p>
                </div>
              </>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
