/**
 * ==============================================================================
 * SecurePass — Password & Passphrase Strength & Entropy Analyzer
 * Evaluates search-space size, Shannon entropy, and brute-force resistance.
 * ==============================================================================
 */

import { CHARACTER_SETS, filterCharacterSet } from './passwordGenerator.js';
import { formatCrackTimeHuman, formatScientific } from './format.js';

export { formatCrackTimeHuman as estimateCrackTime };

/**
 * Calculates the total character pool size based on active categories and optional filter.
 * @param {object} options - Active character categories.
 * @param {Function|null} poolFilter - Character filter predicate.
 * @returns {number} Combined character set length.
 */
export function calculatePoolSize(options = {}, poolFilter = null) {
  let poolSize = 0;
  if (options.uppercase) {
    poolSize += filterCharacterSet(CHARACTER_SETS.uppercase, poolFilter).length;
  }
  if (options.lowercase) {
    poolSize += filterCharacterSet(CHARACTER_SETS.lowercase, poolFilter).length;
  }
  if (options.numbers) {
    poolSize += filterCharacterSet(CHARACTER_SETS.numbers, poolFilter).length;
  }
  if (options.symbols) {
    poolSize += filterCharacterSet(CHARACTER_SETS.symbols, poolFilter).length;
  }
  return poolSize;
}

/**
 * Calculates theoretical Shannon entropy of a password in bits.
 *
 * Formula: E = L * log2(N)
 * Where:
 *   L = Password Length
 *   N = Character Pool Size
 *
 * @param {number} length - Password length.
 * @param {number} poolSize - Total available character pool size.
 * @returns {number} Entropy in bits.
 */
export function calculateEntropy(length, poolSize) {
  if (length <= 0 || poolSize <= 0) return 0;
  const bitsPerChar = Math.log2(poolSize);
  const totalEntropy = length * bitsPerChar;
  return Math.round(totalEntropy * 10) / 10;
}

/**
 * Calculates the theoretical entropy of an EFF Diceware passphrase.
 *
 * Formula: E = wordCount * log2(7776) + (addNumber ? 6.6 : 0)
 * Where:
 *   log2(7776) ≈ 12.925 bits per word
 *   A 2-digit random number (00-99) adds log2(100) ≈ 6.644 bits
 *
 * @param {number} wordCount - Number of words.
 * @param {object} options - Passphrase options.
 * @returns {number} Entropy in bits.
 */
export function calcPassphraseEntropy(wordCount, options = {}) {
  if (wordCount <= 0) return 0;
  const BITS_PER_WORD = Math.log2(7776); // ~12.9248
  let totalBits = wordCount * BITS_PER_WORD;

  if (options.addNumber) {
    totalBits += Math.log2(100); // +6.64 bits
  }

  return Math.round(totalBits * 10) / 10;
}

/**
 * Evaluates password strength based on entropy, length, and category coverage.
 *
 * Strength Bands (NIST Guidelines):
 * - Score 1 (Weak): < 40 bits
 * - Score 2 (Fair): 40 - 59 bits
 * - Score 3 (Strong): 60 - 79 bits
 * - Score 4 (Very Strong): >= 80 bits
 *
 * @param {string} password - The generated password string.
 * @param {number} length - Password length.
 * @param {object} options - Active category options.
 * @param {Function|null} poolFilter - Character filter predicate.
 * @returns {object} Detailed strength report.
 */
export function evaluatePasswordStrength(password, length, options, poolFilter = null) {
  const poolSize = calculatePoolSize(options, poolFilter);

  if (!password || poolSize === 0 || length <= 0) {
    return {
      score: 0,
      label: 'None',
      color: 'var(--color-text-muted)',
      entropyBits: 0,
      poolSize: 0,
      searchSpaceFormatted: '0',
      crackTimeEstimate: 'Instant',
      disclaimer: 'Select at least one character category.'
    };
  }

  const entropyBits = calculateEntropy(length, poolSize);
  const crackTimeEstimate = formatCrackTimeHuman(entropyBits);
  const searchSpace = Math.pow(poolSize, length);
  const searchSpaceFormatted = formatScientific(searchSpace);

  let score = 1;
  let label = 'Weak';
  let color = 'var(--color-danger)';

  if (entropyBits >= 80) {
    score = 4;
    label = 'Very Strong';
    color = 'var(--color-success)';
  } else if (entropyBits >= 60) {
    score = 3;
    label = 'Strong';
    color = 'var(--color-primary)';
  } else if (entropyBits >= 40) {
    score = 2;
    label = 'Fair';
    color = 'var(--color-warning)';
  } else {
    score = 1;
    label = 'Weak';
    color = 'var(--color-danger)';
  }

  return {
    score,
    label,
    color,
    entropyBits,
    poolSize,
    searchSpaceFormatted,
    crackTimeEstimate,
    disclaimer:
      'Strength is an entropy estimate based on character space and length. It does not protect against malware or reused passwords.'
  };
}

/**
 * Evaluates strength for a passphrase.
 * @param {string} passphrase - Generated passphrase string.
 * @param {number} wordCount - Word count.
 * @param {object} options - Passphrase options.
 * @returns {object}
 */
export function evaluatePassphraseStrength(passphrase, wordCount, options = {}) {
  if (!passphrase || wordCount <= 0) {
    return {
      score: 0,
      label: 'None',
      color: 'var(--color-text-muted)',
      entropyBits: 0,
      poolSize: 7776,
      searchSpaceFormatted: '0',
      crackTimeEstimate: 'Instant',
      disclaimer: 'Select at least 4 words.'
    };
  }

  const entropyBits = calcPassphraseEntropy(wordCount, options);
  const crackTimeEstimate = formatCrackTimeHuman(entropyBits);
  const searchSpace = Math.pow(7776, wordCount) * (options.addNumber ? 100 : 1);
  const searchSpaceFormatted = formatScientific(searchSpace);

  let score = 1;
  let label = 'Weak';
  let color = 'var(--color-danger)';

  if (entropyBits >= 80) {
    score = 4;
    label = 'Very Strong';
    color = 'var(--color-success)';
  } else if (entropyBits >= 60) {
    score = 3;
    label = 'Strong';
    color = 'var(--color-primary)';
  } else if (entropyBits >= 40) {
    score = 2;
    label = 'Fair';
    color = 'var(--color-warning)';
  } else {
    score = 1;
    label = 'Weak';
    color = 'var(--color-danger)';
  }

  return {
    score,
    label,
    color,
    entropyBits,
    poolSize: 7776,
    searchSpaceFormatted,
    crackTimeEstimate,
    disclaimer:
      'Passphrase strength is based on the 7,776-word EFF wordlist search space.'
  };
}
