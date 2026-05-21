import React from 'react';
import { motion } from 'framer-motion';
import { TruckIcon, MapPinIcon } from '@heroicons/react/24/outline';

const GCCNetwork = () => {
  const imageFallback =
    'https://images.unsplash.com/photo-1559291001-693fb9166cba?auto=format&fit=crop&w=1200&q=80';

  const countries = [
    {
      name: "Saudi Arabia",
      flag: "SA",
      image: "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=420&q=60",
      cities: ["Riyadh", "Jeddah", "Dammam"],
      description: "Regular transit to major commercial and industrial centers.",
      features: ["Scheduled departures", "Cross-border coordination", "Commercial hubs"]
    },
    {
      name: "Qatar",
      flag: "QA",
      image: "https://images.unsplash.com/photo-1611348524140-53c9a25263d6?auto=format&fit=crop&w=420&q=60",
      cities: ["Doha"],
      description: "Door pickup and final delivery with milestone visibility.",
      features: ["Door-to-door", "Reliable schedule", "Tracking updates"]
    },
    {
      name: "Oman",
      flag: "OM",
      image: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=420&q=60",
      cities: ["Muscat", "Sohar", "Salalah"],
      description: "High-frequency coverage to key ports and commercial zones.",
      features: ["Multiple destinations", "Regular service", "Flexible planning"]
    },
    {
      name: "Kuwait",
      flag: "KW",
      image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=420&q=60",
      cities: ["Kuwait City"],
      description: "Dependable long-haul trucking for commercial and industrial cargo.",
      features: ["Commercial freight", "Industrial cargo", "Secure handling"]
    }
  ];
  return (
    <section id="gcc" className="py-20 bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-secondary-900 mb-4">
            GCC Cross-Border Road Freight
          </h2>
          <p className="text-lg md:text-xl text-secondary-600 max-w-3xl mx-auto">
            Dubai-based overland coverage across the GCC with scheduled runs and dependable delivery milestones.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl p-8 mb-12 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-center mb-5">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center">
              <TruckIcon className="w-7 h-7 text-primary-700" />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold text-center text-secondary-900 mb-3">
            Scheduled, Compliant, Cost-Effective
          </h3>
          <p className="text-center text-secondary-600 max-w-2xl mx-auto">
            Cross-border trucking engineered for predictable timelines, secure handling and practical documentation support.
          </p>
        </motion.div>

        {/* ✅ FIX 1: overflow-hidden instead of w-screen negative margin trick */}
        <div className="relative overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-gray-50 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-gray-50 to-transparent z-10" />

          {/* ✅ FIX 2: will-change + translate3d forces GPU compositing so animation never touches main thread */}
          <div
            className="flex gap-6 sm:gap-8 px-4 sm:px-10 motion-safe:animate-marquee"
            style={{
              width: 'max-content',
              willChange: 'transform',
              transform: 'translate3d(0, 0, 0)',
            }}
          >
            {[...countries, ...countries].map((country, index) => (
              <div
                key={`${country.name}-${index}`}
                className="w-[280px] sm:w-[340px] lg:w-[420px] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-shrink-0"
              >
                {/* ✅ FIX 3: explicit width + height prevents layout recalculation as images load */}
                <div className="h-44 sm:h-52 overflow-hidden bg-gray-100">
                  <img
                    src={country.image}
                    alt={country.name}
                    width={420}
                    height={208}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src = imageFallback;
                    }}
                  />
                </div>

                <div className="p-7">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="mr-3 inline-flex items-center justify-center rounded-lg bg-secondary-100 text-secondary-700 text-xs font-semibold px-2.5 py-1">
                        {country.flag}
                      </span>
                      <h3 className="text-lg font-semibold text-secondary-900">{country.name}</h3>
                    </div>
                    <MapPinIcon className="w-5 h-5 text-secondary-500" />
                  </div>

                  <p className="text-secondary-600 mb-4 leading-relaxed">
                    {country.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-secondary-900 mb-2">Major Cities</h4>
                    <div className="flex flex-wrap gap-2">
                      {country.cities.map((city, idx) => (
                        <span key={idx} className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-secondary-900 mb-2">Services</h4>
                    <ul className="space-y-1">
                      {country.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-secondary-700 text-sm">
                          <div className="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-secondary-900 mb-4">
              Why Choose Our GCC Network?
            </h3>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div>
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TruckIcon className="w-8 h-8 text-primary-600" />
                </div>
                <h4 className="font-semibold text-secondary-900 mb-2">Extensive Coverage</h4>
                <p className="text-secondary-600">Complete GCC coverage with regular scheduled services</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPinIcon className="w-8 h-8 text-primary-600" />
                </div>
                <h4 className="font-semibold text-secondary-900 mb-2">Strategic Location</h4>
                <p className="text-secondary-600">Dubai-based operations for optimal regional connectivity</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TruckIcon className="w-8 h-8 text-primary-600" />
                </div>
                <h4 className="font-semibold text-secondary-900 mb-2">Professional Team</h4>
                <p className="text-secondary-600">Experienced logistics professionals managing your cargo</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GCCNetwork;
