const CACHE_DURATION = 24 * 60 * 60 * 1000;

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export function getCachedData<T>(key: string): T | null {
  const cached = localStorage.getItem(key);

  if (!cached) {
    return null;
  }

  const item: CacheItem<T> = JSON.parse(cached);
  const isExpired = Date.now() - item.timestamp > CACHE_DURATION;

  if (isExpired) {
    localStorage.removeItem(key);
    return null;
  }

  return item.data;
}

export function setCachedData<T>(key: string, data: T): void {
  const item: CacheItem<T> = {
    data,
    timestamp: Date.now(),
  };

  localStorage.setItem(key, JSON.stringify(item));
}
