import React from 'react';
import { Lock, Cpu, EyeOff, ShieldCheck } from 'lucide-react';

/**
 * SecurityNotice Component
 * Explains SecurePass's security principles: CSPRNG, client-side isolation, and zero tracking.
 */
export function SecurityNotice() {
  return (
    <section className="security-notice-card" aria-label="Security & Privacy Guarantees">
      <div className="security-notice-header">
        <ShieldCheck size={18} className="notice-icon-primary" />
        <h3 className="security-notice-title">Security & Privacy Architecture</h3>
      </div>

      <div className="security-features-grid">
        <div className="security-feature-item">
          <Cpu size={16} className="feature-icon" />
          <div className="feature-text">
            <strong>Web Crypto API</strong>
            <span>Uses OS-level hardware entropy via <code>crypto.getRandomValues()</code>.</span>
          </div>
        </div>

        <div className="security-feature-item">
          <EyeOff size={16} className="feature-icon" />
          <div className="feature-text">
            <strong>Zero Telemetry</strong>
            <span>100% client-side execution. No passwords ever leave your device.</span>
          </div>
        </div>

        <div className="security-feature-item">
          <Lock size={16} className="feature-icon" />
          <div className="feature-text">
            <strong>Zero Modulo Bias</strong>
            <span>Uniform distribution using mathematical rejection sampling.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
