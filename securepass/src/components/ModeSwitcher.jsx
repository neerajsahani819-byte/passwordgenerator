import React from 'react';
import { KeyRound, BookOpen } from 'lucide-react';

/**
 * ModeSwitcher Component
 * Segmented control to toggle between Characters mode and Diceware Passphrase mode.
 */
export function ModeSwitcher({ mode, onSelectMode }) {
  return (
    <div className="mode-segmented-control" role="tablist" aria-label="Generator Mode Selection">
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'characters'}
        className={`mode-tab-btn ${mode === 'characters' ? 'mode-tab-active' : ''}`}
        onClick={() => onSelectMode('characters')}
      >
        <KeyRound size={16} aria-hidden="true" />
        <span>Characters</span>
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={mode === 'passphrase'}
        className={`mode-tab-btn ${mode === 'passphrase' ? 'mode-tab-active' : ''}`}
        onClick={() => onSelectMode('passphrase')}
      >
        <BookOpen size={16} aria-hidden="true" />
        <span>Passphrase (Diceware)</span>
      </button>
    </div>
  );
}
