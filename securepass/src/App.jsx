import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTheme } from './hooks/useTheme.js';
import { useLocalStoragePreference } from './hooks/useLocalStoragePreference.js';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts.js';
import { useClipboardAutoClear } from './hooks/useClipboardAutoClear.js';
import { useIdleVisibilityWipe } from './hooks/useIdleVisibilityWipe.js';

import { Header } from './components/Header.jsx';
import { PasswordDisplay } from './components/PasswordDisplay.jsx';
import { ModeSwitcher } from './components/ModeSwitcher.jsx';
import { LengthSelector } from './components/LengthSelector.jsx';
import { CharacterOptions } from './components/CharacterOptions.jsx';
import { PoolPreview } from './components/PoolPreview.jsx';
import { PassphraseOptions } from './components/PassphraseOptions.jsx';
import { EntropyGauge } from './components/EntropyGauge.jsx';
import { EntropyBreakdown } from './components/EntropyBreakdown.jsx';
import { StrengthReason } from './components/StrengthReason.jsx';
import { PasswordHistory } from './components/PasswordHistory.jsx';
import { SecurityNotice } from './components/SecurityNotice.jsx';
import { Footer } from './components/Footer.jsx';
import { ShortcutsModal } from './components/ShortcutsModal.jsx';
import { OnboardingTour } from './components/OnboardingTour.jsx';
import { Toast } from './components/Toast.jsx';

import {
  generatePassword,
  generatePassphrase,
  validateGeneratorConfig,
  AMBIGUOUS_CHARS,
  generateSecureId,
  DEFAULT_PASSWORD_LENGTH,
  DEFAULT_PASSPHRASE_WORDS
} from './utils/passwordGenerator.js';

import {
  calculatePoolSize,
  evaluatePasswordStrength,
  evaluatePassphraseStrength
} from './utils/passwordStrength.js';

