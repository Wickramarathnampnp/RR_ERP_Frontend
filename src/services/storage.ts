import { seedData } from '../data/seed';
import type { AppDataState } from '../types/domain';

const STORAGE_KEY = 'rr-construction-erp-data-v1';

function isAppDataState(value: unknown): value is AppDataState {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<AppDataState>;
  return (
    Array.isArray(candidate.stocks) &&
    Array.isArray(candidate.suppliers) &&
    Array.isArray(candidate.purchaseOrders)
  );
}

export function loadAppData(): AppDataState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(seedData);

    const parsed: unknown = JSON.parse(raw);
    return isAppDataState(parsed) ? parsed : structuredClone(seedData);
  } catch {
    return structuredClone(seedData);
  }
}

export function persistAppData(state: AppDataState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be unavailable in private browsing or hardened browsers.
  }
}

export function getFreshSeedData(): AppDataState {
  return structuredClone(seedData);
}
