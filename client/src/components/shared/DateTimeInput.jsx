function DateTimeInput({ label, dateValue, timeValue, onDateChange, onTimeChange, minDate }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <div className="date-time-group">
        <input
          type="date"
          min={minDate}
          value={dateValue}
          onChange={onDateChange}
          className="input-field date-input"
          required
        />
        <input
          type="time"
          value={timeValue}
          onChange={onTimeChange}
          className="input-field time-input"
          required
        />
      </div>
    </div>
  );
}

export default DateTimeInput;