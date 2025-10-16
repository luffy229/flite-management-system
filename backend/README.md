# Fly Connect Sky - Backend API

A robust Node.js with Express backend API for the Fly Connect Sky flight booking system with MongoDB integration, JWT authentication, and comprehensive flight management features.

## 🚀 Features

- **JWT Authentication**: Secure user registration and login
- **Flight Management**: CRUD operations for flights and seat management
- **Booking System**: Complete booking workflow with seat selection
- **MongoDB Integration**: Scalable database with Mongoose ODM
- **Input Validation**: Express-validator for request validation
- **Password Security**: bcrypt hashing for secure password storage
- **CORS Support**: Cross-origin resource sharing configuration
- **Error Handling**: Comprehensive error handling and logging
- **Database Seeding**: Scripts for populating initial data

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose 
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: Express-validator
- **Development**: Nodemon for hot reloading
- **Environment**: dotenv for configuration

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm package manager

### Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd fly-connect-sky/backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/flyconnect?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:5000`

## 🚀 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample flights
- `npm run generate-seats` - Generate seats for existing flights
- `npm run generate-seats-new` - Generate seats for new flights

## 📁 Project Structure

```
backend/
├── config/              # Database configuration
├── controllers/         # Route controllers
│   ├── authController.js
│   ├── bookingController.js
│   └── flightController.js
├── middleware/          # Custom middleware
│   └── auth.js         # JWT authentication middleware
├── models/             # Mongoose models
│   ├── User.js
│   ├── Flight.js
│   ├── Booking.js
│   └── Seat.js
├── routes/             # Express routes
│   ├── auth.js
│   ├── flights.js
│   └── bookings.js
├── scripts/            # Database seeding scripts
│   ├── seedFlights.js
│   ├── generateSeats.js
│   └── generateSeatsForNewFlights.js
├── utils/              # Utility functions
│   └── generateToken.js
├── validators/         # Input validation schemas
│   ├── authValidator.js
│   ├── flightValidator.js
│   └── bookingValidator.js
└── server.js          # Application entry point
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register a new user | No |
| POST | `/login` | Login user | No |
| GET | `/me` | Get current user profile | Yes |

**Request/Response Examples:**

```javascript
// POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

// Response
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

### Flight Routes (`/api/flights`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all flights with filters | No |
| GET | `/:id` | Get flight by ID | No |
| GET | `/popular-destinations` | Get popular destinations | No |

**Query Parameters for GET /api/flights:**
- `origin` - Origin airport code (e.g., "DEL")
- `destination` - Destination airport code (e.g., "BOM")
- `departureDate` - Departure date (YYYY-MM-DD)
- `passengers` - Number of passengers
- `page` - Page number for pagination
- `limit` - Number of results per page
- `sortBy` - Sort field (price, departure, duration)
- `sortOrder` - Sort order (asc, desc)

### Booking Routes (`/api/bookings`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create a new booking | Yes |
| GET | `/` | Get user's bookings | Yes |
| GET | `/:id` | Get booking by ID | Yes |
| PUT | `/:id/cancel` | Cancel a booking | Yes |
| GET | `/seats/:flightId` | Get available seats for flight | Yes |

**Booking Request Example:**

```javascript
// POST /api/bookings
{
  "flightId": "flight_id_here",
  "passengers": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "seatNumber": "A1"
    }
  ],
  "travelDate": "2024-01-15"
}
```

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check server status |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Registration/Login**: Returns a JWT token
2. **Protected Routes**: Include token in Authorization header
3. **Token Format**: `Bearer <jwt_token>`
4. **Expiration**: Tokens expire after 7 days (configurable)

**Example Request with Authentication:**
```javascript
fetch('/api/bookings', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer your_jwt_token_here',
    'Content-Type': 'application/json'
  }
})
```

## 🗄️ Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (default: 'user'),
  createdAt: Date,
  updatedAt: Date
}
```

### Flight Model
```javascript
{
  airline: String,
  airlineCode: String,
  flightNumber: Number,
  origin: String,
  destination: String,
  totalSeats: Number,
  availableSeats: Number,
  price: Number,
  departure: Date,
  arrival: Date,
  duration: String,
  operationalDays: [Number],
  seatConfiguration: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Model
```javascript
{
  user: ObjectId (ref: User),
  flight: ObjectId (ref: Flight),
  passengers: [Object],
  totalAmount: Number,
  bookingDate: Date,
  travelDate: Date,
  status: String (confirmed/cancelled/completed),
  bookingReference: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🛠️ Database Setup

### Initial Data Seeding

1. **Seed Flights**:
   ```bash
   npm run seed
   ```

2. **Generate Seats for Existing Flights**:
   ```bash
   npm run generate-seats
   ```

3. **Generate Seats for New Flights**:
   ```bash
   npm run generate-seats-new
   ```

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address
5. Get the connection string
6. Update `MONGODB_URI` in your `.env` file

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | Secret key for JWT signing | Required |
| `JWT_EXPIRE` | JWT token expiration time | 7d |
| `NODE_ENV` | Environment (development/production) | development |

### CORS Configuration

The API is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative dev server)
- Your production frontend domain

## 🚀 Deployment

### Production Setup

1. **Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_production_jwt_secret
   JWT_EXPIRE=7d
   ```

2. **Build and Start**:
   ```bash
   npm install --production
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

---

**Fly Connect Sky Backend** - Powering your flight booking experience ✈️