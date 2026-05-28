import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { 
  TrendingUp, ArrowRight, Activity, Box, AlertTriangle, Truck, BarChart3, 
  PieChart as PieChartIcon, Globe2, Cpu, Network, Link as LinkIcon, 
  LayoutDashboard, Package, Settings, Zap, Shield, Sparkles, Brain
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

// Counter Component for Statistics
function Counter({ value, suffix = "", prefix = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const startTime = performance.now();
      
      const animate = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOut * value));
        
        if (progress < 1) requestAnimationFrame(animate);
      };
      
      requestAnimationFrame(animate);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60">
      {prefix}{count}{suffix}
    </span>
  );
}

// Particle System & Animated Background Component
function BackgroundEffects() {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * -20,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.15)_0%,rgba(2,6,23,0)_70%)]" />
      
      <motion.div
        animate={{ x: ["0%", "20%", "0%", "-20%", "0%"], y: ["0%", "10%", "20%", "10%", "0%"], scale: [1, 1.2, 1, 0.8, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-teal-600/20 blur-[120px]"
      />
      <motion.div
        animate={{ x: ["0%", "-20%", "0%", "20%", "0%"], y: ["0%", "-10%", "-20%", "-10%", "0%"], scale: [1, 0.8, 1, 1.2, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-600/20 blur-[150px]"
      />

      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, x: `${p.x}vw`, y: `${p.y}vh` }}
          animate={{ opacity: [0, 0.6, 0], y: [`${p.y}vh`, `${p.y - 30}vh`] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
          className="absolute rounded-full bg-white/60 shadow-[0_0_12px_2px_rgba(255,255,255,0.8)]"
          style={{ width: p.size, height: p.size }}
        />
      ))}
    </div>
  );
}

// Dummy chart data for landing page mockup
const mockChartData = [
  { name: 'Jan', val: 400 },
  { name: 'Feb', val: 300 },
  { name: 'Mar', val: 550 },
  { name: 'Apr', val: 450 },
  { name: 'May', val: 700 },
  { name: 'Jun', val: 650 },
  { name: 'Jul', val: 800 },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const dashboardScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const dashboardOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <div ref={containerRef} className="w-full bg-[#020617] text-white relative selection:bg-teal-500/30 overflow-x-hidden min-h-screen">
      <BackgroundEffects />

      {/* Sticky Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#020617]/70 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 shadow-lg shadow-teal-500/30">
              <LinkIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Chain<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Sphere</span>
            </span>
          </div>
          <div className="hidden md:flex gap-4 items-center">
            <a href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors mr-4">Features</a>
            <a href="#platform" className="text-sm font-medium text-slate-300 hover:text-white transition-colors mr-4">Platform</a>
            <Button variant="ghost" className="text-white hover:text-white/80 hover:bg-white/10" onClick={() => navigate('/signin')}>
              Sign In
            </Button>
            <Button className="bg-white text-black hover:bg-slate-200 font-bold px-6 rounded-full" onClick={() => navigate('/signup')}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Section 1: Hero */}
      <section className="min-h-screen w-full relative flex flex-col items-center justify-center pt-32 pb-20 px-4">
        
        {/* Floating elements to make hero less empty */}
        <motion.div 
          animate={{ y: [0, -15, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="hidden lg:flex absolute left-[10%] top-[30%] flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-500/20"><Brain className="h-5 w-5 text-teal-400"/></div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">LGBM Optimizer</p>
              <p className="text-sm font-bold text-white">98.4% Accuracy</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 15, 0] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="hidden lg:flex absolute right-[10%] top-[45%] flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/20"><AlertTriangle className="h-5 w-5 text-rose-400"/></div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Stockout Risk</p>
              <p className="text-sm font-bold text-white">Surge in Mumbai</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto text-center z-10 flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-8"
          >
            <Sparkles className="h-4 w-4 text-teal-400" />
            <span className="text-sm font-bold text-teal-300">Introducing Enterprise Multi-AI</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight mb-8 leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
            Supply Chain Intelligence,<br /> Perfected.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            Eliminate stockouts, forecast demand with pinpoint precision, and automate your inventory operations with ChainSphere's ensemble machine learning.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
            <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full bg-white text-black hover:bg-slate-200 font-bold" onClick={() => navigate('/signup')}>
              Start Optimizing
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full border-white/20 hover:bg-white/10 hover:text-white bg-transparent text-white" onClick={() => navigate('/signin')}>
              View Live Demo
            </Button>
          </div>
          <p className="mt-6 text-sm text-slate-500 font-medium flex items-center gap-2">
            <Shield className="h-4 w-4"/> Enterprise-grade security • No credit card required
          </p>
        </motion.div>

        {/* Trusted By Marquee */}
        <div className="w-full mt-24 border-y border-white/5 bg-white/[0.02] py-8 overflow-hidden flex flex-col items-center justify-center z-10">
          <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-6">Trusted by Forward-Thinking Global Brands</p>
          <div className="flex gap-12 md:gap-24 opacity-50 grayscale select-none">
            {/* Mock logos text for effect */}
            <span className="text-xl font-black font-serif tracking-tighter">ACME Corp</span>
            <span className="text-xl font-black font-sans tracking-widest">GLOBAL</span>
            <span className="text-xl font-bold font-mono">NEXUS</span>
            <span className="text-xl font-black font-serif italic">Vertex</span>
            <span className="text-xl font-black font-sans tracking-tighter">OMNI</span>
          </div>
        </div>
      </section>

      {/* Section 2: Dashboard High-Fidelity Preview */}
      <section id="platform" className="py-24 w-full relative flex flex-col items-center justify-center px-4 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16 z-10 w-full max-w-7xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Command Your Operations</h2>
          <p className="text-slate-400 text-lg">A unified, beautifully designed view of your entire supply chain ecosystem.</p>
        </motion.div>
        
        <motion.div 
          style={{ scale: dashboardScale, opacity: dashboardOpacity }}
          className="w-full max-w-6xl z-10 perspective-[1200px]"
        >
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            whileHover={{ rotateX: 2, rotateY: -2, boxShadow: "0 0 120px rgba(20,184,166,0.4)" }}
            className="w-full rounded-2xl bg-[#0a0a0f] border border-white/10 shadow-[0_0_80px_-20px_rgba(20,184,166,0.3)] overflow-hidden flex flex-col transition-all duration-500"
          >
            {/* Dashboard Browser Header */}
            <div className="h-12 border-b border-white/5 flex items-center px-4 gap-4 bg-white/[0.01]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white/5 px-32 py-1.5 rounded-md text-xs text-slate-400 flex items-center gap-2">
                   <Shield className="h-3 w-3"/> chainsphere.app/dashboard
                </div>
              </div>
            </div>
            
            {/* High Fidelity Dashboard Content */}
            <div className="flex-1 flex bg-[#050508] min-h-[600px] text-white">
              {/* Sidebar */}
              <div className="w-64 border-r border-white/5 p-4 flex flex-col gap-6">
                <div className="flex items-center gap-2 px-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-blue-600 shadow-lg">
                    <LinkIcon className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-bold text-lg">ChainSphere</span>
                </div>
                <div className="flex flex-col gap-1 mt-4">
                   <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/10 text-white font-medium text-sm"><LayoutDashboard className="h-4 w-4"/> Dashboard</div>
                   <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 font-medium text-sm"><BarChart3 className="h-4 w-4"/> Analytics</div>
                   <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 font-medium text-sm"><Package className="h-4 w-4"/> Inventory</div>
                   <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 font-medium text-sm"><Network className="h-4 w-4"/> Logistics</div>
                </div>
                <div className="mt-auto bg-gradient-to-br from-teal-500/10 to-blue-500/10 border border-teal-500/20 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
                     <span className="text-xs font-bold text-teal-400">AI ACTIVE</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Models synced successfully.</p>
                </div>
              </div>
              
              {/* Main Area */}
              <div className="flex-1 p-8 flex flex-col gap-6 overflow-hidden relative">
                {/* Background glow inside dashboard */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-500/5 blur-[100px] pointer-events-none"/>
                
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold">Welcome back, Admin</h3>
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300">Export Report</div>
                    <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/30 text-teal-400 font-bold">A</div>
                  </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02] flex flex-col gap-2 relative overflow-hidden group">
                    <div className="flex justify-between items-center"><span className="text-xs text-slate-400 font-medium">Total Revenue Impact</span><DollarSign className="h-4 w-4 text-emerald-400"/></div>
                    <span className="text-3xl font-bold">$2.4M</span>
                    <span className="text-xs text-emerald-400 font-semibold">+14% vs last month</span>
                  </div>
                  <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02] flex flex-col gap-2 relative overflow-hidden group">
                    <div className="flex justify-between items-center"><span className="text-xs text-slate-400 font-medium">Critical Stockouts</span><AlertTriangle className="h-4 w-4 text-rose-400"/></div>
                    <span className="text-3xl font-bold">2 Items</span>
                    <span className="text-xs text-rose-400 font-semibold">Action required</span>
                  </div>
                  <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02] flex flex-col gap-2 relative overflow-hidden group">
                    <div className="flex justify-between items-center"><span className="text-xs text-slate-400 font-medium">AI Accuracy</span><Zap className="h-4 w-4 text-teal-400"/></div>
                    <span className="text-3xl font-bold">96.8%</span>
                    <span className="text-xs text-teal-400 font-semibold">LGBM Tuned</span>
                  </div>
                </div>

                {/* Chart Area */}
                <div className="flex-1 border border-white/5 bg-white/[0.02] rounded-xl p-6 flex flex-col relative z-10">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-semibold text-lg flex items-center gap-2"><Sparkles className="h-4 w-4 text-blue-400"/> Demand Forecast</h4>
                    <div className="flex gap-2">
                       <span className="px-3 py-1 bg-white/10 rounded text-xs font-medium text-white">6 Months</span>
                    </div>
                  </div>
                  <div className="flex-1 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mockChartData}>
                        <defs>
                          <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.5}/>
                            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="val" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Section 3: Features Grid */}
      <section id="features" className="py-24 w-full relative flex items-center px-4 overflow-hidden bg-black/40 border-t border-white/5">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto w-full z-10"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Enterprise Scale Intelligence</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Everything you need to run a flawless, data-driven supply chain network.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Cpu, color: "teal", title: "Ensemble Forecasting", desc: "Dual LGBM and XGBoost algorithms predict future demand with unprecedented accuracy." },
              { icon: Box, color: "blue", title: "Smart Warehousing", desc: "Real-time visibility into global inventory levels. Reorder autonomously before stockouts." },
              { icon: AlertTriangle, color: "rose", title: "Risk Intelligence", desc: "Identify disruptions before they happen by monitoring delays, weather, and traffic." },
              { icon: Network, color: "violet", title: "Route Optimization", desc: "Reduce fuel consumption and improve delivery rates with dynamic ML routing." },
              { icon: Activity, color: "emerald", title: "Live Analytics", desc: "Interactive charts and KPI dashboards that update instantly as your data flows." },
              { icon: Settings, color: "amber", title: "Full Customization", desc: "Granular control over AI confidence thresholds, models, and regional parameters." }
            ].map((feat, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-[#0a0a0f] border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all duration-300 group relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-${feat.color}-500/10 blur-[50px] group-hover:bg-${feat.color}-500/20 transition-colors`}/>
                <div className={`h-12 w-12 rounded-xl bg-${feat.color}-500/10 flex items-center justify-center mb-6 border border-${feat.color}-500/20 group-hover:scale-110 transition-transform`}>
                  <feat.icon className={`h-6 w-6 text-${feat.color}-400`} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{feat.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Section 4: CTA */}
      <section className="py-32 w-full relative flex items-center justify-center overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] to-[#050B1F] z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-gradient-to-br from-teal-600/20 to-blue-600/20 blur-[150px] rounded-full pointer-events-none z-0" />
        
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto text-center z-10 px-4 flex flex-col items-center"
        >
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-white">
            Ready to Transform Your Supply Chain?
          </h2>
          
          <p className="text-xl text-slate-300 mb-10 font-light">
            Join industry leaders optimizing their global operations with ChainSphere.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
            <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-10 rounded-full bg-white text-black hover:bg-slate-200 font-bold shadow-[0_0_30px_rgba(20,184,166,0.3)]" onClick={() => navigate('/signup')}>
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-14 px-10 rounded-full border-white/20 bg-white/5 hover:bg-white/10 text-white" onClick={() => navigate('/signin')}>
              Book Demo
            </Button>
          </div>
        </motion.div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-[#020617] text-center text-slate-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
           <LinkIcon className="h-4 w-4"/> <span className="font-bold text-white">ChainSphere AI</span>
        </div>
        <p>© 2026 ChainSphere. All rights reserved.</p>
      </footer>
    </div>
  );
}

// Additional icon needed for the mockup
function DollarSign(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  );
}
