import { useEffect, useState, useCallback } from "react";

/** Local, on-device storage for favourites, trips and recent searches. */
const evt = "ghuri-store";

function read<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
}

export function useStore<T>(key: string, fallback: T) {
  const [val, setVal] = useState<T>(fallback);
  useEffect(() => {
    setVal(read(key, fallback));
    const h = () => setVal(read(key, fallback));
    window.addEventListener(evt, h);
    return () => window.removeEventListener(evt, h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const set = useCallback((next: T | ((p: T) => T)) => {
    const value = typeof next === "function" ? (next as (p: T) => T)(read(key, fallback)) : next;
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(evt));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return [val, set] as const;
}

export function useFavourites() {
  const [favs, setFavs] = useStore<string[]>("ghuri-favs", []);
  const toggle = (slug: string) => setFavs((p) => (p.includes(slug) ? p.filter((s) => s !== slug) : [...p, slug]));
  return { favs, toggle, has: (s: string) => favs.includes(s) };
}

export interface SavedTrip { id: string; name: string; createdAt: string; slugs: string[]; days: number; travellers: number; total: number }
export const useTrips = () => useStore<SavedTrip[]>("ghuri-trips", []);
