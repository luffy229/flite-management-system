# Flight Booking System Scripts

This directory contains utility scripts for managing the flight booking system database.

## Available Scripts

### 1. `seedFlights.js`
**Purpose**: Seeds the database with initial flight data
**Usage**: `npm run seed`
**When to use**: 
- Initial database setup
- When you want to reset all flight data

### 2. `generateSeats.js`
**Purpose**: Generates seats for ALL flights (including existing ones)
**Usage**: `npm run generate-seats`
**When to use**: 
- When you want to regenerate seats for all flights
- After clearing the seats collection
- When seat structure needs to be updated

### 3. `generateSeatsForNewFlights.js`
**Purpose**: Generates seats ONLY for flights that don't have seats yet
**Usage**: `npm run generate-seats-new`
**When to use**: 
- After adding new flights to the database
- When you want to add seats to new flights without affecting existing ones
- **This is the recommended script for adding seats to new flights**

## How to Add New Flights

### Method 1: Using the seed script (Recommended for bulk additions)
1. Add your new flights to `seedFlights.js`
2. Run `npm run seed` to add flights to database
3. Run `npm run generate-seats-new` to create seats for the new flights

### Method 2: Manual addition
1. Add flights directly to the database (via API or MongoDB client)
2. Run `npm run generate-seats-new` to create seats for flights without seats

## Script Features

- **Smart Detection**: Scripts automatically detect which flights already have seats
- **Error Handling**: Graceful error handling with detailed logging
- **Progress Tracking**: Shows progress and summary of operations
- **Safe Operation**: Won't duplicate seats for flights that already have them

## Example Output

```
Connected to MongoDB
Found 5 flights
Flight 6E 101 already has 72 seats - skipping
Flight AI 220 already has 48 seats - skipping
Creating seats for flight SG 310...
✅ Created 39 seats for flight SG 310
Creating seats for flight UK 415...
✅ Created 92 seats for flight UK 415

🎉 Seat generation completed!
📊 Summary:
   - Flights processed: 2
   - Total seats created: 131
   - Flights skipped (already have seats): 3
Disconnected from MongoDB
```

## Important Notes

- Always run `generate-seats-new` after adding new flights
- The scripts assume 6 seats per row (A-F configuration)
- Seats are generated based on the `totalSeats` field in the Flight model
- Scripts are safe to run multiple times (won't create duplicate seats)
