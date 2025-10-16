const express = require('express');
const {
  getFlights,
  getFlight,
  createFlight,
  updateFlight,
  deleteFlight,
  getPopularDestinations
} = require('../controllers/flightController');
const { protect, authorize } = require('../middleware/auth');
const { flightValidation } = require('../validators/flightValidator');

const router = express.Router();

// Public routes
router.get('/', getFlights);
router.get('/popular-destinations', getPopularDestinations);
router.get('/:id', getFlight);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), flightValidation, createFlight);
router.put('/:id', protect, authorize('admin'), flightValidation, updateFlight);
router.delete('/:id', protect, authorize('admin'), deleteFlight);

module.exports = router;
