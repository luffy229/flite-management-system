const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const Seat = require('../models/Seat');
const { validationResult } = require('express-validator');

// @desc    Create new booking with seat selection
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { flightId, passengers, travelDate } = req.body;
    const userId = req.user.id;

    // Find the flight
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    // Check if flight has enough available seats
    if (flight.availableSeats < passengers.length) {
      return res.status(400).json({
        success: false,
        message: `Only ${flight.availableSeats} seats available, but ${passengers.length} passengers requested`
      });
    }

    // Validate and check seat availability
    const seatNumbers = passengers.map(p => p.seatNumber);
    const existingSeats = await Seat.find({
      flight: flightId,
      seatNumber: { $in: seatNumbers }
    });

    // Check for seat conflicts
    const occupiedSeats = existingSeats.filter(seat => seat.isOccupied);
    if (occupiedSeats.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Seats ${occupiedSeats.map(s => s.seatNumber).join(', ')} are already occupied`
      });
    }

    // Calculate total amount (simple: flight price * number of passengers)
    const totalAmount = flight.price * passengers.length;

    // Create booking
    const booking = await Booking.create({
      user: userId,
      flight: flightId,
      passengers,
      totalAmount,
      bookingDate: new Date(),
      travelDate: new Date(travelDate),
      status: 'confirmed',
      paymentStatus: 'pending'
    });

    // Mark seats as occupied
    await Seat.updateMany(
      { flight: flightId, seatNumber: { $in: seatNumbers } },
      { 
        isOccupied: true, 
        booking: booking._id,
        updatedAt: new Date()
      }
    );

    // Update flight available seats
    await Flight.findByIdAndUpdate(flightId, {
      $inc: { availableSeats: -passengers.length }
    });

    // Populate the booking with flight details
    await booking.populate('flight', 'airline airlineCode flightNumber origin destination departure arrival duration');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });

  } catch (error) {
    console.error('Create booking error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error while creating booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings
// @access  Private
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    // Build query
    const query = { user: userId };
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const bookings = await Booking.find(query)
      .populate('flight', 'airline airlineCode flightNumber origin destination departure arrival duration')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: bookings
    });

  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings'
    });
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;

    const booking = await Booking.findOne({ _id: bookingId, user: userId })
      .populate('flight', 'airline airlineCode flightNumber origin destination departure arrival duration')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching booking'
    });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;

    const booking = await Booking.findOne({ _id: bookingId, user: userId });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    // Check if booking can be cancelled (e.g., not within 24 hours of departure)
    const flight = await Flight.findById(booking.flight);
    const departureTime = new Date(flight.departure);
    const now = new Date();
    const hoursUntilDeparture = (departureTime - now) / (1000 * 60 * 60);

    if (hoursUntilDeparture < 24) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled within 24 hours of departure'
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    // Free up seats
    const seatNumbers = booking.passengers.map(p => p.seatNumber);
    await Seat.updateMany(
      { flight: booking.flight, seatNumber: { $in: seatNumbers } },
      { 
        isOccupied: false, 
        booking: null,
        updatedAt: new Date()
      }
    );

    // Update flight available seats
    await Flight.findByIdAndUpdate(booking.flight, {
      $inc: { availableSeats: booking.passengers.length }
    });

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling booking'
    });
  }
};

// @desc    Get available seats for a flight
// @route   GET /api/bookings/seats/:flightId
// @access  Public
exports.getAvailableSeats = async (req, res) => {
  try {
    const flightId = req.params.flightId;

    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    // Get all seats for the flight
    const seats = await Seat.find({ flight: flightId })
      .sort({ row: 1, column: 1 })
      .lean();

    // Group seats by row (simple structure)
    const seatMap = {};

    seats.forEach(seat => {
      if (!seatMap[seat.row]) {
        seatMap[seat.row] = [];
      }
      seatMap[seat.row].push({
        seatNumber: seat.seatNumber,
        column: seat.column,
        isOccupied: seat.isOccupied
      });
    });

    res.status(200).json({
      success: true,
      data: {
        flight: {
          _id: flight._id,
          airline: flight.airline,
          airlineCode: flight.airlineCode,
          flightNumber: flight.flightNumber,
          origin: flight.origin,
          destination: flight.destination,
          departure: flight.departure,
          arrival: flight.arrival,
          duration: flight.duration,
          totalSeats: flight.totalSeats,
          availableSeats: flight.availableSeats
        },
        seats: seatMap
      }
    });

  } catch (error) {
    console.error('Get available seats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching available seats'
    });
  }
};
