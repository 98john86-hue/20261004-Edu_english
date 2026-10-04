export interface UserSettings {
  newWordsPerDay: number;
}

export const SETTINGS_STORAGE_KEY = 'edu-english:settings';
export const NEW_WORDS_PER_DAY_OPTIONS: readonly number[] = [5, 10, 15, 20, 30];
export const DEFAULT_SETTINGS: UserSettings = { newWordsPerDay: 10 };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function parseSettings(raw: string | null): UserSettings {
  if (!raw) return { ...DEFAULT_SETTINGS };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return { ...DEFAULT_SETTINGS };
    const { newWordsPerDay } = parsed;
    return {
      newWordsPerDay:
        typeof newWordsPerDay === 'number' &&
        Number.isInteger(newWordsPerDay) &&
        newWordsPerDay >= 0 &&
        newWordsPerDay <= 100
          ? newWordsPerDay
          : DEFAULT_SETTINGS.newWordsPerDay,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function getStorage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function loadSettings(): UserSettings {
  try {
    return parseSettings(getStorage()?.getItem(SETTINGS_STORAGE_KEY) ?? null);
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: UserSettings): boolean {
  try {
    const storage = getStorage();
    if (!storage) return false;
    storage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    return true;
  } catch {
    return false;
  }
}
