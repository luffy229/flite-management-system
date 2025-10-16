import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plane, LogOut, ArrowLeft, Calendar, Users, CreditCard, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiService, Booking } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const MyBookings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUserBookings();
      if (response.success) {
        setBookings(response.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch bookings",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading your bookings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Plane className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">My Bookings</h1>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              <span className="text-sm text-muted-foreground hidden sm:block">Welcome, {user?.name}</span>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" onClick={() => navigate("/flights")} className="w-full sm:w-auto">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden xs:inline">Back to Search</span>
                  <span className="xs:hidden">Back</span>
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
        {bookings.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Plane className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No bookings yet</h2>
              <p className="text-muted-foreground mb-6">
                You haven't booked any flights. Start searching for your next adventure!
              </p>
              <Button onClick={() => navigate("/flights")}>
                Search Flights
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-semibold">Your Bookings ({bookings.length})</h2>
            
            {bookings.map((booking) => (
              <Card key={booking._id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-primary/5 px-4 sm:px-6 py-4 border-b">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Booking Reference</p>
                        <p className="font-mono font-semibold text-sm sm:text-base break-all">{booking.bookingReference}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-sm text-muted-foreground">Booked on</p>
                        <p className="font-medium text-sm sm:text-base">{formatDate(booking.bookingDate)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 space-y-6">
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <div className="flex items-center gap-2">
                            <Plane className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold">{booking.flight.airline}</h3>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            Flight {booking.flight.flightNumber}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-muted/30 rounded-lg p-3">
                            <p className="text-xs text-muted-foreground mb-1">Departure</p>
                            <p className="font-semibold text-lg">{booking.flight.origin}</p>
                            <p className="text-sm">{formatTime(booking.flight.departure)}</p>
                          </div>
                          <div className="bg-muted/30 rounded-lg p-3">
                            <p className="text-xs text-muted-foreground mb-1">Arrival</p>
                            <p className="font-semibold text-lg">{booking.flight.destination}</p>
                            <p className="text-sm">{formatTime(booking.flight.arrival)}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3">
                            <Calendar className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm text-muted-foreground">Travel Date</p>
                              <p className="font-medium text-sm sm:text-base">{formatDate(booking.travelDate)}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CreditCard className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm text-muted-foreground">Seat Numbers</p>
                              <p className="font-medium text-sm sm:text-base break-all">{booking.passengers.map(p => p.seatNumber).join(", ")}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Users className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-muted-foreground">Passengers</p>
                            <div className="mt-1 space-y-1">
                              {booking.passengers.map((passenger, pIndex) => (
                                <p key={pIndex} className="text-sm font-medium">
                                  {passenger.firstName} {passenger.lastName}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 lg:gap-3">
                        <div className="text-left lg:text-right">
                          <p className="text-sm text-muted-foreground">Total Amount</p>
                          <p className="text-2xl sm:text-3xl font-bold">₹{booking.totalAmount.toLocaleString()}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            toast({
                              title: "Booking Status",
                              description: `Status: ${booking.status}`
                            });
                          }}
                          className="w-full sm:w-auto lg:w-full"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyBookings;