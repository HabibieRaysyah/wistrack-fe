import { STATUS_CONFIG, STATUS_ORDER } from "../statusConfig";

export default function FilterBar({
  search,
  onSearchChange,
  activeStatus,
  onStatusChange,
}) {
  return (
    <div className="filter-bar">
      <input
        className="search-input"
        placeholder="Cari nama atau alamat tempat wisata..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <button
        className="status-filter-chip"
        data-active={activeStatus === null}
        onClick={() => onStatusChange(null)}
      >
        Semua
      </button>
      {STATUS_ORDER.map((key) => (
        <button
          key={key}
          className="status-filter-chip"
          data-active={activeStatus === key}
          onClick={() => onStatusChange(key)}
        >
          <span
            className="dot"
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: STATUS_CONFIG[key].dotColor,
              display: "inline-block",
            }}
          />
          {STATUS_CONFIG[key].label}
        </button>
      ))}
    </div>
  );
}
