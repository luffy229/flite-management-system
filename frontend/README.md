# Fly Connect Sky - Frontend

A modern, responsive React application for flight booking and management built with TypeScript, Vite, and shadcn/ui components.

## 🚀 Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Flight Search**: Search flights by origin, destination, date, and passengers
- **Booking Management**: Create, view, and manage flight bookings
- **Seat Selection**: Interactive seat selection with real-time availability
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Beautiful interface built with shadcn/ui and Tailwind CSS
- **Real-time Updates**: Live flight availability and booking status
- **User Dashboard**: Personal booking history and management

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui + Radix UI primitives
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context API
- **HTTP Client**: Fetch API with custom service layer
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner toast notifications

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Setup

1. **Clone the repository**:
   ```bash
   git clone <https://github.com/luffy229/flite-management-system.git>
   cd fly-connect-sky/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## 🚀 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   └── booking/         # Booking-specific components
├── contexts/            # React Context providers
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── pages/               # Page components
├── services/            # API service layer
├── types/               # TypeScript type definitions
└── main.tsx            # Application entry point
```

## 🎨 UI Components

The application uses shadcn/ui components for a consistent and accessible design:

- **Forms**: Input, Label, Button with validation
- **Layout**: Card, Dialog, Tabs, Separator
- **Feedback**: Toast notifications, Alert dialogs
- **Navigation**: Responsive header with user menu
- **Data Display**: Flight cards, booking lists

## 🔐 Authentication

The app implements JWT-based authentication:

- Secure login/registration forms
- Protected routes with authentication checks
- Automatic token refresh and logout
- User context for global state management

## 🛫 Flight Booking Flow

1. **Search**: Users search for flights by origin, destination, and date
2. **Results**: Display available flights with pricing and details
3. **Selection**: Choose preferred flight and seat
4. **Booking**: Complete booking with passenger details
5. **Confirmation**: Receive booking confirmation and reference

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Fly Connect Sky** - Your journey starts here ✈️
