const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  user?: T;
  token?: string;
  errors?: any[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
}

interface Flight {
  _id: string;
  airline: string;
  airlineCode: string;
  flightNumber: number;
  origin: string;
  destination: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  departure: string;
  arrival: string;
  duration: string;
  operationalDays: number[];
  seatConfiguration?: {
    economy: {
      rows: number;
      seatsPerRow: number;
      price: number;
    };
    business: {
      rows: number;
      seatsPerRow: number;
      price: number;
    };
    first: {
      rows: number;
      seatsPerRow: number;
      price: number;
    };
  };
  createdAt?: string;
  updatedAt?: string;
}

interface Passenger {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  seatNumber: string;
}

interface Booking {
  _id: string;
  user: string;
  flight: Flight;
  passengers: Passenger[];
  totalAmount: number;
  bookingDate: string;
  travelDate: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  bookingReference: string;
  createdAt: string;
  updatedAt: string;
}

interface Seat {
  seatNumber: string;
  column: string;
  isOccupied: boolean;
}

interface SeatMap {
  [row: number]: Seat[];
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(name: string, email: string, password: string): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async login(email: string, password: string): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me', {
      method: 'GET',
    });
  }

  // Flight endpoints
  async getFlights(params: {
    origin?: string;
    destination?: string;
    departureDate?: string;
    passengers?: number;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<ApiResponse<Flight[]>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/flights?${queryString}` : '/flights';
    
    return this.request<Flight[]>(endpoint, {
      method: 'GET',
    });
  }

  async getFlight(id: string): Promise<ApiResponse<Flight>> {
    return this.request<Flight>(`/flights/${id}`, {
      method: 'GET',
    });
  }

  async getPopularDestinations(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/flights/popular-destinations', {
      method: 'GET',
    });
  }

  // Booking endpoints
  async createBooking(data: {
    flightId: string;
    passengers: Passenger[];
    travelDate: string;
  }): Promise<ApiResponse<Booking>> {
    return this.request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUserBookings(params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}): Promise<ApiResponse<Booking[]>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/bookings?${queryString}` : '/bookings';
    
    return this.request<Booking[]>(endpoint, {
      method: 'GET',
    });
  }

  async getBooking(id: string): Promise<ApiResponse<Booking>> {
    return this.request<Booking>(`/bookings/${id}`, {
      method: 'GET',
    });
  }

  async cancelBooking(id: string): Promise<ApiResponse<Booking>> {
    return this.request<Booking>(`/bookings/${id}/cancel`, {
      method: 'PUT',
    });
  }

        async getAvailableSeats(flightId: string): Promise<ApiResponse<{
          flight: Flight;
          seats: SeatMap;
        }>> {
    return this.request(`/bookings/seats/${flightId}`, {
      method: 'GET',
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.request<any>('/health', {
      method: 'GET',
    });
  }
}

export const apiService = new ApiService(API_BASE_URL);
export type { User, Flight, Booking, Passenger, Seat, SeatMap, ApiResponse };
