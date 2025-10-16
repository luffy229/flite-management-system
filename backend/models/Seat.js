const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    required: [true, 'Flight is required']
  },
  seatNumber: {
    type: String,
    required: [true, 'Seat number is required'],
    trim: true,
    uppercase: true
  },
  row: {
    type: Number,
    required: [true, 'Row number is required'],
    min: [1, 'Row number must be positive']
  },
  column: {
    type: String,
    required: [true, 'Column letter is required'],
    trim: true,
    uppercase: true
  },
  isOccupied: {
    type: Boolean,
    default: false
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    default: null
  },
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
seatSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Compound index to ensure unique seat per flight
seatSchema.index({ flight: 1, seatNumber: 1 }, { unique: true });
seatSchema.index({ flight: 1, isOccupied: 1 });

module.exports = mongoose.model('Seat', seatSchema);
