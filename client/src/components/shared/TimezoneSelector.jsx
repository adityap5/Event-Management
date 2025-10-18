import { TIMEZONES, TIMEZONE_LABELS } from "../../constants/timezones";

function TimezoneSelector({ value, onChange, label = "Timezone", className = "select-input" }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <select value={value} onChange={onChange} className={className}>
        {TIMEZONES.map((tz) => (
          <option className="select-input-list" key={tz} value={tz}>
            {TIMEZONE_LABELS[tz] || tz}
          </option>
        ))}
      </select>
    </div>
  );
}

export default TimezoneSelector;