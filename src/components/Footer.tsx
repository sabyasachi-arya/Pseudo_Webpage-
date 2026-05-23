import React from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Strategic Advantage", href: "#advantage" },
    { name: "GCC Network", href: "#gcc" },
    { name: "Contact", href: "#contact" }
  ];

  const services = [
    "Air Freight",
    "Sea Freight", 
    "Land Transport",
    "Door-to-Door Cargo",
    "Customs Clearance",
    "Documents Clearance"
  ];

  return (
    <footer className="bg-darkteal text-white">
      <div className="container-custom py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-2 mb-4">
  <img
    src="/company_logo_2.png"
    alt="Ajiva Global Logo"
    className="h-20 w-20"
  />
  <div className="font-bold text-xl text-white" style={{ fontFamily: "'Cinzel', serif" }}>AJIVA GLOBAL CARGO TRADING LLC</div>
</div>
            <p className="text-white/80 mb-6 leading-relaxed">
              Connecting continents, simplifying commerce. Your premier freight forwarding partner 
              based in Dubai, serving the world.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-white/80">
                <PhoneIcon className="w-5 h-5 mr-3 text-emerald" />
                <span>+971 54 403 4567</span>
              </div>
              <div className="flex items-center text-white/80">
                <EnvelopeIcon className="w-5 h-5 mr-3 text-emerald" />
                <span>Info@ajivacargotrading.com</span>
              </div>
              <div className="flex items-start text-white/80">
                <MapPinIcon className="w-5 h-5 mr-3 text-white mt-1" />
                <span className="text-sm">
                  Office - 213 #05 Sadaf Business Centre,<br />
                  Al Qiyadah exit -2, Al kazim Building,<br />
                  Block A Deira Dubai
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-xl font-bold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-6 text-white">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <span className="text-white/80">{service}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-6 text-white">Business Hours</h3>
            <div className="space-y-2 text-white/80">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span>9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span>9:00 AM - 2:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="border-t border-emerald/20">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm">
              © 2026 Ajiva Global General Trading LLC. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button type="button" className="text-white/60 hover:text-white text-sm transition-colors">
                Privacy Policy
              </button>
              <button type="button" className="text-white/60 hover:text-white text-sm transition-colors">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
