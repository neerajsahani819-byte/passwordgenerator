import React, { useState } from 'react';
import { Flame } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

/**
 * PanicButton Component
 * Instant zero-trace memory wipe trigger for privacy emergencies.
 */
export function PanicButton({ onPanicWipe }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirm = () => {
    setShowConfirm(false);
    onPanicWipe();
  };

  return (
    <>
      <button
        type="button"
        className="panic-btn"
        onClick={() => setShowConfirm(true)}
        aria-label="Panic Button: Emergency wipe of all credentials from memory"
        title="Emergency RAM Wipe"
      >
        <Flame size={18} className="panic-icon" aria-hidden="true" />
        <span className="panic-text">Panic</span>
      </button>

      <ConfirmModal
        isOpen={showConfirm}
        title="Emergency Credential Wipe"
        message="This will immediately purge the current password from the screen, wipe all session history from RAM, and clear the system clipboard. Are you sure?"
        confirmText="Wipe Everything"
        cancelText="Cancel"
        danger={true}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
