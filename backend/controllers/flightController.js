const Flight = require('../models/Flight');
const { validationResult } = require('express-validator');

// @desc    Get all flights with search and filter
// @route   GET /api/flights
// @access  Public
exports.getFlights = async (req, res) => {
  try {
    const {
      origin,
      destination,
      departureDate,
      passengers = 1,
      page = 1,
      limit = 10,
      sortBy = 'departure',
      sortOrder = 'asc'
    } = req.query;

    // Build query object
    const query = {};

    // Add origin filter if provided
    if (origin) {
      query.origin = origin.toUpperCase();
    }

    // Add destination filter if provided
    if (destination) {
      query.destination = destination.toUpperCase();
    }

    // Add departure date filter if provided
    if (departureDate) {
      const selectedDate = new Date(departureDate);
      const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      // Create date range for the specific selected date
      const startDate = new Date(departureDate);
      const endDate = new Date(departureDate);
      endDate.setDate(endDate.getDate() + 1);
      
      // Only show flights that have departure dates on the selected date
      // This ensures we only get flights for the specific date, not based on operational days
      query.departure = {
        $gte: startDate,
        $lt: endDate
      };
    }

    // Add available seats filter
    query.availableSeats = { $gte: parseInt(passengers) };

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const flights = await Flight.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Flight.countDocuments(query);

    res.status(200).json({
      success: true,
      count: flights.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: flights
    });
  } catch (error) {
    console.error('Get flights error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching flights'
    });
  }
};

// @desc    Get single flight by ID
// @route   GET /api/flights/:id
// @access  Public
exports.getFlight = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    res.status(200).json({
      success: true,
      data: flight
    });
  } catch (error) {
    console.error('Get flight error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching flight'
    });
  }
};

// @desc    Create new flight (Admin only)
// @route   POST /api/flights
// @access  Private/Admin
exports.createFlight = async (req, res) => {
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

    const flight = await Flight.create(req.body);

    res.status(201).json({
      success: true,
      data: flight
    });
  } catch (error) {
    console.error('Create flight error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating flight'
    });
  }
};

// @desc    Update flight (Admin only)
// @route   PUT /api/flights/:id
// @access  Private/Admin
exports.updateFlight = async (req, res) => {
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

    const flight = await Flight.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    res.status(200).json({
      success: true,
      data: flight
    });
  } catch (error) {
    console.error('Update flight error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating flight'
    });
  }
};

// @desc    Delete flight (Admin only)
// @route   DELETE /api/flights/:id
// @access  Private/Admin
exports.deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Flight deleted successfully'
    });
  } catch (error) {
    console.error('Delete flight error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting flight'
    });
  }
};

// @desc    Get popular destinations
// @route   GET /api/flights/popular-destinations
// @access  Public
exports.getPopularDestinations = async (req, res) => {
  try {
    const popularDestinations = await Flight.aggregate([
      {
        $group: {
          _id: '$destination',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.status(200).json({
      success: true,
      data: popularDestinations
    });
  } catch (error) {
    console.error('Get popular destinations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching popular destinations'
    });
  }
};
