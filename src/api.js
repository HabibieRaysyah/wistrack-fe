const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

function getToken() {
  return localStorage.getItem("wistrack_token");
}

function authHeaders() {
  const token = getToken();
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
}

async function handle(res) {
  if (!res.ok) {
    let message = "Terjadi kesalahan";
    try {
      const data = await res.json();
      message = data.message || data.error || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  async login(email, password) {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return handle(res);
  },

  async importWisata(file) {
    const formData = new FormData();
    formData.append("file", file);
    const token = getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`${BASE_URL}/wisata/import`, {
      method: "POST",
      headers,
      body: formData,
    });
    return handle(res);
  },

  async getWisata({ status, q } = {}) {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (q) params.set("q", q);
    const res = await fetch(`${BASE_URL}/wisata?${params.toString()}`, {
      headers: authHeaders(),
    });
    return handle(res);
  },

  async getStats() {
    const res = await fetch(`${BASE_URL}/wisata/stats/summary`, {
      headers: authHeaders(),
    });
    return handle(res);
  },

  async updateStatus(id, status, catatan) {
    const res = await fetch(`${BASE_URL}/wisata/${id}/status`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ status, catatan }),
    });
    return handle(res);
  },

  async createWisata(payload) {
    const res = await fetch(`${BASE_URL}/wisata`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    return handle(res);
  },

  async updateWisata(id, payload) {
    const res = await fetch(`${BASE_URL}/wisata/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    return handle(res);
  },

  async deleteWisata(id) {
    const res = await fetch(`${BASE_URL}/wisata/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    return handle(res);
  },

  // Export — trigger browser download langsung
  exportWisata({ status, q, format = "xlsx" } = {}) {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (q) params.set("q", q);
    params.set("format", format);
    const token = getToken();
    if (token) params.set("token", token);
    // Buka di tab baru supaya browser handle download
    window.open(`${BASE_URL}/wisata/export?${params.toString()}`, "_blank");
  },
};
