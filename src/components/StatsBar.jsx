import { STATUS_CONFIG, STATUS_ORDER } from "../statusConfig";

export default function StatsBar({ stats }) {
  if (!stats) return null;

  return (
    <div className="stats-bar">
      <div className="stat-cell is-total">
        <div className="num">{stats.total}</div>
        <div className="label">Total tempat wisata</div>
      </div>
      {STATUS_ORDER.map((key) => (
        <div className="stat-cell" key={key}>
          <div className="num">{stats[key] ?? 0}</div>
          <div className="label">
            <span
              className="dot"
              style={{ background: STATUS_CONFIG[key].dotColor }}
            />
            {STATUS_CONFIG[key].label}
          </div>
        </div>
      ))}
    </div>
  );
}
