export default function AudioIcon({
  silent,
  width,
  height,
  phase,
  className,
}: {
  silent?: boolean;
  width?: number;
  height?: number;
  phase?: 'stoody' | 'shortBreak' | 'longBreak' | 'transition';
  className?: string;
}) {
  const strokeRef = phase ? `url(#${phase}Gradient)` : 'currentColor';

  if (silent) {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        stroke={strokeRef}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10.268 21a2 2 0 0 0 3.464 0" />
        <path d="M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742" />
        <path d="m2 2 20 20" />
        <path d="M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05" />
      </svg>
    );
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke={strokeRef}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.268 21a2 2 0 0 0 3.464 0" />
      <path d="M22 8c0-2.3-.8-4.3-2-6" />
      <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
      <path d="M4 2C2.8 3.7 2 5.7 2 8" />
    </svg>
  );
}
