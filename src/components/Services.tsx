import React from 'react';
import { motion } from 'framer-motion';
import { 
  CpuChipIcon,
  CubeIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

const Services = () => {
  const services = [
  {
    image: "/air-freight.png",
    title: "Air Freight",
    description: "Time-critical air cargo with clear cut-offs, tracking and documentation support.",
    features: ["Express cargo worldwide", "Airport-to-airport", "Door delivery"]
  },
  {
    image: "/cargo-freight.png",
    title: "Sea Freight",
    description: "Ocean freight planning for cost control and predictable transit across major trade lanes.",
    features: ["FCL (Full Container Load)", "LCL (Shared container)", "Import & export"]
  },
  {
    image: "/land-transport.png",
    title: "Land Transport",
    description: "UAE and GCC trucking with reliable schedules and cross-border coordination.",
    features: ["UAE & GCC trucking", "Door pickup & delivery", "Cross-border transport"]
  },
  {
    image: "/door-to-door.png",
    title: "Door-to-Door Cargo",
    description: "End-to-end movement from pickup to delivery for personal and commercial consignments.",
    features: ["UAE to India/Pakistan/Bangladesh", "Personal & commercial cargo", "Full tracking"]
  },
  {
    image: "/custom-clearance.png",
    title: "Customs Clearance",
    description: "Import/export documentation and Dubai customs handling to keep shipments compliant.",
    features: ["Import/export documentation", "Dubai customs handling", "Regulatory compliance"]
  },
  {
    image: "/doc-clearance.png",
    title: "Documents Clearance",
    description: "Trade documentation preparation and clearance support for faster processing.",
    features: ["Trade documentation", "Legal clearance", "Fast processing"]
  }
];

  const cargoTypes = [
  { icon: CpuChipIcon, name: "Electronics", color: "bg-emerald/10 text-orange" },
  { icon: CubeIcon, name: "SME Products", color: "bg-lime/20 text-orange" },
  { icon: HomeIcon, name: "Household Products", color: "bg-emerald/10 text-orange" }
];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-secondary-900 mb-4">
            Freight, Clearance & Delivery Services
          </h2>
          <p className="text-lg md:text-xl text-secondary-600 max-w-3xl mx-auto">
            Practical logistics solutions designed for reliability, compliance and predictable delivery.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 p-8"
            >
              <div className="w-full h-48 rounded-xl overflow-hidden mb-6 bg-orange/5">
  <img
    src={service.image}
    alt={service.title}
    className="w-full h-full object-contain p-4"
    loading="lazy"
  />
</div>
              
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                {service.title}
              </h3>
              
              <p className="text-secondary-600 mb-6 leading-relaxed">
                {service.description}
              </p>
              
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-secondary-700">
                    <div className="w-2 h-2 bg-orange rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8"
        >
          <h3 className="text-2xl font-semibold text-secondary-900 mb-2 text-center">
            Cargo Capabilities
          </h3>
          <p className="text-secondary-600 text-center mb-8">
            Commercial and personal cargo handled with clear documentation and packaging guidance.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {cargoTypes.map((cargo, index) => (
              <div key={index} className="text-center">
                <div className={`w-20 h-20 ${cargo.color} rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white`}>
                  <cargo.icon className="w-10 h-10" />
                </div>
                <h4 className="font-semibold text-secondary-900">{cargo.name}</h4>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="grid md:grid-cols-2 gap-6 text-center">
              <div>
                <h4 className="font-semibold text-secondary-900 mb-2">Bill of Lading (BL)</h4>
                <p className="text-secondary-600">Documentation support for sea freight shipments.</p>
              </div>
              <div>
                <h4 className="font-semibold text-secondary-900 mb-2">FCL & LCL Management</h4>
                <p className="text-secondary-600">Container planning, loading coordination and milestones.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
