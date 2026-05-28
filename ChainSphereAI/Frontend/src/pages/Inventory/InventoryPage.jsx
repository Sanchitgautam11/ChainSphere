import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Package, AlertTriangle, RefreshCw, Search, Sparkles, Loader2, MapPin, Brain, Headphones, Watch, Mouse, Laptop, TrendingUp, TrendingDown, Clock, ChevronRight, Activity } from "lucide-react";
import inventoryService from "@/services/inventoryService";
import aiService from "@/services/aiService";
import { useSettings } from "@/context/SettingsContext";

// Enterprise Metadata Fallbacks
const FALLBACK_PRODUCTS = [
  {
    _id: "ELEC-2045",
    name: "Sony WH-1000XM5 Headphones",
    sku: "ELEC-2045",
    quantity: 32,
    max_capacity: 500,
    status: "low_stock",
    base_price: 349.99,
    warehouse: "Mumbai Central Hub",
    category: "Electronics",
    supplier: "Sony India Pvt Ltd",
    revenue_impact: 420000,
    restock_cost: 110000,
    predicted_weekly_sales: 145,
    demand_trend: "surge",
    ai_confidence: 96.4,
    ai_message: "Projected demand surge detected in Mumbai region. Recommended reorder within 72 hours.",
    icon: Headphones,
    ai_color: "text-amber-400"
  },
  {
    _id: "APP-W9-001",
    name: "Apple Watch Series 9",
    sku: "APP-W9-001",
    quantity: 450,
    max_capacity: 500,
    status: "in_stock",
    base_price: 399.99,
    warehouse: "Delhi Logistics",
    category: "Wearables",
    supplier: "Apple Retail Pvt Ltd",
    revenue_impact: 1250000,
    restock_cost: 0,
    predicted_weekly_sales: 320,
    demand_trend: "steady",
    ai_confidence: 92.1,
    ai_message: "Inventory levels optimized. Current run rate supports demand through end of Q3.",
    icon: Watch,
    ai_color: "text-emerald-400"
  },
  {
    _id: "LOGI-GPRO-X",
    name: "Logitech G Pro X Superlight",
    sku: "LOGI-GPRO-X",
    quantity: 12,
    max_capacity: 200,
    status: "out_of_stock",
    base_price: 159.99,
    warehouse: "Bangalore Tech Park",
    category: "Peripherals",
    supplier: "Logitech Systems",
    revenue_impact: 85000,
    restock_cost: 45000,
    predicted_weekly_sales: 85,
    demand_trend: "drop",
    ai_confidence: 88.5,
    ai_message: "Critical stock-out risk. Seasonal decline expected after current sales cycle.",
    icon: Mouse,
    ai_color: "text-rose-400"
  },
  {
    _id: "DELL-XPS-15",
    name: "Dell XPS 15 Laptop",
    sku: "DELL-XPS-15",
    quantity: 580,
    max_capacity: 600,
    status: "in_stock",
    base_price: 1899.99,
    warehouse: "Pune Distribution",
    category: "Computers",
    supplier: "Dell Technologies",
    revenue_impact: 5400000,
    restock_cost: 0,
    predicted_weekly_sales: 110,
    demand_trend: "steady",
    ai_confidence: 94.8,
    ai_message: "Abnormal sales acceleration detected post-weekend promotion. Overstock risk mitigated.",
    icon: Laptop,
    ai_color: "text-blue-400"
  }
];

