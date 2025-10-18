import { useState } from "react";

export default function ProfileSelector({
  profiles = [],
  selectedProfiles = [],
  currentProfile = null,
  onToggle,
  onSelect,
  onAddProfile,
  multiSelect = false,
  showAddProfile = false,
  placeholder = "Select profiles...",
  searchPlaceholder = "Search profiles..."
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newProfileName, setNewProfileName] = useState("");
  const [showAddRow, setShowAddRow] = useState(false);

  const handleQuickAddProfile = async () => {
    const name = newProfileName.trim();
    if (!name) return;
    await onAddProfile(name);
    setNewProfileName(""); setSearchTerm(""); setShowAddRow(false);
  };

  const handleProfileClick = (profile) => {
    if (multiSelect && onToggle) onToggle(profile);
    else if (!multiSelect && onSelect) { onSelect(profile); setIsOpen(false); setSearchTerm(""); }
  };

  const isProfileSelected = (profile) =>
    multiSelect ? selectedProfiles.some(p => p._id === profile._id) : currentProfile?._id === profile._id;

  const getDisplayText = () => {
    if (multiSelect) {
      if (!selectedProfiles.length) return placeholder;
      return `${selectedProfiles.length} profile${selectedProfiles.length > 1 ? "s" : ""} selected`;
    } else return currentProfile ? currentProfile.name : placeholder;
  };

  const filteredProfiles = profiles.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="dropdown-container">
      <div className={`select-box ${multiSelect ? "multi-select" : ""}`} onClick={() => setIsOpen(!isOpen)}>
        {getDisplayText()} <span className="dropdown-arrow">▼</span>
      </div>

      {isOpen && (
        <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
          <input type="text" placeholder={searchPlaceholder} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input"/>
          <div className="dropdown-list">
            {filteredProfiles.map(profile => (
              <div key={profile._id} className={`dropdown-item ${multiSelect ? "checkbox-item" : ""} ${isProfileSelected(profile) ? "active" : ""}`} onClick={() => handleProfileClick(profile)}>
                {multiSelect && <input type="checkbox" checked={isProfileSelected(profile)} readOnly />}
                <span>{profile.name}</span>
              </div>
            ))}

            {showAddProfile && (!showAddRow ? (
              <div className="dropdown-item add-profile" onClick={(e) => { e.stopPropagation(); setShowAddRow(true); }}>+ Add Profile</div>
            ) : (
              <div className="dropdown-item"  onClick={(e) => e.stopPropagation()}>
                <div className="dropdown-item-add-profile">
                  <input 
                    type="text"
                    placeholder="Profile name" 
                    value={newProfileName} 
                    onChange={(e) => setNewProfileName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleQuickAddProfile(); } else if (e.key === "Escape") { setShowAddRow(false); setNewProfileName(""); } }}
                    
                    autoFocus />
                  <button type="button" className="btn btn-primary" style={{ padding: "8px"}} onClick={handleQuickAddProfile}>Add</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
