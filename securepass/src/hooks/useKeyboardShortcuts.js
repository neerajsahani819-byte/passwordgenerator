import { useEffect } from 'react';

/**
 * Global keyboard shortcuts handler.
 * Ignores keystrokes when focus is inside text inputs or contenteditables.
 *
 * @param {object} actions
 */
export function useKeyboardShortcuts({
  onRegenerate,
  onCopy,
  onToggleReveal,
  onToggleTheme,
  onToggleHistory,
  onToggleCategory,
  onAdjustLength,
  onOpenShortcuts,
  onCloseModals,
  isModalOpen
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Always allow Escape to close open modals
      if (e.key === 'Escape') {
        if (onCloseModals) onCloseModals();
        return;
      }

      // Ignore standard hotkeys when typing in editable fields
      const target = e.target;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      if (isInput) return;

      // When a modal is open, suppress other global shortcuts
      if (isModalOpen && e.key !== 'Escape') return;

      switch (e.key) {
        case ' ': // Space: Regenerate
          e.preventDefault();
          if (onRegenerate) onRegenerate();
          break;

        case 'c':
        case 'C':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            if (onCopy) onCopy();
          }
          break;

        case 'r':
        case 'R':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            if (onToggleReveal) onToggleReveal();
          }
          break;

        case 't':
        case 'T':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            if (onToggleTheme) onToggleTheme();
          }
          break;

        case 'h':
        case 'H':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            if (onToggleHistory) onToggleHistory();
          }
          break;

        case '1':
        case '2':
        case '3':
        case '4':
          e.preventDefault();
          if (onToggleCategory) onToggleCategory(e.key);
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (onAdjustLength) onAdjustLength(1);
          break;

        case 'ArrowDown':
          e.preventDefault();
          if (onAdjustLength) onAdjustLength(-1);
          break;

        case '?':
        case 'F1':
          e.preventDefault();
          if (onOpenShortcuts) onOpenShortcuts();
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    onRegenerate,
    onCopy,
    onToggleReveal,
    onToggleTheme,
    onToggleHistory,
    onToggleCategory,
    onAdjustLength,
    onOpenShortcuts,
    onCloseModals,
    isModalOpen
  ]);
}