import { formatTimeHHMM } from './utils/format.js';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  // Mode Selection: 'characters' | 'passphrase'
  const [mode, setMode] = useState('characters');

  // Character Mode Settings
  const [length, setLength] = useState(DEFAULT_PASSWORD_LENGTH);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  });
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);

  // Passphrase Mode Settings
  const [wordCount, setWordCount] = useState(DEFAULT_PASSPHRASE_WORDS);
  const [separator, setSeparator] = useState('-');
  const [capitalize, setCapitalize] = useState(false);
  const [addNumber, setAddNumber] = useState(false);

  // Interactive UI States
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [explainMode, setExplainMode] = useState(false);

  // RAM-Only History State (Never stored in localStorage)
  const [history, setHistory] = useState([]);
  const historyBackupRef = useRef([]);

  // Modals & Tour States
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [onboarded, setOnboarded] = useLocalStoragePreference('securepass-onboarded', false);

  // Transient Toast Notification State
  const [toast, setToast] = useState(null);

  // Ambiguous character filter predicate
  const poolFilter = useMemo(() => {
    if (!excludeAmbiguous) return null;
    return (ch) => !AMBIGUOUS_CHARS.has(ch);
  }, [excludeAmbiguous]);

  // Live pool size calculation
  const poolSize = useMemo(() => {
    if (mode === 'passphrase') return 7776;
    return calculatePoolSize(options, poolFilter);
  }, [mode, options, poolFilter]);

  // Validation status
  const validation = useMemo(() => {
    if (mode === 'passphrase') return { isValid: true };
    return validateGeneratorConfig(length, options, poolFilter);
  }, [mode, length, options, poolFilter]);

  // Real-time strength evaluation
  const strengthData = useMemo(() => {
    if (mode === 'passphrase') {
      return evaluatePassphraseStrength(password, wordCount, { separator, capitalize, addNumber });
    }
    return evaluatePasswordStrength(password, length, options, poolFilter);
  }, [mode, password, wordCount, separator, capitalize, addNumber, length, options, poolFilter]);

  // Toast helper
  const showToast = useCallback((toastData) => {
    setToast(toastData);
    if (toastData.duration) {
      setTimeout(() => {
        setToast((current) => (current?.id === toastData.id ? null : current));
      }, toastData.duration);
    }
  }, []);

  // Clipboard auto-clear hook
  const { isCopied, countdown, copy, cancelAutoClear } = useClipboardAutoClear(showToast);

  // Core credential generator
  const handleGenerate = useCallback(
    (recordToHistory = true) => {
      let newCred = '';
      let credBits = 0;

      if (mode === 'passphrase') {
        newCred = generatePassphrase(wordCount, { separator, capitalize, addNumber });
        const evalRes = evaluatePassphraseStrength(newCred, wordCount, { separator, capitalize, addNumber });
        credBits = evalRes.entropyBits;
      } else {
        if (!validation.isValid) {
          setPassword('');
          return;
        }
        newCred = generatePassword(length, options, poolFilter);
        const evalRes = evaluatePasswordStrength(newCred, length, options, poolFilter);
        credBits = evalRes.entropyBits;
      }

      setPassword(newCred);

      // Record to RAM-only history (FIFO cap at 10 entries)
      if (recordToHistory) {
        const historyItem = {
          id: generateSecureId(),
          password: newCred,
          bits: credBits,
          timestamp: formatTimeHHMM(new Date()),
          settings: {
            mode,
            length,
            options: { ...options },
            excludeAmbiguous,
            wordCount,
            separator,
            capitalize,
            addNumber
          }
        };

        setHistory((prev) => [historyItem, ...prev.slice(0, 9)]);
      }
    },
    [mode, wordCount, separator, capitalize, addNumber, validation.isValid, length, options, poolFilter, excludeAmbiguous]
  );

  // Automatic generation when settings change
  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    handleGenerate(false);
  }, [handleGenerate]);

  // Panic Wipe: clears current screen credential, RAM history, and clipboard
  const handlePanicWipe = useCallback(async () => {
    setPassword('');
    setHistory([]);
    cancelAutoClear();
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText('');
      }
    } catch {
      // Ignored
    }
    showToast({
      id: 'panic-toast',
      type: 'warning',
      message: 'Emergency Wipe Complete',
      subtext: 'Screen, RAM history, and clipboard cleared with zero trace.',
      duration: 4000
    });
  }, [cancelAutoClear, showToast]);

  // History Clear All with 5-Second Undo Toast
  const handleClearHistory = () => {
    historyBackupRef.current = [...history];
    setHistory([]);
    showToast({
      id: 'clear-history-toast',
      type: 'info',
      message: 'Session history cleared',
      subtext: 'Undo available for 5 seconds',
      duration: 5000,
      undoAction: true
    });
  };

  const handleUndoClearHistory = () => {
    if (historyBackupRef.current.length > 0) {
      setHistory(historyBackupRef.current);
      historyBackupRef.current = [];
      showToast({
        id: 'undo-toast',
        type: 'success',
        message: 'History restored',
        duration: 2500
      });
    }
  };

  const handleDeleteHistoryEntry = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleRestoreSettings = (savedSettings) => {
    if (!savedSettings) return;
    setMode(savedSettings.mode);
    if (savedSettings.mode === 'passphrase') {
      setWordCount(savedSettings.wordCount);
      setSeparator(savedSettings.separator);
      setCapitalize(savedSettings.capitalize);
      setAddNumber(savedSettings.addNumber);
    } else {
      setLength(savedSettings.length);
      setOptions(savedSettings.options);
      setExcludeAmbiguous(savedSettings.excludeAmbiguous);
    }
    handleGenerate(true);
  };

  // 5-minute background tab idle wipe
  useIdleVisibilityWipe(() => {
    setHistory([]);
    showToast({
      id: 'idle-wipe-toast',
      type: 'info',
      message: 'Session RAM Wiped',
      subtext: 'History erased after 5 minutes of tab inactivity.',
      duration: 3500
    });
  });

  // Global Keyboard Shortcuts
  useKeyboardShortcuts({
    onRegenerate: () => handleGenerate(true),
    onCopy: () => copy(password),
    onToggleReveal: () => setIsVisible((prev) => !prev),
    onToggleTheme: toggleTheme,
    onToggleHistory: () => {
      const histEl = document.querySelector('.history-timeline-card');
      if (histEl) histEl.scrollIntoView({ behavior: 'smooth' });
    },
    onToggleCategory: (key) => {
      if (mode !== 'characters') return;
      const keyMap = { '1': 'uppercase', '2': 'lowercase', '3': 'numbers', '4': 'symbols' };
      const cat = keyMap[key];
      if (cat) {
        setOptions((prev) => ({ ...prev, [cat]: !prev[cat] }));
      }
    },
    onAdjustLength: (delta) => {
      if (mode === 'characters') {
        setLength((prev) => Math.max(4, Math.min(128, prev + delta)));
      } else {
        setWordCount((prev) => Math.max(4, Math.min(8, prev + delta)));
      }
    },
    onOpenShortcuts: () => setIsShortcutsOpen(true),
    onCloseModals: () => {
      setIsShortcutsOpen(false);
      setIsAboutOpen(false);
    },
    isModalOpen: isShortcutsOpen || isAboutOpen
  });

  return (
    <div className="command-center-container">
      {/* =========================================================================
          ZONE 1 — HERO COMMAND ZONE
          ========================================================================= */}
      <section className="zone-command-hero" aria-label="Zone 1: Hero Command Center">
        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          onOpenAbout={() => setIsAboutOpen(true)}
          onPanicWipe={handlePanicWipe}
          onShowToast={showToast}
        />

        <PasswordDisplay
          password={password}
          isVisible={isVisible}
          onToggleVisibility={() => setIsVisible(!isVisible)}
          onCopy={() => copy(password)}
          isCopied={isCopied}
          countdown={countdown}
          onRegenerate={() => handleGenerate(true)}
          strengthData={strengthData}
          mode={mode}
          explainMode={explainMode}
          onToggleExplainMode={() => setExplainMode(!explainMode)}
          disabled={!validation.isValid}
        />
      </section>

      {/* =========================================================================
          ZONE 2 — CONTROLS COMMAND ZONE
          ========================================================================= */}
      <main className="zone-command-controls" role="main" aria-label="Zone 2: Controls">
        <section className="command-card">
          <ModeSwitcher mode={mode} onSelectMode={setMode} />

          {mode === 'characters' ? (
            <>
              <LengthSelector
                length={length}
                onChange={setLength}
                entropyBits={strengthData.entropyBits}
                strengthLabel={strengthData.label}
                min={4}
                max={128}
              />

              <CharacterOptions
                options={options}
                onChange={setOptions}
                excludeAmbiguous={excludeAmbiguous}
                onToggleAmbiguous={setExcludeAmbiguous}
                isValid={validation.isValid}
              />

              <PoolPreview
                options={options}
                poolFilter={poolFilter}
                poolSize={poolSize}
              />
            </>
          ) : (
            <PassphraseOptions
              wordCount={wordCount}
              onWordCountChange={setWordCount}
              separator={separator}
              onSeparatorChange={setSeparator}
              capitalize={capitalize}
              onCapitalizeChange={setCapitalize}
              addNumber={addNumber}
              onAddNumberChange={setAddNumber}
              passphrasePreview={password}
              entropyBits={strengthData.entropyBits}
            />
          )}
        </section>
      </main>

      {/* =========================================================================
          ZONE 3 — INSIGHTS & ARCHITECTURE ZONE
          ========================================================================= */}
      <section className="zone-command-insights" aria-label="Zone 3: Cryptographic Insights">
        <div className="insights-gauge-grid">
          <EntropyGauge
            entropyBits={strengthData.entropyBits}
            label={strengthData.label}
            length={mode === 'passphrase' ? wordCount : length}
            poolSize={poolSize}
          />

          <EntropyBreakdown
            mode={mode}
            length={length}
            poolSize={poolSize}
            entropyBits={strengthData.entropyBits}
            wordCount={wordCount}
            options={{ addNumber }}
            strengthData={strengthData}
          />
        </div>

        <StrengthReason
          mode={mode}
          length={length}
          wordCount={wordCount}
          options={options}
          entropyBits={strengthData.entropyBits}
          excludeAmbiguous={excludeAmbiguous}
        />

        <PasswordHistory
          history={history}
          onClearHistory={handleClearHistory}
          onSelectPassword={(selected) => setPassword(selected)}
          onCopyPassword={(text) => copy(text)}
          onRestoreSettings={handleRestoreSettings}
          onDeleteEntry={handleDeleteHistoryEntry}
        />

        <SecurityNotice />

        <Footer />
      </section>

      {/* =========================================================================
          GLOBAL MODALS & TOAST NOTIFICATIONS
          ========================================================================= */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <OnboardingTour
        isOpen={!onboarded}
        onComplete={() => setOnboarded(true)}
      />

      <Toast
        toast={toast}
        onDismiss={() => setToast(null)}
        onUndo={handleUndoClearHistory}
      />
    </div>
  );
}
