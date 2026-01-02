import { useState, useEffect, useMemo, useCallback, useRef } from "react";

interface UseDebouncedSearchOptions {
  delay?: number;
  minLength?: number;
}

export const useDebouncedSearch = (
  initialValue: string = "",
  options: UseDebouncedSearchOptions = {}
) => {
  const { delay = 300, minLength = 0 } = options;
  
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Debounce effect
  useEffect(() => {
    if (value.length < minLength && value.length > 0) {
      // Don't search if below minimum length
      return;
    }

    setIsDebouncing(true);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, minLength]);

  // Clear function
  const clear = useCallback(() => {
    setValue("");
    setDebouncedValue("");
    setIsDebouncing(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  // Force immediate update (skip debounce)
  const setImmediate = useCallback((newValue: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setValue(newValue);
    setDebouncedValue(newValue);
    setIsDebouncing(false);
  }, []);

  return {
    value,
    setValue,
    debouncedValue,
    isDebouncing,
    clear,
    setImmediate,
  };
};

// Hook for combining search with query params
export const useSearchWithQuery = <T>(
  items: T[] | undefined,
  searchField: keyof T | ((item: T) => string),
  options: UseDebouncedSearchOptions = {}
) => {
  const { value, setValue, debouncedValue, isDebouncing, clear } = useDebouncedSearch("", options);

  const filteredItems = useMemo(() => {
    if (!items || !debouncedValue.trim()) return items || [];
    
    const searchLower = debouncedValue.toLowerCase();
    
    return items.filter((item) => {
      const fieldValue = typeof searchField === "function" 
        ? searchField(item) 
        : String(item[searchField] || "");
      return fieldValue.toLowerCase().includes(searchLower);
    });
  }, [items, debouncedValue, searchField]);

  return {
    searchValue: value,
    setSearchValue: setValue,
    filteredItems,
    isSearching: isDebouncing,
    clearSearch: clear,
    hasActiveSearch: debouncedValue.trim().length > 0,
  };
};
