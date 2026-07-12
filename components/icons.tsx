export function WaterGlassIcon({ filled = false, checked = false }: { filled?: boolean; checked?: boolean }) {
  return (
    <svg viewBox="0 0 96 128" aria-hidden="true" className="h-full w-full">
      <path
        d="M19 8h58l-8 104a10 10 0 0 1-10 9H37a10 10 0 0 1-10-9L19 8Z"
        fill="rgba(247,252,255,.76)"
        stroke="#0759A8"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d={filled ? "M29 64c9-6 16 4 25-2 7-4 12-6 20-1l-4 50a10 10 0 0 1-10 9H37a10 10 0 0 1-10-9l-4-45c2 0 4-1 6-2Z" : "M28 108h40"}
        fill={filled ? "#0A96F0" : "none"}
        stroke={filled ? "#45BDF5" : "#8FD8F7"}
        strokeWidth="4"
      />
      {checked ? (
        <path
          d="m37 70 9 10 17-23"
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
        />
      ) : null}
    </svg>
  );
}
