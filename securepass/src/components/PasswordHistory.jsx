import React, { useState } from 'react';
import { History, Trash2, Copy, Check, Eye, EyeOff, RefreshCw, X, ShieldAlert } from 'lucide-react';

/**
 * PasswordHistory Timeline Component (Zone 3)
 * Transient RAM-only timeline (FIFO cap 10) with individual reveal, copy, settings restore, and delete.
 */
export function PasswordHistory({
  history,
  onClearHistory,
  onSelectPassword,
  onCopyPassword,
  onRestoreSettings,
  onDeleteEntry
}) {
  const [revealedIds, setRevealedIds] = useState(new Set());
  const [copiedId, setCopiedId] = useState(null);

  const toggleReveal = (id, e) => {
    e.stopPropagation();
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCopy = (item, e) => {
    e.stopPropagation();
    onCopyPassword(item.password);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="insight-card history-timeline-card" aria-label="Session Password History">
      <div className="insight-header">
        <div className="history-title-flex">
          <History size={17} className="insight-icon" aria-hidden="true" />
          <h3 className="insight-title">Session History Timeline</h3>
          <span className="history-badge-ram">RAM Only</span>
        </div>
        {history.length > 0 && (
          <button
            type="button"
            className="history-clear-all-btn"
            onClick={onClearHistory}
            title="Clear all session history (Undo available for 5s)"
          >
            <Trash2 size={13} aria-hidden="true" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="history-privacy-notice-strip">
        <ShieldAlert size={14} className="notice-icon" aria-hidden="true" />
        <span>Stored exclusively in temporary RAM. Automatically erased on tab close or after 5m idle.</span>
      </div>

      {history.length === 0 ? (
        <div className="history-empty-placeholder" role="status">
          <span>No passwords generated yet in this session.</span>
        </div>
      ) : (
        <ul className="history-timeline-list" role="list">
          {history.map((item) => {
            const isRevealed = revealedIds.has(item.id);
            const isCopied = copiedId === item.id;

            return (
              <li key={item.id} className="history-timeline-item">
                <div
                  className="history-item-body"
                  onClick={() => onSelectPassword(item.password)}
                  title="Click to restore this password to the hero card"
                >
                  <div className="history-item-top">
                    <span className="history-item-code">
                      {isRevealed ? item.password : '•'.repeat(Math.min(item.password.length, 24))}
                    </span>
                    <span className="history-item-bits">{item.bits} bits</span>
                  </div>

                  <div className="history-item-meta-row">
                    <span className="history-item-time">{item.timestamp}</span>
                    <span className="history-item-type">
                      {item.settings?.mode === 'passphrase' ? 'Passphrase' : `${item.password.length} chars`}
                    </span>
                  </div>
                </div>

                <div className="history-item-actions-row">
                  <button
                    type="button"
                    className="history-action-small"
                    onClick={(e) => toggleReveal(item.id, e)}
                    aria-label={isRevealed ? 'Mask password' : 'Show password'}
                    title={isRevealed ? 'Mask' : 'Reveal'}
                  >
                    {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>

                  <button
                    type="button"
                    className={`history-action-small ${isCopied ? 'history-action-copied' : ''}`}
                    onClick={(e) => handleCopy(item, e)}
                    aria-label="Copy credential"
                    title="Copy"
                  >
                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                  </button>

                  {item.settings && onRestoreSettings && (
                    <button
                      type="button"
                      className="history-action-small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRestoreSettings(item.settings);
                      }}
                      aria-label="Regenerate with same settings"
                      title="Apply settings & regenerate"
                    >
                      <RefreshCw size={14} />
                    </button>
                  )}

                  {onDeleteEntry && (
                    <button
                      type="button"
                      className="history-action-small history-action-del"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteEntry(item.id);
                      }}
                      aria-label="Delete entry"
                      title="Delete from history"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
