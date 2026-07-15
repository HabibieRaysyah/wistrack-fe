import { useEffect, useState, useCallback } from "react";
import { api } from "./api";
import StatsBar from "./components/StatsBar";
import FilterBar from "./components/FilterBar";
import WisataTable from "./components/WisataTable";
import AddWisataModal from "./components/AddWisataModal";

export default function App() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const [wisataRes, statsRes] = await Promise.all([
        api.getWisata({ status: activeStatus || undefined, q: search || undefined }),
        api.getStats(),
      ]);
      setItems(wisataRes);
      setStats(statsRes);
    } catch (err) {
      setLoadError(
        err.message ||
          "Gagal memuat data. Pastikan backend Express & MySQL sudah jalan."
      );
    } finally {
      setLoading(false);
    }
  }, [activeStatus, search]);

  useEffect(() => {
    const timeout = setTimeout(loadData, 250); // debounce search
    return () => clearTimeout(timeout);
  }, [loadData]);

  async function handleStatusChange(item, newStatus) {
    setUpdatingId(item.id);
    const prevItems = items;
    setItems((cur) =>
      cur.map((i) => (i.id === item.id ? { ...i, status: newStatus } : i))
    );
    try {
      await api.updateStatus(item.id, newStatus);
      const statsRes = await api.getStats();
      setStats(statsRes);
    } catch (err) {
      setItems(prevItems); // rollback
      alert(err.message || "Gagal mengubah status");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleCreate(payload) {
    await api.createWisata(payload);
    await loadData();
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Tracker Kemitraan Wisata</p>
          <h1>Jelajah Prospek</h1>
          <p className="subtitle">
            Pantau progres kontak ke setiap tempat wisata — dari belum
            dihubungi sampai deal, langsung lewat WhatsApp.
          </p>
        </div>
        <button className="btn-add" onClick={() => setShowAddModal(true)}>
          + Tambah Tempat Wisata
        </button>
      </header>

      <StatsBar stats={stats} />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
      />

      {loadError ? (
        <div className="wisata-table-wrap">
          <div className="state-block">
            <h3>Ups, gagal konek ke server</h3>
            <p>{loadError}</p>
          </div>
        </div>
      ) : loading ? (
        <div className="wisata-table-wrap">
          <div className="state-block">
            <h3>Memuat data...</h3>
          </div>
        </div>
      ) : (
        <WisataTable
          items={items}
          onStatusChange={handleStatusChange}
          updatingId={updatingId}
        />
      )}

      {showAddModal && (
        <AddWisataModal
          onClose={() => setShowAddModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
