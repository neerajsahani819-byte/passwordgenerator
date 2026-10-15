# SecurePass — Cryptographically Secure Command Center

[![React](https://img.shields.io/badge/React-19.x-61dafb.svg?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646cff.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Security](https://img.shields.io/badge/Security-Web_Crypto_CSPRNG-10b981.svg?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues)
[![Entropy](https://img.shields.io/badge/Entropy-Shannon_Information_Theory-3b82f6.svg?style=flat-square)](#5-cryptographic-architecture--mathematics)
[![Accessibility](https://img.shields.io/badge/A11y-WCAG_2.1_AA-8b5cf6.svg?style=flat-square)](#4-accessibility--ux-features)
[![Telemetry](https://img.shields.io/badge/Telemetry-Zero_Persistence-success.svg?style=flat-square)](#7-security--privacy-architecture)
[![Tests](https://img.shields.io/badge/Tests-17%2C672_Passed-emerald.svg?style=flat-square)](#8-testing--quality-assurance)

**SecurePass** is a high-security, client-side, zero-knowledge password and passphrase generator engineered in React 19 and Vite 8. Designed around a three-zone **"Command Center"** architecture, it educates users on why passwords are secure while enforcing rigorous mathematical randomness via the native **Web Crypto API**.

---

## 📑 Table of Contents
1. [Architecture & The Three-Zone Command Center](#1-architecture--the-three-zone-command-center)
2. [Key Upgrades & Features](#2-key-upgrades--features)
3. [Technology Stack](#3-technology-stack)
4. [Accessibility & UX Features](#4-accessibility--ux-features)
5. [Cryptographic Architecture & Mathematics](#5-cryptographic-architecture--mathematics)
6. [Project Structure](#6-project-structure)
7. [Security & Privacy Hardening](#7-security--privacy-hardening)
8. [Testing & Quality Assurance](#8-testing--quality-assurance)
9. [Installation & Setup](#9-installation--setup)
10. [Viva Voce & Technical Interview Guide](#10-viva-voce--technical-interview-guide)

---

## 1. Architecture & The Three-Zone Command Center

```text
┌─────────────────────────────────────────────────────────────┐
│ ZONE 1 — HERO COMMAND ZONE                                  │
│  Logo + Theme Toggle + Shortcuts + Panic Button             │
│  Monospace Output · Mask/Reveal · Copy (Confetti) · Refresh │
│  Live Metrics Strip: Bits · Rating · Chars · Pool · Crack   │
├─────────────────────────────────────────────────────────────┤
│ ZONE 2 — CONTROLS COMMAND ZONE                              │
│  Segmented Mode: [ Characters | Passphrase ]                │
│  Characters Mode:                                           │
│    Color-Reactive Slider (Red→Amber→Green→Emerald)          │
│    Presets (8, 12, 16, 24, 32, 64) · Drag Tooltip           │
│    Category Toggles (A-Z, a-z, 0-9, Symbols)                │
│    Ambiguous Filter: Exclude 0/O, 1/l/I, 5/S, 2/Z           │
│    Live Character Stream & Pool Size Counter                │
│  Passphrase Mode:                                           │
│    EFF Wordlist (7,776 words) · Word count 4–8              │
│    Separators (-, ., _, space) · Capitalize · Append number │
├─────────────────────────────────────────────────────────────┤
│ ZONE 3 — INSIGHTS & ARCHITECTURE                            │
│  SVG Arc Entropy Gauge (0–128 bits) with NIST Bands         │
│  Live Formula Breakdown: E = L × log₂(N)                    │
│  NIST "Why This Is Strong" Verification Checklist           │
│  Session History Timeline (RAM only, 10 cap, 5s Undo)       │
│  Security Architecture Notice & Tech Badges                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Key Upgrades & Features

### 2.1 Passphrase (Diceware) Mode
- Generates memorable, high-entropy multi-word phrases using the **EFF Short Wordlist (7,776 words)**.
- Each selected word contributes $\log_2(7776) \approx 12.925$ bits of entropy.
- Options: Word count (4–8, default 6), custom separator (`-`, `.`, `_`, ` `), word capitalization, and optional 2-digit random append ($+6.64$ bits).
- **Entropy Benchmarks**:
  - 6 words $\approx 77.5$ bits (Strong)
  - 7 words $\approx 90.5$ bits (Very Strong)
  - 6 words + 2-digit number $\approx 84.1$ bits (Very Strong)

### 2.2 Live Character Stream & Ambiguous Exclusion
- Live animated pool preview strip updates whenever categories are toggled.
- **Ambiguous Character Filter**: Excludes `0`, `O`, `1`, `l`, `I`, `5`, `S`, `2`, `Z` for high-legibility scenarios, automatically adjusting pool size from 87 down to 78.

### 2.3 Color-Reactive Slider & Tooltips
- Continuous color transition across track from rose to amber to blue to emerald based on resulting bits.
- Drag tooltip renders exact live evaluation: `16 chars → 103.4 bits (Very Strong)`.
- Tick marks at `8, 12, 16, 24, 32, 64` with quick preset buttons.

### 2.4 Auto-Clear Clipboard & Confetti
- One-click copy morphs icon $\rightarrow$ ✓ and triggers a CSS confetti burst.
- Toast displays countdown: *"Clipboard will auto-clear in 30s"*.
- After 30 seconds, clipboard is automatically cleared via `navigator.clipboard.writeText('')`.

### 2.5 "Explain This Password" Mode
- Color-codes each character by its category (Uppercase: Blue, Lowercase: Slate, Numbers: Amber, Symbols: Violet).
- Highlights the guaranteed-inclusion characters.
- Plays a brief shuffle animation on regeneration.

### 2.6 Panic Button
- Header emergency button wipes the current credential, purges all RAM history, clears the system clipboard, and displays confirmation feedback.

### 2.7 5-Minute Inactivity Auto-Wipe
- Tab visibility listener (`visibilitychange`) purges all RAM credentials if the tab is left hidden in the background for more than 5 minutes.

### 2.8 Keyboard Shortcuts
| Key | Action |
|---|---|
| `Space` | Regenerate credential |
| `C` | Copy to clipboard |
| `R` | Toggle mask / reveal |
| `T` | Toggle light & dark theme |
| `H` | Jump to history timeline |
| `1` – `4` | Toggle character categories |
| `↑` / `↓` | Adjust length / word count by $\pm 1$ |
| `?` or `F1` | Open keyboard shortcuts guide |
| `Esc` | Close any active dialog or modal |

---

## 3. Technology Stack

- **React 19**: Reactive state orchestration and functional components.
- **Vite 8**: Ultra-fast build pipeline and ES modules.
- **Vanilla CSS3 (OKLCH)**: Modern perceptual color spaces (`oklch()`), custom slider tracks, SVG arcs, and glassmorphism.
- **Web Crypto API**: Native operating system hardware entropy pool (`crypto.getRandomValues`).
- **Lucide React**: Clean, accessible SVG iconography.

---

## 4. Accessibility & UX Features

- **WCAG 2.1 Level AA**: All color combinations exceed contrast requirements ($\ge 4.5:1$ for body text, $\ge 3:1$ for UI elements).
- **Reduced-Motion Support**: All transitions, confetti bursts, and spinner animations are suppressed under `@media (prefers-reduced-motion: reduce)`.
- **Keyboard Traps**: Modals trap focus and close cleanly on `Esc`.
- **Screen Reader Announcements**: Live regions (`role="status"`, `aria-live="polite"`) announce changes without interrupting screen reader speech.

---

## 5. Cryptographic Architecture & Mathematics

### 5.1 CSPRNG vs `Math.random()`
`Math.random()` is a pseudorandom number generator (PRNG) with predictable internal state. SecurePass strictly uses `crypto.getRandomValues()`, seeded by operating system hardware entropy (CPU interrupt timings, thermal fluctuations).

### 5.2 Rejection Sampling (Zero Modulo Bias)
To prevent modulo bias when drawing a random character from a pool of size $N$:
1. Calculate $\text{limit} = 2^{32} - (2^{32} \pmod N)$.
2. Draw 32-bit unsigned random integer $R$.
3. If $R \ge \text{limit}$, reject and redraw.
4. If $R < \text{limit}$, return $R \pmod N$.
Every character in $[0, N-1]$ has identical probability $\frac{1}{N}$.

### 5.3 Fisher–Yates Shuffle
To prevent mandatory category characters from predictably congregating at the beginning of the string, SecurePass shuffles the character array using the Durstenfeld Fisher–Yates algorithm:
$$\forall i \in [L-1 \dots 1], \quad j = \text{getRandomInt}(i + 1), \quad \text{swap}(arr[i], arr[j])$$

### 5.4 Shannon Information Entropy
- **Characters Mode**: $E = L \times \log_2(N)$
- **Passphrase Mode**: $E = \text{wordCount} \times \log_2(7776) + (\text{addNumber} ? 6.64 : 0)$

---

## 6. Project Structure

```text
securepass/
├── public/
│   └── favicon.svg                    # Security shield icon
├── src/
│   ├── components/
│   │   ├── Header.jsx                 # Zone 1: Logo, controls, panic button
│   │   ├── PasswordDisplay.jsx        # Zone 1: Hero card, explain mode, metrics
│   │   ├── ModeSwitcher.jsx           # Zone 2: Segmented Characters/Passphrase
│   │   ├── LengthSelector.jsx         # Zone 2: Color-reactive slider, presets
│   │   ├── CharacterOptions.jsx       # Zone 2: Category toggles, ambiguous filter
│   │   ├── PoolPreview.jsx            # Zone 2: Live animated character stream
│   │   ├── PassphraseOptions.jsx      # Zone 2: EFF word count, separator, number
│   │   ├── EntropyGauge.jsx           # Zone 3: SVG arc gauge (0-128 bits)
│   │   ├── EntropyBreakdown.jsx       # Zone 3: Live formula breakdown
│   │   ├── StrengthReason.jsx         # Zone 3: NIST checklist
│   │   ├── PasswordHistory.jsx        # Zone 3: RAM timeline, undo clear
│   │   ├── SecurityNotice.jsx         # Zone 3: Architecture notice
│   │   ├── Footer.jsx                 # Zone 3: Credits & badges
│   │   ├── ShortcutsModal.jsx         # Global: Keyboard shortcuts dialog
│   │   ├── OnboardingTour.jsx         # Global: 3-step walkthrough
│   │   ├── PanicButton.jsx            # Global: Emergency wipe trigger
│   │   ├── ConfirmModal.jsx           # Global: Focus-trapped confirmation modal
│   │   ├── Toast.jsx                  # Global: Notifications with Undo action
│   │   └── ThemeToggle.jsx            # Global: Dark/Light switcher
│   ├── hooks/
│   │   ├── useTheme.js                # Theme hook (data-theme on html)
│   │   ├── useLocalStoragePreference.js # Strict key whitelist hook
│   │   ├── useKeyboardShortcuts.js    # Global hotkeys listener
│   │   ├── useClipboardAutoClear.js   # 30s auto-clear countdown manager
│   │   └── useIdleVisibilityWipe.js   # 5-min background idle wipe hook
│   ├── utils/
│   │   ├── passwordGenerator.js       # Web Crypto CSPRNG, rejection sampling, shuffle
│   │   ├── passwordStrength.js        # Entropy formulas & NIST classification
│   │   ├── effWordlist.js             # EFF Short Wordlist (7,776 words)
│   │   ├── format.js                  # Scientific notation & crack time formatting
│   │   └── clipboard.js               # Safe clipboard write & clear utility
│   ├── App.jsx                        # Master coordinator
│   ├── main.jsx                       # Entry point
│   └── index.css                      # Master OKLCH design system
├── index.html                         # Strict Content Security Policy
├── package.json                       # Scripts & dependencies
├── test-suite.js                      # 17,672-assertion test runner
├── SECURITY.md                        # Responsible disclosure policy
└── LICENSE                            # MIT License
```

---

## 7. Security & Privacy Hardening

1. **Content Security Policy**: `index.html` restricts scripts and styles to `'self'` and blocks all network connections (`connect-src 'self' ws:` in dev, `connect-src 'none'` in prod).
2. **Zero Storage of Credentials**: `localStorage` strictly contains only three whitelisted preference keys: `securepass-theme-preference`, `securepass-onboarded`, and `securepass-last-settings`.
3. **No `Math.random()`**: Grep-audited across the entire codebase. All unique identifiers and numbers use hardware CSPRNG.
4. **No Console Leakage**: Credentials are never output to `console.log`.

---

## 8. Testing & Quality Assurance

Run the automated test suite:
```powershell
npm test
```

### Verified Test Results:
```text
====================================================
🧪 Starting SecurePass Automated Quality Assurance
====================================================

[SECTION 1] Boundary & Input Validation Testing...
  ✓ Successfully rejected lengths < 4: [-10, 0, 1, 2, 3]
  ✓ Successfully rejected lengths > 128: [129, 130, 256, 1000]
  ✓ Successfully rejected non-numeric length types.
  ✓ Successfully caught empty category configuration with clear error.
  ✓ Exactly validated boundaries 4 and 128.

[SECTION 2] Testing All 15 Category Combinations (1,500 Generations)...
  ✓ Verified 1,500/1,500 passwords across all 15 permutations.
  ✓ Confirmed every selected category contributes at least 1 character.
  ✓ Confirmed unselected categories are strictly excluded.

[SECTION 3] Cryptographic Engine Integrity & Uniformity...
  ✓ Rejection sampling across 87 options: 10,000 draws uniformly populated (min: 89, max: 141).
  ✓ Fisher-Yates preserves full multiset permutation.

[SECTION 4] Password Strength & Entropy Benchmarks...
  ✓ NIST thresholds verified: Weak (1), Fair (2), Strong (3), Very Strong (4).
  ✓ Brute-force crack time progression accurately scales with entropy.

[SECTION 5] Upgraded Features Verification (Passphrase, Ambiguous Filter, A11y)...
  ✓ Passphrase generation produces exact word counts across all separators (-, ., _, space).
  ✓ Passphrase capitalization applies cleanly to all words.
  ✓ Passphrase append-number correctly attaches 2-digit random suffix.
  ✓ Passphrase entropy formula accurately yields ~77.5 bits for 6 words and ~90.5 bits for 7 words.
  ✓ evaluatePassphraseStrength benchmarks match NIST standards.
  ✓ Ambiguous character exclusion successfully purged [0, O, 1, l, I, 5, S, 2, Z] across 100 runs.
  ✓ formatScientific and humanization utilities format metrics accurately.
  ✓ generateSecureId uses hardware CSPRNG without Math.random().
  ✓ Zero Math.random() verified across all core source and hook files.

====================================================
🎉 ALL 17672/17672 TESTS PASSED WITH ZERO FAILURES!
====================================================
```

---

## 9. Installation & Setup

```powershell
cd securepass
npm install
npm run dev
# Live at http://localhost:5173/

npm test
# Runs 17,672 test assertions

npm run build
# Compiles optimized static production bundle in dist/
```

---

## 10. Viva Voce & Technical Interview Guide

### Q1: How does Passphrase (Diceware) entropy compare to standard character password entropy?
> **Answer**: Passphrase entropy is calculated based on the size of the wordlist rather than individual characters. Using the EFF Short Wordlist of $7,776$ words, each selected word contributes $\log_2(7776) \approx 12.925$ bits of entropy. A 6-word passphrase yields $6 \times 12.925 \approx 77.55$ bits of entropy, which is comparable to a 12-character complex alphanumeric password ($12 \times \log_2(87) \approx 77.3$ bits), while being significantly easier for human users to remember and type without error. Appending a random 2-digit number ($00-99$) adds an additional $\log_2(100) \approx 6.64$ bits, raising a 6-word passphrase to $>84$ bits (Very Strong).

### Q2: What is the purpose of the Ambiguous Character exclusion feature?
> **Answer**: In high-security environments, credentials often need to be manually transcribed into terminal prompts, mobile devices, or written on recovery sheets. Homoglyphs and visually similar characters—such as `0` (digit zero) vs `O` (capital O), `1` (digit one) vs `l` (lowercase L) vs `I` (capital i), and `5` vs `S`—frequently cause costly transcription errors. SecurePass allows excluding these characters, reducing the character pool from 87 to 78 characters. Even with this reduction, a 16-character password still maintains $16 \times \log_2(78) \approx 100.6$ bits of entropy (well above the NIST 80-bit target).

### Q3: How does the Clipboard Auto-Clear feature improve security?
> **Answer**: Modern operating systems maintain a shared clipboard that any running native desktop application or background script can monitor. By setting an automated 30-second timer that clears the clipboard (`navigator.clipboard.writeText('')`), SecurePass minimizes the exposure window during which credentials can be harvested by background clipboard sniffers after the user has pasted them into their password manager.

---

## 📄 License
MIT License &copy; 2026 SecurePass Contributors
