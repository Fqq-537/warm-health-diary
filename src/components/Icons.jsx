const paths = {
  home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></>,
  scale: <><path d="M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z"/><path d="M8 9a5 5 0 0 1 8 0l-2 3h-4L8 9Z"/></>,
  utensils: <><path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M16 3v18M16 3c3 2 4 5 4 8h-4"/></>,
  dumbbell: <><path d="M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12M1 12h2M21 12h2"/></>,
  flower: <><path d="M12 8c-5-6-10 0-5 3-6 5 0 10 5 5 5 5 11 0 5-5 5-3 0-9-5-3Z"/><circle cx="12" cy="12" r="2"/></>,
  database: <><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  download: <><path d="M12 3v12m-5-5 5 5 5-5M4 20h16"/></>,
  upload: <><path d="M12 16V4m-5 5 5-5 5 5M4 20h16"/></>,
  trash: <><path d="M4 7h16M9 3h6l1 4H8l1-4ZM6 7l1 14h10l1-14M10 11v6M14 11v6"/></>,
  refresh: <><path d="M20 7v5h-5M4 17v-5h5"/><path d="M6.1 8A7 7 0 0 1 18 6l2 6M4 12l2 6a7 7 0 0 0 11.9-2"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  flame: <path d="M12 22c4 0 7-3 7-7 0-5-4-7-3-12-4 2-5 5-4 8-2-1-3-3-3-5-3 3-4 6-4 9 0 4 3 7 7 7Z"/>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></>,
  left: <path d="m15 18-6-6 6-6"/>,
  right: <path d="m9 18 6-6-6-6"/>,
  sparkles: <><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3ZM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/></>,
  arrow: <><path d="M5 12h14m-5-5 5 5-5 5"/></>,
  edit: <><path d="m14 5 5 5M4 20l3.5-.7L20 6.8 17.2 4 4.7 16.5 4 20Z"/></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></>,
}

export function Icon({ name, size = 20, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name] || paths.sparkles}
    </svg>
  )
}
