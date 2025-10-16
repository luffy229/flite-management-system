import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Flight, Passenger, SeatMap } from "@/services/api";
import { SeatSelection } from "./SeatSelection";
import { PassengerDetailsForm } from "./PassengerDetailsForm";
import { BookingConfirmation } from "./BookingConfirmation";
import { apiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface BookingDialogProps {
  flight: Flight | null;
  open: boolean;
  onClose: () => void;
  selectedDate: string;
  userEmail: string;
  passengers: number;
}

export interface PassengerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  seatNumber: string;
}

export interface BookingData {
  flight: Flight;
  passengers: PassengerDetails[];
  travelDate: string;
  totalAmount: number;
  bookingReference: string;
}

export const BookingDialog = ({ flight, open, onClose, selectedDate, userEmail, passengers: passengerCount }: BookingDialogProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengers, setPassengers] = useState<PassengerDetails[]>([]);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [seatMap, setSeatMap] = useState<SeatMap | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSeats, setLoadingSeats] = useState(false);

  // Load seat map when flight changes
  useEffect(() => {
    if (flight && open) {
      loadSeatMap();
    }
  }, [flight, open]);

  const loadSeatMap = async () => {
    if (!flight) return;
    
    setLoadingSeats(true);
    try {
      const response = await apiService.getAvailableSeats(flight._id);
      if (response.success && response.data) {
        setSeatMap(response.data.seats);
      } else {
        toast({
          title: "Error loading seats",
          description: "Unable to load seat map. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading seats:', error);
      toast({
        title: "Error loading seats",
        description: "Unable to load seat map. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingSeats(false);
    }
  };

  const handleSeatConfirm = (seats: string[]) => {
    setSelectedSeats(seats);
    setStep(2);
  };

  const handlePassengerConfirm = async (passengerData: PassengerDetails[]) => {
    if (!flight) return;
    
    setLoading(true);
    try {
      const response = await apiService.createBooking({
        flightId: flight._id,
        passengers: passengerData,
        travelDate: selectedDate
      });

      if (response.success && response.data) {
        const booking: BookingData = {
          flight: response.data.flight,
          passengers: response.data.passengers,
          travelDate: response.data.travelDate,
          totalAmount: response.data.totalAmount,
          bookingReference: response.data.bookingReference
        };

        setBookingData(booking);
        setStep(3);
        
        toast({
          title: "Booking Confirmed!",
          description: `Your booking reference is ${response.data.bookingReference}`,
        });
      } else {
        toast({
          title: "Booking Failed",
          description: response.message || "Unable to complete booking. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "Unable to complete booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedSeats([]);
    setPassengers([]);
    setBookingData(null);
    setSeatMap(null);
    onClose();
  };

  if (!flight) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {step === 1 && "Select Seats"}
            {step === 2 && "Passenger Details"}
            {step === 3 && "Booking Confirmation"}
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <SeatSelection
            flight={flight}
            seatMap={seatMap}
            loading={loadingSeats}
            onConfirm={handleSeatConfirm}
            onCancel={handleClose}
            maxSeats={passengerCount}
          />
        )}

        {step === 2 && (
          <PassengerDetailsForm
            selectedSeats={selectedSeats}
            seatMap={seatMap}
            onConfirm={handlePassengerConfirm}
            onBack={() => setStep(1)}
            loading={loading}
          />
        )}

        {step === 3 && bookingData && (
          <BookingConfirmation
            booking={bookingData}
            onClose={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
