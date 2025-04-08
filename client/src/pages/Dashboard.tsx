import React, { useState, useEffect } from "react";
import {
  Home,
  Layers,
  Image,
  Link as LinkIcon,
  Menu,
  LogOut,
  KeyRound
} from "lucide-react";
import {
  Link as RouterLink,
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate
} from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Import individual dashboard components
import DashboardHome from "../components/dashboard/Dashboardhome";
import CategoryManager from "../components/dashboard/CategoryManager";
import LinkManager from "../components/dashboard/LinkManager";
import ChangePw from "./ChangePw";

// JWT decoding utility
import { jwtDecode } from "jwt-decode";

// Komponen Dashboard
const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Check token validity on component mount
  useEffect(() => {
    const checkTokenValidity = () => {
      const token = localStorage.getItem("authToken") || 
                    sessionStorage.getItem("authToken");
      
      if (!token) {
        navigate('/login');
        return false;
      }

      try {
        const decoded = jwtDecode(token) as { exp: number };
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (decoded.exp < currentTime) {
          // Token expired
          localStorage.removeItem("authToken");
          sessionStorage.removeItem("authToken");
          navigate('/login');
          return false;
        }
        
        return true;
      } catch (error) {
        // Invalid token
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
        navigate('/login');
        return false;
      }
    };

    checkTokenValidity();
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      const response = await fetch("https://api.sekawan-grup.com/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Clear tokens from storage
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");

      // Redirect to login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout if API call fails
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
      window.location.href = "/login";
    }
  };

  return (
    <div className="flex h-screen overflow-x-hidden bg-luxury">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-luxury-50 shadow-lg transition-all duration-300 flex flex-col border-r border-gold/20",
          isSidebarOpen ? "w-64" : "w-20"
        )}>
        <div className="p-4 flex items-center justify-between border-b border-gold/20">
          <div
            className={cn(
              "flex items-center",
              !isSidebarOpen && "justify-center w-full"
            )}>
            <img
              src="https://res.cloudinary.com/dqrazyfpm/image/upload/v1743086568/logorayagold_igfsvf.png"
              alt="Raya Gold"
              className="w-8 h-8"
            />
            {isSidebarOpen && (
              <span className="ml-2 font-bold text-gold">Raya Gold Admin</span>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className={cn(
              "text-gold hover:text-gold/80 transition-colors",
              !isSidebarOpen && "hidden"
            )}>
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            <li>
              <RouterLink
                to="/admin/dashboard"
                className={cn(
                  "flex items-center px-4 py-3 rounded-md transition-colors",
                  location.pathname === "/admin/dashboard"
                    ? "bg-gold/10 text-gold font-semibold"
                    : "text-luxury-700 hover:bg-luxury-100/50 hover:text-gold",
                  !isSidebarOpen && "justify-center"
                )}>
                <Home size={20} />
                {isSidebarOpen && <span className="ml-3">Dashboard</span>}
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/admin/categories"
                className={cn(
                  "flex items-center px-4 py-3 rounded-md transition-colors",
                  location.pathname === "/admin/categories"
                    ? "bg-gold/10 text-gold font-semibold"
                    : "text-luxury-700 hover:bg-luxury-100/50 hover:text-gold",
                  !isSidebarOpen && "justify-center"
                )}>
                <Layers size={20} />
                {isSidebarOpen && <span className="ml-3">Kategori</span>}
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/admin/links"
                className={cn(
                  "flex items-center px-4 py-3 rounded-md transition-colors",
                  location.pathname === "/admin/links"
                    ? "bg-gold/10 text-gold font-semibold"
                    : "text-luxury-700 hover:bg-luxury-100/50 hover:text-gold",
                  !isSidebarOpen && "justify-center"
                )}>
                <LinkIcon size={20} />
                {isSidebarOpen && <span className="ml-3">Edit Link</span>}
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/admin/change-password"
                className={cn(
                  "flex items-center px-4 py-3 rounded-md transition-colors",
                  location.pathname === "/admin/change-password"
                    ? "bg-gold/10 text-gold font-semibold"
                    : "text-luxury-700 hover:bg-luxury-100/50 hover:text-gold",
                  !isSidebarOpen && "justify-center"
                )}>
                <KeyRound size={20} />
                {isSidebarOpen && <span className="ml-3">Ubah Password</span>}
              </RouterLink>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-gold/20">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              "w-full text-luxury-700 hover:text-red-500 hover:bg-luxury-100/50",
              !isSidebarOpen && "justify-center p-2"
            )}>
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-luxury-50 shadow-md py-4 px-6 flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className={cn(
              "text-gold hover:text-gold/80 transition-colors",
              isSidebarOpen && "hidden"
            )}>
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-semibold text-gold">
            {location.pathname === "/admin/dashboard" && "Dashboard"}
            {location.pathname === "/admin/categories" && "Kategori Produk"}
            {location.pathname === "/admin/images" && "Edit Gambar Produk"}
            {location.pathname === "/admin/links" && "Edit Link Produk"}
            {location.pathname === "/admin/change-password" && "Ubah Password"}
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-luxury-700">Admin</span>
            <div className="w-8 h-8 rounded-full bg-gold text-luxury-200 flex items-center justify-center">
              A
            </div>
          </div>
        </header>

        <main className="p-6">
          <Routes>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/categories" element={<CategoryManager />} />
            <Route path="/links" element={<LinkManager />} />
            <Route path="/change-password" element={<ChangePw />} />
            <Route
              path="*"
              element={<Navigate to="/admin/dashboard" replace />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;