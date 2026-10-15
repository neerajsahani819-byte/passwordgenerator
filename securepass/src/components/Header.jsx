import React, { useState } from 'react';
import { ShieldCheck, Keyboard, HelpCircle, Database } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { PanicButton } from './PanicButton';

/**
 * Header Component (Zone 1)
 * Logo, Theme toggle, Shortcuts button, Panic button, About trigger, and Debug Storage Inspector.
 */
export function Header({
  theme,
  onToggleTheme,
  onOpenShortcuts,
  onOpenAbout,
  onPanicWipe,
  onShowToast
}) {
  const [isDebugMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('debug') === '1';
    }
    return false;
  });

  const handleInspectStorage = () => {
    if (typeof window === 'undefined') return;
    const keys = Object.keys(window.localStorage);
    const ALLOWED = ['securepass-theme-preference', 'securepass-onboarded', 'securepass-last-settings'];
    const invalid = keys.filter((k) => !ALLOWED.includes(k));

    if (invalid.length > 0) {
      if (onShowToast) {
        onShowToast({
          type: 'danger',
          message: 'Storage Security Warning',
          subtext: `Found unauthorized keys: ${invalid.join(', ')}`
        });
      }
    } else {
      if (onShowToast) {
        onShowToast({
          type: 'info',
          message: 'Storage Audit Passed',
          subtext: `Keys: ${keys.length ? keys.join(', ') : 'None'}. Zero passwords stored.`
        });
      }
    }
  };

  return (
    <header className="command-header">
      <div className="header-brand">
        <div className="brand-logo-circle" aria-hidden="true">
          <ShieldCheck size={24} className="brand-shield" />
        </div>
        <div className="brand-meta">
          <div className="brand-title-row">
            <span className="brand-title">SecurePass</span>
            <span className="brand-pill">Command Center</span>
          </div>
          <span className="brand-sub">Client-Side CSPRNG &bull; Zero Persistence</span>
        </div>
      </div>

      <nav className="header-controls" aria-label="Global application controls">
        {isDebugMode && (
          <button
            type="button"
            className="ctrl-btn ctrl-btn-debug"
            onClick={handleInspectStorage}
            title="Storage Inspector (?debug=1 active)"
            aria-label="Inspect LocalStorage security"
          >
            <Database size={17} aria-hidden="true" />
            <span className="ctrl-btn-text">Audit RAM</span>
          </button>
        )}

        <button
          type="button"
          className="ctrl-btn"
          onClick={onOpenShortcuts}
          title="Keyboard Shortcuts (? or F1)"
          aria-label="Open keyboard shortcuts guide"
        >
          <Keyboard size={18} aria-hidden="true" />
          <span className="ctrl-btn-text">Keys</span>
        </button>

        <PanicButton onPanicWipe={onPanicWipe} />

        <ThemeToggle theme={theme} onToggle={onToggleTheme} />

        <button
          type="button"
          className="ctrl-btn"
          onClick={onOpenAbout}
          title="About & Security Model"
          aria-label="Open about and security documentation"
        >
          <HelpCircle size={18} aria-hidden="true" />
        </button>
      </nav>
    </header>
  );
}
