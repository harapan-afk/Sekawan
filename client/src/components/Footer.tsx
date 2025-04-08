import { 
  Facebook, Instagram, Twitter, Linkedin, Youtube, 
  MapPin, Phone, Mail, ChevronRight 
} from "lucide-react";
import { cn } from "@/lib/utils";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const productLinks = [
    { name: "Sekawan Modal", link: "/products/sekawan-modal" },
    { name: "Raya Gold Trader", link: "/products/raya-gold-trader" },
    { name: "Paylater Movement", link: "/products/paylater-movement" },
    { name: "Raya Gadget", link: "/products/raya-gadget" },
  ];
  
  const companyLinks = [
    { name: "About Us", link: "/about" },
    { name: "Contact Us", link: "/contact" },
    { name: "Privacy Policy", link: "/privacy-policy" },
    { name: "Terms & Conditions", link: "/terms" },
  ];
  
  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, name: "Facebook", link: "https://facebook.com" },
    { icon: <Instagram className="w-5 h-5" />, name: "Instagram", link: "https://instagram.com" },
    { icon: <Twitter className="w-5 h-5" />, name: "Twitter", link: "https://twitter.com" },
    { icon: <Linkedin className="w-5 h-5" />, name: "LinkedIn", link: "https://linkedin.com" },
    { icon: <Youtube className="w-5 h-5" />, name: "YouTube", link: "https://youtube.com" },
  ];

  return (
    <footer className="bg-luxury text-white pt-16 pb-8">
      <div className="content-section">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Bagian Logo & Deskripsi */}
          <div>
            <div className="mb-5">
              <a href="/" className="text-3xl font-bold">
                <span className="text-gold">Seka</span>wan
              </a>
            </div>
            <p className="text-luxury-600 mb-6">
              Trusted partner for safe and affordable financial solutions for Indonesian traders.
            </p>
            
            {/* Ikon Media Sosial */}
            <div className="flex space-x-4">
              {socialLinks.map((social, idx) => (
                <a 
                  key={idx}
                  href={social.link}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-luxury-100 hover:bg-gold text-gold hover:text-white flex items-center justify-center transition-all duration-300"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Produk & Layanan */}
          <div>
            <h4 className="text-lg font-semibold mb-5">Produk & Layanan</h4>
            <ul className="space-y-3">
              {productLinks.map((item, idx) => (
                <li key={idx}>
                  <a href={item.link} className="text-luxury-600 hover:text-gold transition-colors inline-flex items-center group">
                    <ChevronRight className="w-4 h-4 mr-1 transition-transform group-hover:translate-x-1 text-gold" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Perusahaan */}
          <div>
            <h4 className="text-lg font-semibold mb-5">Perusahaan</h4>
            <ul className="space-y-3">
              {companyLinks.map((item, idx) => (
                <li key={idx}>
                  <a href={item.link} className="text-luxury-600 hover:text-gold transition-colors inline-flex items-center group">
                    <ChevronRight className="w-4 h-4 mr-1 transition-transform group-hover:translate-x-1 text-gold" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Kontak */}
          <div>
            <h4 className="text-lg font-semibold mb-5">Kontak</h4>
            <ul className="space-y-4">
              <li className="flex">
                <MapPin className="w-5 h-5 text-gold mt-1 mr-3 shrink-0" />
                <span className="text-luxury-600">
                  ---
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-gold mr-3 shrink-0" />
                <a href="tel:+6281234567890" className="text-luxury-600 hover:text-gold transition-colors">
                  ---
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-gold mr-3 shrink-0" />
                <a href="mailto:info@sekawan.com" className="text-luxury-600 hover:text-gold transition-colors">
                  ---
                </a>
              </li>
            </ul>
          </div>

        </div>
        
        {/* Copyright Section */}
        <div className="border-t border-luxury-100 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-luxury-600 text-sm mb-4 md:mb-0">
              &copy; {currentYear} Sekawan Grup. All Rights Reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/privacy-policy" className="text-luxury-600 text-sm hover:text-gold transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-luxury-600 text-sm hover:text-gold transition-colors">
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
