import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEvent } from "../../store/eventSlice";
import { createProfile, toggleSelectedProfile, resetSelectedProfiles } from "../../store/profileSlice";
import { TIMEZONES } from "../../constants/timezones";
import { getTodayDate, createTimezoneDate, getNextDay } from "../../utils/dateUtils";
import TimezoneSelector from "../shared/TimezoneSelector";
import DateTimeInput from "../shared/DateTimeInput";
import ErrorMessage from "../shared/ErrorMessage";
import ProfileSelector from "../shared/ProfileSelector";

export default function EventForm() {
  const dispatch = useDispatch();
  const { profiles, currentProfile, selectedProfiles } = useSelector(state => state.profiles);

  const [timezone, setTimezone] = useState(TIMEZONES[0]);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("09:00");
  const [error, setError] = useState("");

  const today = getTodayDate();

  const handleAddProfile = async (name) => {
    const action = dispatch(createProfile({ name }));
    if (typeof action.unwrap === "function") {
      await action.unwrap();
    } else {
      await action;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (selectedProfiles.length === 0) {
      setError("Please select at least one profile");
      return;
    }

    if (!startDate || !endDate) {
      setError("Please select start and end dates");
      return;
    }

    const start = createTimezoneDate(startDate, startTime, timezone);
    const end = createTimezoneDate(endDate, endTime, timezone);


    const eventData = {
      profiles: selectedProfiles.map(p => p._id),
      timezone,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };

    try {
      await dispatch(createEvent(eventData)).unwrap();
      
      if (currentProfile) {
        dispatch(resetSelectedProfiles());
        dispatch(toggleSelectedProfile(currentProfile));
      }
      setStartDate(""); setStartTime("09:00"); setEndDate(""); setEndTime("09:00");
      setError("");
    } catch {
      setError("Failed to create event");
    }
  };

  return (
    <div className="card">
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Profiles</label>
          <ProfileSelector
            profiles={profiles}
            selectedProfiles={selectedProfiles}
            onToggle={(p) => dispatch(toggleSelectedProfile(p))}
            onAddProfile={handleAddProfile}
            multiSelect
            showAddProfile
            placeholder="Select profiles..."
            searchPlaceholder="Search profiles..."
          />
        </div>

        <TimezoneSelector
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
        />

        <DateTimeInput
          label="Start Date & Time" 
          dateValue={startDate} 
          timeValue={startTime} 
           onDateChange={(e) => {setStartDate(e.target.value)}}
          onTimeChange={(e) => setStartTime(e.target.value)} 
          minDate={today}
         
          /> 
          <DateTimeInput 
          label="End Date & Time" 
          dateValue={endDate} 
          timeValue={endTime} 
          onDateChange={(e) => setEndDate(e.target.value)} 
          onTimeChange={(e) => setEndTime(e.target.value)} 
          minDate={getNextDay(startDate) || today} 
          />

        <ErrorMessage message={error} />
        <button type="submit" className="btn btn-primary btn-block">
          + Create Event
        </button>
      </form>
    </div>
  );
}
