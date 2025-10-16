const { body } = require('express-validator');

const bookingValidation = [
  body('flightId')
    .notEmpty()
    .withMessage('Flight ID is required')
    .isMongoId()
    .withMessage('Invalid flight ID'),

  body('travelDate')
    .notEmpty()
    .withMessage('Travel date is required')
    .isISO8601()
    .withMessage('Invalid travel date format')
    .custom((value) => {
      const travelDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (travelDate < today) {
        throw new Error('Travel date cannot be in the past');
      }
      return true;
    }),

  body('passengers')
    .isArray({ min: 1, max: 9 })
    .withMessage('Passengers must be an array with 1-9 passengers'),

  body('passengers.*.firstName')
    .notEmpty()
    .withMessage('First name is required for all passengers')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),

  body('passengers.*.lastName')
    .notEmpty()
    .withMessage('Last name is required for all passengers')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),

  body('passengers.*.email')
    .notEmpty()
    .withMessage('Email is required for all passengers')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  body('passengers.*.phone')
    .notEmpty()
    .withMessage('Phone number is required for all passengers')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Invalid phone number format'),

  body('passengers.*.seatNumber')
    .notEmpty()
    .withMessage('Seat number is required for all passengers')
    .matches(/^[0-9]+[A-F]$/)
    .withMessage('Invalid seat number format (e.g., 12A, 5C)'),

];

module.exports = {
  bookingValidation
};
