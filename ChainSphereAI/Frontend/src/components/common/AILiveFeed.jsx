import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, CheckCircle2, XCircle } from "lucide-react";
import aiService from "@/services/aiService";

export function AILiveFeed() {
  const [status, setStatus] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Poll the actual API every 10 seconds
    const fetchStatus = async () => {
      try {
        const data = await aiService.getAiStatus();
        setStatus(data);
      } catch (err) {
        setStatus({ error: true });
      }
    };
    
    fetchStatus();
    const pollInterval = setInterval(fetchStatus, 10000);
    return () => clearInterval(pollInterval);
  }, []);

  // Build the list of active statuses to cycle through
  const activeLogs = [];
  if (status) {
    activeLogs.push({ 
      text: status.api_connected ? "API connected" : "API disconnected", 
      color: status.api_connected ? "text-emerald-400" : "text-rose-400",
      icon: status.api_connected ? CheckCircle2 : XCircle
    });
    activeLogs.push({ 
      text: status.model_trained ? "Forecast model trained" : "Model untrained", 
      color: status.model_trained ? "text-emerald-400" : "text-amber-400",
      icon: status.model_trained ? CheckCircle2 : XCircle
    });
    activeLogs.push({ 
      text: status.clustering_active ? "Clustering active" : "Clustering inactive", 
      color: status.clustering_active ? "text-emerald-400" : "text-amber-400",
      icon: status.clustering_active ? CheckCircle2 : XCircle
    });
    activeLogs.push({ 
      text: status.inventory_optimizer_running ? "Inventory optimizer running" : "Optimizer offline", 
      color: status.inventory_optimizer_running ? "text-emerald-400" : "text-rose-400",
      icon: status.inventory_optimizer_running ? CheckCircle2 : XCircle
    });
  } else {
    activeLogs.push({ text: "Connecting to ML Pipeline...", color: "text-amber-400", icon: Brain });
  }

  useEffect(() => {
    // Cycle through messages every 3 seconds
    const cycleInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(1, activeLogs.length));
    }, 3000);
    return () => clearInterval(cycleInterval);
  }, [activeLogs.length]);

  const currentLog = activeLogs[currentIndex] || activeLogs[0];
  const Icon = currentLog?.icon || Brain;

  return (
    <div className="absolute bottom-4 left-4 right-4">
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md shadow-lg">
        
        {/* Pulsing background effect based on connection status */}
        <div className={`absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 blur-2xl rounded-full animate-pulse ${status?.error || !status?.api_connected ? 'bg-rose-500/20' : 'bg-primary/20'}`} />

        <div className="flex items-center gap-2 mb-2">
          <div className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status?.error || !status?.api_connected ? 'bg-rose-400' : 'bg-emerald-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${status?.error || !status?.api_connected ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
          </div>
          <p className="text-xs font-semibold text-foreground tracking-wider uppercase">Live AI Status</p>
        </div>

        <div className="h-10 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-start gap-2"
            >
              {currentLog && (
                <>
                  <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${currentLog.color}`} />
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    {currentLog.text}
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        
      </div>
    </div>
  );
}
