import StatusSelect from "./StatusSelect";
import { STATUS_CONFIG } from "../statusConfig";

function buildWaLink(item) {
  if (!item.telp_wa) return null;
  const pesan = encodeURIComponent(
    `Halo, kami dari [Nama Perusahaan] ingin menanyakan kerja sama terkait ${item.nama}.`
  );
  return `https://wa.me/${item.telp_wa}?text=${pesan}`;
}

function Pipeline({ status }) {
  const order = STATUS_CONFIG[status].order;
  return (
    <div className="pipeline" data-status={status}>
      <span className="seg" data-filled={order >= 0} />
      <span className="seg" data-filled={order >= 1} />
      <span className="seg" data-filled={order >= 2} />
    </div>
  );
}

export default function WisataTable({ items, onStatusChange, updatingId }) {
  if (!items.length) {
    return (
      <div className="wisata-table-wrap">
        <div className="state-block">
          <h3>Belum ada data yang cocok</h3>
          <p>Coba ubah kata kunci pencarian atau filter status.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wisata-table-wrap">
      <table className="wisata-table">
        <thead>
          <tr>
            <th style={{ width: "26%" }}>Tempat Wisata</th>
            <th style={{ width: "16%" }}>Kontak</th>
            <th style={{ width: "10%" }}>Rating</th>
            <th style={{ width: "16%" }}>Tautan</th>
            <th style={{ width: "18%" }}>Progress</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const waLink = buildWaLink(item);
            return (
              <tr key={item.id}>
                <td>
                  <p className="wisata-name">{item.nama}</p>
                  <p className="wisata-addr">{item.alamat}</p>
                </td>
                <td>
                  {waLink ? (
                    <a
                      className="wa-link"
                      href={waLink}
                      target="_blank"
                      rel="noreferrer"
                      title="Buka chat WhatsApp"
                    >
                      ↗ {item.telp}
                    </a>
                  ) : (
                    <span className="no-phone">Tidak ada nomor telp</span>
                  )}
                </td>
                <td>
                  {item.rating ? (
                    <span className="rating-pill">★ {item.rating}</span>
                  ) : (
                    <span className="no-phone">—</span>
                  )}
                </td>
                <td>
                  <div className="link-icons">
                    {item.website && (
                      <a href={item.website} target="_blank" rel="noreferrer">
                        Website
                      </a>
                    )}
                    {item.url_maps && (
                      <a href={item.url_maps} target="_blank" rel="noreferrer">
                        Maps
                      </a>
                    )}
                  </div>
                </td>
                <td>
                  <StatusSelect
                    value={item.status}
                    disabled={updatingId === item.id}
                    onChange={(newStatus) => onStatusChange(item, newStatus)}
                  />
                  <Pipeline status={item.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
