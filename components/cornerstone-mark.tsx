export function CornerstoneMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="6"
        y="38"
        width="16"
        height="18"
        rx="3"
        fill="currentColor"
        opacity=".6"
      />
      <rect
        x="24"
        y="23"
        width="16"
        height="33"
        rx="3"
        fill="currentColor"
        opacity=".8"
      />
      <rect x="42" y="8" width="16" height="48" rx="3" fill="currentColor" />
      <path
        d="M6 61H58"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
