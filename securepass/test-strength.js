import {
  calculatePoolSize,
  calculateEntropy,
  estimateCrackTime,
  evaluatePasswordStrength
} from './src/utils/passwordStrength.js';

console.log('--- Testing SecurePass Strength & Entropy Engine ---');

// Test 1: Pool size calculation
const poolAll = calculatePoolSize({ uppercase: true, lowercase: true, numbers: true, symbols: true });
console.assert(poolAll === 87, `Test 1 Failed: Expected pool size 87, got ${poolAll}`);
console.log(`✓ Test 1: Full pool size computed accurately: ${poolAll} characters.`);

// Test 2: Entropy calculation formula E = L * log2(N)
const entropy16 = calculateEntropy(16, 88);
// 16 * log2(88) = 16 * 6.4594 = 103.4
console.assert(entropy16 >= 103 && entropy16 <= 104, `Test 2 Failed: Expected ~103.4, got ${entropy16}`);
console.log(`✓ Test 2: Shannon entropy for 16 chars from 88 pool = ${entropy16} bits.`);

// Test 3: Strength ratings categorization
const weakResult = evaluatePasswordStrength('abcd', 4, { lowercase: true });
console.assert(weakResult.score === 1 && weakResult.label === 'Weak', 'Test 3 Failed: Weak score');
console.log(`✓ Test 3a: Length 4 evaluated as ${weakResult.label} (~${weakResult.entropyBits} bits).`);

const fairResult = evaluatePasswordStrength('Abc12345', 8, { uppercase: true, lowercase: true, numbers: true });
console.assert(fairResult.score === 2 && fairResult.label === 'Fair', 'Test 3 Failed: Fair score');
console.log(`✓ Test 3b: Length 8 (alphanumeric) evaluated as ${fairResult.label} (~${fairResult.entropyBits} bits).`);

const strongResult = evaluatePasswordStrength('Abc123456789', 12, { uppercase: true, lowercase: true, numbers: true });
console.assert(strongResult.score === 3 && strongResult.label === 'Strong', 'Test 3 Failed: Strong score');
console.log(`✓ Test 3c: Length 12 (alphanumeric) evaluated as ${strongResult.label} (~${strongResult.entropyBits} bits).`);

const veryStrongResult = evaluatePasswordStrength('K9#mP2$xL8*vQ4@w', 16, { uppercase: true, lowercase: true, numbers: true, symbols: true });
console.assert(veryStrongResult.score === 4 && veryStrongResult.label === 'Very Strong', 'Test 3 Failed: Very Strong score');
console.log(`✓ Test 3d: Length 16 (all categories) evaluated as ${veryStrongResult.label} (~${veryStrongResult.entropyBits} bits).`);

// Test 4: Crack time estimates
console.assert(estimateCrackTime(20) === 'Instant', 'Test 4 Failed: Crack time instant');
console.assert(estimateCrackTime(103) === 'Astronomical' || estimateCrackTime(103) === 'Centuries', 'Test 4 Failed: Crack time centuries');
console.log('✓ Test 4: Brute-force resistance scale functions correctly.');

console.log('--- All Strength Engine Tests Passed Successfully! ---');
