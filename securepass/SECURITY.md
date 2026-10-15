# Security Policy

## 1. Zero-Trust Architecture
SecurePass operates under a strict **Zero-Knowledge, Zero-Persistence, Client-Side Only** architecture:
- All cryptographic entropy originates from the host system's hardware via `window.crypto.getRandomValues()`.
- No password or passphrase ever leaves your device.
- No network requests (`fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`) are executed by application code.
- Credential history is stored exclusively in volatile system RAM (`useState`) and is wiped upon page reload, tab closure, or 5 minutes of inactivity.
- Persistent browser storage (`localStorage`) is restricted strictly to non-sensitive preferences (`securepass-theme-preference`, `securepass-onboarded`, `securepass-last-settings`).

## 2. Reporting a Vulnerability
We welcome responsible security disclosures regarding cryptographic flaws, memory leaks, or bypasses.

If you believe you have discovered a vulnerability in SecurePass:
1. **Do not create a public issue** on GitHub.
2. Contact the maintainer directly via secure communication or email at `security@securepass.local` (or via private GitHub Security Advisory).
3. Provide a detailed Proof of Concept (PoC) explaining:
   - Specific environment and browser version.
   - Attack vector and impact.
   - Step-by-step reproduction instructions.

## 3. Scope
In Scope:
- Modulo bias or skew in character/word selection.
- Weaknesses in rejection sampling or Fisher–Yates implementation.
- Unintended storage of sensitive strings in persistent browser caches or storage APIs.
- Cross-Site Scripting (XSS) vectors or Content Security Policy violations.

Out of Scope:
- Physical device compromises, rootkits, or hardware keyloggers.
- Malicious browser extensions with broad DOM or clipboard inspection permissions.
- Denial of Service via client-side tab freezes.
