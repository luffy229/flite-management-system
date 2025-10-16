import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Flight, SeatMap } from "@/services/api";
import { cn } from "@/lib/utils";
import { Armchair, Loader2, User } from "lucide-react";

interface SeatSelectionProps {
  flight: Flight;
  seatMap: SeatMap | null;
  loading: boolean;
  onConfirm: (seats: string[]) => void;
  onCancel: () => void;
  maxSeats: number;
}

export const SeatSelection = ({ flight, seatMap, loading, onConfirm, onCancel, maxSeats }: SeatSelectionProps) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  
  const toggleSeat = (seatNumber: string) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        // If seat is already selected, remove it
        return prev.filter(s => s !== seatNumber);
      } else {
        // If seat is not selected, only add it if we haven't reached the max limit
        if (prev.length < maxSeats) {
          return [...prev, seatNumber];
        }
        return prev; // Don't add if we've reached the limit
      }
    });
  };

  const getTotalPrice = () => {
    return selectedSeats.length * flight.price;
  };

  const renderSeatMap = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading seat map...</span>
        </div>
      );
    }

    if (!seatMap) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          Unable to load seat map. Please try again.
        </div>
      );
    }

    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Armchair className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold text-base sm:text-lg">Available Seats</h3>
          </div>
          
          {/* Centered Seat Map */}
          <div className="flex justify-center">
            <div className="border rounded-lg p-3 sm:p-6 bg-card shadow-sm max-w-2xl w-full">
              <div className="mb-4 sm:mb-6 text-center">
                <div className="inline-block bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-8 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium border border-blue-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Front (Cockpit)
                  </div>
                </div>
              </div>
              
              {/* Seat Grid */}
              <div className="space-y-2 sm:space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
                {Object.entries(seatMap).map(([row, seats]) => (
                  <div key={row} className="flex items-center justify-center gap-2 sm:gap-3">
                    <div className="w-6 sm:w-8 text-center text-xs sm:text-sm font-semibold text-muted-foreground">
                      {row}
                    </div>
                    <div className="flex gap-1 sm:gap-2">
                      {seats.map(seat => {
                        const isOccupied = seat.isOccupied;
                        const isSelected = selectedSeats.includes(seat.seatNumber);
                        const isDisabled = isOccupied || (!isSelected && selectedSeats.length >= maxSeats);
                        
                        return (
                          <button
                            key={seat.seatNumber}
                            onClick={() => toggleSeat(seat.seatNumber)}
                            disabled={isDisabled}
                            className={cn(
                              "w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-105",
                              "border-2 shadow-sm",
                              isOccupied && "bg-red-50 border-red-200 text-red-400 cursor-not-allowed hover:scale-100",
                              !isOccupied && !isSelected && !isDisabled && "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300",
                              !isOccupied && !isSelected && isDisabled && "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed hover:scale-100",
                              isSelected && "bg-blue-500 border-blue-500 text-white shadow-lg hover:bg-blue-600"
                            )}
                            title={isOccupied ? `Seat ${seat.seatNumber} - Occupied` : 
                                   isDisabled ? `Seat ${seat.seatNumber} - Maximum seats selected` : 
                                   `Seat ${seat.seatNumber}`}
                          >
                            {isOccupied ? (
                              <User className="h-3 w-3 sm:h-4 sm:w-4" />
                            ) : (
                              <Armchair className="h-3 w-3 sm:h-4 sm:w-4" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-50 border-2 border-gray-200 rounded-lg flex items-center justify-center">
              <Armchair className="h-3 w-3 text-gray-600" />
            </div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 border-2 border-blue-500 rounded-lg flex items-center justify-center">
              <Armchair className="h-3 w-3 text-white" />
            </div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-center justify-center">
              <User className="h-3 w-3 text-red-400" />
            </div>
            <span>Occupied</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Flight Info */}
      <div className="bg-muted/50 rounded-lg p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-sm sm:text-base">{flight.airline} {flight.flightNumber}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {flight.origin} → {flight.destination}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs sm:text-sm text-muted-foreground">Price per seat</p>
            <p className="font-semibold text-sm sm:text-base">₹{flight.price}</p>
          </div>
        </div>
      </div>

      {/* Seat Map */}
      {renderSeatMap()}

      {/* Selection Summary */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex-1">
            <p className="font-medium text-sm sm:text-base">
              Selected Seats: {selectedSeats.length} / {maxSeats}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground break-all">
              {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'No seats selected yet'}
            </p>
            {selectedSeats.length < maxSeats && (
              <p className="text-xs text-muted-foreground mt-1">
                You can select {maxSeats - selectedSeats.length} more seat{maxSeats - selectedSeats.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs sm:text-sm text-muted-foreground">Total Price</p>
            <p className="text-base sm:text-lg font-bold">₹{getTotalPrice()}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button 
          onClick={() => onConfirm(selectedSeats)}
          disabled={selectedSeats.length === 0 || selectedSeats.length !== maxSeats}
          className="w-full sm:w-auto"
        >
          <span className="hidden sm:inline">
            Continue ({selectedSeats.length}/{maxSeats} seat{maxSeats !== 1 ? 's' : ''})
          </span>
          <span className="sm:hidden">Continue ({selectedSeats.length}/{maxSeats})</span>
        </Button>
      </div>
    </div>
  );
};