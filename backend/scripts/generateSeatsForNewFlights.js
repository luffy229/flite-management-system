const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Flight = require('../models/Flight');
const Seat = require('../models/Seat');

dotenv.config();

const generateSeatsForNewFlights = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all flights
    const flights = await Flight.find({});
    console.log(`Found ${flights.length} flights`);

    let totalSeatsCreated = 0;
    let flightsProcessed = 0;

    for (const flight of flights) {
      // Check if seats already exist for this flight
      const existingSeats = await Seat.countDocuments({ flight: flight._id });
      
      if (existingSeats > 0) {
        console.log(`Flight ${flight.airlineCode} ${flight.flightNumber} already has ${existingSeats} seats - skipping`);
        continue;
      }

      console.log(`Creating seats for flight ${flight.airlineCode} ${flight.flightNumber}...`);
      
      const seatsToCreate = [];
      const totalSeats = flight.totalSeats;
      
      // Calculate rows and seats per row (assuming 6 seats per row)
      const seatsPerRow = 6;
      const totalRows = Math.ceil(totalSeats / seatsPerRow);
      
      let seatCount = 0;
      for (let row = 1; row <= totalRows && seatCount < totalSeats; row++) {
        for (let col = 0; col < seatsPerRow && seatCount < totalSeats; col++) {
          const column = String.fromCharCode(65 + col); // A, B, C, D, E, F
          seatsToCreate.push({
            flight: flight._id,
            seatNumber: `${row}${column}`,
            row: row,
            column: column,
            isOccupied: false
          });
          seatCount++;
        }
      }

      if (seatsToCreate.length > 0) {
        try {
          await Seat.insertMany(seatsToCreate, { ordered: false });
          console.log(`✅ Created ${seatsToCreate.length} seats for flight ${flight.airlineCode} ${flight.flightNumber}`);
          totalSeatsCreated += seatsToCreate.length;
          flightsProcessed++;
        } catch (error) {
          console.error(`❌ Error creating seats for flight ${flight.airlineCode} ${flight.flightNumber}:`, error.message);
        }
      }
    }

    console.log('\n🎉 Seat generation completed!');
    console.log(`📊 Summary:`);
    console.log(`   - Flights processed: ${flightsProcessed}`);
    console.log(`   - Total seats created: ${totalSeatsCreated}`);
    console.log(`   - Flights skipped (already have seats): ${flights.length - flightsProcessed}`);

  } catch (error) {
    console.error('❌ Error generating seats:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
generateSeatsForNewFlights();
