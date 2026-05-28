import React from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Brain, Activity, Cpu, Globe2, Shield } from "lucide-react";

export function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex bg-[#020617] text-white">
      {/* Left Column: Image Background */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 z-0">
           <img src="/auth-bg.png" alt="ChainSphere AI Analytics" className="w-full h-full object-cover opacity-60 mix-blend-screen" />
           {/* Dark overlays to ensure text readability and blend nicely with the right side */}
           <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
           <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/40 to-[#020617]" />
        </div>
        
        <div className="relative z-10">
           <a href="/" className="flex items-center gap-3 mb-16 hover:opacity-80 transition-opacity w-fit">
             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 shadow-lg shadow-teal-500/30">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
             </div>
             <span className="text-2xl font-bold tracking-tight text-white">
               Chain<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Sphere</span>
             </span>
           </a>

           <div className="flex items-center gap-2 mb-6">
             <div className="p-2.5 rounded-lg bg-teal-500/20 border border-teal-500/30">
               <Brain className="h-6 w-6 text-teal-400" />
             </div>
             <span className="text-teal-400 font-bold text-sm uppercase tracking-widest">Enterprise Intelligence</span>
           </div>
           <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-lg leading-[1.15]">
             Automate Your Global Supply Chain with Pinpoint AI Accuracy.
           </h1>
           
           <div className="mt-12 grid grid-cols-2 gap-4 max-w-lg">
             <div className="flex flex-col gap-2 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
               <div className="flex items-center gap-2 text-teal-400 font-semibold text-sm">
                 <Activity className="h-4 w-4" /> Real-time Analytics
               </div>
               <p className="text-xs text-slate-400 leading-relaxed">Live multi-regional inventory tracking and demand visualization.</p>
             </div>
             <div className="flex flex-col gap-2 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
               <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
                 <Cpu className="h-4 w-4" /> LightGBM Engine
               </div>
               <p className="text-xs text-slate-400 leading-relaxed">Advanced ensemble models predicting stockouts before they happen.</p>
             </div>
             <div className="flex flex-col gap-2 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
               <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
                 <Globe2 className="h-4 w-4" /> Global Logistics
               </div>
               <p className="text-xs text-slate-400 leading-relaxed">Automated regional balancing and route disruption alerts.</p>
             </div>
             <div className="flex flex-col gap-2 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
               <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
                 <Shield className="h-4 w-4" /> XAI Explainability
               </div>
               <p className="text-xs text-slate-400 leading-relaxed">Transparent feature importance so you always know why the AI acted.</p>
             </div>
           </div>
        </div>
        

      </div>

      {/* Right Column: Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative p-8">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="w-full max-w-md z-10">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
