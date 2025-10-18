import React from "react";
import {
  formatDate,
  formatTime,
  formatDetailedDateTime,
} from "../../utils/dateUtils";

const EventCards = React.memo(function EventCards({
  events,
  viewTimezone,
  onEdit,
  onViewLogs,
}) {
  if (!events.length) {
    return <div className="no-events">No events found</div>;
  }

  return (
    <div className="events-list">
      {events.map((event) => (
        <div key={event._id} className="event-card">
          <div className="event-header" style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span>👥</span>
              <span>{event.profiles.map((p) => p.name).join(", ")}</span>
            </div>
          </div>

          <div className="event-details" style={{ gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span>📅</span>
              <strong>Start: {formatDate(event.startDate, viewTimezone)}</strong>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#666" }}>
              <span>🕒</span>
              <span>{formatTime(event.startDate, viewTimezone)}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <span>📅</span>
              <strong>End: {formatDate(event.endDate, viewTimezone)}</strong>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#666" }}>
              <span>🕒</span>
              <span>{formatTime(event.endDate, viewTimezone)}</span>
            </div>

            <div style={{ borderTop: "2px solid #f0f0f0", margin: "12px 0" }} />

            <div style={{ color: "#999", fontSize: 13 }}>
              {event.createdAt && (
                <div>Created: {formatDetailedDateTime(event.createdAt, viewTimezone)}</div>
              )}
              {event.updatedAt && (
                <div>Updated: {formatDetailedDateTime(event.updatedAt, viewTimezone)}</div>
              )}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginTop: 12,
            }}
          >
            <button onClick={() => onEdit(event)} className="btn btn-secondary">
              ✏️ Edit
            </button>
            <button onClick={() => onViewLogs(event._id)} className="btn btn-secondary">
              📋 View Logs
            </button>
          </div>
        </div>
      ))}
    </div>
  );
});

export default EventCards;
