/**
 * ==============================================================================
 * SecurePass — Secure Clipboard Utility
 * Copies passwords without console leakage, provides legacy fallback, and clears clipboard.
 * ==============================================================================
 */

/**
 * Copies a string to the clipboard safely.
 *
 * Tries the modern asynchronous Clipboard API (`navigator.clipboard.writeText`) first.
 * If that fails, falls back to a hidden `<textarea>` with `document.execCommand('copy')`.
 *
 * Under NO circumstances is the password logged to the console.
 *
 * @param {string} text - The password or text to copy.
 * @returns {Promise<{ success: boolean, message?: string }>}
 */
export async function copyToClipboard(text) {
  if (!text) {
    return { success: false, message: 'No credential available to copy.' };
  }

  // 1. Try modern navigator.clipboard API
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true };
    } catch {
      // Fall through to legacy mechanism
    }
  }

  // 2. Legacy fallback using transient hidden textarea
  if (typeof document !== 'undefined') {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.top = '-9999px';
      textArea.style.left = '-9999px';
      textArea.style.opacity = '0';
      textArea.setAttribute('readonly', '');

      document.body.appendChild(textArea);
      textArea.select();
      textArea.setSelectionRange(0, 99999);

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        return { success: true };
      }
    } catch {
      // Failed
    }
  }

  return {
    success: false,
    message: 'Unable to copy automatically. Please copy manually.'
  };
}

/**
 * Safely clears the system clipboard (auto-clear security feature).
 * @returns {Promise<boolean>}
 */
export async function clearClipboard() {
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText('');
      return true;
    } catch {
      // Ignore errors if window lost focus
    }
  }

  if (typeof document !== 'undefined') {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = '';
      textArea.style.position = 'fixed';
      textArea.style.top = '-9999px';
      textArea.style.left = '-9999px';
      textArea.style.opacity = '0';
      textArea.setAttribute('readonly', '');

      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    } catch {
      return false;
    }
  }

  return false;
}
