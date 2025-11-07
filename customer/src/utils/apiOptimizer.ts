// API optimization utilities for faster loading

export const fetchWithCache = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300000 // 5 minutes default
): Promise<T> => {
  try {
    const cached = localStorage.getItem(key);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < ttl) {
        return data as T;
      }
    }
  } catch (error) {
    console.error('Cache read error:', error);
  }

  const data = await fetcher();
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch (error) {
    console.error('Cache write error:', error);
    if (error.name === 'QuotaExceededError') {
      // Clear old cache entries and retry
      clearOldCache();
      try {
        localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
      } catch (retryError) {
        console.error('Cache retry failed:', retryError);
      }
    }
  }
  return data;
};

export const parallelFetch = async <T>(requests: Promise<T>[]): Promise<T[]> => {
  return Promise.all(requests);
};

// Clear cache on app start if it's too large
export const initializeCache = () => {
  try {
    const usage = JSON.stringify(localStorage).length;
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (usage > maxSize) {
      clearOldCache();
    }
  } catch (error) {
    console.error('Cache initialization error:', error);
  }
};

export const clearCache = (key?: string) => {
  if (key) {
    localStorage.removeItem(key);
  } else {
    // Clear all cache keys
    const keys = Object.keys(localStorage);
    keys.forEach(k => {
      if (k.startsWith('cache_') || k.startsWith('wallet_') || k.startsWith('transactions_')) {
        localStorage.removeItem(k);
      }
    });
  }
};

const clearOldCache = () => {
  const keys = Object.keys(localStorage);
  const cacheKeys = keys.filter(k => k.startsWith('wallet_') || k.startsWith('transactions_') || k.startsWith('cache_'));
  
  // Sort by timestamp and remove oldest entries
  const entries = cacheKeys.map(key => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        return { key, timestamp: parsed.timestamp || 0 };
      }
    } catch (e) {
      return { key, timestamp: 0 };
    }
    return null;
  }).filter(Boolean).sort((a, b) => a.timestamp - b.timestamp);
  
  // Remove oldest 50% of cache entries
  const toRemove = entries.slice(0, Math.ceil(entries.length / 2));
  toRemove.forEach(entry => localStorage.removeItem(entry.key));
};
