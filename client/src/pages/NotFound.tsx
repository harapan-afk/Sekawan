import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-luxury text-center px-4">
      <div className="flex items-center justify-center bg-gold/10 p-6 rounded-full shadow-lg mb-6">
        <AlertTriangle className="text-gold" size={48} />
      </div>

      <h1 className="text-4xl font-bold text-gold mb-2">404 - Halaman Tidak Ditemukan</h1>
      <p className="text-luxury-700 mb-6">
        Sepertinya halaman yang Anda cari tidak tersedia atau sudah dipindahkan.
      </p>

      <Button
        onClick={goHome}
        className="bg-gold text-luxury-50 hover:bg-gold/90 transition-colors"
      >
        Kembali ke Dashboard
      </Button>
    </div>
  );
};

export default NotFound;
