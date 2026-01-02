import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { toast } from "sonner";

// Performance logging for slow queries
const logSlowQuery = (queryKey: unknown, duration: number) => {
  if (duration > 1000) {
    console.warn(`[Performance] Slow query detected:`, {
      queryKey,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });
  }
};

// Global error handler for queries
const handleQueryError = (error: unknown) => {
  console.error("[Query Error]", error);
  
  // Only show toast for network errors, not for expected errors
  if (error instanceof Error) {
    if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
      toast.error("Connection issue", {
        description: "Please check your internet connection and try again.",
      });
    }
  }
};

// Global error handler for mutations
const handleMutationError = (error: unknown, variables: unknown, context: unknown, mutation: unknown) => {
  console.error("[Mutation Error]", error);
  
  if (error instanceof Error) {
    // Don't show toast if the mutation has its own error handling
    const mutationMeta = (mutation as any)?.meta;
    if (!mutationMeta?.suppressErrorToast) {
      toast.error("Operation failed", {
        description: error.message || "Please try again.",
      });
    }
  }
};

export const createQueryClient = () => {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: handleQueryError,
    }),
    mutationCache: new MutationCache({
      onError: handleMutationError,
    }),
    defaultOptions: {
      queries: {
        // Data considered fresh for 30 seconds
        staleTime: 30 * 1000,
        // Keep unused data in cache for 5 minutes
        gcTime: 5 * 60 * 1000,
        // Retry failed requests 3 times with exponential backoff
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Refetch on window focus for fresh data
        refetchOnWindowFocus: true,
        // Don't refetch on mount if data is fresh
        refetchOnMount: true,
        // Refetch when reconnecting
        refetchOnReconnect: true,
        // Network mode for offline support
        networkMode: "online",
      },
      mutations: {
        // Retry mutations once
        retry: 1,
        retryDelay: 1000,
        // Network mode
        networkMode: "online",
      },
    },
  });
};

// Singleton instance
let queryClientInstance: QueryClient | null = null;

export const getQueryClient = () => {
  if (!queryClientInstance) {
    queryClientInstance = createQueryClient();
  }
  return queryClientInstance;
};

// Utility for optimistic updates
export const createOptimisticUpdate = <T>(
  queryKey: unknown[],
  updater: (oldData: T | undefined) => T
) => {
  const queryClient = getQueryClient();
  
  return {
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });
      
      // Snapshot previous value
      const previousData = queryClient.getQueryData<T>(queryKey);
      
      // Optimistically update
      queryClient.setQueryData<T>(queryKey, updater);
      
      return { previousData };
    },
    onError: (err: unknown, variables: unknown, context: { previousData?: T } | undefined) => {
      // Rollback on error
      if (context?.previousData !== undefined) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey });
    },
  };
};

// Request deduplication key generator
export const generateQueryKey = (base: string, params: Record<string, unknown> = {}) => {
  const sortedParams = Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null && v !== "")
    .sort(([a], [b]) => a.localeCompare(b));
  
  return [base, Object.fromEntries(sortedParams)];
};
