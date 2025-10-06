import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard } from '@capacitor/keyboard';
import Welcome from "./pages/Welcome";
import CheckAvailability from "./pages/CheckAvailability";
import Congrats from "./pages/Congrats";
import NotAvailable from "./pages/NotAvailable";
import Login from "./pages/Login";
import VerifyMobile from "./pages/VerifyMobile";
import Services from "./pages/Services";
import CreateProfile from "./pages/CreateProfile";
import Home from "./pages/Home";
import Prices from "./pages/Prices";
import Booking from "./pages/Booking";
import ContinueBooking from "./pages/ContinueBooking";
import BookingConfirmation from "./pages/BookingConfirmation";
import BookingHistory from "./pages/BookingHistory";
import OrderDetails from "./pages/OrderDetails";
import Profile from "./pages/Profile";
import AddAddress from "./pages/AddAddress";
import Wallet from "./pages/Wallet";
import ReferEarn from "./pages/ReferEarn";
import RateOrder from "./pages/RateOrder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const initializeApp = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          // Hide splash screen
          await SplashScreen.hide();
          
          // Set status bar style
          await StatusBar.setStyle({ style: Style.Light });
          await StatusBar.setBackgroundColor({ color: '#ffffff' });
          
          // Configure keyboard
          Keyboard.addListener('keyboardWillShow', () => {
            document.body.classList.add('keyboard-open');
          });
          
          Keyboard.addListener('keyboardWillHide', () => {
            document.body.classList.remove('keyboard-open');
          });
        } catch (error) {
          console.log('Capacitor initialization error:', error);
        }
      }
    };
    
    initializeApp();
  }, []);
  
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/check-availability" element={<CheckAvailability />} />
          <Route path="/congrats" element={<Congrats />} />
          <Route path="/not-available" element={<NotAvailable />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-mobile" element={<VerifyMobile />} />
          <Route path="/services" element={<Services />} />
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route path="/home" element={<Home />} />
          <Route path="/prices" element={<Prices />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/continue-booking" element={<ContinueBooking />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="/booking-history" element={<BookingHistory />} />
          <Route path="/order-details" element={<OrderDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/refer-earn" element={<ReferEarn />} />
          <Route path="/rate-order/:orderId" element={<RateOrder />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
