import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, AlertTriangle } from "lucide-react";

// Simplified relative coordinates for an abstract 800x400 map
const nodes = [
  { id: "NY", label: "New York Hub", cx: 220, cy: 160 },
  { id: "LDN", label: "London Hub", cx: 400, cy: 130 },
  { id: "SGP", label: "Singapore Port", cx: 650, cy: 220 },
  { id: "TKY", label: "Tokyo Hub", cx: 720, cy: 160 },
  { id: "SYD", label: "Sydney Hub", cx: 700, cy: 320 },
  { id: "RIO", label: "Rio Hub", cx: 280, cy: 300 }
];

const routes = [
  { id: "r1", from: "NY", to: "LDN", status: "active", delay: false },
  { id: "r2", from: "LDN", to: "SGP", status: "active", delay: true },
  { id: "r3", from: "SGP", to: "TKY", status: "active", delay: false },
  { id: "r4", from: "TKY", to: "NY", status: "active", delay: false },
  { id: "r5", from: "SGP", to: "SYD", status: "active", delay: false },
  { id: "r6", from: "NY", to: "RIO", status: "active", delay: true }
];

export function SupplyChainMap() {
  const [hoveredRoute, setHoveredRoute] = useState(null);

  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center bg-[#0a0a0f] rounded-lg overflow-hidden border border-white/5">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <svg
        viewBox="0 0 800 400"
        className="w-full h-full drop-shadow-2xl z-10"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Draw Static Routes Base */}
        {routes.map((route) => {
          const from = nodes.find((n) => n.id === route.from);
          const to = nodes.find((n) => n.id === route.to);
          return (
            <line
              key={`base-${route.id}`}
              x1={from.cx}
              y1={from.cy}
              x2={to.cx}
              y2={to.cy}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Draw Animated Active Cargo Routes */}
        {routes.map((route) => {
          const from = nodes.find((n) => n.id === route.from);
          const to = nodes.find((n) => n.id === route.to);
          const isDelayed = route.delay;
          
          return (
            <motion.line
              key={`active-${route.id}`}
              x1={from.cx}
              y1={from.cy}
              x2={to.cx}
              y2={to.cy}
              stroke={isDelayed ? "#ef4444" : "#8b5cf6"} // red-500 or violet-500
              strokeWidth={isDelayed ? "3" : "2"}
              initial={{ strokeDasharray: "0 1000", strokeDashoffset: 0 }}
              animate={{ 
                strokeDasharray: ["0 1000", "200 1000", "200 1000", "0 1000"],
                strokeDashoffset: [0, 0, -800, -800]
              }}
              transition={{
                duration: isDelayed ? 6 : 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2
              }}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredRoute(route)}
              onMouseLeave={() => setHoveredRoute(null)}
            />
          );
        })}

        {/* Draw Nodes */}
        {nodes.map((node) => (
          <g key={node.id} className="group">
            {/* Pulsing ring */}
            <motion.circle
              cx={node.cx}
              cy={node.cy}
              r="12"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="1.5"
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
            {/* Core dot */}
            <circle
              cx={node.cx}
              cy={node.cy}
              r="6"
              fill="#3b82f6" // blue-500
              className="shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            />
            <text
              x={node.cx}
              y={node.cy - 15}
              fill="white"
              fontSize="12"
              textAnchor="middle"
              className="opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md font-medium"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>

      {/* Hover Tooltip Overlay */}
      <AnimatePresence>
        {hoveredRoute && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 glass-panel bg-surface/90 border-white/10 p-4 rounded-xl shadow-2xl min-w-[250px] z-20 pointer-events-none"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-widest">Route Status</span>
              {hoveredRoute.delay ? (
                <div className="flex items-center gap-1 text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full text-xs font-semibold">
                  <AlertTriangle size={12} /> Delayed
                </div>
              ) : (
                <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full text-xs font-semibold">
                  <Navigation size={12} /> On Time
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-3 text-sm text-white font-medium">
              <span>{nodes.find(n => n.id === hoveredRoute.from).label}</span>
              <span className="mx-2 text-gray-500">→</span>
              <span>{nodes.find(n => n.id === hoveredRoute.to).label}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
