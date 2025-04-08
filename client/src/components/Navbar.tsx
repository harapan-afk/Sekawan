
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4",
        isScrolled 
          ? "bg-luxury-100/80 backdrop-blur-md border-b border-luxury-200/50" 
          : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="text-2xl font-bold text-white">
            <span className="text-gold">SEKA</span>WAN
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {["Beranda", "Layanan", "Tentang", ].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="animated-border text-white font-medium hover:text-gold transition-colors"
            >
              {item}
            </a>
          ))}
          <Button className="bg-gold hover:bg-gold-dark text-luxury-200 button-shine">
            Contact Us
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden absolute w-full bg-luxury-100 border-t border-luxury-200/50 shadow-lg transition-all duration-300 ease-in-out transform",
          isMobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        )}
      >
        <div className="container py-4 flex flex-col space-y-4">
          {["Beranda", "Layanan", "Tentang", "Cabang", "Karier"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="py-2 text-white hover:text-gold transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <Button className="w-full bg-gold hover:bg-gold-dark text-luxury-200">
            Hubungi Kami
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
