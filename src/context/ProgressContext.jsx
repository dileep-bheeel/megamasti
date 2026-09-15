import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "megamasti_progress_v2";
const defaults = {
  recent: [], favorites: [], bestScores: {}, completed: {}, totalXp: 0, achievements: [],
  daily: null,
  preferences: { largeText: false, highContrast: false, reducedMotion: false, sound: true }
};
const ProgressContext = createContext(null);
const achievementNames = new Set(["First Move","Curious Mind","World Hopper","Four Figures"]);

function numericRecord(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([key,number]) => key && Number.isFinite(Number(number)) && Number(number) >= 0).map(([key,number]) => [key,Math.round(Number(number))]));
}

function restore() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || localStorage.getItem("megamasti_progress_v1"));
    if (!parsed || typeof parsed !== "object") return defaults;
    return {
      recent: Array.isArray(parsed.recent) ? parsed.recent.slice(0,6) : [],
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
      bestScores: numericRecord(parsed.bestScores),
      completed: numericRecord(parsed.completed),
      totalXp: Number.isFinite(Number(parsed.totalXp)) ? Math.max(0,Math.round(Number(parsed.totalXp))) : 0,
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements.filter(item => achievementNames.has(item)) : [],
      daily: parsed.daily && typeof parsed.daily === "object" && typeof parsed.daily.date === "string" && typeof parsed.daily.gameId === "string" ? {...parsed.daily,score:Math.max(0,Math.round(Number(parsed.daily.score)||0)),completed:Boolean(parsed.daily.completed)} : null,
      preferences: Object.fromEntries(Object.keys(defaults.preferences).map(key => [key,typeof parsed.preferences?.[key] === "boolean" ? parsed.preferences[key] : defaults.preferences[key]]))
    };
  } catch {
    return defaults;
  }
}

function earnedAchievements(state) {
  const completedGames = Object.keys(state.completed).length;
  const totalSessions = Object.values(state.completed).reduce((sum,value) => sum + Number(value || 0),0);
  return [
    totalSessions >= 1 && "First Move",
    completedGames >= 5 && "Curious Mind",
    completedGames >= 10 && "World Hopper",
    state.totalXp >= 1000 && "Four Figures"
  ].filter(Boolean);
}

export function ProgressProvider({ children }) {
  const [progress,setProgress] = useState(restore);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY,JSON.stringify(progress)); } catch { /* Gameplay remains available when storage is blocked. */ }
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
        return {...current,bestScores:{...current.bestScores,[id]:Math.round(score)}};
      });
    },
    markCompleted(id,score = 0) {
      setProgress(current => {
        const next = {
          ...current,
          completed:{...current.completed,[id]:(current.completed[id] || 0) + 1},
          totalXp:current.totalXp + Math.max(0,Math.round(Number(score) || 0))
        };
        return {...next,achievements:[...new Set([...current.achievements,...earnedAchievements(next)])]};
      });
    },
    markDailyCompleted(date,id,score) {
      setProgress(current => {
        if (current.daily?.date === date && current.daily?.gameId === id && current.daily?.completed) {
          if (score <= Number(current.daily.score || 0)) return current;
        }
        return {...current,daily:{date,gameId:id,score:Math.round(score),completed:true}};
      });
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
