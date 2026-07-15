import { useState } from "react";

const EMPTY_FORM = {
  nama: "",
  alamat: "",
  telp: "",
  website: "",
  url_maps: "",
  rating: "",
};

export default function AddWisataModal({ onClose, onCreate }) {
  const [form, setForm] = useState(EMPTY_FORM);
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
      await onCreate({
        ...form,
        rating: form.rating ? Number(form.rating) : null,
      });
      onClose();
    } catch (err) {
      setError(err.message || "Gagal menyimpan data.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>Tambah Tempat Wisata</h2>
        <p className="modal-sub">
          Data baru akan masuk dengan status "Belum Dihubungi".
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Nama tempat wisata</label>
            <input
              value={form.nama}
              onChange={(e) => updateField("nama", e.target.value)}
              placeholder="cth. Curug Cimahi"
            />
          </div>

          <div className="form-field">
            <label>Alamat</label>
            <textarea
              value={form.alamat}
              onChange={(e) => updateField("alamat", e.target.value)}
              placeholder="Alamat lengkap"
            />
          </div>

          <div className="form-field">
            <label>Nomor telepon / WhatsApp</label>
            <input
              value={form.telp}
              onChange={(e) => updateField("telp", e.target.value)}
              placeholder="cth. 0812-3456-7890"
            />
          </div>

          <div className="form-field">
            <label>Website (opsional)</label>
            <input
              value={form.website}
              onChange={(e) => updateField("website", e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="form-field">
            <label>Link Google Maps (opsional)</label>
            <input
              value={form.url_maps}
              onChange={(e) => updateField("url_maps", e.target.value)}
              placeholder="https://www.google.com/maps/..."
            />
          </div>

          <div className="form-field">
            <label>Rating (opsional)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={form.rating}
              onChange={(e) => updateField("rating", e.target.value)}
              placeholder="cth. 4.5"
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
