export function CupIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M9 2c-.6 1-.6 1.6 0 2.4M12 2c-.6 1-.6 1.6 0 2.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M5 9h12.5a2 2 0 0 1 2 2.2l-.35 3.1A6 6 0 0 1 13.2 20H9.8a6 6 0 0 1-5.96-5.7L3.3 11a2 2 0 0 1 1.7-2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 10.5h1.3a2.3 2.3 0 0 1 0 4.6h-1.7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
