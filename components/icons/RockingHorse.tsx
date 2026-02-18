// components/icons/RockingHorse.tsx
export const RockingHorse = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* 말 머리 & 몸통 */}
    <path d="M15.5 5.5c-1.5-1.5-3.5-1-4.5 0-.5.5-1 1.5-1 1.5L7 8l2 2" />
    <path d="M18 7c1 1 2 2 2 4v4h-6l-2-2H9" />

    {/* 다리 */}
    <path d="M11 15l-1 3" />
    <path d="M17 15l1 3" />

    {/* 흔들 받침대 (Rockers) */}
    <path d="M5 19c2 2.5 8 3.5 14 0" />

    {/* 안장 & 눈 */}
    <circle cx="15" cy="8" r="0.5" fill="currentColor" />
    <path d="M13 11h3" />
  </svg>
);
