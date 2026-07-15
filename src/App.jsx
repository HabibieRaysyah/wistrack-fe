import { useEffect, useState, useCallback } from "react";
import { api } from "./api";
import StatsBar from "./components/StatsBar";
import FilterBar from "./components/FilterBar";
import WisataTable from "./components/WisataTable";
import AddWisataModal from "./components/AddWisataModal";
import Pagination from "./components/Pagination";

export default function App() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  // Reset page to 1 when search query or status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeStatus]);

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

  // Calculate items to display on the current page
  const totalItems = items.length;
  const maxPage = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const activePage = currentPage > maxPage ? maxPage : currentPage;
  
  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Tracker Kemitraan Wisata</p>
          <h1 className="header-title">Jelajah Prospek</h1>
          <p className="subtitle">
            Pantau progres kontak ke setiap tempat wisata — dari belum
            dihubungi sampai deal, langsung lewat WhatsApp.
          </p>
        </div>
        <button className="btn-add" onClick={() => setShowAddModal(true)}>
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
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tambah Tempat Wisata
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
            <div className="spinner"></div>
            <h3>Memuat data...</h3>
          </div>
        </div>
      ) : (
        <>
          <WisataTable
            items={currentItems}
            onStatusChange={handleStatusChange}
            updatingId={updatingId}
          />
          <Pagination
            currentPage={activePage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </>
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

