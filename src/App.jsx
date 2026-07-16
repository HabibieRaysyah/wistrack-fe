import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "./api";
import Sidebar from "./components/Sidebar";
import StatsBar from "./components/StatsBar";
import FilterBar from "./components/FilterBar";
import WisataTable from "./components/WisataTable";
import AddWisataModal from "./components/AddWisataModal";
import EditWisataModal from "./components/EditWisataModal";
import ImportModal from "./components/ImportModal";
import Pagination from "./components/Pagination";

export default function App() {
  const navigate = useNavigate();
  const username = localStorage.getItem("wistrack_username") || "Admin";

  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Pagination
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
      setLoadError(err.message || "Gagal memuat data. Pastikan backend sudah jalan.");
    } finally {
      setLoading(false);
    }
  }, [activeStatus, search]);

  useEffect(() => {
    const timeout = setTimeout(loadData, 250);
    return () => clearTimeout(timeout);
  }, [loadData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeStatus]);

  function handleLogout() {
    localStorage.removeItem("wistrack_token");
    localStorage.removeItem("wistrack_is_logged_in");
    localStorage.removeItem("wistrack_username");
    navigate("/");
  }

  async function handleStatusChange(item, newStatus, catatan) {
    setUpdatingId(item.id);
    const prevItems = items;
    setItems((cur) =>
      cur.map((i) => (i.id === item.id ? { ...i, status: newStatus } : i))
    );
    try {
      await api.updateStatus(item.id, newStatus, catatan);
      const statsRes = await api.getStats();
      setStats(statsRes);
    } catch (err) {
      setItems(prevItems);
      alert(err.message || "Gagal mengubah status");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleCreate(payload) {
    await api.createWisata(payload);
    await loadData();
  }

  async function handleEdit(id, payload) {
    await api.updateWisata(id, payload);
    await loadData();
  }

  async function handleDelete(id) {
    if (!window.confirm("Yakin ingin menghapus tempat wisata ini?")) return;
    try {
      await api.deleteWisata(id);
      await loadData();
    } catch (err) {
      alert(err.message || "Gagal menghapus data.");
    }
  }

  // Pagination calc
  const totalItems = items.length;
  const maxPage = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const activePage = currentPage > maxPage ? maxPage : currentPage;
  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="layout">
      <Sidebar
        username={username}
        onAddClick={() => setShowAddModal(true)}
        onImportClick={() => setShowImportModal(true)}
        onLogout={handleLogout}
        activeStatus={activeStatus}
        search={search}
      />

      <main className="main-content">
        {/* Page header */}
        <div className="page-header">
          <div>
            <p className="eyebrow">Tracker Kemitraan Wisata</p>
            <h1 className="header-title">Jelajah Prospek</h1>
            <p className="subtitle">
              Pantau progres kontak ke setiap tempat wisata — dari belum dihubungi sampai deal,
              langsung lewat WhatsApp.
            </p>
          </div>
        </div>

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
              <div className="spinner" />
              <h3>Memuat data...</h3>
            </div>
          </div>
        ) : (
          <>
            <WisataTable
              items={currentItems}
              onStatusChange={handleStatusChange}
              updatingId={updatingId}
              onEdit={setEditItem}
              onDelete={handleDelete}
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
      </main>

      {showAddModal && (
        <AddWisataModal
          onClose={() => setShowAddModal(false)}
          onCreate={handleCreate}
        />
      )}

      {showImportModal && (
        <ImportModal
          onClose={() => setShowImportModal(false)}
          onImported={loadData}
        />
      )}

      {editItem && (
        <EditWisataModal
          item={editItem}
          onClose={() => setEditItem(null)}
          onSave={handleEdit}
        />
      )}
    </div>
  );
}
