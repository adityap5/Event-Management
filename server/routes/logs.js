const express = require('express');
const router = express.Router();
const EventLog = require('../models/EventLog');
const Profile = require('../models/Profile');

// Get logs for an event
router.get('/event/:eventId', async (req, res) => {
  try {
    const logs = await EventLog.find({
      eventId: req.params.eventId
    }).sort({ timestamp: -1 });
    
    // Populate profile names for profile changes
    const logsWithNames = await Promise.all(logs.map(async (log) => {
      const logObj = log.toObject();
      if (logObj.changeType === 'Profiles changed') {
        const prevProfiles = await Profile.find({ _id: { $in: logObj.previousValue } });
        const newProfiles = await Profile.find({ _id: { $in: logObj.newValue } });
        logObj.previousValue = prevProfiles.map(p => p.name).join(', ');
        logObj.newValue = newProfiles.map(p => p.name).join(', ');
      }
      return logObj;
    }));
    
    res.json(logsWithNames);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;