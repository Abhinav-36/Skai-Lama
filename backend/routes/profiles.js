const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const { validateProfile } = require('../middleware/validation');

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().sort({ createdAt: -1 });
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', validateProfile, async (req, res) => {
  try {
    const { name } = req.body;
    const profile = new Profile({ name });
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


