import { useEffect, useState } from "react";
import { STATUS_CONFIG, STATUS_ORDER } from "../statusConfig";
import { api } from "../api";

export default function FilterBar({
  search,
  onSearchChange,
  activeStatus,
  onStatusChange,
  activeKota,
  onKotaChange,
}) {
  const [kotaList, setKotaList] = useState([]);

  useEffect(() => {
    api.getKotaList()
      .then(setKotaList)
      .catch(() => setKotaList([]));
  }, []);

  return (
    <div className="filter-bar">
      {/* Search */}
      <div className="search-wrapper">
        <svg
          className="search-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className="search-input"
          placeholder="Cari nama atau alamat tempat wisata..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {search && (
          <button
            className="search-clear-btn"
            onClick={() => onSearchChange("")}
            title="Bersihkan pencarian"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown filter kota */}
      <div className="kota-select-wrapper">
        <svg
          className="kota-select-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <select
          className="kota-select"
          value={activeKota || ""}
          onChange={(e) => onKotaChange(e.target.value || null)}
        >
          <option value="">Semua Kota</option>
          {kotaList.map((kota) => (
            <option key={kota} value={kota}>
              {kota}
            </option>
          ))}
        </select>
        {activeKota && (
          <button
            className="kota-clear-btn"
            onClick={() => onKotaChange(null)}
            title="Hapus filter kota"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Filter chips status */}
      <div className="filter-chips">
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
              style={{ background: STATUS_CONFIG[key].dotColor }}
            />
            {STATUS_CONFIG[key].label}
          </button>
        ))}
      </div>
    </div>
  );
}
