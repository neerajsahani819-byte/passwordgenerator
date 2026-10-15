import React from 'react';
import { Shield, Sparkles, Code2 } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

/**
 * Footer Component
 * Project credits, technology stack badges, and educational summary.
 */
export function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-badges">
        <span className="footer-badge">
          <Code2 size={13} /> React 19 + Vite
        </span>
        <span className="footer-badge">
          <Shield size={13} /> Web Crypto CSPRNG
        </span>
        <span className="footer-badge">
          <Sparkles size={13} /> Zero Telemetry
        </span>
      </div>
      <p className="footer-copy">
        SecurePass &copy; {CURRENT_YEAR} — Built for high-security client-side generation.
      </p>
      <p className="footer-subtext">
        College Project &bull; Portfolio Edition &bull; Open Source Client
      </p>
    </footer>
  );
}
