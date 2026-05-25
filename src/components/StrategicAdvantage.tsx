import React from 'react';
import { motion } from 'framer-motion';
import { ChartBarIcon, GlobeAltIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const StrategicAdvantage = () => {
  const imageFallback =
    'https://images.unsplash.com/photo-1446511437394-36cdff3ae1b3?auto=format&fit=crop&w=1200&q=80';

  const advantages = [
  {
    icon: ChartBarIcon,
    title: "Data-Driven Approach",
    description: "...",
    color: "orange/10 text-orange"
  },
  {
    icon: GlobeAltIcon,
    title: "Global Network",
    description: "...",
    color: "bg-orange/10 text-orange"
  },
  {
    icon: UserGroupIcon,
    title: "Deep Market Penetration",
    description: "...",
    color: "bg-orange/10 text-orange"
  }
];

  const countries = [
    {
      name: "China",
      flag: "CN",
      description: "Manufacturing-focused lanes supported by rooted supplier and handling connections.",
      specialties: ["Manufacturing hub", "Electronics", "Industrial goods"],
      image: "/china.jpg"
    },
    {
      name: "India",
      flag: "IN",
      description: "Strong coverage for a diverse export economy across multiple sectors and shipment sizes.",
      specialties: ["Pharmaceuticals", "IT services", "Textiles"],
      image: "/india.jpg"
    },
    {
      name: "Africa",
      flag: "AF",
      description: "Practical routing and documentation support for emerging and complex logistics environments.",
      specialties: ["Natural resources", "Agriculture", "Growing markets"],
      image: "/africa.jpg"
    }
  ];

  return (
    <section id="advantage" className="py-20 bg-white">
      <div
        className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-16"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2400&q=80)",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-orange/85" />
        <div className="relative h-[70vh] min-h-[520px] flex items-center">
          <div className="container-custom">
            <div className="max-w-3xl">
              <div className="sticky top-20">
                <motion.h2
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4"
                >
                  Built for High-Velocity Trade Lanes
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="text-lg md:text-xl text-gray-200 leading-relaxed"
                >
                  A Dubai base, strong market coverage and practical execution across air, sea and road.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="mt-5 text-base md:text-lg text-gray-200/90 leading-relaxed"
                >
                  From documentation and customs coordination to last-mile delivery, we keep shipments compliant and on schedule.
                  Our team prioritizes clear milestones, proactive updates, and practical routing to reduce delays.
                </motion.p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom">

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {advantages.map((advantage, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center rounded-2xl border border-gray-100 p-8 shadow-sm"
            >
              <div className={`w-20 h-20 ${advantage.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                <advantage.icon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                {advantage.title}
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                {advantage.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
          <h3 className="text-3xl font-semibold text-secondary-900 mb-8 text-center">
            Key Market Coverage
          </h3>

          <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-gray-50 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-gray-50 to-transparent" />

            <div className="flex w-max gap-6 sm:gap-8 motion-safe:animate-marquee px-4 sm:px-10">
              {[...countries, ...countries].map((country, index) => (
                <div
                  key={`${country.name}-${index}`}
                  className="w-[280px] sm:w-[340px] lg:w-[420px] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className="h-44 sm:h-52 overflow-hidden">
                    <img
                      src={country.image}
                      alt={country.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = imageFallback;
                      }}
                    />
                  </div>

                  <div className="p-7">
                    <div className="flex items-center mb-3">
                      <span className="mr-3 inline-flex items-center justify-center rounded-lg bg-secondary-100 text-secondary-700 text-xs font-semibold px-2.5 py-1">
                        {country.flag}
                      </span>
                      <h4 className="text-lg font-semibold text-secondary-900">{country.name}</h4>
                    </div>

                    <p className="text-secondary-600 mb-4 leading-relaxed">
                      {country.description}
                    </p>

                    <div className="space-y-2">
                      {country.specialties.map((specialty, idx) => (
                        <div key={idx} className="flex items-center text-secondary-700 text-sm">
                          <div className="w-2 h-2 bg-orange rounded-full mr-3"></div>
                          {specialty}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StrategicAdvantage;
