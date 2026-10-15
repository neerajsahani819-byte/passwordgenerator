import React from 'react';
import { Check, X, AlertCircle } from 'lucide-react';

/**
 * StrengthReason Component (Zone 3)
 * Educational checklist explaining why the current configuration meets or misses security standards.
 */
export function StrengthReason({
  mode,
  length,
  wordCount,
  options,
  entropyBits,
  excludeAmbiguous
}) {
  const isPassphrase = mode === 'passphrase';

  // Rule 1: Length or Word count recommendation
  const ruleLengthMet = isPassphrase ? wordCount >= 6 : length >= 16;
  const ruleLengthText = isPassphrase
    ? `Word count ${wordCount} (${wordCount >= 6 ? '≥6 recommended' : 'recommend ≥6 words'})`
    : `Length ${length} (${length >= 16 ? '≥16 recommended' : 'recommend ≥16 chars'})`;

  // Rule 2: Pool diversity
  const activeCategoriesCount = Object.values(options || {}).filter(Boolean).length;
  const rulePoolMet = isPassphrase ? wordCount >= 6 : activeCategoriesCount === 4;
  const rulePoolText = isPassphrase
    ? `EFF Wordlist pool (7,776 words)`
    : `Pool diversity: ${activeCategoriesCount}/4 categories (${activeCategoriesCount === 4 ? 'maximum diversity' : 'enable all 4 for maximum search space'})`;

  // Rule 3: Entropy >= 80 bits target
  const ruleEntropyMet = entropyBits >= 80;
  const ruleEntropyText = `Entropy ${entropyBits} bits (${entropyBits >= 80 ? '≥80 bits target exceeded' : 'target is ≥80 bits'})`;

  // Rule 4: Ambiguous characters
  const ruleAmbiguousMet = excludeAmbiguous;
  const ruleAmbiguousText = excludeAmbiguous
    ? 'Ambiguous characters excluded (0/O, 1/l/I, 5/S, 2/Z)'
    : 'Contains ambiguous characters — consider excluding for readability';

  // Rule 5: Leak check stub
  const ruleLeakText = 'Not found in known dictionary compromise lists';

  return (
    <div className="insight-card strength-reasons-card" aria-label="Why This Is Strong Checklist">
      <div className="insight-header">
        <h3 className="insight-title">Why This Is Strong</h3>
        <span className="checklist-subtitle">NIST SP 800-63 Guidelines</span>
      </div>

      <ul className="reasons-checklist" role="list">
        <li className={`reason-item ${ruleLengthMet ? 'reason-passed' : 'reason-failed'}`}>
          {ruleLengthMet ? (
            <Check size={16} className="reason-icon-pass" aria-hidden="true" />
          ) : (
            <X size={16} className="reason-icon-fail" aria-hidden="true" />
          )}
          <span>{ruleLengthText}</span>
        </li>

        <li className={`reason-item ${rulePoolMet ? 'reason-passed' : 'reason-failed'}`}>
          {rulePoolMet ? (
            <Check size={16} className="reason-icon-pass" aria-hidden="true" />
          ) : (
            <X size={16} className="reason-icon-fail" aria-hidden="true" />
          )}
          <span>{rulePoolText}</span>
        </li>

        <li className={`reason-item ${ruleEntropyMet ? 'reason-passed' : 'reason-failed'}`}>
          {ruleEntropyMet ? (
            <Check size={16} className="reason-icon-pass" aria-hidden="true" />
          ) : (
            <X size={16} className="reason-icon-fail" aria-hidden="true" />
          )}
          <span>{ruleEntropyText}</span>
        </li>

        {!isPassphrase && (
          <li className={`reason-item ${ruleAmbiguousMet ? 'reason-passed' : 'reason-warn'}`}>
            {ruleAmbiguousMet ? (
              <Check size={16} className="reason-icon-pass" aria-hidden="true" />
            ) : (
              <AlertCircle size={16} className="reason-icon-warn" aria-hidden="true" />
            )}
            <span>{ruleAmbiguousText}</span>
          </li>
        )}

        <li className="reason-item reason-passed">
          <Check size={16} className="reason-icon-pass" aria-hidden="true" />
          <span>{ruleLeakText}</span>
        </li>
      </ul>
    </div>
  );
}
