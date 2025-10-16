import { Button } from "@/components/ui/button";
import { BookingData } from "./BookingDialog";
import { CheckCircle, Plane, Calendar, Users, CreditCard } from "lucide-react";

interface BookingConfirmationProps {
  booking: BookingData;
  onClose: () => void;
}

export const BookingConfirmation = ({ booking, onClose }: BookingConfirmationProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold">Booking Confirmed!</h2>
        <p className="text-sm sm:text-base text-muted-foreground px-4">
          Your flight has been successfully booked. A confirmation email will be sent shortly.
        </p>
      </div>

      <div className="bg-muted/30 rounded-lg p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 gap-4">
          <div className="flex-1">
            <p className="text-xs sm:text-sm text-muted-foreground">Booking Reference</p>
            <p className="text-lg sm:text-xl font-bold font-mono break-all">{booking.bookingReference}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs sm:text-sm text-muted-foreground">Total Amount</p>
            <p className="text-xl sm:text-2xl font-bold">₹{booking.totalAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Plane className="w-5 h-5 text-primary mt-1" />
            <div className="flex-1">
              <p className="font-semibold">{booking.flight.airline}</p>
              <p className="text-sm text-muted-foreground">
                {booking.flight.airlineCode} {booking.flight.flightNumber}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-primary mt-1" />
            <div className="flex-1">
              <p className="font-semibold">Travel Date</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(booking.travelDate)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-card rounded p-3">
              <p className="text-xs text-muted-foreground">Departure</p>
              <p className="font-semibold text-sm sm:text-base">{booking.flight.origin}</p>
              <p className="text-xs sm:text-sm">{formatTime(booking.flight.departure)}</p>
            </div>
            <div className="bg-card rounded p-3">
              <p className="text-xs text-muted-foreground">Arrival</p>
              <p className="font-semibold text-sm sm:text-base">{booking.flight.destination}</p>
              <p className="text-xs sm:text-sm">{formatTime(booking.flight.arrival)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm sm:text-base">Passengers ({booking.passengers.length})</p>
              <div className="mt-2 space-y-1">
                {booking.passengers.map((passenger, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 text-xs sm:text-sm">
                    <span className="text-muted-foreground break-words">
                      {passenger.firstName} {passenger.lastName}
                    </span>
                    <span className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-medium w-fit">
                      {passenger.seatNumber}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={onClose} className="flex-1">
          Close
        </Button>
      </div>
    </div>
  );
};
