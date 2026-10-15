import React from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * ThemeToggle Component
 * Accessible toggle button to switch between Light and Dark themes.
 */
export function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={onToggle}
      className="theme-toggle-btn"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="theme-icon sun-icon" size={20} aria-hidden="true" />
      ) : (
        <Moon className="theme-icon moon-icon" size={20} aria-hidden="true" />
      )}
      <span className="theme-label">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
    </button>
  );
}
