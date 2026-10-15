import React from 'react';
import { BookOpen } from 'lucide-react';

const SEPARATORS = [
  { id: '-', label: 'Hyphen (-)' },
  { id: '.', label: 'Dot (.)' },
  { id: '_', label: 'Underscore (_)' },
  { id: ' ', label: 'Space ( )' }
];

/**
 * PassphraseOptions Component (Zone 2 for Passphrase Mode)
 * Controls for word count, separator, capitalization, and numeric append.
 */
export function PassphraseOptions({
  wordCount,
  onWordCountChange,
  separator,
  onSeparatorChange,
  capitalize,
  onCapitalizeChange,
  addNumber,
  onAddNumberChange,
  passphrasePreview,
  entropyBits
}) {
  const minWords = 4;
  const maxWords = 8;
  const percentage = ((wordCount - minWords) / (maxWords - minWords)) * 100;

  return (
    <div className="passphrase-options-container">
      {/* Word Count Slider */}
      <div className="control-group">
        <div className="control-header-row">
          <label htmlFor="passphrase-word-count" className="control-label">
            Word Count
          </label>
          <div className="length-display-pill">
            <span className="length-number-control">{wordCount}</span>
            <span className="length-unit-tag">words</span>
          </div>
        </div>

        <div className="slider-track-container">
          <input
            id="passphrase-word-count"
            type="range"
            min={minWords}
            max={maxWords}
            value={wordCount}
            onChange={(e) => onWordCountChange(parseInt(e.target.value, 10))}
            className="color-reactive-slider"
            style={{
              background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${percentage}%, var(--color-track-bg) ${percentage}%, var(--color-track-bg) 100%)`
            }}
            aria-valuemin={minWords}
            aria-valuemax={maxWords}
            aria-valuenow={wordCount}
            aria-label="Adjust passphrase word count"
          />

          <div className="slider-tick-row" aria-hidden="true">
            {[4, 5, 6, 7, 8].map((w) => (
              <span
                key={w}
                className={`slider-tick-mark ${wordCount >= w ? 'tick-passed' : ''}`}
                style={{ left: `${((w - minWords) / (maxWords - minWords)) * 100}%` }}
                onClick={() => onWordCountChange(w)}
              >
                {w}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Separator Selection */}
      <div className="control-group">
        <span className="control-label">Word Separator</span>
        <div className="separator-btn-group" role="radiogroup" aria-label="Word separator">
          {SEPARATORS.map((sep) => (
            <button
              key={sep.id}
              type="button"
              role="radio"
              aria-checked={separator === sep.id}
              className={`separator-chip-btn ${separator === sep.id ? 'separator-chip-active' : ''}`}
              onClick={() => onSeparatorChange(sep.id)}
            >
              {sep.label}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles: Capitalize & Add Number */}
      <div className="passphrase-toggles-row">
        <label className="filter-toggle-label" htmlFor="toggle-capitalize">
          <input
            id="toggle-capitalize"
            type="checkbox"
            checked={capitalize}
            onChange={(e) => onCapitalizeChange(e.target.checked)}
            className="filter-toggle-checkbox"
          />
          <div className="toggle-switch-track" aria-hidden="true">
            <span className="toggle-switch-knob" />
          </div>
          <span className="filter-title">Capitalize words</span>
        </label>

        <label className="filter-toggle-label" htmlFor="toggle-add-number">
          <input
            id="toggle-add-number"
            type="checkbox"
            checked={addNumber}
            onChange={(e) => onAddNumberChange(e.target.checked)}
            className="filter-toggle-checkbox"
          />
          <div className="toggle-switch-track" aria-hidden="true">
            <span className="toggle-switch-knob" />
          </div>
          <span className="filter-title">Append 2-digit number (+6.6 bits)</span>
        </label>
      </div>

      {/* Wordlist badge & live preview strip */}
      <div className="passphrase-preview-strip">
        <div className="passphrase-wordlist-tag">
          <BookOpen size={14} aria-hidden="true" />
          <span>EFF Short Wordlist (7,776 words &bull; ~12.9 bits/word)</span>
        </div>
        <div className="passphrase-preview-text">
          <code>{passphrasePreview}</code>
          <span className="passphrase-preview-bits">({entropyBits} bits)</span>
        </div>
      </div>
    </div>
  );
}
