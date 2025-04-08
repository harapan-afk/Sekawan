import React, { useState, FormEvent, useEffect } from "react";
import { Eye, EyeOff, Check, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

interface PasswordRequirement {
  text: string;
  met: boolean;
}

const ChangePw: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // For responsive design
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);

  // Navigate hook
  const navigate = useNavigate();

  // Password requirements
  const [requirements, setRequirements] = useState<PasswordRequirement[]>([
    { text: "Minimal 8 karakter", met: false },
    { text: "Minimal 1 huruf besar", met: false },
    { text: "Minimal 1 huruf kecil", met: false },
    { text: "Minimal 1 angka", met: false },
  ]);

  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Check password requirements
  useEffect(() => {
    const checkRequirements = () => {
      const newRequirements = [
        { text: "Minimal 8 karakter", met: newPassword.length >= 8 },
        { text: "Minimal 1 huruf besar", met: /[A-Z]/.test(newPassword) },
        { text: "Minimal 1 huruf kecil", met: /[a-z]/.test(newPassword) },
        { text: "Minimal 1 angka", met: /[0-9]/.test(newPassword) },        
      ];
      
      setRequirements(newRequirements);
    };
    
    checkRequirements();
  }, [newPassword]);

  const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset states
    setError("");
    setSuccess("");
    
    // Validate form
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Semua kolom harus diisi");
      return;
    }
    
    // Check if new password meets all requirements
    const allRequirementsMet = requirements.every(req => req.met);
    if (!allRequirementsMet) {
      setError("Password baru tidak memenuhi semua persyaratan");
      return;
    }
    
    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setError("Password baru dan konfirmasi password tidak cocok");
      return;
    }
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Get token from storage
      const token = localStorage.getItem("authToken") || 
                    sessionStorage.getItem("authToken");

      if (!token) {
        throw new Error("Tidak ada token autentikasi");
      }

      // API call to change password
      const response = await fetch("https://api.sekawan-grup.com/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengubah password");
      }

      // Show success message
      setSuccess("Password berhasil diubah");
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 2000);
      
      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengubah password. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black bg-gradient-to-b from-black to-luxury-950 bg-[url('/images/gold-pattern.png')] bg-opacity-10 bg-blend-overlay px-4 py-6 sm:px-6">
      <div className="w-full max-w-md">
        {/* Logo dan nama aplikasi */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gold">RayaGoldTrader</h1>
        </div>
        
        <Card className="bg-black/60 backdrop-blur-sm border border-gold/30 shadow-lg shadow-gold/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl sm:text-2xl font-bold text-gold text-center">Ubah Password</CardTitle>
            <CardDescription className="text-luxury-400 text-center text-sm sm:text-base">
              Ubah password akun Anda untuk keamanan
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleChangePassword}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-red-900/20 border-red-800 text-red-200">
                  <AlertTitle className="text-red-200">Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="bg-green-900/20 border-green-800 text-green-200">
                  <Check className="h-4 w-4 text-green-400" />
                  <AlertTitle className="text-green-200">Sukses</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-white text-sm sm:text-base">Password Saat Ini</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-black/50 border-gold/30 text-white placeholder:text-luxury-500 focus:border-gold focus:ring-gold/40 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-luxury-500 hover:text-gold"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-white text-sm sm:text-base">Password Baru</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-black/50 border-gold/30 text-white placeholder:text-luxury-500 focus:border-gold focus:ring-gold/40 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-luxury-500 hover:text-gold"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              {/* Password Requirements */}
              <div className="space-y-2 rounded-md bg-black/40 p-3 border border-gold/10">
                <p className="text-xs font-medium text-luxury-400">Persyaratan Password:</p>
                <ul className="space-y-1">
                  {requirements.map((requirement, index) => (
                    <li 
                      key={index} 
                      className={cn(
                        "flex items-center text-xs",
                        requirement.met ? "text-green-300" : "text-luxury-500"
                      )}
                    >
                      <span className={cn(
                        "mr-2 h-1.5 w-1.5 rounded-full",
                        requirement.met ? "bg-green-400" : "bg-luxury-600"
                      )} />
                      {requirement.text}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-white text-sm sm:text-base">Konfirmasi Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-black/50 border-gold/30 text-white placeholder:text-luxury-500 focus:border-gold focus:ring-gold/40 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-luxury-500 hover:text-gold"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">Konfirmasi password tidak cocok</p>
                )}
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-gold/90 to-gold hover:from-gold hover:to-gold-dark text-black font-medium transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-luxury-900 border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Memproses...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <KeyRound size={18} className="mr-2" />
                    <span>Ubah Password</span>
                  </div>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        {/* Copyright footer */}
        <div className="mt-6 text-center text-luxury-500 text-xs">
          &copy; {new Date().getFullYear()} RayaGoldTrader. Seluruh hak cipta dilindungi.
        </div>
      </div>
    </div>
  );
};

export default ChangePw;