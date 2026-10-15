import { useState, useEffect, useRef, useCallback } from 'react';
import { copyToClipboard, clearClipboard } from '../utils/clipboard.js';

const AUTO_CLEAR_SECONDS = 30;

/**
 * Hook to handle copying credentials and managing a 30-second auto-clear timer.
 * @returns {object}
 */
export function useClipboardAutoClear(onShowToast) {
  const [isCopied, setIsCopied] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef(null);
  const intervalRef = useRef(null);

  const cancelTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCountdown(0);
  }, []);

  const copy = useCallback(
    async (text) => {
      cancelTimer();
      const result = await copyToClipboard(text);

      if (result.success) {
        setIsCopied(true);
        setCountdown(AUTO_CLEAR_SECONDS);

        if (onShowToast) {
          onShowToast({
            id: 'copy-toast',
            type: 'copy',
            message: 'Copied to clipboard',
            subtext: `Clipboard will auto-clear in ${AUTO_CLEAR_SECONDS}s`,
            duration: AUTO_CLEAR_SECONDS * 1000
          });
        }

        // Ticker for countdown
        intervalRef.current = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(intervalRef.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        // Auto-clear trigger after 30s
        timerRef.current = setTimeout(async () => {
          await clearClipboard();
          setIsCopied(false);
          setCountdown(0);
          if (onShowToast) {
            onShowToast({
              id: 'cleared-toast',
              type: 'info',
              message: 'Clipboard cleared',
              subtext: 'Auto-clear wiped credentials for your privacy',
              duration: 3500
            });
          }
        }, AUTO_CLEAR_SECONDS * 1000);

        // Reset visual checkmark after 2.5s
        setTimeout(() => {
          setIsCopied(false);
        }, 2500);
      }

      return result;
    },
    [cancelTimer, onShowToast]
  );

  useEffect(() => {
    return () => cancelTimer();
  }, [cancelTimer]);

  return {
    isCopied,
    countdown,
    copy,
    cancelAutoClear: cancelTimer
  };
}
