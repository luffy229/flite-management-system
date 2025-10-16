import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PassengerDetails } from "./BookingDialog";
import { SeatMap } from "@/services/api";
import { Loader2 } from "lucide-react";

interface PassengerDetailsFormProps {
  selectedSeats: string[];
  seatMap: SeatMap | null;
  loading: boolean;
  onConfirm: (passengers: PassengerDetails[]) => void;
  onBack: () => void;
}

export const PassengerDetailsForm = ({ 
  selectedSeats, 
  seatMap, 
  loading, 
  onConfirm, 
  onBack 
}: PassengerDetailsFormProps) => {
  const [passengers, setPassengers] = useState<PassengerDetails[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Initialize passengers based on selected seats
  useEffect(() => {
    const initialPassengers: PassengerDetails[] = selectedSeats.map(seatNumber => ({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      seatNumber: seatNumber
    }));
    setPassengers(initialPassengers);
  }, [selectedSeats]);

  const updatePassenger = (index: number, field: keyof PassengerDetails, value: string) => {
    setPassengers(prev => prev.map((passenger, i) => 
      i === index ? { ...passenger, [field]: value } : passenger
    ));
    
    // Clear error when user starts typing
    if (errors[`${index}-${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${index}-${field}`];
        return newErrors;
      });
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    passengers.forEach((passenger, index) => {
      if (!passenger.firstName.trim()) {
        newErrors[`${index}-firstName`] = 'First name is required';
      }
      if (!passenger.lastName.trim()) {
        newErrors[`${index}-lastName`] = 'Last name is required';
      }
      if (!passenger.email.trim()) {
        newErrors[`${index}-email`] = 'Email is required';
      } else if (!validateEmail(passenger.email)) {
        newErrors[`${index}-email`] = 'Please enter a valid email address';
      }
      if (!passenger.phone.trim()) {
        newErrors[`${index}-phone`] = 'Phone number is required';
      } else if (!validatePhone(passenger.phone)) {
        newErrors[`${index}-phone`] = 'Please enter a valid 10-digit phone number';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onConfirm(passengers);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Processing booking...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {passengers.map((passenger, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">
                Passenger {index + 1} - Seat {passenger.seatNumber}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`firstName-${index}`}>First Name</Label>
                  <Input
                    id={`firstName-${index}`}
                    value={passenger.firstName}
                    onChange={(e) => updatePassenger(index, 'firstName', e.target.value)}
                    placeholder="Enter first name"
                    className={errors[`${index}-firstName`] ? 'border-destructive' : ''}
                  />
                  {errors[`${index}-firstName`] && (
                    <p className="text-sm text-destructive">{errors[`${index}-firstName`]}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`lastName-${index}`}>Last Name</Label>
                  <Input
                    id={`lastName-${index}`}
                    value={passenger.lastName}
                    onChange={(e) => updatePassenger(index, 'lastName', e.target.value)}
                    placeholder="Enter last name"
                    className={errors[`${index}-lastName`] ? 'border-destructive' : ''}
                  />
                  {errors[`${index}-lastName`] && (
                    <p className="text-sm text-destructive">{errors[`${index}-lastName`]}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`email-${index}`}>Email Address</Label>
                <Input
                  id={`email-${index}`}
                  type="email"
                  value={passenger.email}
                  onChange={(e) => updatePassenger(index, 'email', e.target.value)}
                  placeholder="Enter email address"
                  className={errors[`${index}-email`] ? 'border-destructive' : ''}
                />
                {errors[`${index}-email`] && (
                  <p className="text-sm text-destructive">{errors[`${index}-email`]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`phone-${index}`}>Phone Number</Label>
                <Input
                  id={`phone-${index}`}
                  type="tel"
                  value={passenger.phone}
                  onChange={(e) => updatePassenger(index, 'phone', e.target.value)}
                  placeholder="Enter 10-digit phone number"
                  className={errors[`${index}-phone`] ? 'border-destructive' : ''}
                />
                {errors[`${index}-phone`] && (
                  <p className="text-sm text-destructive">{errors[`${index}-phone`]}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="w-full sm:w-auto">
          Back to Seats
        </Button>
        <Button type="submit" className="w-full sm:w-auto">
          Confirm & Book
        </Button>
      </div>
    </form>
  );
};