import { useState, useEffect } from 'react';

const ALLOWED_STORAGE_KEYS = new Set([
  'securepass-theme-preference',
  'securepass-onboarded',
  'securepass-last-settings'
]);

/**
 * Strict LocalStorage preference hook.
 * Under security compliance, ONLY allowed non-sensitive configuration keys may be stored.
 * Passwords and history are strictly forbidden from localStorage.
 *
 * @param {string} key - Preference key
 * @param {any} initialValue - Fallback value
 * @returns {[any, Function]}
 */
export function useLocalStoragePreference(key, initialValue) {
  if (!ALLOWED_STORAGE_KEYS.has(key)) {
    throw new Error(`Security Violation: "${key}" is not permitted in localStorage.`);
  }

  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch {
      // Ignore private browsing storage restrictions
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
