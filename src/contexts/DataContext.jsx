import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ensureSeeded } from '../storage/seed.js';
import { LS_KEYS } from '../storage/keys.js';
import { readJSON, writeJSON } from '../storage/json.js';

const DataContext = createContext(undefined);

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function pushActivity(evt) {
  const current = readJSON(LS_KEYS.activity, []);
  const next = {
    id: `evt_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    at: new Date().toISOString(),
    ...evt,
  };
  writeJSON(LS_KEYS.activity, [next, ...current].slice(0, 250));
}

function loadFunds() {
  ensureSeeded();
  return readJSON(LS_KEYS.funds, []);
}

function saveFunds(next) {
  writeJSON(LS_KEYS.funds, next);
}

function navDeltaPct(risk) {
  const base =
    risk === 'Low'
      ? 0.06
      : risk === 'Medium'
        ? 0.14
        : 0.26; // percent
  const drift = 0.02;
  const direction = Math.random() < 0.52 ? 1 : -1;
  const jitter = Math.random() * base;
  return direction * jitter + drift;
}

export function DataProvider({ children }) {
  const [funds, setFunds] = useState(() => loadFunds());

  useEffect(() => {
    ensureSeeded();
    setFunds(loadFunds());
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setFunds((prev) => {
        if (prev.length === 0) return prev;
        const next = prev.map((f) => {
          const pct = navDeltaPct(f.risk);
          const nextNav = round2(Math.max(1, f.nav * (1 + pct / 100)));
          const next1y = clamp(round2(f.returns['1Y'] + pct * 0.14), -40, 45);
          const next3y = clamp(round2(f.returns['3Y'] + pct * 0.06), -20, 30);
          const next5y = clamp(round2(f.returns['5Y'] + pct * 0.04), -10, 25);
          return {
            ...f,
            nav: nextNav,
            returns: {
              '1Y': next1y,
              '3Y': next3y,
              '5Y': next5y,
            },
          };
        });
        saveFunds(next);
        return next;
      });
    }, 2800);
    return () => window.clearInterval(id);
  }, []); // Empty dependency – runs once on mount

  const api = useMemo(() => {
    return {
      funds,
      addFund: (fund) => {
        const next = { ...fund, id: `f_${Date.now()}` };
        setFunds((prev) => {
          const merged = [next, ...prev];
          saveFunds(merged);
          return merged;
        });
      },
      updateFund: (id, updates) => {
        setFunds((prev) => {
          const next = prev.map((f) => (f.id === id ? { ...f, ...updates } : f));
          saveFunds(next);
          return next;
        });
      },
      deleteFund: (id) => {
        setFunds((prev) => {
          const next = prev.filter((f) => f.id !== id);
          saveFunds(next);
          return next;
        });
      },
      getHoldings: (userId) => {
        const all = readJSON(LS_KEYS.holdings, []);
        return all.filter((h) => h.userId === userId);
      },
      buyFund: ({ userId, fundId, amount }) => {
        const amt = Number.isFinite(amount) ? amount : NaN;
        if (!amt || amt <= 0) return { ok: false, error: 'Enter a valid amount.' };
        const fund = funds.find((f) => f.id === fundId);
        if (!fund) return { ok: false, error: 'Fund not found.' };
        if (amt < fund.minInvestment) return { ok: false, error: `Minimum investment is ₹${fund.minInvestment}.` };

        const units = amt / fund.nav;
        const now = new Date().toISOString();
        const all = readJSON(LS_KEYS.holdings, []);
        const idx = all.findIndex((h) => h.userId === userId && h.fundId === fundId);

        let nextAll;
        if (idx >= 0) {
          const existing = all[idx];
          const totalUnits = existing.units + units;
          const nextAvg = (existing.avgNav * existing.units + fund.nav * units) / totalUnits;
          const updated = {
            ...existing,
            units: round2(totalUnits),
            avgNav: round2(nextAvg),
            updatedAt: now,
          };
          nextAll = [...all.slice(0, idx), updated, ...all.slice(idx + 1)];
        } else {
          const created = {
            userId,
            fundId,
            units: round2(units),
            avgNav: round2(fund.nav),
            createdAt: now,
            updatedAt: now,
          };
          nextAll = [created, ...all];
        }

        writeJSON(LS_KEYS.holdings, nextAll);
        pushActivity({ type: 'fund.buy', userId, meta: { fundId, amount: round2(amt) } });
        return { ok: true, units: round2(units) };
      },
    };
  }, [funds]);

  // ✅ Correct return – provides context to children
  return (
    <DataContext.Provider value={api}>
      {children}
    </DataContext.Provider>
  );
}