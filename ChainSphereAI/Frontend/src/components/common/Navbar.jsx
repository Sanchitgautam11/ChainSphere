import React, { useState, useEffect, useRef } from "react";
import { Search, Bell, Menu, User, Loader2, Sparkles, AlertTriangle, TrendingUp, Package, Compass, Truck, Command, Brain, LogOut, Settings as SettingsIcon } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import aiService from "@/services/aiService";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export function Navbar({ toggleSidebar }) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setShowDropdown(true);
    setIsSearching(true);

    const timerId = setTimeout(async () => {
      try {
        const response = await aiService.searchAiCommand(query);
        if (response.success) {
          setResults(response.results || []);
        }
      } catch (error) {
        console.error("AI Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    }, 600); // 600ms debounce

    return () => clearTimeout(timerId);
  }, [query]);

  // Navigate based on AI recommendation type
  const handleResultClick = (type) => {
    setShowDropdown(false);
    setQuery("");
    if (type === "forecast") navigate("/dashboard/forecast");
    else if (type === "inventory" || type === "alert") navigate("/dashboard/inventory");
    else navigate("/dashboard/analytics");
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
  };

  // Group results by category
  const groupedResults = results.reduce((acc, res) => {
    const cat = res.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(res);
    return acc;
  }, {});

  const renderIcon = (type) => {
    switch (type) {
      case "alert": return <AlertTriangle className="h-4 w-4 text-rose-400" />;
      case "forecast": return <TrendingUp className="h-4 w-4 text-blue-400" />;
      case "inventory": return <Package className="h-4 w-4 text-emerald-400" />;
      default: return <Sparkles className="h-4 w-4 text-amber-400" />;
    }
  };

  const renderCategoryIcon = (cat) => {
    switch (cat) {
      case "Risks": return <AlertTriangle className="h-3 w-3 text-rose-500" />;
      case "Inventory": return <Package className="h-3 w-3 text-emerald-500" />;
      case "Forecasts": return <TrendingUp className="h-3 w-3 text-blue-500" />;
      case "Regional": return <Compass className="h-3 w-3 text-amber-500" />;
      case "Supplier": return <Truck className="h-3 w-3 text-orange-500" />;
      case "Insights": return <Sparkles className="h-3 w-3 text-violet-500" />;
      case "Recommendations": return <Command className="h-3 w-3 text-teal-500" />;
      default: return <Sparkles className="h-3 w-3 text-slate-500" />;
    }
  };

  // Mock Auto-Suggestions
  const autoSuggestions = ["low stock analysis", "predict next month demand", "festival demand products", "supplier delay risks"];
  const showSuggestions = !isSearching && results.length === 0 && query.length < 5;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/10 bg-background/60 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="rounded-md p-2 text-muted-foreground hover:bg-white/5 hover:text-foreground md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        {/* MULTI-AI COMMAND CENTER */}
        <div className="relative hidden md:block" ref={dropdownRef}>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Ask AI... (e.g. 'festival demand', 'supplier delays')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (query) setShowDropdown(true); }}
            className="h-10 w-[420px] rounded-full border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all shadow-inner"
          />
          
          <AnimatePresence>
            {showDropdown && (query.trim().length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-14 left-0 w-[500px] bg-[#0a0a0f]/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col max-h-[450px]"
              >
                <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center bg-white/5">
                  <span className="text-xs font-semibold text-teal-400 flex items-center gap-2">
                    <Brain className="h-4 w-4" /> ChainSphere Multi-AI Intelligence Engine
                  </span>
                  {isSearching && <Loader2 className="h-3.5 w-3.5 text-muted-foreground animate-spin" />}
                </div>

                <div className="overflow-y-auto p-2 flex-1">
                  {showSuggestions ? (
                    <div className="p-2">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-2">Suggested Commands</p>
                      {autoSuggestions.map((sug, i) => (
                        <div 
                          key={i} 
                          onClick={() => handleSuggestionClick(sug)}
                          className="px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer text-sm text-slate-300 flex items-center gap-2 transition-colors"
                        >
                          <Search className="h-3 w-3 text-slate-500" /> {sug}
                        </div>
                      ))}
                    </div>
                  ) : isSearching && results.length === 0 ? (
                    <div className="p-8 flex flex-col items-center justify-center text-center space-y-3">
                      <Loader2 className="h-6 w-6 text-violet-500 animate-spin" />
                      <p className="text-sm text-slate-400">Ensemble parsing intent...</p>
                    </div>
                  ) : Object.keys(groupedResults).length > 0 ? (
                    <div className="space-y-4 p-2">
                      {Object.entries(groupedResults).map(([category, catResults]) => (
                        <div key={category} className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 flex items-center gap-1.5 border-b border-white/5 pb-1">
                            {renderCategoryIcon(category)} {category}
                          </p>
                          {catResults.map((res, idx) => (
                            <div 
                              key={idx} 
                              onClick={() => handleResultClick(res.type)}
                              className="p-3 rounded-lg bg-white/[0.02] hover:bg-white/10 transition-colors group cursor-pointer border border-transparent hover:border-violet-500/30"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  {renderIcon(res.type)}
                                  <h4 className="text-sm font-semibold text-white">{res.title}</h4>
                                </div>
                              </div>
                              <p className="text-xs text-slate-400 pl-6 leading-relaxed">
                                {res.description}
                              </p>
                              <div className="pl-6 mt-2 flex items-center gap-2">
                                <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded bg-white/10 text-slate-200 group-hover:bg-violet-600 transition-colors">
                                  Action: {res.action}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Sparkles className="h-6 w-6 text-slate-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">No critical anomalies detected for this segment.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
        </button>
        
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="h-8 w-8 overflow-hidden rounded-full border border-white/20 bg-muted hover:ring-2 hover:ring-teal-500/50 transition-all focus:outline-none"
          >
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-500 to-blue-500">
              {user?.name ? (
                <span className="text-xs font-bold text-white tracking-widest">
                  {user.name.substring(0, 2).toUpperCase()}
                </span>
              ) : (
                <User className="h-4 w-4 text-white" />
              )}
            </div>
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-12 w-56 rounded-xl border border-white/10 bg-[#0a0a0f]/95 backdrop-blur-2xl shadow-2xl z-50 overflow-hidden"
              >
                <div className="border-b border-white/10 px-4 py-3 bg-white/5">
                  <p className="text-sm font-medium text-white">{user?.name || "ChainSphere Admin"}</p>
                  <p className="text-xs text-slate-400 truncate">{user?.email || "admin@chainsphere.com"}</p>
                </div>
                <div className="p-2">
                  <Link 
                    to="/dashboard/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <SettingsIcon className="h-4 w-4" />
                    Account Settings
                  </Link>
                  <button 
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                      navigate("/login");
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors mt-1"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
