import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import AnimatedSection from "./AnimatedSection";

const testimonials = [
  {
    name: "Budi Santoso",
    role: "Pengusaha UMKM",
    content: "Sekawan membantu saya mendapatkan modal usaha dengan proses cepat dan bunga rendah. Berkat dukungan mereka, bisnis kuliner saya bisa berkembang pesat.",
  },
  {
    name: "Siti Rahayu",
    role: "Ibu Rumah Tangga",
    content: "Saat membutuhkan dana mendesak untuk biaya pendidikan anak, Sekawan memberikan solusi gadai yang aman dan terpercaya. Prosesnya mudah dan nilai taksirannya sangat memuaskan.",
  },
  {
    name: "Andi Wijaya",
    role: "Karyawan Swasta",
    content: "Saya rutin berinvestasi emas di Sekawan karena transparansi dan pelayanannya yang profesional. Investasi jadi lebih mudah dan terjamin keamanannya.",
  },
  {
    name: "Maya Anggraini",
    role: "Pemilik Toko Online",
    content: "Layanan pembiayaan usaha dari Sekawan membantu toko online saya bertahan di masa pandemi. Proses pengajuan cepat dan persyaratannya tidak rumit.",
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextTestimonial = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }
  };

  const prevTestimonial = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [activeIndex]);

  useEffect(() => {
    const autoplayTimer = setInterval(() => {
      nextTestimonial();
    }, 5000);

    return () => clearInterval(autoplayTimer);
  }, [isAnimating]);

  return (
    <section className="py-24 bg-luxury-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-luxury to-luxury-50"></div>
      
      <div className="content-section relative z-10">
        <AnimatedSection>
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-luxury-100 text-gold font-medium text-sm">
              Testimonial
            </div>
            <h2 className="mb-4 text-white">What <span className="text-shine">Customer Say</span></h2>
            <p className="max-w-2xl mx-auto text-luxury-700">
            Our success is measured by customer satisfaction. See how our services have been helping many people achieve their financial goals.
            </p>
          </div>
        </AnimatedSection>

        <div className="relative overflow-hidden px-16">
          <div className="relative max-w-3xl mx-auto">
            <div 
              className={cn(
                "transition-all duration-500 ease-in-out",
                isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
              )}
            >
              <div className="mb-6 text-center">
                <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-luxury-100 text-gold mb-6">
                  <Quote className="w-6 h-6" />
                </div>
                <blockquote className="text-xl md:text-2xl font-medium text-white mb-8">
                  "{testimonials[activeIndex].content}"
                </blockquote>
                <div className="font-semibold text-gold">{testimonials[activeIndex].name}</div>
                <div className="text-luxury-600 text-sm">{testimonials[activeIndex].role}</div>
              </div>
            </div>

            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-300",
                    idx === activeIndex ? "bg-gold w-6" : "bg-luxury-200"
                  )}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Lihat testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 w-full left-0 flex justify-between">
            <button
              onClick={prevTestimonial}
              className="w-10 h-10 rounded-full bg-luxury-100 border border-luxury-200 text-gold hover:bg-luxury-200 flex items-center justify-center transition-colors ml-2"
              aria-label="Testimonial sebelumnya"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextTestimonial}
              className="w-10 h-10 rounded-full bg-luxury-100 border border-luxury-200 text-gold hover:bg-luxury-200 flex items-center justify-center transition-colors mr-2"
              aria-label="Testimonial berikutnya"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;