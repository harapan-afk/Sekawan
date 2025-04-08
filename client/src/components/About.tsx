
import { Badge } from "@/components/ui/badge";
import { Award, TrendingUp, Users, Shield } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const About = () => {
  const stats = [
    { label: "Customers Trust Us", value: "10.000+" },
  ];

  const values = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Integrity",
      description: "We run a business with high ethical standards and transparency in every service.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Innovation",
      description: "Continue to develop relevant financial solutions with the needs of modern society.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Concern",
      description: "Committed to providing the best service and assisting the community in every financial need.",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Professionalism",
      description: "Our services are supported by a team of professionals who are experienced in the field of finance.",
    },
  ];    

  return (
    <section id="tentang" className="py-24 bg-luxury text-white">
      <div className="content-section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection className="order-2 lg:order-1">
            <div className="glass-card-dark p-8 relative overflow-hidden">
              {/* Abstract shapes */}
              <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-gold/5 filter blur-3xl"></div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-gold/5 filter blur-3xl"></div>
              
              <div className="relative z-10">
                
                <h3 className="text-2xl font-bold mb-4">Trusted Financial Partner</h3>
                <p className="mb-6 text-luxury-700">
                  We have helped Indonesians to find the right financial solution for their trading needs.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="bg-luxury-100/50 rounded-lg p-4 backdrop-blur-sm">
                      <div className="text-2xl font-bold text-gold mb-1">{stat.value}</div>
                      <div className="text-sm text-luxury-700">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection className="order-1 lg:order-2">
            <div className="text-center lg:text-left">
              <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-luxury-100 text-gold font-medium text-sm">
                About Us
              </div>
              <h2 className="mb-6">Building <span className="text-shine">Trust</span><br />with <span className="text-shine">Quality Services</span></h2>
              <p className="text-luxury-700 mb-8">
                Raya Gold provides easy access for anyone who wants to trade gold,
                throughout Indonesia.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
                {values.map((value, idx) => (
                  <div key={idx} className="flex">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-luxury-100 text-gold shrink-0 mt-1">
                      {value.icon}
                    </div>
                    <div className="ml-4">
                      <h4 className="text-xl font-semibold mb-2">{value.title}</h4>
                      <p className="text-luxury-700">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default About;
