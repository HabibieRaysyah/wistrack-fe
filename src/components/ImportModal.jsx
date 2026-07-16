import { useState, useRef } from "react";
import { api } from "../api";

const ACCEPTED = ".xlsx,.xls,.csv";

const TEMPLATE_HEADERS = [
  "nama", "alamat", "telp", "telp_wa", "website", "url_maps", "rating", "catatan", "status",
];

export default function ImportModal({ onClose, onImported }) {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null); // { imported: n } or { error: msg }
  const inputRef = useRef(null);

  function pickFile(f) {
    if (!f) return;
    const ext = f.name.split(".").pop().toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(ext)) {
      setResult({ error: "Format tidak didukung. Gunakan file .xlsx, .xls, atau .csv." });
      return;
    }
    setFile(f);
    setResult(null);
  }

  function onDragOver(e) {
    e.preventDefault();
    setDragging(true);
  }
  function onDragLeave() {
    setDragging(false);
  }
  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    pickFile(e.dataTransfer.files[0]);
  }

  async function handleSubmit() {
    if (!file) return;
    setImporting(true);
    setResult(null);
    try {
      const data = await api.importWisata(file);
      setResult({ imported: data.imported });
      onImported(); // refresh tabel & stats
    } catch (err) {
      setResult({ error: err.message || "Gagal mengimport file." });
    } finally {
      setImporting(false);
    }
  }

  function handleDownloadTemplate() {
    // Buat CSV template sederhana untuk diunduh
    const csv = TEMPLATE_HEADERS.join(",") + "\n"
      + "Curug Cimahi,Jl. Contoh No.1 Bandung,022123456,628123456789,https://contoh.com,https://maps.google.com/,4.5,Catatan opsional,belum_dihubungi";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template_import_wisata.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const isDone = result && result.imported !== undefined;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card import-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2>Import Data Wisata</h2>
            <p className="modal-sub">
              Upload file Excel (.xlsx / .xls) atau CSV. Baris pertama harus berisi header kolom.
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Tutup">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Kolom yang didukung */}
        <div className="import-columns-info">
          <p className="import-columns-label">Kolom yang dikenali:</p>
          <div className="import-columns-list">
            {TEMPLATE_HEADERS.map((h) => (
              <span key={h} className={`import-col-tag ${h === "nama" ? "import-col-tag--required" : ""}`}>
                {h}{h === "nama" ? "*" : ""}
              </span>
            ))}
          </div>
          <p className="import-columns-note">
            * wajib ada. Kolom lain opsional. Status yang tidak diisi otomatis jadi <strong>belum_dihubungi</strong>.
          </p>
        </div>

        {/* Drop zone */}
        {!isDone && (
          <div
            className={`import-dropzone ${dragging ? "import-dropzone--drag" : ""} ${file ? "import-dropzone--has-file" : ""}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => !file && inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED}
              style={{ display: "none" }}
              onChange={(e) => pickFile(e.target.files[0])}
            />
            {file ? (
              <div className="import-file-chosen">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="import-file-icon">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <div>
                  <p className="import-file-name">{file.name}</p>
                  <p className="import-file-size">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  className="import-file-remove"
                  onClick={(e) => { e.stopPropagation(); setFile(null); setResult(null); }}
                  title="Ganti file"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="import-dropzone-empty">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="import-drop-icon">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p className="import-drop-title">Drag & drop file di sini</p>
                <p className="import-drop-sub">atau <span className="import-drop-link">klik untuk pilih file</span></p>
                <p className="import-drop-formats">XLSX · XLS · CSV · maks 10 MB</p>
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {result?.error && (
          <div className="import-result import-result--error">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{result.error}</span>
          </div>
        )}

        {/* Success */}
        {isDone && (
          <div className="import-success-block">
            <div className="import-success-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className="import-success-title">Import Berhasil!</h3>
            <p className="import-success-desc">
              <strong>{result.imported}</strong> tempat wisata berhasil ditambahkan ke database.
            </p>
            <button className="btn-primary" onClick={onClose}>
              Tutup
            </button>
          </div>
        )}

        {/* Actions */}
        {!isDone && (
          <div className="modal-actions">
            <button className="btn-template" onClick={handleDownloadTemplate} type="button">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Template
            </button>
            <div style={{ flex: 1 }} />
            <button className="btn-secondary" onClick={onClose} type="button">Batal</button>
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={!file || importing}
              type="button"
            >
              {importing ? (
                <><div className="login-spinner" style={{ borderColor: "rgba(255,255,255,.35)", borderTopColor: "#fff" }} />Mengimport...</>
              ) : "Import Sekarang"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