export default function InventoryPage() {
  const { settings } = useSettings();
  const [items, setItems] = useState(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  
  // AI Clustering State
  const [analyzingSku, setAnalyzingSku] = useState(null);
  const [regionalForecast, setRegionalForecast] = useState(null);

  // Time mock
  const [lastUpdate, setLastUpdate] = useState("2 mins ago");

  const fetchData = async () => {
    setLoading(true);
    try {
      // Simulate network request
      await new Promise(r => setTimeout(r, 600));
      setLastUpdate("Just now");
      
      // Smart Filtering Logic
      let filtered = [...FALLBACK_PRODUCTS];
      const s = search.toLowerCase().trim();
      
      if (s === "low stock" || s === "critical") {
        filtered = filtered.filter(p => p.quantity < 50);
      } else if (s) {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(s) || 
          p.sku.toLowerCase().includes(s) ||
          p.category.toLowerCase().includes(s)
        );
      }
      setItems(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]); // Auto-filter on search change

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleClusterAnalysis = async (product) => {
    setAnalyzingSku(product._id);
    try {
      const response = await aiService.clusterProduct({
        product_name: product.name,
        category: product.category,
        base_price: product.base_price
      });
      if (response.success) {
        setRegionalForecast(prev => ({ ...prev, [product._id]: response.regional_forecast }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingSku(null);
    }
  };

  const formatCurrency = (val) => {
    if (val >= 100000 && settings.currency === 'INR') return `₹${(val / 100000).toFixed(1)}L`;
    const symbol = settings.currency === 'INR' ? '₹' : settings.currency === 'EUR' ? '€' : '$';
    if (val >= 1000000 && settings.currency !== 'INR') return `${symbol}${(val / 1000000).toFixed(1)}M`;
    return `${symbol}${val.toLocaleString()}`;
  };

  const getProgressColor = (qty, max) => {
    const pct = (qty / max) * 100;
    if (pct < 15) return "bg-rose-500";
    if (pct < 40) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-20"
    >
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Inventory Operations
            <span className="text-xs font-medium px-2 py-1 bg-white/10 text-slate-300 rounded-full flex items-center gap-1 border border-white/5">
              <Clock className="h-3 w-3" /> Last AI Update: {lastUpdate}
            </span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Enterprise supply chain visibility with live LightGBM market intelligence.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors shadow-sm"
          title="Refresh Data"
        >
          <RefreshCw className={`h-4 w-4 text-slate-400 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Smart Search */}
      <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="AI Search (e.g., 'low stock', 'Sony', 'Wearables')..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 shadow-inner"
          />
        </div>
      </form>

      {/* Enterprise Card Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((product, index) => {
            const Icon = product.icon || Package;
            const rForecast = regionalForecast?.[product._id];
            const pct = Math.min(100, (product.quantity / product.max_capacity) * 100);
            
            // First item gets a wider "Hero" Analytics Card layout
            const isHero = index === 0;

            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={isHero ? "md:col-span-2 lg:col-span-2 xl:col-span-2" : "col-span-1"}
              >
                <Card className="h-full glass-panel border-white/5 bg-surface/60 overflow-hidden relative flex flex-col group hover:border-white/10 transition-colors shadow-lg">
                  
                  {/* Subtle Background Gradient for Hero */}
                  {isHero && <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-violet-500/10 blur-3xl rounded-full" />}

                  <CardHeader className="flex flex-row items-start justify-between pb-2 z-10">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-white/5 rounded-lg border border-white/10 shadow-sm group-hover:bg-white/10 transition-colors">
                        <Icon className="h-5 w-5 text-slate-300" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold text-white tracking-tight">{product.name}</CardTitle>
                        <p className="text-xs font-medium text-slate-500 mt-0.5 font-mono">{product.sku} • {product.category}</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col gap-5 pt-2 z-10">
                    
                    {/* Metrics Row */}
                    <div className={`grid gap-4 ${isHero ? 'grid-cols-3' : 'grid-cols-2'}`}>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Stock Level</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-white">{product.quantity}</span>
                          <span className="text-xs text-slate-500">/ {product.max_capacity}</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="h-1.5 w-full bg-white/10 rounded-full mt-2 overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(product.quantity, product.max_capacity)}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Predicted Weekly</p>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xl font-bold text-white">{product.predicted_weekly_sales}</span>
                          {product.demand_trend === "surge" && <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />}
                          {product.demand_trend === "drop" && <TrendingDown className="h-3.5 w-3.5 text-rose-400" />}
                          {product.demand_trend === "steady" && <Activity className="h-3.5 w-3.5 text-blue-400" />}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">{product.demand_trend === "surge" ? "High Demand" : product.demand_trend === "drop" ? "Seasonal Drop" : "Stable Demand"}</p>
                      </div>

                      {isHero && (
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Revenue Impact</p>
                          <span className="text-xl font-bold text-white">{formatCurrency(product.revenue_impact)}</span>
                          <p className="text-[10px] text-slate-400 mt-1">Restock: {formatCurrency(product.restock_cost)}</p>
                        </div>
                      )}
                    </div>

                    {/* Metadata Section */}
                    <div className="bg-black/20 rounded-lg p-2.5 border border-white/5 grid grid-cols-2 gap-2">
                       <div>
                         <p className="text-[9px] text-slate-500 uppercase font-semibold">Warehouse</p>
                         <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" /> {product.warehouse}</p>
                       </div>
                       <div>
                         <p className="text-[9px] text-slate-500 uppercase font-semibold">Supplier</p>
                         <p className="text-xs text-slate-300 mt-0.5 truncate">{product.supplier}</p>
                       </div>
                    </div>

                    {/* AI Prediction Box */}
                    <div className="bg-gradient-to-br from-white/5 to-transparent rounded-lg p-3 border border-white/10 flex-1 relative overflow-hidden group-hover:border-violet-500/30 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${product.ai_color}`}>
                          <Sparkles className="h-3 w-3" /> AI Market Intelligence
                        </span>
                        <span className="text-[10px] font-medium bg-white/10 px-1.5 py-0.5 rounded text-slate-300 border border-white/5">
                          Conf: {product.ai_confidence}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        {product.ai_message}
                      </p>
                    </div>

                    {/* Action Buttons & Regional AI */}
                    <div className="mt-auto space-y-3">
                      {rForecast ? (
                        <div className="bg-[#0a0a0f] rounded-lg p-3 border border-white/10">
                          <p className="text-xs font-semibold text-violet-400 flex items-center gap-1.5 mb-2">
                            <Brain className="h-3.5 w-3.5" /> Regional Forecast Analysis
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            {Object.entries(rForecast).map(([city, demand]) => (
                              <div key={city} className="flex flex-col bg-white/5 px-2 py-1.5 rounded border border-white/5">
                                <span className="text-[10px] text-slate-400 uppercase tracking-wider">{city}</span>
                                <span className={`text-xs font-bold mt-0.5 ${demand.includes("High") ? "text-emerald-400" : "text-amber-400"}`}>
                                  {demand.replace(" demand", "")}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleClusterAnalysis(product)}
                            disabled={analyzingSku === product._id}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold transition-all shadow-lg shadow-violet-500/20 disabled:opacity-50"
                          >
                            {analyzingSku === product._id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Brain className="h-3.5 w-3.5" />}
                            Run AI Market Analysis
                          </button>
                          
                          {/* Conditional Actions */}
                          {product.quantity < 50 ? (
                            <button className="flex items-center justify-center px-3 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-semibold transition-all">
                              Reorder Now
                            </button>
                          ) : (
                            <button className="flex items-center justify-center px-3 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-xs font-medium transition-all">
                              Optimize
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
