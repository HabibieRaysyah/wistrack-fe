import { useState } from "react";

export default function EditWisataModal({ item, onClose, onSave }) {
  const [form, setForm] = useState({
    nama: item.nama || "",
    alamat: item.alamat || "",
    telp_wa: item.telp_wa || item.telp || "",
    website: item.website || "",
    url_maps: item.url_maps || "",
    rating: item.rating != null ? String(item.rating) : "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nama.trim()) {
      setError("Nama tempat wisata wajib diisi.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave(item.id, {
        ...form,
        telp: form.telp_wa,
        rating: form.rating ? Number(form.rating) : null,
      });
      onClose();
    } catch (err) {
      setError(err.message || "Gagal menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Edit Tempat Wisata</h2>
            <p className="modal-sub">Perbarui informasi tempat wisata ini.</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Tutup">
            <svg
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-field">
            <label>Nama tempat wisata</label>
            <input
              value={form.nama}
              onChange={(e) => updateField("nama", e.target.value)}
              placeholder="cth. Curug Cimahi"
              required
            />
          </div>

          <div className="form-field">
            <label>Alamat</label>
            <textarea
              value={form.alamat}
              onChange={(e) => updateField("alamat", e.target.value)}
              placeholder="Alamat lengkap lokasi wisata"
            />
          </div>

          <div className="form-field">
            <label>Nomor telepon / WhatsApp</label>
            <input
              value={form.telp_wa}
              onChange={(e) => updateField("telp_wa", e.target.value)}
              placeholder="cth. 628123456789 (format internasional untuk klik WA)"
            />
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label>Website</label>
              <input
                value={form.website}
                onChange={(e) => updateField("website", e.target.value)}
                placeholder="https://..."
                type="url"
              />
            </div>
            <div className="form-field">
              <label>Rating (0–5)</label>
              <input
                value={form.rating}
                onChange={(e) => updateField("rating", e.target.value)}
                placeholder="cth. 4.5"
                type="number"
                min="0"
                max="5"
                step="0.1"
              />
            </div>
          </div>

          <div className="form-field">
            <label>Link Google Maps</label>
            <input
              value={form.url_maps}
              onChange={(e) => updateField("url_maps", e.target.value)}
              placeholder="https://maps.google.com/..."
              type="url"
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
