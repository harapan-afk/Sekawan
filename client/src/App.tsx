import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ServicesPageRayaGoldTrader from "./pages/ServicesPageRayaGoldTrader";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import AuthService from "./services/authService";
import { AlertTriangle } from "lucide-react";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isAuthenticated = AuthService.isTokenValid();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isMobileDevice = /Android|iPhone|iPad/i.test(userAgent);
    setIsMobile(isMobileDevice);
  }, []);

  if (isMobile === false) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-luxury text-center px-4">
        <div className="flex items-center justify-center bg-gold/10 p-6 rounded-full shadow-lg mb-6">
          <AlertTriangle className="text-gold" size={48} />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gold mb-2">
          Perangkat Tidak Didukung
        </h1>
        <p className="text-luxury-700 mb-6 max-w-md">
          Situs ini hanya dapat diakses melalui perangkat Android atau iOS.
          Silakan buka situs menggunakan perangkat mobile untuk pengalaman
          terbaik.
        </p>
      </div>
    );
  }

  if (isMobile === null) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/services/raya-gold-trader"
              element={<ServicesPageRayaGoldTrader />}
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
