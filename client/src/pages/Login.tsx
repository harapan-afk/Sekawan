// src/pages/Login.tsx
import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AuthService from "@/services/authService";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Hook navigasi untuk perpindahan halaman
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validasi form
    if (!username || !password) {
      setError("Username dan password harus diisi");
      return;
    }

    // Reset state error
    setError("");
    setIsLoading(true);

    try {
      // Gunakan AuthService untuk login
      await AuthService.login(username, password, rememberMe);

      // Navigate ke dashboard setelah login berhasil
      navigate("/admin/dashboard");
    } catch (err) {
      // Tangani error login
      setError(
        err instanceof Error
          ? err.message
          : "Login gagal. Silakan periksa username dan password Anda."
      );
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
            <CardTitle className="text-xl sm:text-2xl font-bold text-gold text-center">
              Login
            </CardTitle>
            <CardDescription className="text-luxury-400 text-center text-sm sm:text-base">
              Masukkan kredensial Anda untuk mengakses panel
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <Alert
                  variant="destructive"
                  className="bg-red-900/20 border-red-800 text-red-200"
                >
                  <AlertTitle className="text-red-200">Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-white text-sm sm:text-base"
                >
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="contoh"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-black/50 border-gold/30 text-white placeholder:text-luxury-500 focus:border-gold focus:ring-gold/40"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="password"
                    className="text-white text-sm sm:text-base"
                  >
                    Password
                  </Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black/50 border-gold/30 text-white placeholder:text-luxury-500 focus:border-gold focus:ring-gold/40 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-luxury-500 hover:text-gold"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gold/40 bg-black/50 text-gold focus:ring-gold/40"
                />
                <Label
                  htmlFor="remember"
                  className="text-luxury-300 text-sm cursor-pointer"
                >
                  Ingat saya
                </Label>
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
                    <LogIn size={18} className="mr-2" />
                    <span>Masuk</span>
                  </div>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Copyright footer */}
        <div className="mt-6 text-center text-luxury-500 text-xs">
          &copy; {new Date().getFullYear()} RayaGoldTrader. Seluruh hak cipta
          dilindungi.
        </div>
      </div>
    </div>
  );
};

export default Login;