import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventsByProfile, updateEvent } from "../../store/eventSlice";
import { createProfile } from "../../store/profileSlice";
import EventLogsModal from "./EventLogsModal";
import { TIMEZONES } from "../../constants/timezones";
import {
  createTimezoneDate,
  formatDateForInput,
  formatTimeForInput,
  getNextDay,
  getTodayDate
} from "../../utils/dateUtils";

import { useProfileSelection } from "../../hooks/useProfileSelection";
import ProfileSelector from "../shared/ProfileSelector";
import TimezoneSelector from "../shared/TimezoneSelector";
import DateTimeInput from "../shared/DateTimeInput";
import Modal from "../shared/Modal";
import EventCards from "./EventCards"; 

function EventList() {
  const dispatch = useDispatch();
  const { currentProfile, profiles } = useSelector((state) => state.profiles);
  const { events, loading } = useSelector((state) => state.events);

  const [editingEvent, setEditingEvent] = useState(null);
  const { selectedProfiles, toggleProfile, setProfiles } = useProfileSelection();
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [viewTimezone, setViewTimezone] = useState(TIMEZONES[0]);

  useEffect(() => {
    if (currentProfile?._id) {
      dispatch(fetchEventsByProfile(currentProfile._id));
      setViewTimezone(currentProfile.timezone);
    }
  }, [currentProfile?._id, dispatch]);

  const handleEditEvent = useCallback((event) => {
    setEditingEvent({
      ...event,
      startDate: formatDateForInput(event.startDate, event.timezone),
      startTime: formatTimeForInput(event.startDate, event.timezone),
      endDate: formatDateForInput(event.endDate, event.timezone),
      endTime: formatTimeForInput(event.endDate, event.timezone),
    });
    setProfiles(event.profiles);
  }, [setProfiles]);

  const handleViewLogs = useCallback((eventId) => {
    setSelectedEventId(eventId);
    setShowLogsModal(true);
  }, []);

  const handleAddProfile = async (name) => {
    const action = dispatch(createProfile({ name }));
    if (typeof action.unwrap === "function") {
      await action.unwrap();
    } else {
      await action;
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();

    const start = createTimezoneDate(
      editingEvent.startDate,
      editingEvent.startTime,
      editingEvent.timezone
    );
    const end = createTimezoneDate(
      editingEvent.endDate,
      editingEvent.endTime,
      editingEvent.timezone
    );

    const eventData = {
      profiles: selectedProfiles.map((p) => p._id),
      timezone: editingEvent.timezone,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };

    await dispatch(updateEvent({ eventId: editingEvent._id, eventData }));
    setEditingEvent(null);
    dispatch(fetchEventsByProfile(currentProfile._id));
  };

  if (loading) {
    return <div className="card">Loading events...</div>;
  }

  return (
    <div className="card">
      <h2>Events</h2>

      <div className="events-header">
        <TimezoneSelector
          label="View in Timezone"
          value={viewTimezone}
          onChange={(e) => setViewTimezone(e.target.value)}
          className="select-input"
        />
      </div>

      <EventCards
        events={events}
        viewTimezone={viewTimezone}
        onEdit={handleEditEvent}
        onViewLogs={handleViewLogs}
      />

      <Modal
        isOpen={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        title="Edit Event"
        size="large"
      >
        <form onSubmit={handleUpdateEvent}>
          <div className="form-group">
            <label>Profiles</label>
            <ProfileSelector
              profiles={profiles}
              selectedProfiles={selectedProfiles}
              onToggle={toggleProfile}
              onAddProfile={handleAddProfile}
              multiSelect
              showAddProfile
              placeholder="Select profiles..."
              searchPlaceholder="Search profiles..."
            />
          </div>

          <TimezoneSelector
            value={editingEvent?.timezone || TIMEZONES[0]}
            onChange={(e) =>
              setEditingEvent({ ...editingEvent, timezone: e.target.value })
            }
          />

          <DateTimeInput
            label="Start Date & Time"
            dateValue={editingEvent?.startDate || ""}
            timeValue={editingEvent?.startTime || ""}
            onDateChange={(e) =>
              setEditingEvent({ ...editingEvent, startDate: e.target.value })
            }
            onTimeChange={(e) =>
              setEditingEvent({ ...editingEvent, startTime: e.target.value })
            }
            minDate={getTodayDate()}
          />

          <DateTimeInput
            label="End Date & Time"
            dateValue={editingEvent?.endDate || ""}
            timeValue={editingEvent?.endTime || ""}
            onDateChange={(e) =>
              setEditingEvent({ ...editingEvent, endDate: e.target.value })
            }
            onTimeChange={(e) =>
              setEditingEvent({ ...editingEvent, endTime: e.target.value })
            }
            minDate={getNextDay(editingEvent?.startDate) || getTodayDate()}
          />

          <div className="modal-actions">
            <button
              type="button"
              onClick={() => setEditingEvent(null)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Update Event
            </button>
          </div>
        </form>
      </Modal>

      {showLogsModal && (
        <EventLogsModal
          eventId={selectedEventId}
          onClose={() => setShowLogsModal(false)}
          userTimezone={viewTimezone}
        />
      )}
    </div>
  );
}

export default EventList;