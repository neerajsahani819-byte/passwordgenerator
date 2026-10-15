/**
 * ==============================================================================
 * SecurePass — Cryptographic Password & Passphrase Generation Engine
 * Powered by Web Crypto API (crypto.getRandomValues)
 * Unbiased Rejection Sampling • Fisher-Yates Shuffle • Zero Insecure PRNG
 * ==============================================================================
 */

import { EFF_WORDLIST } from './effWordlist.js';

export const CHARACTER_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?/~'
};

export const AMBIGUOUS_CHARS = new Set(['0', 'O', '1', 'l', 'I', '5', 'S', '2', 'Z']);

export const MIN_PASSWORD_LENGTH = 4;
export const MAX_PASSWORD_LENGTH = 128;
export const DEFAULT_PASSWORD_LENGTH = 16;

export const MIN_PASSPHRASE_WORDS = 4;
export const MAX_PASSPHRASE_WORDS = 8;
export const DEFAULT_PASSPHRASE_WORDS = 6;

/**
 * Resolves the available cryptographic interface across browser and modern test environments.
 * @returns {Crypto|null}
 */
function getCryptoObject() {
  if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.getRandomValues === 'function') {
    return window.crypto;
  }
  if (typeof globalThis !== 'undefined' && globalThis.crypto && typeof globalThis.crypto.getRandomValues === 'function') {
    return globalThis.crypto;
  }
  return null;
}

/**
 * Checks whether the current runtime environment supports the Web Crypto API.
 * @returns {boolean}
 */
export function isWebCryptoSupported() {
  return getCryptoObject() !== null;
}

/**
 * Generates an unbiased random 32-bit unsigned integer in the range [0, max - 1].
 *
 * Why Rejection Sampling?
 * Simple `rand % max` introduces MODULO BIAS when `2^32` is not evenly divisible
 * by `max`. Numbers in the lower remainder range have a higher statistical
 * probability of being chosen.
 *
 * To eliminate bias:
 * 1. Calculate the largest multiple of `max` that fits in 2^32.
 * 2. Reject any random draw greater than or equal to this limit.
 * 3. Return `candidate % max` only from the uniform bucket.
 *
 * @param {number} max - Upper bound (exclusive). Must be > 0 and <= 2^32.
 * @returns {number} An unbiased integer in [0, max - 1].
 */
export function getSecureRandomInt(max) {
  if (max <= 0) {
    throw new Error('Range max must be greater than zero.');
  }
  if (max === 1) return 0;

  const cryptoInstance = getCryptoObject();
  if (!cryptoInstance) {
    throw new Error(
      'Web Crypto API is not available in this environment. Secure password generation requires crypto.getRandomValues().'
    );
  }

  // 2^32 = 4,294,967,296 (max value for Uint32 + 1)
  const TWO_POW_32 = 4294967296;
  const limit = TWO_POW_32 - (TWO_POW_32 % max);

  const buffer = new Uint32Array(1);

  while (true) {
    cryptoInstance.getRandomValues(buffer);
    const candidate = buffer[0];
    if (candidate < limit) {
      return candidate % max;
    }
    // Candidate rejected: retry until an unbiased sample is obtained
  }
}

/**
 * Generates a cryptographically random unique identifier using CSPRNG.
 * @returns {string} Hexadecimal random ID.
 */
export function generateSecureId() {
  const cryptoInstance = getCryptoObject();
  if (cryptoInstance) {
    const bytes = new Uint8Array(8);
    cryptoInstance.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  }
  return Date.now().toString(16);
}

/**
 * Picks one random character from a given character string uniformly without bias.
 * @param {string} charSet - String of characters to choose from.
 * @returns {string} Single character.
 */
export function getRandomChar(charSet) {
  if (!charSet || charSet.length === 0) {
    throw new Error('Character set must not be empty.');
  }
  const index = getSecureRandomInt(charSet.length);
  return charSet[index];
}

/**
 * Performs a cryptographically secure in-place Fisher-Yates (Durstenfeld) shuffle.
 * Guarantees that all n! permutations are equally likely.
 *
 * @param {Array} array - Array of elements to shuffle.
 * @returns {Array} Shuffled array.
 */
export function secureShuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    // Pick an unbiased random index from [0, i]
    const j = getSecureRandomInt(i + 1);
    // Swap elements at i and j
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

/**
 * Filters a character string using an optional poolFilter function.
 * @param {string} charSet - Source character string.
 * @param {Function|null} poolFilter - Filter predicate (char => boolean).
 * @returns {string} Filtered character string.
 */
export function filterCharacterSet(charSet, poolFilter = null) {
  if (!poolFilter || typeof poolFilter !== 'function') {
    return charSet;
  }
  return charSet
    .split('')
    .filter((ch) => poolFilter(ch))
    .join('');
}

