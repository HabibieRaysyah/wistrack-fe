import { useState } from "react";
import { api } from "../api";

export default function Sidebar({
  onAddClick,
  onImportClick,
  onLogout,
  username,
  activeStatus,
  search,
}) {
  const [exporting, setExporting] = useState(false);

  function handleExport(format) {
    setExporting(true);
    try {
      api.exportWisata({ status: activeStatus || undefined, q: search || undefined, format });
    } finally {
      // Timeout singkat biar UI feedback keliatan
      setTimeout(() => setExporting(false), 1200);
    }
  }

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
            <line x1="9" y1="3" x2="9" y2="18" />
            <line x1="15" y1="6" x2="15" y2="21" />
          </svg>
        </div>
        <div>
          <p className="sidebar-brand-name">Wistrack</p>
          <p className="sidebar-brand-sub">Tracker Kemitraan</p>
        </div>
      </div>

      <div className="sidebar-divider" />

      <p className="sidebar-section-label">Menu</p>

      <nav className="sidebar-nav">
        <div className="sidebar-nav-item sidebar-nav-item--active">
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          Dashboard
        </div>
      </nav>

      <div className="sidebar-divider" />

      <p className="sidebar-section-label">Aksi</p>

      <div className="sidebar-actions">
        {/* Tambah */}
        <button className="sidebar-btn sidebar-btn--primary" onClick={onAddClick}>
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tambah Wisata
        </button>

        {/* Import */}
        <button className="sidebar-btn sidebar-btn--secondary" onClick={onImportClick}>
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Import XLSX
        </button>

        {/* Export */}
        <div className="sidebar-export-group">
          <p className="sidebar-export-label">
            Export
            {(activeStatus || search) && (
              <span className="sidebar-export-badge">filtered</span>
            )}
          </p>
          <div className="sidebar-export-btns">
            <button
              className="sidebar-btn sidebar-btn--secondary sidebar-btn--half"
              onClick={() => handleExport("xlsx")}
              disabled={exporting}
              title="Export ke Excel (.xlsx)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {exporting ? "..." : "XLSX"}
            </button>
            <button
              className="sidebar-btn sidebar-btn--secondary sidebar-btn--half"
              onClick={() => handleExport("csv")}
              disabled={exporting}
              title="Export ke CSV"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {exporting ? "..." : "CSV"}
            </button>
          </div>
        </div>
      </div>

      <div className="sidebar-spacer" />
      <div className="sidebar-divider" />

      {/* User + logout */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {(username || "A").charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">{username || "Admin"}</p>
            <p className="sidebar-user-role">Administrator</p>
          </div>
        </div>
        <button className="sidebar-logout-btn" onClick={onLogout} title="Logout">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
