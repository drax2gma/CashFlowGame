import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface UserSettings {
  tooltipsEnabled: boolean;
  tooltipDelay: number; // milliseconds
}

const STORAGE_KEY = 'cashflow-settings';

const defaultSettings: UserSettings = {
  tooltipsEnabled: true,
  tooltipDelay: 500
};

function loadSettings(): UserSettings {
  if (!browser) return defaultSettings;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultSettings, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return defaultSettings;
}

function createSettingsStore() {
  const { subscribe, set, update } = writable<UserSettings>(loadSettings());

  return {
    subscribe,
    set: (value: UserSettings) => {
      if (browser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      }
      set(value);
    },
    update: (updater: (value: UserSettings) => UserSettings) => {
      update(current => {
        const newValue = updater(current);
        if (browser) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newValue));
        }
        return newValue;
      });
    },
    reset: () => {
      if (browser) {
        localStorage.removeItem(STORAGE_KEY);
      }
      set(defaultSettings);
    }
  };
}

export const settingsStore = createSettingsStore();

// Convenience functions
export function setTooltipsEnabled(enabled: boolean) {
  settingsStore.update(s => ({ ...s, tooltipsEnabled: enabled }));
}

export function setTooltipDelay(delay: number) {
  settingsStore.update(s => ({ ...s, tooltipDelay: delay }));
}