import React from 'react';
import { Check } from 'lucide-react';

const CATEGORY_ITEMS = [
  { id: 'uppercase', label: 'Uppercase', sample: 'A–Z', keyHint: '1' },
  { id: 'lowercase', label: 'Lowercase', sample: 'a–z', keyHint: '2' },
  { id: 'numbers', label: 'Numbers', sample: '0–9', keyHint: '3' },
  { id: 'symbols', label: 'Special Symbols', sample: '!@#$...', keyHint: '4' }
];

/**
 * CharacterOptions Component
 * Category checkboxes with keyboard shortcuts and ambiguous character exclusion toggle.
 */
export function CharacterOptions({
  options,
  onChange,
  excludeAmbiguous,
  onToggleAmbiguous
}) {
  const handleToggle = (id) => {
    onChange({
      ...options,
      [id]: !options[id]
    });
  };

  return (
    <div className="control-group categories-control-group">
      <div className="control-header-row">
        <span className="control-label">Character Pool</span>
        <span className="control-sublabel">Select character sets</span>
      </div>

      <div className="categories-pill-grid" role="group" aria-label="Character categories">
        {CATEGORY_ITEMS.map((cat) => {
          const checked = Boolean(options[cat.id]);
          return (
            <label
              key={cat.id}
              htmlFor={`cat-${cat.id}`}
              className={`category-pill-card ${checked ? 'pill-card-checked' : ''}`}
            >
              <input
                id={`cat-${cat.id}`}
                type="checkbox"
                checked={checked}
                onChange={() => handleToggle(cat.id)}
                className="visually-hidden"
              />
              <div className="custom-check-box" aria-hidden="true">
                {checked && <Check size={13} strokeWidth={3} />}
              </div>
              <div className="pill-card-text">
                <span className="pill-card-title">{cat.label}</span>
                <span className="pill-card-sample">{cat.sample}</span>
              </div>
              <kbd className="pill-key-badge" title={`Shortcut: ${cat.keyHint}`}>
                {cat.keyHint}
              </kbd>
            </label>
          );
        })}
      </div>

      {/* Ambiguous Character Filter Toggle */}
      <div className="ambiguous-filter-row">
        <label className="filter-toggle-label" htmlFor="toggle-ambiguous">
          <input
            id="toggle-ambiguous"
            type="checkbox"
            checked={excludeAmbiguous}
            onChange={(e) => onToggleAmbiguous(e.target.checked)}
            className="filter-toggle-checkbox"
          />
          <div className="toggle-switch-track" aria-hidden="true">
            <span className="toggle-switch-knob" />
          </div>
          <div className="filter-text-col">
            <span className="filter-title">Exclude ambiguous characters</span>
            <span className="filter-desc">
              Removes easily confused glyphs: <code>0/O</code>, <code>1/l/I</code>, <code>5/S</code>, <code>2/Z</code>
            </span>
          </div>
        </label>
      </div>
    </div>
  );
}
