const validateEvent = (req, res, next) => {
  const { profiles, timezone, startDateTime, endDateTime } = req.body;

  if (!profiles || !Array.isArray(profiles) || profiles.length === 0) {
    return res.status(400).json({ error: 'At least one profile is required' });
  }

  if (!timezone || typeof timezone !== 'string' || !timezone.trim()) {
    return res.status(400).json({ error: 'Timezone is required' });
  }

  if (!startDateTime || !endDateTime) {
    return res.status(400).json({ error: 'Start and end date/time are required' });
  }

  const start = new Date(startDateTime);
  const end = new Date(endDateTime);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({ error: 'Invalid date/time format' });
  }

  if (end <= start) {
    return res.status(400).json({ error: 'End date/time must be after start date/time' });
  }

  next();
};

const validateProfile = (req, res, next) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Profile name is required' });
  }

  req.body.name = name.trim();
  next();
};

module.exports = {
  validateEvent,
  validateProfile
};

