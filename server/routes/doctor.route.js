import express from 'express';
import Doctor from '../models/doctor.model.js';

const router = express.Router();

// Add doctor clinic
router.post('/doctors', async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;
    const doctor = new Doctor({
      name,
      address,
      location: { type: 'Point', coordinates: [longitude, latitude] },
    });
    await doctor.save();
    res.json({ message: 'Doctor added', doctor });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add doctor', details: err.message });
  }
});

// Search doctors near a location
router.get('/doctors', async (req, res) => {
  try {
    const { latitude, longitude, maxDistance } = req.query;
    const doctors = await Doctor.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseFloat(maxDistance) || 10000, // Default 10 km
        },
      },
    });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch doctors', details: err.message });
  }
});

export default router;
