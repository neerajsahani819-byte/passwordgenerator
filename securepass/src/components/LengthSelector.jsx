import React, { useState } from 'react';

const PRESETS = [8, 12, 16, 24, 32, 64];

/**
 * Returns a reactive CSS color token based on entropy bits.
 * @param {number} entropy
 * @returns {string}
 */
function getReactiveColor(entropy) {
  if (entropy >= 80) return 'var(--color-emerald)';
  if (entropy >= 60) return 'var(--color-blue)';
  if (entropy >= 40) return 'var(--color-amber)';
  return 'var(--color-rose)';
}

/**
 * LengthSelector Component
 * Color-reactive slider with continuous entropy track, tick marks, drag tooltip, and presets.
 */
export function LengthSelector({
  length,
  onChange,
  entropyBits = 0,
  strengthLabel = '',
  min = 4,
  max = 128
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) onChange(val);
  };

  const handleNumberChange = (e) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val)) val = min;
    val = Math.max(min, Math.min(max, val));
    onChange(val);
  };

  const percentage = ((length - min) / (max - min)) * 100;
  const reactiveColor = getReactiveColor(entropyBits);

  return (
    <div className="control-group length-control-group">
      <div className="control-header-row">
        <label htmlFor="length-slider-input" className="control-label">
          Password Length
        </label>
        <div className="length-display-pill">
          <input
            id="length-number-box"
            type="number"
            min={min}
            max={max}
            value={length}
            onChange={handleNumberChange}
            className="length-number-control"
            aria-label="Password length character count"
            autoComplete="off"
            spellCheck="false"
          />
          <span className="length-unit-tag">chars</span>
        </div>
      </div>

      <div className="slider-track-container">
        {/* Dynamic Drag Tooltip */}
        <div
          className={`slider-live-tooltip ${isDragging ? 'tooltip-visible' : ''}`}
          style={{ left: `calc(${percentage}% + (${8 - percentage * 0.16}px))` }}
          aria-hidden="true"
        >
          {length} chars &rarr; {entropyBits} bits ({strengthLabel})
        </div>

        <input
          id="length-slider-input"
          type="range"
          min={min}
          max={max}
          value={length}
          onChange={handleSliderChange}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="color-reactive-slider"
          style={{
            background: `linear-gradient(to right, ${reactiveColor} 0%, ${reactiveColor} ${percentage}%, var(--color-track-bg) ${percentage}%, var(--color-track-bg) 100%)`
          }}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={length}
          aria-label="Adjust password length"
        />

        {/* Ticks & Labels */}
        <div className="slider-tick-row" aria-hidden="true">
          {PRESETS.map((tick) => {
            const tickPercent = ((tick - min) / (max - min)) * 100;
            return (
              <span
                key={tick}
                className={`slider-tick-mark ${length >= tick ? 'tick-passed' : ''}`}
                style={{ left: `${tickPercent}%` }}
                onClick={() => onChange(tick)}
              >
                {tick}
              </span>
            );
          })}
        </div>
      </div>

      <div className="presets-control-row">
        <span className="presets-label">Quick Presets:</span>
        <div className="preset-pill-group">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              className={`preset-pill-btn ${length === p ? 'preset-pill-active' : ''}`}
              onClick={() => onChange(p)}
              aria-label={`Set length to ${p} characters`}
            >
              {p}
            </button>
          ))}
        </div>
        <span className="entropy-summary-tag" style={{ color: reactiveColor }}>
          {entropyBits} bits &bull; {strengthLabel}
        </span>
      </div>
    </div>
  );
}
