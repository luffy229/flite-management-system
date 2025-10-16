const { body } = require('express-validator');

exports.flightValidation = [
  body('airline')
    .trim()
    .notEmpty()
    .withMessage('Airline name is required'),
  
  body('airlineCode')
    .trim()
    .notEmpty()
    .withMessage('Airline code is required')
    .isLength({ min: 2, max: 3 })
    .withMessage('Airline code must be 2-3 characters'),
  
  body('flightNumber')
    .isInt({ min: 1 })
    .withMessage('Flight number must be a positive integer'),
  
  body('origin')
    .trim()
    .notEmpty()
    .withMessage('Origin airport code is required')
    .isLength({ min: 3, max: 3 })
    .withMessage('Origin airport code must be exactly 3 characters'),
  
  body('destination')
    .trim()
    .notEmpty()
    .withMessage('Destination airport code is required')
    .isLength({ min: 3, max: 3 })
    .withMessage('Destination airport code must be exactly 3 characters'),
  
  body('availableSeats')
    .isInt({ min: 0 })
    .withMessage('Available seats must be a non-negative integer'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  
  body('departure')
    .isISO8601()
    .withMessage('Departure time must be a valid ISO 8601 date'),
  
  body('arrival')
    .isISO8601()
    .withMessage('Arrival time must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      const departure = new Date(req.body.departure);
      const arrival = new Date(value);
      
      if (arrival <= departure) {
        throw new Error('Arrival time must be after departure time');
      }
      
      return true;
    }),
  
  body('duration')
    .trim()
    .notEmpty()
    .withMessage('Flight duration is required'),
  
  body('operationalDays')
    .isArray({ min: 1 })
    .withMessage('At least one operational day is required')
    .custom((value) => {
      const validDays = [0, 1, 2, 3, 4, 5, 6]; // 0 = Sunday, 6 = Saturday
      const invalidDays = value.filter(day => !validDays.includes(day));
      
      if (invalidDays.length > 0) {
        throw new Error('Operational days must be integers from 0-6 (0=Sunday, 6=Saturday)');
      }
      
      return true;
    })
];
