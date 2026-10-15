import React, { useState } from 'react';
import { ShieldCheck, Sliders, Lock, ArrowRight, Check, X } from 'lucide-react';

const TOUR_STEPS = [
  {
    icon: ShieldCheck,
    title: '100% Client-Side Cryptography',
    description:
      'Your password is generated locally using the browser’s Web Crypto API — nothing ever leaves your device.'
  },
  {
    icon: Sliders,
    title: 'Live Entropy Feedback',
    description:
      'Adjust length, character pools, or switch to Diceware passphrases. Shannon information entropy updates live.'
  },
  {
    icon: Lock,
    title: 'Zero-Persistence Privacy',
    description:
      'Copy your credentials directly into your password manager. Session history lives strictly in volatile RAM.'
  }
];

/**
 * OnboardingTour Component
 * Interactive 3-step walkthrough for first-time visitors.
 */
export function OnboardingTour({ isOpen, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];
  const IconComponent = step.icon;
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div className="modal-backdrop tour-backdrop" role="presentation">
      <div
        className="tour-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-step-title"
      >
        <button
          type="button"
          className="tour-skip-btn"
          onClick={onComplete}
          aria-label="Skip onboarding tour"
        >
          <X size={16} aria-hidden="true" />
          <span>Skip</span>
        </button>

        <div className="tour-badge-wrapper">
          <div className="tour-icon-circle">
            <IconComponent size={24} className="tour-icon" aria-hidden="true" />
          </div>
          <span className="tour-step-indicator">
            Step {currentStep + 1} of {TOUR_STEPS.length}
          </span>
        </div>

        <h3 id="tour-step-title" className="tour-title">
          {step.title}
        </h3>
        <p className="tour-description">{step.description}</p>

        {/* Step dots */}
        <div className="tour-dots-row" aria-hidden="true">
          {TOUR_STEPS.map((_, idx) => (
            <span
              key={idx}
              className={`tour-dot ${idx === currentStep ? 'tour-dot-active' : ''}`}
            />
          ))}
        </div>

        <div className="tour-actions">
          {currentStep > 0 && (
            <button
              type="button"
              className="btn-secondary tour-btn-back"
              onClick={() => setCurrentStep((prev) => prev - 1)}
            >
              Back
            </button>
          )}
          <button
            type="button"
            className="btn-primary tour-btn-next"
            onClick={handleNext}
          >
            <span>{isLastStep ? 'Get Started' : 'Next'}</span>
            {isLastStep ? <Check size={16} /> : <ArrowRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
