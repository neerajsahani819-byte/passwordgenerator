import React, { useEffect, useRef } from 'react';
import { Keyboard, X } from 'lucide-react';

const SHORTCUTS_LIST = [
  { key: 'Space', desc: 'Regenerate password / passphrase' },
  { key: 'C', desc: 'Copy current credential to clipboard' },
  { key: 'R', desc: 'Toggle password mask / reveal' },
  { key: 'T', desc: 'Toggle light & dark theme' },
  { key: 'H', desc: 'Toggle session history timeline' },
  { key: '1 – 4', desc: 'Toggle character categories (Characters mode)' },
  { key: '↑ / ↓', desc: 'Increase / decrease length by 1' },
  { key: '? or F1', desc: 'Open this keyboard shortcuts guide' },
  { key: 'Esc', desc: 'Close any active modal or dialog' }
];

/**
 * ShortcutsModal Component
 * Accessible keyboard navigation cheat sheet modal.
 */
export function ShortcutsModal({ isOpen, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-container shortcuts-modal-container"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <Keyboard size={20} className="modal-icon-primary" aria-hidden="true" />
            <h2 id="shortcuts-modal-title" className="modal-title">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close shortcuts modal"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="shortcuts-table-wrapper">
          <table className="shortcuts-table">
            <thead>
              <tr>
                <th scope="col">Key</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {SHORTCUTS_LIST.map((item) => (
                <tr key={item.key}>
                  <td>
                    <kbd className="shortcut-kbd">{item.key}</kbd>
                  </td>
                  <td>{item.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="modal-footer">
          <span className="shortcuts-tip">
            Press <kbd className="shortcut-kbd">Esc</kbd> anytime to return to the generator.
          </span>
          <button type="button" className="btn-primary" onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
