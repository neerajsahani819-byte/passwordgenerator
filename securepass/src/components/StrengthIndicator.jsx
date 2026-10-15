import React from 'react';
import { Info, ShieldAlert, Shield, ShieldCheck } from 'lucide-react';

/**
 * StrengthIndicator Component
 * Visual password strength bar and entropy analysis with educational context.
 */
export function StrengthIndicator({ strengthData }) {
  const { score, label, color, entropyBits, poolSize, crackTimeEstimate } = strengthData || {
    score: 0,
    label: 'None',
    color: 'var(--color-muted)',
    entropyBits: 0,
    poolSize: 0,
    crackTimeEstimate: 'Instant'
  };

  const getStrengthIcon = () => {
    switch (label) {
      case 'Very Strong':
        return <ShieldCheck size={18} className="strength-badge-icon strength-icon-very-strong" />;
      case 'Strong':
        return <ShieldCheck size={18} className="strength-badge-icon strength-icon-strong" />;
      case 'Fair':
        return <Shield size={18} className="strength-badge-icon strength-icon-fair" />;
      case 'Weak':
      default:
        return <ShieldAlert size={18} className="strength-badge-icon strength-icon-weak" />;
    }
  };

  return (
    <div className="setting-group strength-indicator-group" aria-label="Password Strength Evaluation">
      <div className="strength-header">
        <div className="strength-label-group">
          <span className="setting-title">Estimated Strength</span>
          <span className="strength-disclaimer-badge" title="Statistical entropy estimate">
            <Info size={12} />
            Estimate
          </span>
        </div>
        <div className="strength-status-badge" style={{ color: color }}>
          {getStrengthIcon()}
          <span className="strength-text-label">{label}</span>
        </div>
      </div>

      {/* 4-Segment Visual Meter */}
      <div
        className="strength-meter-bar"
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuetext={`Password strength: ${label}`}
      >
        {[1, 2, 3, 4].map((seg) => {
          const isActive = seg <= score;
          return (
            <div
              key={seg}
              className={`strength-segment ${isActive ? 'strength-segment-active' : ''}`}
              style={{
                backgroundColor: isActive ? color : 'var(--color-meter-bg)'
              }}
            />
          );
        })}
      </div>

      {/* Metrics Row */}
      <div className="strength-metrics-row">
        <div className="metric-pill">
          <span className="metric-title">Entropy:</span>
          <span className="metric-value">~{entropyBits} bits</span>
        </div>
        <div className="metric-pill">
          <span className="metric-title">Pool Size:</span>
          <span className="metric-value">{poolSize} chars</span>
        </div>
        <div className="metric-pill">
          <span className="metric-title">Search Space:</span>
          <span className="metric-value">{crackTimeEstimate}</span>
        </div>
      </div>

      <p className="strength-disclaimer-text">
        Strength is calculated from character space entropy. It is an algorithmic estimation, not an
        absolute guarantee against dictionary attacks or compromised services.
      </p>
    </div>
  );
}
