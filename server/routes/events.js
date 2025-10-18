const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const EventLog = require('../models/EventLog');

// Get events by profile
router.get('/profile/:profileId', async (req, res) => {
  try {
    const events = await Event.find({
      profiles: req.params.profileId
    }).populate('profiles').sort({ startDate: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create event
router.post('/', async (req, res) => {
  try {
    const event = new Event({
      profiles: req.body.profiles,
      timezone: req.body.timezone,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate)
    });
    const newEvent = await event.save();
    const populatedEvent = await Event.findById(newEvent._id).populate('profiles');
    res.status(201).json(populatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update event
router.patch('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const changes = [];
    
    if (req.body.profiles) {
      const oldProfiles = event.profiles.map(p => p.toString()).sort().join(',');
      const newProfiles = req.body.profiles.sort().join(',');
      if (oldProfiles !== newProfiles) {
        changes.push({
          eventId: event._id,
          changeType: 'Profiles changed',
         
        });
      }
      event.profiles = req.body.profiles;
    }

    if (req.body.timezone && req.body.timezone !== event.timezone) {
      changes.push({
        eventId: event._id,
        changeType: 'Timezone changed',
       
      });
      event.timezone = req.body.timezone;
    }

    if (req.body.startDate) {
      const newStartDate = new Date(req.body.startDate);
      if (newStartDate.getTime() !== event.startDate.getTime()) {
        changes.push({
          eventId: event._id,
          changeType: 'Start date/time updated',
         
        });
        event.startDate = newStartDate;
      }
    }

    if (req.body.endDate) {
      const newEndDate = new Date(req.body.endDate);
      if (newEndDate.getTime() !== event.endDate.getTime()) {
        changes.push({
          eventId: event._id,
          changeType: 'End date/time updated',
        
        });
        event.endDate = newEndDate;
      }
    }

    event.updatedAt = Date.now();
    const updatedEvent = await event.save();
    
    // Create logs for changes
    if (changes.length > 0) {
      await EventLog.insertMany(changes);
    }

    const populatedEvent = await Event.findById(updatedEvent._id).populate('profiles');
    res.json(populatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;