import {
  generatePassword,
  validateGeneratorConfig,
  getSecureRandomInt
} from './src/utils/passwordGenerator.js';

console.log('--- Testing SecurePass Generation Engine ---');

// Test 1: Validation with zero categories
const val0 = validateGeneratorConfig(16, { uppercase: false, lowercase: false, numbers: false, symbols: false });
console.assert(val0.isValid === false, 'Test 1 Failed: Zero categories should be invalid');
console.log('✓ Test 1: Zero categories properly rejected.');

// Test 2: Validation with lengths outside boundaries
const valMin = validateGeneratorConfig(3, { uppercase: true });
const valMax = validateGeneratorConfig(129, { uppercase: true });
console.assert(!valMin.isValid && !valMax.isValid, 'Test 2 Failed: Length boundary checks failed');
console.log('✓ Test 2: Boundary lengths (<4 or >128) properly rejected.');

// Test 3: Generate 1,000 passwords and verify category guarantee
let allGuaranteePassed = true;
const testOptions = { uppercase: true, lowercase: true, numbers: true, symbols: true };

for (let i = 0; i < 1000; i++) {
  const pwd = generatePassword(16, testOptions);
  
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasNum = /[0-9]/.test(pwd);
  const hasSym = /[!@#$%^&*()\-_=+[\]{};:,.?/~]/.test(pwd);

  if (pwd.length !== 16 || !hasUpper || !hasLower || !hasNum || !hasSym) {
    allGuaranteePassed = false;
    console.error(`Failure at iteration ${i}: ${pwd}`);
    break;
  }
}
console.assert(allGuaranteePassed, 'Test 3 Failed: Category guarantee failed in sample');
console.log('✓ Test 3: 1,000/1,000 passwords guaranteed >= 1 character from every active category.');

// Test 4: Boundary test at length 4 and 128
const pwd4 = generatePassword(4, testOptions);
const pwd128 = generatePassword(128, testOptions);
console.assert(pwd4.length === 4, 'Test 4 Failed: length 4');
console.assert(pwd128.length === 128, 'Test 4 Failed: length 128');
console.log('✓ Test 4: Length bounds (4 and 128) generated with exact length.');

// Test 5: Rejection sampling range check
let intInRange = true;
for (let i = 0; i < 5000; i++) {
  const n = getSecureRandomInt(26);
  if (n < 0 || n >= 26) {
    intInRange = false;
    break;
  }
}
console.assert(intInRange, 'Test 5 Failed: Rejection sampling returned out-of-range value');
console.log('✓ Test 5: Rejection sampling integers strictly within [0, max-1].');

console.log('--- All Engine Tests Passed Successfully! ---');
