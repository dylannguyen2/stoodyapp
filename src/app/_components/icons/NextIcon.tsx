export default function NextIcon({width = 24, height = 24}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      className="lucide lucide-arrow-big-left-icon lucide-arrow-big-left"
      aria-hidden
      focusable="false"
    >
      {/* filled left arrow */}
      <path
        d="M19 12l-7 7v-4H5v-6h7V5l7 7z"
        fill="currentColor"
      />
    </svg>
  );
}
