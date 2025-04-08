import React, { useState, useEffect } from "react";
import { Users, Activity, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { getVisitorCount, getLastVisitTimestamp, incrementVisitorCount } from "@/services/firebaseService";

interface VisitorCounterProps {
  className?: string;
}

const VisitorCounter: React.FC<VisitorCounterProps> = ({ className }) => {
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [lastVisit, setLastVisit] = useState<string>("Just now");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Always increment on every page load/refresh
    incrementVisitorCount()
      .then(() => {
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Failed to increment visitor count:", error);
        setIsLoading(false);
      });

    // Simulate loading for smooth animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);
    
    // Set up listener for visitor count updates
    const unsubscribeCount = getVisitorCount((count) => {
      setVisitorCount(count);
    });
    
    // Set up listener for last visit timestamp updates
    const unsubscribeTimestamp = getLastVisitTimestamp((timestamp) => {
      if (timestamp) {
        updateLastVisitTime(timestamp);
      }
    });
    
    // Clean up subscriptions and timers
    return () => {
      clearTimeout(timer);
      // If the Firebase listeners return unsubscribe functions, call them
      if (typeof unsubscribeCount === 'function') unsubscribeCount();
      if (typeof unsubscribeTimestamp === 'function') unsubscribeTimestamp();
    };
  }, []); // Empty dependency array means this runs once on mount

  // Update time since last visit
  const updateLastVisitTime = (timestamp: number) => {
    const lastVisitTime = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - lastVisitTime.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      setLastVisit("Just now");
    } else if (diffInSeconds < 3600) {
      setLastVisit(`${Math.floor(diffInSeconds / 60)} minute(s) ago`);
    } else if (diffInSeconds < 86400) {
      setLastVisit(`${Math.floor(diffInSeconds / 3600)} hour(s) ago`);
    } else {
      setLastVisit(`${Math.floor(diffInSeconds / 86400)} day(s) ago`);
    }
  };

  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            "fixed right-6 bottom-24 z-50",
            className
          )}
        >
          <div className="relative">
            <motion.div
              className="flex flex-col items-center"
              layout
            >
              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className="bg-luxury-100/90 backdrop-blur-md border border-gold/20 rounded-full p-3 shadow-lg shadow-gold/10 hover:shadow-gold/20 transition-all duration-300 flex items-center gap-2 group"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={isLoading}
              >
                <Users className="w-5 h-5 text-gold" />
                <span className="text-gold font-medium">
                  <motion.span
                    key={visitorCount}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isLoading ? "..." : formatNumber(visitorCount)}
                  </motion.span>
                  {isExpanded ? " views" : ""}
                </span>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-gold/70"
                  >
                    <path d="m18 15-6-6-6 6"/>
                  </svg>
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="mt-2 bg-luxury-100/90 backdrop-blur-md border border-gold/20 rounded-lg p-3 shadow-lg text-sm text-luxury-700 w-full"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-gold/70" />
                      <span>Page view counter</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-gold/70" />
                      <span>Last view: {lastVisit}</span>
                    </div>
                    <div className="h-1 w-full bg-luxury-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ 
                          width: "100%",
                          transition: { duration: 1.5, ease: "easeOut" }
                        }}
                        className="h-full bg-gradient-to-r from-gold/60 to-gold"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VisitorCounter;