/**
 * Validates the options and length parameters.
 * @param {number} length - Desired password length.
 * @param {object} options - Category toggle map.
 * @param {Function|null} poolFilter - Optional character filter predicate.
 * @returns {{ isValid: boolean, error?: string, activeCategories: string[] }}
 */
export function validateGeneratorConfig(length, options, poolFilter = null) {
  if (typeof length !== 'number' || isNaN(length)) {
    return { isValid: false, error: 'Password length must be a valid number.', activeCategories: [] };
  }

  if (length < MIN_PASSWORD_LENGTH || length > MAX_PASSWORD_LENGTH) {
    return {
      isValid: false,
      error: `Password length must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH}.`,
      activeCategories: []
    };
  }

  const activeCategories = Object.keys(options || {}).filter(
    (key) => Boolean(options[key]) && Boolean(CHARACTER_SETS[key])
  );

  if (activeCategories.length === 0) {
    return {
      isValid: false,
      error: 'At least one character category must be selected.',
      activeCategories: []
    };
  }

  // Ensure pools are not empty after applying filter
  if (poolFilter) {
    for (const cat of activeCategories) {
      const filtered = filterCharacterSet(CHARACTER_SETS[cat], poolFilter);
      if (filtered.length === 0) {
        return {
          isValid: false,
          error: `Category ${cat} has no remaining characters after filtering.`,
          activeCategories
        };
      }
    }
  }

  if (length < activeCategories.length) {
    return {
      isValid: false,
      error: `Length must be at least ${activeCategories.length} to include every selected category.`,
      activeCategories
    };
  }

  return { isValid: true, activeCategories };
}

/**
 * Generates a strong, cryptographically secure password meeting all requirements:
 * 1. Uses Web Crypto CSPRNG with rejection sampling (zero modulo bias).
 * 2. Guarantees at least one character from each active category.
 * 3. Fills remaining characters uniformly from the combined pool.
 * 4. Shuffles characters with Fisher-Yates to eliminate predictable positioning.
 *
 * @param {number} length - Length of password (4-128).
 * @param {object} options - Active character categories.
 * @param {Function|null} poolFilter - Optional character filter predicate.
 * @returns {string} Generated password string.
 */
export function generatePassword(length = DEFAULT_PASSWORD_LENGTH, options = {}, poolFilter = null) {
  const validation = validateGeneratorConfig(length, options, poolFilter);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const { activeCategories } = validation;
  const resultCharacters = [];

  // 1. Mandatory Inclusion: Guarantee at least 1 character from EACH active category
  for (const category of activeCategories) {
    const rawPool = CHARACTER_SETS[category];
    const charPool = filterCharacterSet(rawPool, poolFilter);
    resultCharacters.push(getRandomChar(charPool));
  }

  // 2. Build the combined character pool for remaining slots
  let combinedPool = '';
  for (const category of activeCategories) {
    const rawPool = CHARACTER_SETS[category];
    combinedPool += filterCharacterSet(rawPool, poolFilter);
  }

  // 3. Fill the remaining slots up to the requested length
  const remainingSlots = length - resultCharacters.length;
  for (let i = 0; i < remainingSlots; i++) {
    resultCharacters.push(getRandomChar(combinedPool));
  }

  // 4. Securely shuffle the array so mandatory category characters
  //    are not predictably clustered at the beginning
  const shuffledCharacters = secureShuffle(resultCharacters);

  return shuffledCharacters.join('');
}

/**
 * Generates a Diceware-style passphrase using the EFF Short Wordlist (7,776 words).
 * Uses Web Crypto CSPRNG with rejection sampling for word selection.
 *
 * @param {number} wordCount - Number of words (4-8, default 6).
 * @param {object} options - Passphrase options: separator, capitalize, addNumber.
 * @returns {string} Generated passphrase.
 */
export function generatePassphrase(wordCount = DEFAULT_PASSPHRASE_WORDS, options = {}) {
  const count = Math.max(MIN_PASSPHRASE_WORDS, Math.min(MAX_PASSPHRASE_WORDS, wordCount));
  const separator = options.separator !== undefined ? options.separator : '-';
  const capitalize = Boolean(options.capitalize);
  const addNumber = Boolean(options.addNumber);

  const words = [];
  const totalWords = EFF_WORDLIST.length;

  for (let i = 0; i < count; i++) {
    const wordIndex = getSecureRandomInt(totalWords);
    let word = EFF_WORDLIST[wordIndex];
    if (capitalize) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }
    words.push(word);
  }

  let phrase = words.join(separator);

  if (addNumber) {
    // Append a 2-digit cryptographically random number (00-99)
    const num = getSecureRandomInt(100);
    const numStr = String(num).padStart(2, '0');
    phrase = separator ? `${phrase}${separator}${numStr}` : `${phrase}${numStr}`;
  }

  return phrase;
}
