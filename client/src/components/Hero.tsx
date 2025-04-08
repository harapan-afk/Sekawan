
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, BarChart3, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const Hero = () => {
  const features = [
    {
      icon: <Shield className="w-5 h-5" />,
      text: "Safe & Reliable",
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      text: "Affordable Services",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      text: "Fast Process",
    },
  ];

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-luxury-100 to-luxury"></div>
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-gold/5 filter blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-gold/10 filter blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          
          <h1 className="mb-6 overflow-hidden text-white">
            
            <span className="block overflow-hidden">
              <span className="inline-block text-shine font-bold animate-text-reveal" style={{ animationDelay: "0.3s" }}>
                Reliable &amp; Affordable
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="inline-block animate-text-reveal" style={{ animationDelay: "0.1s" }}>
                Financial Solution
              </span>
            </span>
          </h1>
          
          <p className="mb-8 text-lg text-luxury-800 max-w-2xl mx-auto animate-fade-in opacity-0" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
          Quick loan with secure collateral, easy processes and competitive
          interest rates. Financial solutions for your trading needs.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "flex items-center justify-center gap-2 py-3 px-4 rounded-lg glass-card-dark",
                  "animate-fade-in opacity-0"
                )}
                style={{ animationDelay: `${0.8 + idx * 0.1}s`, animationFillMode: "forwards" }}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-luxury-200 text-gold">
                  {feature.icon}
                </div>
                <span className="font-medium text-white">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
