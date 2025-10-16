const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    required: [true, 'Flight is required']
  },
  passengers: [{
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    seatNumber: {
      type: String,
      required: [true, 'Seat number is required'],
      trim: true
    },
  }],
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  bookingDate: {
    type: Date,
    required: [true, 'Booking date is required']
  },
  travelDate: {
    type: Date,
    required: [true, 'Travel date is required']
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  bookingReference: {
    type: String,
    unique: true,
    uppercase: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
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
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate booking reference before saving
bookingSchema.pre('save', async function(next) {
  if (this.isNew && !this.bookingReference) {
    let reference;
    let exists = true;
    while (exists) {
      reference = `BK${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      const existingBooking = await this.constructor.findOne({ bookingReference: reference });
      if (!existingBooking) {
        exists = false;
      }
    }
    this.bookingReference = reference;
  }
  next();
});

// Index for better search performance
bookingSchema.index({ user: 1 });
bookingSchema.index({ flight: 1 });
bookingSchema.index({ bookingReference: 1 });
bookingSchema.index({ travelDate: 1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
