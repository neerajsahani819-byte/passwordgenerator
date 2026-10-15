import React from 'react';
import { Calculator } from 'lucide-react';

/**
 * EntropyBreakdown Component (Zone 3)
 * Live mathematical formula panel with live substituted variables and search space metrics.
 */
export function EntropyBreakdown({
  mode,
  length,
  poolSize,
  entropyBits,
  wordCount,
  options,
  strengthData
}) {
  const isPassphrase = mode === 'passphrase';
  const { searchSpaceFormatted = '0', crackTimeEstimate = 'Instant' } = strengthData || {};

  // For characters: L * log2(N)
  // For passphrase: wordCount * log2(7776) + (addNumber ? 6.6 : 0)
  const bitsPerChar = poolSize > 0 ? (Math.log2(poolSize)).toFixed(2) : '0';

  return (
    <div className="insight-card entropy-breakdown-card" aria-label="Shannon Entropy Breakdown">
      <div className="insight-header">
        <Calculator size={17} className="insight-icon" aria-hidden="true" />
        <h3 className="insight-title">Entropy Formula Breakdown</h3>
        <span className="formula-tag">Shannon Information Theory</span>
      </div>

      <div className="formula-display-box">
        {isPassphrase ? (
          <>
            <div className="formula-line formula-general">
              <code>E = Words &times; log&#8322;(7,776){options?.addNumber ? ' + log&#8322;(100)' : ''}</code>
            </div>
            <div className="formula-line formula-substituted">
              <code>
                E = {wordCount} &times; 12.92{options?.addNumber ? ' + 6.64' : ''} = <strong>{entropyBits} bits</strong>
              </code>
            </div>
          </>
        ) : (
          <>
            <div className="formula-line formula-general">
              <code>E = L &times; log&#8322;(N)</code>
            </div>
            <div className="formula-line formula-substituted">
              <code>
                E = {length} &times; log&#8322;({poolSize}) = {length} &times; {bitsPerChar} = <strong>{entropyBits} bits</strong>
              </code>
            </div>
          </>
        )}
      </div>

      <div className="metrics-grid">
        <div className="metric-cell">
          <span className="metric-label">Search Space:</span>
          <span className="metric-val">{searchSpaceFormatted}</span>
        </div>
        <div className="metric-cell">
          <span className="metric-label">Brute-Force Resistance:</span>
          <span className="metric-val" title="Assumes 100 billion guesses/sec">
            {crackTimeEstimate}
          </span>
        </div>
      </div>
    </div>
  );
}
