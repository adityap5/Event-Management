import { useState } from "react";

export const useProfileSelection = (initialProfiles = []) => {
  const [selectedProfiles, setSelectedProfiles] = useState(initialProfiles);

  const toggleProfile = (profile) => {
    setSelectedProfiles((prev) => {
      const exists = prev.find((p) => p._id === profile._id);
      if (exists) {
        return prev.filter((p) => p._id !== profile._id);
      } else {
        return [...prev, profile];
      }
    });
  };

  const resetSelection = () => {
    setSelectedProfiles([]);
  };

  const setProfiles = (profiles) => {
    setSelectedProfiles(profiles);
  };

  return {
    selectedProfiles,
    toggleProfile,
    resetSelection,
    setProfiles,
  };
};