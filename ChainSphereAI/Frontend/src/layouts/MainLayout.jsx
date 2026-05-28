import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/common/Sidebar";
import { Navbar } from "@/components/common/Navbar";
import { motion, AnimatePresence } from "framer-motion";

export function MainLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:pl-64 transition-all duration-300 ease-in-out">
        <Navbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        
        {/* Main Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full max-w-7xl mx-auto space-y-6"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
