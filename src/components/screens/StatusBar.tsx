export default function StatusBar({ dark = false }: { dark?: boolean }) {
  const color = dark ? "#ffffff" : "#2f2440";
  return (
    <div
      className="flex items-center justify-between px-7 pt-3 text-[13px] font-semibold"
      style={{ color }}
    >
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          <path d="M1 9.5L4 5.5L7 8L10 3L13 6.5L16.5 1" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0" />
          <rect x="0.5" y="7" width="2" height="4" rx="0.5" fill={color} />
          <rect x="4" y="5" width="2" height="6" rx="0.5" fill={color} />
          <rect x="7.5" y="3" width="2" height="8" rx="0.5" fill={color} />
          <rect x="11" y="0.5" width="2" height="10.5" rx="0.5" fill={color} />
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
          <path
            d="M7.5 10C8.3 10 9 9.3 9 8.5C9 7.7 8.3 7 7.5 7C6.7 7 6 7.7 6 8.5C6 9.3 6.7 10 7.5 10Z"
            fill={color}
          />
          <path
            d="M4 6.2C5 5.3 6.2 4.8 7.5 4.8C8.8 4.8 10 5.3 11 6.2"
            stroke={color}
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path
            d="M1.3 3.4C3 1.9 5.1 1 7.5 1C9.9 1 12 1.9 13.7 3.4"
            stroke={color}
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
          <rect x="0.5" y="0.5" width="20" height="11" rx="2.5" stroke={color} strokeOpacity="0.6" />
          <rect x="2" y="2" width="16" height="8" rx="1.3" fill={color} />
          <rect x="21.5" y="4" width="1.6" height="4" rx="0.8" fill={color} opacity="0.6" />
        </svg>
      </div>
    </div>
  );
}
