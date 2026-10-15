import React from 'react';
import { HelpCircle } from 'lucide-react';

/**
 * ExplainModeToggle Component
 * Toggles educational color-coding and guaranteed-inclusion character highlighting.
 */
export function ExplainModeToggle({ isEnabled, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`explain-mode-toggle ${isEnabled ? 'explain-mode-active' : ''}`}
      aria-pressed={isEnabled}
      title="Toggle educational color-coding of characters"
    >
      <HelpCircle size={15} aria-hidden="true" />
      <span>{isEnabled ? 'Explanation On' : 'Explain'}</span>
    </button>
  );
}
