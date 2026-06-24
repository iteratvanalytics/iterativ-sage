import React from "react";

interface Props {
  className?: string;
  size?: number;
  animated?: boolean;
}

/**
 * Sage four-petal orb mark — green / amber / red / blue swooshes
 * arranged around a luminous core. Color is intrinsic, not currentColor.
 */
export const SageLogo: React.FC<Props> = ({ className = "", size = 40, animated = false }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${animated ? "sage-spin" : ""}`}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="sage-grad-blue" x1="10" y1="20" x2="50" y2="60">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
      <linearGradient id="sage-grad-green" x1="40" y1="10" x2="80" y2="50">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <linearGradient id="sage-grad-yellow" x1="50" y1="40" x2="90" y2="80">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
      <linearGradient id="sage-grad-red" x1="20" y1="50" x2="60" y2="90">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#b91c1c" />
      </linearGradient>
      <radialGradient id="sage-core-glow" cx="50" cy="50" r="50">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="transparent" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#sage-core-glow)" opacity="0.18" />
    <path d="M 20 50 A 30 30 0 0 1 50 20 A 40 40 0 0 0 10 60 Z" fill="url(#sage-grad-blue)" />
    <path d="M 50 20 A 30 30 0 0 1 80 50 A 40 40 0 0 0 40 10 Z" fill="url(#sage-grad-green)" />
    <path d="M 80 50 A 30 30 0 0 1 50 80 A 40 40 0 0 0 90 40 Z" fill="url(#sage-grad-yellow)" />
    <path d="M 50 80 A 30 30 0 0 1 20 50 A 40 40 0 0 0 60 90 Z" fill="url(#sage-grad-red)" />
  </svg>
);

export default SageLogo;
