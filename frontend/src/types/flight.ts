export interface Flight {
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

export interface FlightSearchParams {
  origin?: string;
  destination?: string;
  departureDate?: string;
  passengers?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FlightSearchResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  totalPages: number;
  data: Flight[];
}
