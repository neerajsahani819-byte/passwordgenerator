import { useEffect, useRef } from 'react';

const FIVE_MINUTES_MS = 5 * 60 * 1000;

/**
 * Monitors page visibility. If the user leaves the tab hidden for more than 5 minutes,
 * automatically purges transient RAM history for security.
 *
 * @param {Function} onWipe - Callback to purge RAM history
 */
export function useIdleVisibilityWipe(onWipe) {
  const hiddenTimeRef = useRef(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        hiddenTimeRef.current = Date.now();
      } else {
        if (hiddenTimeRef.current) {
          const elapsed = Date.now() - hiddenTimeRef.current;
          if (elapsed >= FIVE_MINUTES_MS) {
            if (onWipe) onWipe();
          }
        }
        hiddenTimeRef.current = null;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [onWipe]);
}
