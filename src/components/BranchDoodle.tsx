export function BranchDoodle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 220" fill="none" className={className} aria-hidden="true">
      <path
        d="M20 200 Q40 140 70 110 Q100 80 90 30"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M70 110 Q55 95 60 75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* leaves */}
      <path
        d="M90 30c-14 2-24 14-24 28 14-2 24-14 24-28z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M90 30c14 2 24 14 24 28-14-2-24-14-24-28z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M60 75c-13 3-21 15-19 29 13-4 21-16 19-29z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M60 75c13 1 23 11 24 25-13 0-23-11-24-25z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M70 110c-13 4-20 17-17 30 13-5 20-18 17-30z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* coffee cherries */}
      <circle cx="34" cy="150" r="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="45" cy="160" r="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="26" cy="163" r="5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
