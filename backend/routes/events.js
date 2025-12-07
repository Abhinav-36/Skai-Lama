const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const EventLog = require('../models/EventLog');
const Profile = require('../models/Profile');
const { validateEvent } = require('../middleware/validation');

router.get('/', async (req, res) => {
  try {
    const { profileIds } = req.query;
    const query = {};
    
    if (profileIds) {
      const ids = Array.isArray(profileIds) ? profileIds : [profileIds];
      query.profiles = { $in: ids };
    }

    const events = await Event.find(query)
      .populate('profiles', 'name')
      .sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const evt = await Event.findById(req.params.id).populate('profiles', 'name');
    if (!evt) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(evt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', validateEvent, async (req, res) => {
  try {
    const { profiles, timezone, startDateTime, endDateTime } = req.body;
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    const existing = await Profile.find({ _id: { $in: profiles } }).select('_id');
    const existingIds = new Set(existing.map(p => p._id.toString()));
    const requestedIds = new Set(profiles.map(id => id.toString()));
    
    if (existingIds.size !== requestedIds.size || 
        ![...requestedIds].every(id => existingIds.has(id))) {
      return res.status(400).json({ error: 'One or more profiles not found' });
    }

    const evt = new Event({
      profiles,
      timezone,
      startDateTime: start,
      endDateTime: end
    });

    await evt.save();
    const result = await Event.findById(evt._id).populate('profiles', 'name');
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { profiles, timezone, startDateTime, endDateTime } = req.body;
    const evt = await Event.findById(req.params.id);
    
    if (!evt) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const changes = [];

    if (profiles) {
      const oldIds = new Set(evt.profiles.map(p => p.toString()).sort());
      const newIds = new Set(profiles.map(id => id.toString()).sort());
      const changed = oldIds.size !== newIds.size || ![...oldIds].every(id => newIds.has(id));
      
      if (changed) {
        const old = await Profile.find({ _id: { $in: evt.profiles } });
        const updated = await Profile.find({ _id: { $in: profiles } });
        changes.push({
          field: 'profiles',
          oldValue: old.map(p => p.name).join(', '),
          newValue: updated.map(p => p.name).join(', ')
        });
        evt.profiles = profiles;
      }
    }

    if (timezone && timezone !== evt.timezone) {
      changes.push({
        field: 'timezone',
        oldValue: evt.timezone,
        newValue: timezone
      });
      evt.timezone = timezone;
    }

    if (startDateTime) {
      const newStart = new Date(startDateTime);
      if (newStart.getTime() !== evt.startDateTime.getTime()) {
        changes.push({
          field: 'startDateTime',
          oldValue: evt.startDateTime,
          newValue: newStart
        });
        evt.startDateTime = newStart;
      }
    }

    if (endDateTime) {
      const newEnd = new Date(endDateTime);
      if (newEnd.getTime() !== evt.endDateTime.getTime()) {
        changes.push({
          field: 'endDateTime',
          oldValue: evt.endDateTime,
          newValue: newEnd
        });
        evt.endDateTime = newEnd;
      }
    }

    if (evt.endDateTime <= evt.startDateTime) {
      return res.status(400).json({ error: 'End date/time must be after start date/time' });
    }

    if (changes.length > 0) {
      await evt.save();
      const log = new EventLog({
        eventId: evt._id,
        changes
      });
      await log.save();
    }

    const result = await Event.findById(evt._id).populate('profiles', 'name');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/logs', async (req, res) => {
  try {
    const logs = await EventLog.find({ eventId: req.params.id })
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

