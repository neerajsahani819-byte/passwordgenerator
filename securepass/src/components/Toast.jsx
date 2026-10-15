import React from 'react';
import { Check, Info, AlertTriangle, RotateCcw, X } from 'lucide-react';

/**
 * Toast Component
 * Displays transient notifications with optional countdown and Undo actions.
 */
export function Toast({ toast, onDismiss, onUndo }) {
  if (!toast) return null;

  const { type = 'info', message, subtext, undoAction } = toast;

  return (
    <div className={`toast-container toast-${type}`} role="status" aria-live="polite">
      <div className="toast-icon-wrapper">
        {type === 'copy' || type === 'success' ? (
          <Check size={18} className="toast-icon-success" aria-hidden="true" />
        ) : type === 'warning' || type === 'danger' ? (
          <AlertTriangle size={18} className="toast-icon-warning" aria-hidden="true" />
        ) : (
          <Info size={18} className="toast-icon-info" aria-hidden="true" />
        )}
      </div>

      <div className="toast-content">
        <strong className="toast-message">{message}</strong>
        {subtext && <span className="toast-subtext">{subtext}</span>}
      </div>

      {undoAction && (
        <button
          type="button"
          className="toast-undo-btn"
          onClick={() => {
            if (onUndo) onUndo();
            if (onDismiss) onDismiss();
          }}
          aria-label="Undo action"
        >
          <RotateCcw size={14} aria-hidden="true" />
          <span>Undo</span>
        </button>
      )}

      <button
        type="button"
        className="toast-close-btn"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
