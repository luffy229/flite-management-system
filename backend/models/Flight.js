const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  airline: {
    type: String,
    required: [true, 'Airline name is required'],
    trim: true
  },
  airlineCode: {
    type: String,
    required: [true, 'Airline code is required'],
    trim: true,
    uppercase: true
  },
  flightNumber: {
    type: Number,
    required: [true, 'Flight number is required'],
    min: [1, 'Flight number must be positive']
  },
  origin: {
    type: String,
    required: [true, 'Origin airport code is required'],
    trim: true,
    uppercase: true,
    length: [3, 'Airport code must be 3 characters']
  },
  destination: {
    type: String,
    required: [true, 'Destination airport code is required'],
    trim: true,
    uppercase: true,
    length: [3, 'Airport code must be 3 characters']
  },
  totalSeats: {
    type: Number,
    required: [true, 'Total seats count is required'],
    min: [1, 'Total seats must be at least 1']
  },
  availableSeats: {
    type: Number,
    required: [true, 'Available seats count is required'],
    min: [0, 'Available seats cannot be negative']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  departure: {
    type: Date,
    required: [true, 'Departure time is required']
  },
  arrival: {
    type: Date,
    required: [true, 'Arrival time is required']
  },
  duration: {
    type: String,
    required: [true, 'Flight duration is required'],
    trim: true
  },
  operationalDays: [{
    type: Number,
    min: 0,
    max: 6,
    validate: {
      validator: function(v) {
        return Number.isInteger(v);
      },
      message: 'Operational days must be integers (0=Sunday, 1=Monday, etc.)'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
flightSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better search performance
flightSchema.index({ origin: 1, destination: 1 });
flightSchema.index({ departure: 1 });
flightSchema.index({ airline: 1 });

module.exports = mongoose.model('Flight', flightSchema);
