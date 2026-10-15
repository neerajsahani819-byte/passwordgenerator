import React from 'react';

/**
 * EntropyGauge Component (Zone 3)
 * SVG Arc gauge (0-128 bits) with smooth CSS transition, NIST color bands, and tooltip.
 */
export function EntropyGauge({ entropyBits = 0, label = 'Weak', length = 16, poolSize = 87 }) {
  const maxBits = 128;
  const clampedBits = Math.max(0, Math.min(maxBits, entropyBits));
  const ratio = clampedBits / maxBits;

  // Gauge geometry: 220-degree arc
  // Radius = 64, Arc length ~ 245
  const arcLength = 245;
  const strokeDashoffset = arcLength * (1 - ratio);

  // Dynamic Color
  const getGaugeColor = () => {
    if (clampedBits >= 80) return 'var(--color-emerald)';
    if (clampedBits >= 60) return 'var(--color-blue)';
    if (clampedBits >= 40) return 'var(--color-amber)';
    return 'var(--color-rose)';
  };

  const gaugeColor = getGaugeColor();

  return (
    <div
      className="entropy-gauge-card"
      title={`L=${length}, N=${poolSize}, E=${entropyBits} bits (${label})`}
      aria-label={`Entropy gauge: ${entropyBits} bits out of 128, rated ${label}`}
    >
      <div className="gauge-svg-wrapper">
        <svg
          viewBox="0 0 160 110"
          className="gauge-svg"
          role="img"
          aria-label={`Entropy Gauge: ${entropyBits} bits`}
        >
          {/* Background Track Arc */}
          <path
            d="M 20 95 A 64 64 0 1 1 140 95"
            fill="none"
            stroke="var(--color-gauge-bg)"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Active Colored Progress Arc */}
          <path
            d="M 20 95 A 64 64 0 1 1 140 95"
            fill="none"
            stroke={gaugeColor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            className="gauge-progress-arc"
          />
        </svg>

        {/* Center Readout */}
        <div className="gauge-center-readout">
          <span className="gauge-bits-val" style={{ color: gaugeColor }}>
            {entropyBits}
          </span>
          <span className="gauge-unit">bits</span>
          <span className="gauge-label-tag" style={{ color: gaugeColor }}>
            {label}
          </span>
        </div>
      </div>

      <div className="gauge-scale-legend">
        <span>0</span>
        <span>40</span>
        <span>60</span>
        <span>80</span>
        <span>128+</span>
      </div>
    </div>
  );
}
