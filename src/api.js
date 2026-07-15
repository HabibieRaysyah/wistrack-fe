const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function handle(res) {
  if (!res.ok) {
    let message = "Terjadi kesalahan";
    try {
      const data = await res.json();
      message = data.message || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  async getWisata({ status, q } = {}) {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (q) params.set("q", q);
    const res = await fetch(`${BASE_URL}/wisata?${params.toString()}`);
    return handle(res);
  },

  async getStats() {
    const res = await fetch(`${BASE_URL}/wisata/stats/summary`);
    return handle(res);
  },

  async updateStatus(id, status, catatan) {
    const res = await fetch(`${BASE_URL}/wisata/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, catatan }),
    });
    return handle(res);
  },

  async createWisata(payload) {
    const res = await fetch(`${BASE_URL}/wisata`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return handle(res);
  },

  async updateWisata(id, payload) {
    const res = await fetch(`${BASE_URL}/wisata/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return handle(res);
  },

  async deleteWisata(id) {
    const res = await fetch(`${BASE_URL}/wisata/${id}`, { method: "DELETE" });
    return handle(res);
  },
};
