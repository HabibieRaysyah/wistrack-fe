import StatusSelect from "./StatusSelect";
import { STATUS_CONFIG } from "../statusConfig";

function toAbsoluteUrl(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

function buildWaLink(item) {
  if (!item.telp_wa) return null;
  const pesan = encodeURIComponent(
    `Halo, kami dari Wondo ingin menanyakan kerja sama terkait ${item.nama}.`
  );
  return `https://wa.me/${item.telp_wa}?text=${pesan}`;
}

function Pipeline({ status }) {
  const order = STATUS_CONFIG[status]?.order ?? 0;
  return (
    <div className="pipeline" data-status={status}>
      <span className="seg" data-filled={order >= 0} />
      <span className="seg" data-filled={order >= 1} />
      <span className="seg" data-filled={order >= 2} />
    </div>
  );
}

export default function WisataTable({ items, onStatusChange, updatingId, onEdit, onDelete }) {
  if (!items.length) {
    return (
      <div className="wisata-table-wrap">
        <div className="state-block">
          <svg
            className="state-block-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
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
            <th style={{ width: "28%" }}>Tempat Wisata</th>
            <th style={{ width: "17%" }}>Kontak</th>
            <th style={{ width: "10%" }}>Rating</th>
            <th style={{ width: "18%" }}>Tautan</th>
            <th style={{ width: "17%" }}>Progress</th>
            <th style={{ width: "10%" }}>Aksi</th>
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

                {/* Kontak */}
                <td>
                  {waLink ? (
                    <a
                      className="wa-link"
                      href={waLink}
                      target="_blank"
                      rel="noreferrer"
                      title="Buka chat WhatsApp"
                    >
                      <svg
                        className="wa-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.732-1.451L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.864-9.852.002-2.634-1.02-5.11-2.88-6.973-1.86-1.863-4.332-2.888-6.969-2.89-5.447 0-9.877 4.417-9.881 9.858-.002 1.77.466 3.498 1.356 5.03L1.922 22.1l6.23-1.634-.41-.244zm9.938-7.143c-.27-.135-1.597-.788-1.845-.878-.247-.09-.427-.135-.607.135-.18.27-.697.878-.855 1.058-.158.18-.315.202-.585.067-.27-.135-1.14-.42-2.172-1.341-.803-.715-1.344-1.602-1.502-1.872-.158-.27-.017-.417.118-.552.122-.122.27-.315.405-.472.135-.158.18-.27.27-.45.09-.18.045-.337-.022-.472-.068-.135-.607-1.463-.833-2.003-.22-.529-.481-.458-.66-.467-.17-.008-.364-.01-.559-.01-.195 0-.514.073-.784.37-.27.296-1.031 1.009-1.031 2.459 0 1.45 1.054 2.85 1.202 3.053.148.203 2.074 3.167 5.024 4.444.702.304 1.25.485 1.678.621.705.224 1.346.193 1.853.117.565-.084 1.597-.653 1.822-1.283.225-.63.225-1.17.158-1.283-.068-.113-.248-.203-.518-.338z" />
                      </svg>
                      <span>{item.telp_wa || item.telp}</span>
                    </a>
                  ) : (
                    <span className="no-phone">Tidak ada nomor</span>
                  )}
                </td>

                {/* Rating */}
                <td>
                  {item.rating ? (
                    <span className="rating-badge">
                      <svg
                        className="star-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <span>{Number(item.rating).toFixed(1)}</span>
                    </span>
                  ) : (
                    <span className="no-rating">—</span>
                  )}
                </td>

                {/* Tautan */}
                <td>
                  <div className="link-pills">
                    {item.website ? (
                      <a
                        className="link-pill"
                        href={toAbsoluteUrl(item.website)}
                        target="_blank"
                        rel="noreferrer"
                        title="Buka Website"
                      >
                        <svg
                          className="link-icon"
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="2" y1="12" x2="22" y2="12" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                        <span>Web</span>
                      </a>
                    ) : null}
                    {item.url_maps ? (
                      <a
                        className="link-pill link-pill-maps"
                        href={toAbsoluteUrl(item.url_maps)}
                        target="_blank"
                        rel="noreferrer"
                        title="Buka Google Maps"
                      >
                        <svg
                          className="link-icon"
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>Maps</span>
                      </a>
                    ) : null}
                    {!item.website && !item.url_maps && (
                      <span className="no-rating">—</span>
                    )}
                  </div>
                </td>

                {/* Progress */}
                <td>
                  <div className="status-cell-wrapper">
                    <StatusSelect
                      value={item.status}
                      disabled={updatingId === item.id}
                      onChange={(newStatus) => onStatusChange(item, newStatus)}
                    />
                    <Pipeline status={item.status} />
                  </div>
                </td>

                {/* Aksi */}
                <td>
                  <div className="row-actions">
                    <button
                      className="row-action-btn row-action-edit"
                      title="Edit"
                      onClick={() => onEdit(item)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      className="row-action-btn row-action-delete"
                      title="Hapus"
                      onClick={() => onDelete(item.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
