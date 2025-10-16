import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Plane, Search, Calendar, Shield } from "lucide-react";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/flights");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Plane className="h-6 w-6 text-primary" />
              <h1 className="text-lg sm:text-xl font-bold">Flight Management System</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4">
        <section className="py-12 sm:py-16 lg:py-20 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Book Your Flight Today
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Search and book flights across India with ease. Find the best deals and manage your bookings all in one place.
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14">
            Get Started
          </Button>
        </section>

        <section className="py-12 sm:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center p-4 sm:p-6 rounded-lg border bg-card">
            <div className="inline-flex p-3 bg-primary/10 rounded-full mb-4">
              <Search className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Easy Search</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Search flights by origin and destination with our intuitive interface
            </p>
          </div>

          <div className="text-center p-4 sm:p-6 rounded-lg border bg-card">
            <div className="inline-flex p-3 bg-primary/10 rounded-full mb-4">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Flexible Booking</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Book flights for your preferred dates with real-time availability
            </p>
          </div>

          <div className="text-center p-4 sm:p-6 rounded-lg border bg-card md:col-span-2 lg:col-span-1">
            <div className="inline-flex p-3 bg-primary/10 rounded-full mb-4">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Secure & Safe</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Your bookings are secure with our trusted flight management system
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
