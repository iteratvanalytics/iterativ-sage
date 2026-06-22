import React from "react";

interface Props {
  className?: string;
  size?: number;
}

export const SageLogo: React.FC<Props> = ({ className = "", size = 40 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Outer circle */}
    <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    {/* Inner leaf / S form */}
    <path
      d="M20 8
         C12 8, 8 14, 8 18
         C8 24, 14 26, 20 26
         C26 26, 28 22, 28 20
         C28 16, 24 14, 20 14
         C16 14, 14 16, 14 18
         C14 20, 16 22, 20 22
         C22 22, 24 21, 24 20"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Dot at the bottom tip */}
    <circle cx="20" cy="32" r="2.5" fill="currentColor" opacity="0.85" />
  </svg>
);

export default SageLogo;
