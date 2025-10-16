import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import { Flight } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plane, LogOut, Calendar, Ticket, Search, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BookingDialog } from "@/components/booking/BookingDialog";

const Flights = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [searchResults, setSearchResults] = useState<Flight[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [passengers, setPassengers] = useState(1);

  const handleSearch = async () => {
    if (!origin || !destination) {
      toast({ title: "Please enter both origin and destination", variant: "destructive" });
      return;
    }
    
    if (origin.toUpperCase() === destination.toUpperCase()) {
      toast({ title: "Origin and destination cannot be the same", variant: "destructive" });
      return;
    }

    setIsSearching(true);
    
    try {
      const response = await apiService.getFlights({
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        departureDate: selectedDate || undefined,
        passengers: passengers
      });

      if (response.success && response.data) {
        setSearchResults(response.data);
        
        if (response.data.length === 0) {
          toast({ title: "No flights found", description: "Try different airports or dates" });
        } else {
          toast({ title: `Found ${response.data.length} flights`, description: "Choose your preferred flight" });
        }
      } else {
        toast({ title: "Search failed", description: response.message || "Unable to search flights", variant: "destructive" });
      }
    } catch (error: any) {
      console.error('Flight search error:', error);
      toast({ title: "Search failed", description: "Unable to connect to server", variant: "destructive" });
    } finally {
      setIsSearching(false);
    }
  };

  const handleBooking = (flight: Flight) => {
    if (!selectedDate) {
      toast({
        title: "Please select a travel date",
        variant: "destructive"
      });
      return;
    }
    setSelectedFlight(flight);
    setBookingDialogOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Plane className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Flight Booking</h1>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              <span className="text-sm text-muted-foreground hidden sm:block">Welcome, {user?.name}</span>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" onClick={() => navigate("/bookings")} className="w-full sm:w-auto">
                  <Ticket className="h-4 w-4 mr-2" />
                  <span className="hidden xs:inline">My Bookings</span>
                  <span className="xs:hidden">Bookings</span>
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout} className="w-full sm:w-auto">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Flights</CardTitle>
            <CardDescription>Find the best flights for your journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2 sm:col-span-1">
                <Label htmlFor="origin">From</Label>
                <Input
                  id="origin"
                  type="text"
                  placeholder="Airport code (e.g., DEL)"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                  maxLength={3}
                  className="text-center"
                />
                <p className="text-xs text-muted-foreground text-center">3-letter code</p>
              </div>
              
              <div className="space-y-2 sm:col-span-1">
                <Label htmlFor="destination">To</Label>
                <Input
                  id="destination"
                  type="text"
                  placeholder="Airport code (e.g., BOM)"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value.toUpperCase())}
                  maxLength={3}
                  className="text-center"
                />
                <p className="text-xs text-muted-foreground text-center">3-letter code</p>
              </div>

              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <Label htmlFor="date">Travel Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="pl-9"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <Label htmlFor="passengers">Passengers</Label>
                <Input
                  id="passengers"
                  type="number"
                  min="1"
                  max="9"
                  value={passengers}
                  onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                  className="text-center"
                />
              </div>

              <div className="flex flex-col justify-end sm:col-span-2 lg:col-span-1">
                <Label className="invisible">Search</Label>
                <Button 
                  onClick={handleSearch} 
                  className="w-full h-10" 
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span className="hidden sm:inline">Searching...</span>
                      <span className="sm:hidden">Searching</span>
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Search Flights</span>
                      <span className="sm:hidden">Search</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold">Available Flights</h2>
            {searchResults.map((flight) => (
              <Card key={flight._id} className="overflow-hidden">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row justify-between gap-4">
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h3 className="text-lg font-semibold">{flight.airline}</h3>
                        <span className="text-sm text-muted-foreground">
                          {flight.airlineCode} {flight.flightNumber}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <div className="bg-muted/30 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1">Departure</p>
                          <p className="font-semibold text-lg">{flight.origin}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(flight.departure).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              timeZone: 'UTC'
                            })}
                          </p>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1">Arrival</p>
                          <p className="font-semibold text-lg">{flight.destination}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(flight.arrival).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              timeZone: 'UTC'
                            })}
                          </p>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1">Duration</p>
                          <p className="font-semibold">{flight.duration}</p>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1">Available Seats</p>
                          <p className="font-semibold">{flight.availableSeats}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 lg:gap-3">
                      <div className="text-left lg:text-right">
                        <p className="text-xl sm:text-2xl font-bold">₹{flight.price.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">per person</p>
                      </div>
                      <Button onClick={() => handleBooking(flight)} className="w-full sm:w-auto lg:w-full">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <BookingDialog
        flight={selectedFlight}
        open={bookingDialogOpen}
        onClose={() => {
          setBookingDialogOpen(false);
          setSelectedFlight(null);
        }}
        selectedDate={selectedDate}
        userEmail={user?.email || ""}
      />
    </div>
  );
};

export default Flights;
