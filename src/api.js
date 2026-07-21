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

  async getWisata({ status, q, kota } = {}) {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (q) params.set("q", q);
    if (kota) params.set("kota", kota);
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

  async getById(id) {
    const res = await fetch(`${BASE_URL}/wisata/${id}`, {
      headers: authHeaders(),
    });
    return handle(res);
  },

  async createWisata(payload) {
    const res = await fetch(`${BASE_URL}/wisata/create`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    return handle(res);
  },

  async updateWisata(id, payload) {
    const res = await fetch(`${BASE_URL}/wisata/${id}/update`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    return handle(res);
  },

  async updateStatus(id, status, catatan) {
    const res = await fetch(`${BASE_URL}/wisata/${id}/status`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ status, catatan }),
    });
    return handle(res);
  },

  async deleteWisata(id) {
    const res = await fetch(`${BASE_URL}/wisata/${id}/delete`, {
      method: "POST",
      headers: authHeaders(),
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

  exportWisata({ status, q, kota, format = "xlsx" } = {}) {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (q) params.set("q", q);
    if (kota) params.set("kota", kota);
    params.set("format", format);
    const token = getToken();
    if (token) params.set("token", token);
    window.open(`${BASE_URL}/wisata/export?${params.toString()}`, "_blank");
  },

  async getKotaList() {
    const res = await fetch(`${BASE_URL}/wisata/kota/list`, {
      headers: authHeaders(),
    });
    return handle(res);
  },
};
