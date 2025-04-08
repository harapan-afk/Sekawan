import { ArrowRight, CreditCard, Coins, Smartphone, ShoppingBag } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    {
      icon: <CreditCard className="w-8 h-8 text-gold" />,
      title: "Sekawan Modal",
      description: "We provide venture capital loans to help you start and grow your business, with easy terms and affordable interest.",
      link: "#"
    },
    {
      icon: (
        <img
          src="https://res.cloudinary.com/dqrazyfpm/image/upload/v1743086568/logorayagold_igfsvf.png"
          alt="Raya Gold Trader"
          className="w-8 h-8"
        />
      ),
      title: "Raya Gold Trader",
      description: "Provides the opportunity to raise additional capital to support your trading activities, with a fast and flexible process.",
      link: "/services/raya-gold-trader"
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-gold" />,
      title: "Paylater Movement",
      description: "With Paylater loans, which allows you to make payments later according to your convenience.",
      link: "#"
    },
    {
      icon: <Smartphone className="w-8 h-8 text-gold" />,
      title: "Raya Gadget",
      description: "Provides a safe and easy buying and selling for those of you who want to replace or buy electronic devices at competitive prices.",
      link: "#"
    }
  ];

  return (
    <section id="layanan" className="bg-gradient-to-b from-luxury to-luxury-50 py-24">
      <div className="content-section">
        <AnimatedSection>
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-luxury-100 text-gold font-medium text-sm">
              Our Services
            </div>
            <h2 className="mb-4 text-white">
              Financial <span className="text-shine">Solution For All Needs</span>
            </h2>
            <p className="max-w-2xl mx-auto text-luxury-700">
              We provide a wide range of reliable financial services to help you meet your needs financial needs easily and securely.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {services.map((service, idx) => (
            <AnimatedSection key={idx} delay={idx * 100}>
              <div className="glass-card-dark p-6 hover:shadow-lg transition-all h-full flex flex-col">
                <div className="mb-5 icon-box">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-white">{service.title}</h3>
                <p className="text-luxury-700 mb-4 flex-grow">{service.description}</p>
                <Link to={service.link} className="group inline-flex items-center text-gold font-medium">
                  <span className="animated-border">Learn More</span>
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
