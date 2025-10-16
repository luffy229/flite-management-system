const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Flight = require('../models/Flight');

// Load environment variables
dotenv.config();

// Sample flight data
const sampleFlights = [
  {
    "airline": "Indigo",
    "airlineCode": "6E",
    "flightNumber": 101,
    "origin": "PNQ",
    "availableSeats": 72,
    "destination": "DEL",
    "price": 5645,
    "departure": "2025-10-16T06:45:00.000Z",
    "arrival": "2025-10-16T08:55:00.000Z",
    "duration": "2h 10m",
    "operationalDays": [1,3,5]
  },
  {
    "airline": "Air India",
    "airlineCode": "AI",
    "flightNumber": 220,
    "origin": "PNQ",
    "availableSeats": 48,
    "destination": "DEL",
    "price": 6240,
    "departure": "2025-10-16T11:30:00.000Z",
    "arrival": "2025-10-16T13:40:00.000Z",
    "duration": "2h 10m",
    "operationalDays": [2,4,6]
  },
  {
    "airline": "Spice Jet",
    "airlineCode": "SG",
    "flightNumber": 310,
    "origin": "PNQ",
    "availableSeats": 39,
    "destination": "DEL",
    "price": 5789,
    "departure": "2025-10-16T16:15:00.000Z",
    "arrival": "2025-10-16T18:30:00.000Z",
    "duration": "2h 15m",
    "operationalDays": [1,3,5]
  },
  {
    "airline": "Vistara",
    "airlineCode": "UK",
    "flightNumber": 415,
    "origin": "BOM",
    "availableSeats": 92,
    "destination": "BLR",
    "price": 4990,
    "departure": "2025-10-17T05:20:00.000Z",
    "arrival": "2025-10-17T07:05:00.000Z",
    "duration": "1h 45m",
    "operationalDays": [2,4,6]
  },
  {
    "airline": "Go Air",
    "airlineCode": "G8",
    "flightNumber": 532,
    "origin": "BOM",
    "availableSeats": 55,
    "destination": "BLR",
    "price": 4620,
    "departure": "2025-10-17T09:10:00.000Z",
    "arrival": "2025-10-17T10:55:00.000Z",
    "duration": "1h 45m",
    "operationalDays": [1,3,5]
  },
  {
    "airline": "Indigo",
    "airlineCode": "6E",
    "flightNumber": 540,
    "origin": "BOM",
    "availableSeats": 80,
    "destination": "BLR",
    "price": 5125,
    "departure": "2025-10-17T15:25:00.000Z",
    "arrival": "2025-10-17T17:10:00.000Z",
    "duration": "1h 45m",
    "operationalDays": [2,4,6]
  },
  {
    "airline": "Air India",
    "airlineCode": "AI",
    "flightNumber": 300,
    "origin": "HYD",
    "availableSeats": 64,
    "destination": "MAA",
    "price": 3540,
    "departure": "2025-10-18T07:15:00.000Z",
    "arrival": "2025-10-18T08:25:00.000Z",
    "duration": "1h 10m",
    "operationalDays": [1,2,3,4,5,6]
  },
  {
    "airline": "Spice Jet",
    "airlineCode": "SG",
    "flightNumber": 312,
    "origin": "HYD",
    "availableSeats": 25,
    "destination": "MAA",
    "price": 3390,
    "departure": "2025-10-18T13:45:00.000Z",
    "arrival": "2025-10-18T14:55:00.000Z",
    "duration": "1h 10m",
    "operationalDays": [1,3,5,6]
  },
  {
    "airline": "Indigo",
    "airlineCode": "6E",
    "flightNumber": 354,
    "origin": "HYD",
    "availableSeats": 82,
    "destination": "MAA",
    "price": 3670,
    "departure": "2025-10-18T18:30:00.000Z",
    "arrival": "2025-10-18T19:40:00.000Z",
    "duration": "1h 10m",
    "operationalDays": [2,4,6]
  },
  {
    "airline": "Vistara",
    "airlineCode": "UK",
    "flightNumber": 460,
    "origin": "DEL",
    "availableSeats": 43,
    "destination": "BOM",
    "price": 5980,
    "departure": "2025-10-19T06:00:00.000Z",
    "arrival": "2025-10-19T08:05:00.000Z",
    "duration": "2h 05m",
    "operationalDays": [1,3,5]
  },
  {
    "airline": "Air India",
    "airlineCode": "AI",
    "flightNumber": 470,
    "origin": "DEL",
    "availableSeats": 30,
    "destination": "BOM",
    "price": 6540,
    "departure": "2025-10-19T10:15:00.000Z",
    "arrival": "2025-10-19T12:20:00.000Z",
    "duration": "2h 05m",
    "operationalDays": [2,4,6]
  },
  {
    "airline": "Go Air",
    "airlineCode": "G8",
    "flightNumber": 489,
    "origin": "DEL",
    "availableSeats": 60,
    "destination": "BOM",
    "price": 6120,
    "departure": "2025-10-19T14:35:00.000Z",
    "arrival": "2025-10-19T16:45:00.000Z",
    "duration": "2h 10m",
    "operationalDays": [1,2,3,4,5,6]
  },
  {
    "airline": "Indigo",
    "airlineCode": "6E",
    "flightNumber": 510,
    "origin": "BLR",
    "availableSeats": 91,
    "destination": "PNQ",
    "price": 4770,
    "departure": "2025-10-20T06:45:00.000Z",
    "arrival": "2025-10-20T08:25:00.000Z",
    "duration": "1h 40m",
    "operationalDays": [1,3,5]
  },
  {
    "airline": "Air India",
    "airlineCode": "AI",
    "flightNumber": 521,
    "origin": "BLR",
    "availableSeats": 77,
    "destination": "PNQ",
    "price": 5100,
    "departure": "2025-10-20T10:30:00.000Z",
    "arrival": "2025-10-20T12:10:00.000Z",
    "duration": "1h 40m",
    "operationalDays": [2,4,6]
  },
  {
    "airline": "Spice Jet",
    "airlineCode": "SG",
    "flightNumber": 530,
    "origin": "BLR",
    "availableSeats": 33,
    "destination": "PNQ",
    "price": 4990,
    "departure": "2025-10-20T14:00:00.000Z",
    "arrival": "2025-10-20T15:45:00.000Z",
    "duration": "1h 45m",
    "operationalDays": [1,3,5]
  },
  {
    "airline": "Vistara",
    "airlineCode": "UK",
    "flightNumber": 540,
    "origin": "DEL",
    "availableSeats": 62,
    "destination": "BLR",
    "price": 7180,
    "departure": "2025-10-20T17:30:00.000Z",
    "arrival": "2025-10-20T19:45:00.000Z",
    "duration": "2h 15m",
    "operationalDays": [2,4,6]
  },
  {
    "airline": "Indigo",
    "airlineCode": "6E",
    "flightNumber": 550,
    "origin": "DEL",
    "availableSeats": 105,
    "destination": "BLR",
    "price": 6890,
    "departure": "2025-10-21T06:30:00.000Z",
    "arrival": "2025-10-21T08:50:00.000Z",
    "duration": "2h 20m",
    "operationalDays": [1,2,3,4,5,6]
  },
  {
    "airline": "Air India",
    "airlineCode": "AI",
    "flightNumber": 560,
    "origin": "DEL",
    "availableSeats": 50,
    "destination": "BLR",
    "price": 7250,
    "departure": "2025-10-21T12:10:00.000Z",
    "arrival": "2025-10-21T14:25:00.000Z",
    "duration": "2h 15m",
    "operationalDays": [2,4,6]
  },
  {
    "airline": "Go Air",
    "airlineCode": "G8",
    "flightNumber": 575,
    "origin": "DEL",
    "availableSeats": 58,
    "destination": "BLR",
    "price": 6980,
    "departure": "2025-10-21T16:00:00.000Z",
    "arrival": "2025-10-21T18:15:00.000Z",
    "duration": "2h 15m",
    "operationalDays": [1,3,5]
  },
  {
    "airline": "Vistara",
    "airlineCode": "UK",
    "flightNumber": 580,
    "origin": "PNQ",
    "availableSeats": 84,
    "destination": "DEL",
    "price": 6350,
    "departure": "2025-10-21T09:20:00.000Z",
    "arrival": "2025-10-21T11:35:00.000Z",
    "duration": "2h 15m",
    "operationalDays": [2,4,6]
  },
  {
    "airline": "Indigo",
    "airlineCode": "6E",
    "flightNumber": 581,
    "origin": "PNQ",
    "availableSeats": 70,
    "destination": "DEL",
    "price": 5990,
    "departure": "2025-10-21T13:45:00.000Z",
    "arrival": "2025-10-21T16:00:00.000Z",
    "duration": "2h 15m",
    "operationalDays": [1,3,5]
  },
  {
    "airline": "Air India",
    "airlineCode": "AI",
    "flightNumber": 582,
    "origin": "PNQ",
    "availableSeats": 35,
    "destination": "DEL",
    "price": 6780,
    "departure": "2025-10-21T17:20:00.000Z",
    "arrival": "2025-10-21T19:30:00.000Z",
    "duration": "2h 10m",
    "operationalDays": [2,4,6]
  },
  {
    "airline": "Spice Jet",
    "airlineCode": "SG",
    "flightNumber": 583,
    "origin": "PNQ",
    "availableSeats": 40,
    "destination": "DEL",
    "price": 6210,
    "departure": "2025-10-21T20:00:00.000Z",
    "arrival": "2025-10-21T22:15:00.000Z",
    "duration": "2h 15m",
    "operationalDays": [1,3,5]
  },
  {
    "airline": "Indigo",
    "airlineCode": "6E",
    "flightNumber": 584,
    "origin": "DEL",
    "availableSeats": 91,
    "destination": "HYD",
    "price": 5120,
    "departure": "2025-10-18T08:00:00.000Z",
    "arrival": "2025-10-18T10:05:00.000Z",
    "duration": "2h 05m",
    "operationalDays": [1,3,5]
  },
  {
    "airline": "Go Air",
    "airlineCode": "G8",
    "flightNumber": 585,
    "origin": "DEL",
    "availableSeats": 67,
    "destination": "HYD",
    "price": 5250,
    "departure": "2025-10-18T13:30:00.000Z",
    "arrival": "2025-10-18T15:35:00.000Z",
    "duration": "2h 05m",
    "operationalDays": [2,4,6]
  },
  {
    "airline": "Vistara",
    "airlineCode": "UK",
    "flightNumber": 586,
    "origin": "DEL",
    "availableSeats": 82,
    "destination": "HYD",
    "price": 5890,
    "departure": "2025-10-18T18:45:00.000Z",
    "arrival": "2025-10-18T20:55:00.000Z",
    "duration": "2h 10m",
    "operationalDays": [1,3,5]
  },
  {
    "airline": "Air India",
    "airlineCode": "AI",
    "flightNumber": 587,
    "origin": "HYD",
    "availableSeats": 58,
    "destination": "DEL",
    "price": 6150,
    "departure": "2025-10-19T07:00:00.000Z",
    "arrival": "2025-10-19T09:10:00.000Z",
    "duration": "2h 10m",
    "operationalDays": [1,2,3,4,5,6]
  },
  {
    "airline": "Spice Jet",
    "airlineCode": "SG",
    "flightNumber": 588,
    "origin": "HYD",
    "availableSeats": 32,
    "destination": "DEL",
    "price": 5830,
    "departure": "2025-10-19T13:20:00.000Z",
    "arrival": "2025-10-19T15:35:00.000Z",
    "duration": "2h 15m",
    "operationalDays": [2,4,6]
  },
  {
    "airline": "Indigo",
    "airlineCode": "6E",
    "flightNumber": 589,
    "origin": "HYD",
    "availableSeats": 76,
    "destination": "DEL",
    "price": 5720,
    "departure": "2025-10-19T19:15:00.000Z",
    "arrival": "2025-10-19T21:25:00.000Z",
    "duration": "2h 10m",
    "operationalDays": [1,3,5]
  }
]

const seedFlights = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing flights
    await Flight.deleteMany({});
    console.log('Cleared existing flights');

    // Insert sample flights
    const flights = await Flight.insertMany(sampleFlights);
    console.log(`Inserted ${flights.length} flights`);

    console.log('Flight seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding flights:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seeding function
seedFlights();
