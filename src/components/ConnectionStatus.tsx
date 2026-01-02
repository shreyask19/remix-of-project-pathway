import { useConnectionHealth } from "@/hooks/useConnectionHealth";
import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

const ConnectionStatus = () => {
  const { isConnected, isChecking, error, checkConnection } = useConnectionHealth();

  if (isConnected) return null;

  return (
    <AnimatePresence>
      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground px-4 py-2"
        >
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4" />
              <span className="text-sm font-medium">
                {error || "Connection lost. Some features may be unavailable."}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={checkConnection}
              disabled={isChecking}
              className="text-destructive-foreground hover:bg-destructive-foreground/10"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${isChecking ? "animate-spin" : ""}`} />
              {isChecking ? "Checking..." : "Retry"}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConnectionStatus;
