import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import { LayoutDashboard, TrendingUp, Package, Activity, Settings, Link as LinkIcon } from "lucide-react";
import { motion } from "framer-motion";
import { AILiveFeed } from "./AILiveFeed";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Forecast Analytics", href: "/dashboard/forecast", icon: TrendingUp },
  { name: "Inventory", href: "/dashboard/inventory", icon: Package },
  { name: "Supply Chain", href: "/dashboard/analytics", icon: Activity },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ isOpen }) {
  const location = useLocation();

  return (
    <motion.aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 transform border-r border-white/10 bg-background/80 backdrop-blur-xl transition-transform duration-300 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center px-6">
        <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-blue-600 shadow-lg shadow-teal-500/20">
            <LinkIcon className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Chain<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Sphere</span>
          </span>
        </Link>
      </div>

      <nav className="space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {item.name}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 h-8 w-1 rounded-r-full bg-primary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
      
      <AILiveFeed />
    </motion.aside>
  );
}
