import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { 
  Moon, Sun, Sparkles, BrainCircuit, Activity, User, Globe, Layout, Home, IndianRupee,
  Calendar, Percent, SlidersHorizontal, Settings2, RefreshCw, Dna, Bell, Mail, Clock,
  Database, FileUp, Link as LinkIcon, Download, MapPin, Shield, Key, History, Zap
} from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useAuth } from "@/context/AuthContext";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// Sleek Custom Toggle Switch Component
const Toggle = ({ active, onToggle }) => (
  <div
    onClick={onToggle}
    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out ${active ? 'bg-teal-500' : 'bg-white/10'}`}
  >
    <div
      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${active ? 'translate-x-5' : 'translate-x-0'}`}
    />
  </div>
);

// Reusable Setting Row
const SettingRow = ({ icon: Icon, title, description, children }) => (
  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
    <div className="flex items-center gap-4">
      <div className="p-2 rounded-lg bg-white/5 text-slate-400">
        <Icon size={18} />
      </div>
      <div>
        <span className="text-sm font-semibold text-white block">{title}</span>
        {description && <span className="text-xs text-slate-500">{description}</span>}
      </div>
    </div>
    <div className="flex items-center gap-3">
      {children}
    </div>
  </div>
);

const CustomSelect = ({ value, onChange, options, className = "w-40" }) => {
  const [open, setOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value) || options[0];

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <div 
        className="bg-[#0a0a0f] border border-white/10 hover:border-white/20 text-white text-xs rounded-lg px-3 py-2 cursor-pointer flex justify-between items-center transition-colors shadow-inner"
        onClick={() => setOpen(!open)}
      >
        <span>{selectedOption?.label}</span>
        <svg className={`w-3 h-3 ml-2 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
      
      {open && (
        <div className="absolute top-full mt-1 right-0 w-full min-w-[120px] z-50 bg-[#0f0f15] border border-white/10 rounded-lg shadow-2xl overflow-hidden py-1">
          {options.map((opt) => (
            <div 
              key={opt.value}
              className={`px-3 py-2 text-xs cursor-pointer transition-colors flex items-center gap-2 ${value === opt.value ? 'bg-teal-500/10 text-teal-400 font-medium' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
              onClick={() => {
                onChange({ target: { value: opt.value } });
                setOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function SettingsPage() {
  const { settings, saveSettings } = useSettings();
  const { user } = useAuth();
  const [saveStatus, setSaveStatus] = useState(null);
  
  // Local state to hold unsaved changes
  const [localSettings, setLocalSettings] = useState(settings);

  const updateSetting = (key, value) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  };

  const toggleCity = (city) => {
    setLocalSettings((prev) => {
      const activeCities = prev.activeCities.includes(city)
        ? prev.activeCities.filter((c) => c !== city)
        : [...prev.activeCities, city];
      return { ...prev, activeCities };
    });
  };

  const handleSave = () => {
    setSaveStatus("saving");
    saveSettings(localSettings);
    setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(null), 2000);
    }, 800);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 max-w-6xl mx-auto pb-20"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Platform Settings</h1>
          <p className="text-slate-400 mt-1">Configure your ChainSphere environment and AI parameters.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saveStatus === "saving"}
          className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 rounded-lg text-sm font-bold text-white transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50 flex items-center gap-2"
        >
          {saveStatus === "saving" ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Settings2 className="h-4 w-4" />}
          {saveStatus === "saving" ? "Applying..." : saveStatus === "saved" ? "Saved Successfully!" : "Apply Changes"}
        </button>
      </div>

      {/* Profile Summary Header */}
      <motion.div variants={itemVariants}>
        <div className="glass-panel border-white/10 bg-surface/60 p-6 flex items-center gap-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.3)] z-10">
            {user?.name ? (
                <span className="text-2xl font-bold text-white tracking-widest">
                  {user.name.substring(0, 2).toUpperCase()}
                </span>
              ) : (
                <User size={32} className="text-white/80" />
            )}
          </div>
          <div className="z-10">
            <h2 className="text-xl font-bold text-white">{user?.name || "ChainSphere Admin"}</h2>
            <p className="text-sm text-slate-400">{user?.email || "admin@chainsphere.com"} • Enterprise Plan</p>
          </div>
          <div className="ml-auto flex gap-3 z-10">
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors text-white">
              Edit Profile
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-2">

        {/* ─── APPEARANCE & LOCALIZATION ─── */}
        <motion.div variants={itemVariants}>
          <Card className="h-full glass-panel border-white/5 bg-surface/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sun size={20} className="text-blue-400" />
                Appearance & Localization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">


              <SettingRow icon={Globe} title="Language / Locale">
                <CustomSelect 
                  value={localSettings.language} 
                  onChange={(e) => updateSetting("language", e.target.value)}
                  options={[
                    { value: 'en', label: 'English (US)' },
                    { value: 'hi', label: 'Hindi (IN)' },
                    { value: 'es', label: 'Spanish (ES)' }
                  ]}
                />
              </SettingRow>

              <SettingRow icon={Layout} title="Dashboard Density">
                <CustomSelect 
                  value={localSettings.density} 
                  onChange={(e) => updateSetting("density", e.target.value)}
                  options={[
                    { value: 'compact', label: 'Compact' },
                    { value: 'comfortable', label: 'Comfortable' },
                    { value: 'spacious', label: 'Spacious' }
                  ]}
                />
              </SettingRow>

              <SettingRow icon={IndianRupee} title="Currency Format">
                <CustomSelect 
                  value={localSettings.currency} 
                  onChange={(e) => updateSetting("currency", e.target.value)}
                  options={[
                    { value: 'INR', label: '₹ INR' },
                    { value: 'USD', label: '$ USD' },
                    { value: 'EUR', label: '€ EUR' }
                  ]}
                />
              </SettingRow>
            </CardContent>
          </Card>
        </motion.div>

        {/* ─── AI PREFERENCES ─── */}
        <motion.div variants={itemVariants}>
          <Card className="h-full glass-panel border-white/5 bg-surface/60 border-t-teal-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BrainCircuit size={20} className="text-teal-400" />
                AI Model Tuning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <SettingRow icon={Dna} title="Core Model Selection" description="Changes which .pkl model handles predictions.">
                <CustomSelect 
                  value={localSettings.modelSelection} 
                  onChange={(e) => updateSetting("modelSelection", e.target.value)}
                  className="w-48"
                  options={[
                    { value: 'Ensemble', label: 'Ensemble (LGBM + XGB)' },
                    { value: 'LGBM', label: 'LightGBM Only' },
                    { value: 'XGBoost', label: 'XGBoost Only' }
                  ]}
                />
              </SettingRow>

              <SettingRow icon={Percent} title="Confidence Risk Threshold" description={`Only alert if risk > ${localSettings.confidenceThreshold}%`}>
                <div className="flex items-center gap-3 w-40">
                  <input 
                    type="range" min="50" max="99" 
                    value={localSettings.confidenceThreshold}
                    onChange={(e) => updateSetting("confidenceThreshold", parseInt(e.target.value))}
                    className="w-full accent-teal-500"
                  />
                  <span className="text-xs font-bold text-white">{localSettings.confidenceThreshold}%</span>
                </div>
              </SettingRow>

              <SettingRow icon={Calendar} title="Forecast Horizon" description="Default chart projection timeframe.">
                <CustomSelect 
                  value={localSettings.forecastHorizon} 
                  onChange={(e) => updateSetting("forecastHorizon", e.target.value)}
                  options={[
                    { value: '3', label: '3 Months' },
                    { value: '6', label: '6 Months' },
                    { value: '12', label: '12 Months' }
                  ]}
                />
              </SettingRow>

              <SettingRow icon={Zap} title="Cold Start Handling" description="Use clustering for products with no history.">
                <Toggle active={localSettings.coldStartHandling} onToggle={() => updateSetting("coldStartHandling", !localSettings.coldStartHandling)} />
              </SettingRow>
            </CardContent>
          </Card>
        </motion.div>

        {/* ─── REGION SETTINGS ─── */}
        <motion.div variants={itemVariants}>
          <Card className="h-full glass-panel border-white/5 bg-surface/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin size={20} className="text-amber-400" />
                Regional Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm font-semibold text-white block mb-3">Active Monitored Regions</span>
                <div className="flex flex-wrap gap-2">
                  {["Mumbai", "Delhi", "Bangalore", "Pune", "Chennai", "Hyderabad"].map(city => {
                    const isActive = localSettings.activeCities.includes(city);
                    return (
                      <button
                        key={city}
                        onClick={() => toggleCity(city)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${isActive ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-white/5 text-slate-400 border border-transparent hover:bg-white/10'}`}
                      >
                        {city}
                      </button>
                    )
                  })}
                </div>
              </div>

              <SettingRow icon={Home} title="Default Headquarter Region">
                <CustomSelect 
                  value={localSettings.defaultRegion} 
                  onChange={(e) => updateSetting("defaultRegion", e.target.value)}
                  options={localSettings.activeCities.map(c => ({ value: c, label: c }))}
                />
              </SettingRow>
            </CardContent>
          </Card>
        </motion.div>

        {/* ─── NOTIFICATIONS & INTEGRATIONS ─── */}
        <motion.div variants={itemVariants}>
          <Card className="h-full glass-panel border-white/5 bg-surface/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell size={20} className="text-rose-400" />
                Alerts & Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <SettingRow icon={Mail} title="Demand Surge Email Alerts" description="Notify immediately on 300%+ variance.">
                <Toggle active={localSettings.demandSurgeAlerts} onToggle={() => updateSetting("demandSurgeAlerts", !localSettings.demandSurgeAlerts)} />
              </SettingRow>

              <SettingRow icon={Clock} title="Reorder Reminder Frequency">
                <CustomSelect 
                  value={localSettings.reorderFrequency} 
                  onChange={(e) => updateSetting("reorderFrequency", e.target.value)}
                  options={[
                    { value: 'realtime', label: 'Real-time' },
                    { value: 'daily', label: 'Daily Digest' },
                    { value: 'weekly', label: 'Weekly Report' }
                  ]}
                />
              </SettingRow>

              <SettingRow icon={Database} title="ERP Connection" description="Sync inventory with SAP/Oracle.">
                <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-md text-xs font-medium text-white transition-colors flex items-center gap-2">
                  <LinkIcon size={12} /> Connect System
                </button>
              </SettingRow>

              <SettingRow icon={Download} title="Export Latest Predictions">
                <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-md text-xs font-medium text-white transition-colors flex items-center gap-2">
                  <FileUp size={12} /> Download CSV
                </button>
              </SettingRow>
            </CardContent>
          </Card>
        </motion.div>

        {/* ─── ACCOUNT & SECURITY ─── */}
        <motion.div variants={itemVariants} className="xl:col-span-2">
          <Card className="glass-panel border-white/5 bg-surface/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield size={20} className="text-slate-400" />
                Account & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <SettingRow icon={Key} title="API Keys" description="Manage tokens for backend Python access.">
                  <button className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-xs font-medium text-slate-300">
                    Manage Keys
                  </button>
                </SettingRow>
                <SettingRow icon={History} title="Session Activity Log">
                  <button className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-xs font-medium text-slate-300">
                    View Logs
                  </button>
                </SettingRow>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col justify-center">
                <h4 className="text-sm font-semibold text-white mb-1">Change Password</h4>
                <p className="text-xs text-slate-400 mb-4">Ensure your account is using a strong, unique password.</p>
                <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium text-white transition-colors border border-white/10">
                  Update Password
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </motion.div>
  );
}