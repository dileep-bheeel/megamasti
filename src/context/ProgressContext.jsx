import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "megamasti_progress_v1";
const defaults = { recent: [], favorites: [], bestScores: {}, completed: {}, preferences: { largeText: false, highContrast: false, reducedMotion: false, sound: true } };
const ProgressContext = createContext(null);

function restore() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!parsed || typeof parsed !== "object") return defaults;
    return {
      recent: Array.isArray(parsed.recent) ? parsed.recent.slice(0,6) : [],
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
      bestScores: parsed.bestScores && typeof parsed.bestScores === "object" ? parsed.bestScores : {},
      completed: parsed.completed && typeof parsed.completed === "object" ? parsed.completed : {},
      preferences: {...defaults.preferences,...(parsed.preferences || {})}
    };
  } catch {
    return defaults;
  }
}

export function ProgressProvider({ children }) {
  const [progress,setProgress] = useState(restore);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY,JSON.stringify(progress)); } catch { /* Private browsing may block storage. Gameplay remains available. */ }
  },[progress]);

  const actions = useMemo(() => ({
    markPlayed(id) {
      setProgress(current => ({...current,recent:[id,...current.recent.filter(item => item !== id)].slice(0,6)}));
    },
    recordScore(id,score) {
      if (!Number.isFinite(score) || score <= 0) return;
      setProgress(current => {
        const previous = Number(current.bestScores[id] || 0);
        if (score <= previous) return current;
        return {...current,bestScores:{...current.bestScores,[id]:score}};
      });
    },
    markCompleted(id) {
      setProgress(current => ({...current,completed:{...current.completed,[id]:(current.completed[id] || 0) + 1}}));
    },
    toggleFavorite(id) {
      setProgress(current => ({...current,favorites:current.favorites.includes(id) ? current.favorites.filter(item => item !== id) : [...current.favorites,id]}));
    },
    setPreference(name,value) {
      setProgress(current => ({...current,preferences:{...current.preferences,[name]:value}}));
    }
  }),[]);

  return <ProgressContext.Provider value={{progress,...actions}}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error("useProgress must be used inside ProgressProvider");
  return value;
}
