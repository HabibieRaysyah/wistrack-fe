import { STATUS_CONFIG, STATUS_ORDER } from "../statusConfig";

export default function StatusSelect({ value, onChange, disabled }) {
  return (
    <select
      className="status-select"
      data-status={value}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
    >
      {STATUS_ORDER.map((key) => (
        <option key={key} value={key}>
          {STATUS_CONFIG[key].label}
        </option>
      ))}
    </select>
  );
}
