import React, { createContext, useContext, useEffect, useState } from 'react';
import { DEMO_SCANS } from '../data/demoScans';

const BinWiseContext = createContext(null);

const STORAGE_KEYS = {
  SCANS: 'binwise_scans_v1',
  POINTS: 'binwise_points_v1',
  ACTIVITIES: 'binwise_activities_v1',
  VISITED_LIBRARY: 'binwise_visited_library_v1',
};

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function BinWiseProvider({ children }) {
  const [scans, setScans] = useState(() => loadFromStorage(STORAGE_KEYS.SCANS, DEMO_SCANS));
  const [ecoPoints, setEcoPoints] = useState(() => loadFromStorage(STORAGE_KEYS.POINTS, 30));
  const [activities, setActivities] = useState(() =>
    loadFromStorage(STORAGE_KEYS.ACTIVITIES, [
      {
        id: 'act-init',
        label: 'Joined BinWise & explored sample records',
        points: 30,
        timestamp: new Date().toISOString(),
      },
    ])
  );
  const [visitedLibrary, setVisitedLibrary] = useState(() =>
    loadFromStorage(STORAGE_KEYS.VISITED_LIBRARY, false)
  );
  const [latestResult, setLatestResult] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(scans));
  }, [scans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POINTS, JSON.stringify(ecoPoints));
  }, [ecoPoints]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VISITED_LIBRARY, JSON.stringify(visitedLibrary));
  }, [visitedLibrary]);

  const addActivity = (label, points) => {
    setEcoPoints((prev) => prev + points);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        label,
        points,
        timestamp: new Date().toISOString(),
      },
      ...prev.slice(0, 29),
    ]);
  };

  const saveScanToHistory = (scanResult) => {
    const entry = {
      ...scanResult,
      id: scanResult.id || `scan-${Date.now()}`,
      timestamp: scanResult.timestamp || new Date().toISOString(),
      isDemo: scanResult.mode === 'demo' || Boolean(scanResult.isDemo),
    };

    setScans((prev) => {
      if (prev.some((s) => s.id === entry.id)) return prev;
      return [entry, ...prev];
    });

    addActivity(`Scanned ${entry.item_name} (${entry.category.toUpperCase()})`, 15);
    return entry;
  };

  const deleteScan = (id) => {
    setScans((prev) => prev.filter((item) => item.id !== id));
  };

  const clearDemoScans = () => {
    setScans((prev) => prev.filter((item) => !item.isDemo));
  };

  const recordLibraryVisit = () => {
    if (!visitedLibrary) {
      setVisitedLibrary(true);
      addActivity('Explored Waste Knowledge Library', 10);
    }
  };

  const stats = {
    total: scans.length,
    wet: scans.filter((s) => s.category === 'wet').length,
    dry: scans.filter((s) => s.category === 'dry').length,
    hazardous: scans.filter((s) => s.category === 'hazardous').length,
    uncertain: scans.filter((s) => s.category === 'uncertain').length,
  };

  return (
    <BinWiseContext.Provider
      value={{
        scans,
        ecoPoints,
        activities,
        stats,
        latestResult,
        setLatestResult,
        saveScanToHistory,
        deleteScan,
        clearDemoScans,
        recordLibraryVisit,
      }}
    >
      {children}
    </BinWiseContext.Provider>
  );
}

export function useBinWise() {
  const ctx = useContext(BinWiseContext);
  if (!ctx) {
    throw new Error('useBinWise must be used within BinWiseProvider');
  }
  return ctx;
}
