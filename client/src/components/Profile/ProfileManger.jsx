import { useDispatch, useSelector } from "react-redux";
import { createProfile, setCurrentProfile, updateProfileTimezone } from "../../store/profileSlice";
import { fetchEventsByProfile } from "../../store/eventSlice";
import { TIMEZONES } from "../../constants/timezones";
import ProfileSelector from "../shared/ProfileSelector";

export default function ProfileManager({ showTimezone = true }) {
  const dispatch = useDispatch();
  const { profiles, currentProfile } = useSelector(state => state.profiles);

  const handleProfileSelect = (profile) => {
    dispatch(setCurrentProfile(profile));
    dispatch(fetchEventsByProfile(profile._id));
  };

  const handleAddProfile = async (name) => {
    const action = dispatch(createProfile({ name }));
    if (typeof action.unwrap === "function") {
      await action.unwrap();
    } else {
      await action;
    }
  };

  const handleTimezoneChange = async (e) => {
    if (!currentProfile) return;
    await dispatch(updateProfileTimezone({ profileId: currentProfile._id, timezone: e.target.value }));
    dispatch(fetchEventsByProfile(currentProfile._id));
  };

  return (
    <div className="profile-manager profile-manager--toolbar">
      <div className="profile-selector">
        <label className="sr-only">Current Profile</label>
        <ProfileSelector
          profiles={profiles}
          currentProfile={currentProfile}
          onSelect={handleProfileSelect}
          onAddProfile={handleAddProfile}
          multiSelect={false}
          showAddProfile={true}
          placeholder="Select current profile..."
          searchPlaceholder="Search current profile..."
        />
      </div>

      {showTimezone && currentProfile && (
        <div className="timezone-selector">
          <label>Timezone</label>
          <select
            value={currentProfile.timezone}
            onChange={handleTimezoneChange}
            className="select-input"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}