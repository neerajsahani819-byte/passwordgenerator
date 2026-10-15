/**
 * ==============================================================================
 * SecurePass — Formatting Utilities
 * Scientific notation, crack-time humanization, and time formatting
 * ==============================================================================
 */

/**
 * Formats a very large number into readable scientific notation with superscript exponents.
 * Example: formatScientific(1.6e31) => "1.6 × 10³¹"
 *
 * @param {number} num
 * @returns {string}
 */
export function formatScientific(num) {
  if (!isFinite(num) || num <= 0) return '0';
  if (num < 1000) return Math.round(num).toString();
  if (num < 1e6) return num.toLocaleString();

  const expStr = num.toExponential(1); // e.g. "1.6e+31"
  const [base, exp] = expStr.split('e+');
  if (!exp) return num.toExponential(1);

  const superscripts = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻'
  };

  const expSuper = exp.split('').map((char) => superscripts[char] || char).join('');
  return `${base} × 10${expSuper}`;
}

/**
 * Converts entropy in bits into estimated crack time against a 100B guesses/sec cluster.
 * Outputs formatted string such as "~5.2 × 10¹² years".
 *
 * @param {number} entropyBits
 * @returns {string}
 */
export function formatCrackTimeHuman(entropyBits) {
  if (entropyBits <= 0) return 'Instant';

  // 100 billion guesses/sec = 10^11 guesses/sec
  // Average guesses needed = 2^(E - 1)
  // Seconds = 2^(E - 1) / 10^11
  // log10(seconds) = (E - 1) * log10(2) - 11
  const log10Seconds = (entropyBits - 1) * Math.log10(2) - 11;

  if (log10Seconds < 0) return '< 1 second';
  if (log10Seconds < 1.77) return '< 1 minute'; // 60s
  if (log10Seconds < 3.55) return 'A few hours'; // 3600s
  if (log10Seconds < 4.93) return 'Several days'; // 86400s
  if (log10Seconds < 6.41) return 'Several months';
  if (log10Seconds < 7.50) return '~1 to 10 years';

  // In years: seconds / (365.25 * 86400) = seconds / 31,557,600 (log10 is ~7.5)
  const log10Years = log10Seconds - 7.5;
  if (log10Years < 2) return `${Math.round(Math.pow(10, log10Years))} years`;

  // Above 100 years, format in scientific notation
  const yearVal = Math.pow(10, log10Years);
  return `~${formatScientific(yearVal)} years`;
}

/**
 * Formats a Date object or timestamp into HH:MM (24-hour format)
 * @param {Date|number} date
 * @returns {string}
 */
export function formatTimeHHMM(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}
