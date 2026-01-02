import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ConnectionHealth {
  isConnected: boolean;
  isChecking: boolean;
  lastChecked: Date | null;
  latency: number | null;
  error: string | null;
}

export const useConnectionHealth = () => {
  const [health, setHealth] = useState<ConnectionHealth>({
    isConnected: true,
    isChecking: false,
    lastChecked: null,
    latency: null,
    error: null,
  });

  const checkConnection = useCallback(async () => {
    setHealth(prev => ({ ...prev, isChecking: true }));
    
    const startTime = performance.now();
    
    try {
      // Simple health check - query a small piece of data
      const { error } = await supabase
        .from("institutions")
        .select("id")
        .limit(1);

      const latency = Math.round(performance.now() - startTime);

      if (error) {
        setHealth({
          isConnected: false,
          isChecking: false,
          lastChecked: new Date(),
          latency: null,
          error: error.message,
        });
      } else {
        setHealth({
          isConnected: true,
          isChecking: false,
          lastChecked: new Date(),
          latency,
          error: null,
        });
      }
    } catch (err) {
      setHealth({
        isConnected: false,
        isChecking: false,
        lastChecked: new Date(),
        latency: null,
        error: err instanceof Error ? err.message : "Connection failed",
      });
    }
  }, []);

  // Check on mount
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Periodic health check (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, [checkConnection]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      checkConnection();
    };

    const handleOffline = () => {
      setHealth(prev => ({
        ...prev,
        isConnected: false,
        error: "Network offline",
      }));
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [checkConnection]);

  return {
    ...health,
    checkConnection,
  };
};
