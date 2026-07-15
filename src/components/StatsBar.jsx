import { STATUS_CONFIG, STATUS_ORDER } from "../statusConfig";

const ICONS = {
  total: (
    <svg className="stat-icon total-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  ),
  belum_dihubungi: (
    <svg className="stat-icon belum-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  dihubungi: (
    <svg className="stat-icon dihubungi-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  deal: (
    <svg className="stat-icon deal-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  ditolak: (
    <svg className="stat-icon ditolak-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
};

export default function StatsBar({ stats }) {
  if (!stats) return null;

  return (
    <div className="stats-grid">
      <div className="stat-card is-total">
        <div className="stat-card-header">
          <span className="stat-label">Total Tempat Wisata</span>
          <div className="stat-icon-wrapper">{ICONS.total}</div>
        </div>
        <div className="stat-num">{stats.total}</div>
      </div>
      {STATUS_ORDER.map((key) => (
        <div className={`stat-card is-${key}`} key={key}>
          <div className="stat-card-header">
            <span className="stat-label">
              <span
                className="dot"
                style={{ background: STATUS_CONFIG[key].dotColor }}
              />
              {STATUS_CONFIG[key].label}
            </span>
            <div className="stat-icon-wrapper" style={{ color: STATUS_CONFIG[key].dotColor }}>
              {ICONS[key]}
            </div>
          </div>
          <div className="stat-num">{stats[key] ?? 0}</div>
        </div>
      ))}
    </div>
  );
}

