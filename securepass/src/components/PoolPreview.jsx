import React from 'react';
import { CHARACTER_SETS, filterCharacterSet } from '../utils/passwordGenerator.js';

/**
 * PoolPreview Component
 * Live animated strip showing every active character in the current pool with count badge.
 */
export function PoolPreview({ options, poolFilter, poolSize }) {
  // Build active characters list
  let characters = [];
  if (options.uppercase) {
    characters.push(...filterCharacterSet(CHARACTER_SETS.uppercase, poolFilter).split(''));
  }
  if (options.lowercase) {
    characters.push(...filterCharacterSet(CHARACTER_SETS.lowercase, poolFilter).split(''));
  }
  if (options.numbers) {
    characters.push(...filterCharacterSet(CHARACTER_SETS.numbers, poolFilter).split(''));
  }
  if (options.symbols) {
    characters.push(...filterCharacterSet(CHARACTER_SETS.symbols, poolFilter).split(''));
  }

  return (
    <div className="pool-preview-panel" aria-label="Active Character Pool Preview">
      <div className="pool-preview-header">
        <span className="pool-preview-title">Live Pool Stream</span>
        <span className="pool-count-badge">
          Pool size: <strong>{poolSize}</strong> characters
        </span>
      </div>

      <div className="pool-preview-scroller" tabIndex={0} aria-label="Character pool stream">
        {characters.length === 0 ? (
          <span className="pool-empty-text">No character sets enabled</span>
        ) : (
          characters.map((char, index) => (
            <span key={`${char}-${index}`} className="pool-char-chip">
              {char}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
