import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check, RefreshCw } from 'lucide-react';
import { ExplainModeToggle } from './ExplainModeToggle';

/**
 * Determines character category classification for educational Explain Mode.
 * @param {string} ch
 * @returns {string}
 */
function getCharClass(ch) {
  if (/[A-Z]/.test(ch)) return 'char-cat-upper';
  if (/[a-z]/.test(ch)) return 'char-cat-lower';
  if (/[0-9]/.test(ch)) return 'char-cat-number';
  if (/[^A-Za-z0-9]/.test(ch)) return 'char-cat-symbol';
  return '';
}

/**
 * PasswordDisplay Component (Zone 1 Hero Card)
 * High-security output card with live metrics strip, explain mode, copy confetti, and regeneration.
 */
export function PasswordDisplay({
  password,
  isVisible,
  onToggleVisibility,
  onCopy,
  isCopied,
  countdown,
  onRegenerate,
  strengthData,
  mode,
  explainMode,
  onToggleExplainMode,
  disabled
}) {
  const [shuffling, setShuffling] = useState(false);

  const handleRegenerateClick = () => {
    setShuffling(true);
    if (onRegenerate) onRegenerate();
    setTimeout(() => setShuffling(false), 250);
  };

  const { entropyBits = 0, label = 'None', poolSize = 0, crackTimeEstimate = 'Instant' } =
    strengthData || {};

  // Render password characters with optional Explain Mode classification
  const renderPasswordContent = () => {
    if (!password) {
      return (
        <span className="password-empty-prompt">
          {mode === 'passphrase' ? 'Configuring passphrase...' : 'Select at least one character category'}
        </span>
      );
    }

    if (!isVisible) {
      return <span className="password-masked">{'•'.repeat(Math.min(password.length, 36))}</span>;
    }

    if (explainMode && mode === 'characters') {
      return (
        <span className="password-explained-tokens">
          {password.split('').map((char, index) => {
            const catClass = getCharClass(char);
            // In SecurePass, the first occurrence of each category was guaranteed
            const isFirstOfCat = password.indexOf(char) === index;
            return (
              <span
                key={index}
                className={`explained-char ${catClass} ${isFirstOfCat ? 'explained-guaranteed-ring' : ''}`}
                title={`Category: ${catClass.replace('char-cat-', '')}${isFirstOfCat ? ' (Guaranteed inclusion)' : ''}`}
              >
                {char}
              </span>
            );
          })}
        </span>
      );
    }

    return <span className="password-plaintext">{password}</span>;
  };

  return (
    <section className="hero-command-card" aria-label="Generated Credential Output">
      <div className="hero-output-row">
        <div
          className={`hero-password-display ${shuffling ? 'hero-password-shuffling' : ''}`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {renderPasswordContent()}
        </div>

        <div className="hero-actions-toolbar">
          {mode === 'characters' && password && (
            <ExplainModeToggle isEnabled={explainMode} onToggle={onToggleExplainMode} />
          )}

          <button
            type="button"
            className="action-icon-btn"
            onClick={onToggleVisibility}
            aria-label={isVisible ? 'Hide credential characters' : 'Reveal credential characters'}
            title={isVisible ? 'Hide (R)' : 'Reveal (R)'}
            disabled={!password || disabled}
          >
            {isVisible ? <EyeOff size={19} /> : <Eye size={19} />}
          </button>

          <button
            type="button"
            className={`action-icon-btn action-copy-btn ${isCopied ? 'btn-copied-pulse' : ''}`}
            onClick={onCopy}
            aria-label={isCopied ? 'Copied to clipboard' : 'Copy credential to clipboard'}
            title="Copy (C)"
            disabled={!password || disabled}
          >
            {isCopied ? <Check size={19} className="check-icon-morphed" /> : <Copy size={19} />}
            {isCopied && <span className="confetti-burst" aria-hidden="true" />}
          </button>

          <button
            type="button"
            className={`action-icon-btn action-regen-btn ${shuffling ? 'regen-spinning' : ''}`}
            onClick={handleRegenerateClick}
            aria-label="Regenerate password with current settings"
            title="Regenerate (Space)"
            disabled={disabled}
          >
            <RefreshCw size={19} />
          </button>
        </div>
      </div>

      {/* Under-Password Single-Line Live Metrics Strip */}
      <div className="hero-metrics-strip" aria-label="Live security metrics">
        <div className="strip-primary-metric">
          <span className="strip-bits-number">{entropyBits} bits</span>
          <span className="strip-separator">&bull;</span>
          <span className="strip-strength-rating">{label}</span>
        </div>

        <div className="strip-secondary-details">
          <span className="strip-detail-item">
            {password ? password.length : 0} {mode === 'passphrase' ? 'words' : 'chars'}
          </span>
          <span className="strip-separator">&bull;</span>
          <span className="strip-detail-item">pool {poolSize}</span>
          <span className="strip-separator">&bull;</span>
          <span className="strip-detail-item" title="Time to crack at 100 billion guesses/second">
            crack time {crackTimeEstimate}
          </span>
        </div>

        {countdown > 0 && (
          <div className="strip-countdown-badge" title="Clipboard auto-clear countdown">
            <span className="countdown-ring-dot" />
            <span>Clears in {countdown}s</span>
          </div>
        )}
      </div>
    </section>
  );
}
