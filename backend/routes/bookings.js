const express = require('express');
const {
  createBooking,
  getUserBookings,
  getBooking,
  cancelBooking,
  getAvailableSeats
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { bookingValidation } = require('../validators/bookingValidator');

const router = express.Router();

// Public routes
router.get('/seats/:flightId', getAvailableSeats);

// Protected routes
router.post('/', protect, bookingValidation, createBooking);
router.get('/', protect, getUserBookings);
router.get('/:id', protect, getBooking);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
