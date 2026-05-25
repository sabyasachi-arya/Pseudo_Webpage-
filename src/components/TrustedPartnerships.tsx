import React from 'react';
import { motion } from 'framer-motion';

const logos = [
  { src: '/abc-cargo.png', alt: 'ABC Cargo' },
  { src: '/dhl-logo.png', alt: 'DHL' },
  { src: '/fed-ex-logo.jpg', alt: 'FedEx' },
];

const TrustedPartnerships = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-secondary-900 mb-6">
            Our Trusted Partnerships
          </h2>
          <p className="text-lg md:text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
            At Ajiva Global, we believe that seamless logistics is built on strong relationships. Over the years, we have forged strategic alliances with world-class carriers, local port authorities, and global trade networks. By combining our regional expertise with our partners' vast infrastructure, we ensure your cargo moves swiftly, securely, and cost-effectively across every border. Together, we connect your business to the world.
          </p>
        </motion.div>

        {/* Logo marquee */}
        <div className="relative overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

          <div
            className="flex gap-8 sm:gap-16 motion-safe:animate-marquee px-4"
            style={{
              width: 'max-content',
              willChange: 'transform',
              transform: 'translate3d(0, 0, 0)',
            }}
          >
            {[...logos, ...logos, ...logos, ...logos].map((logo, index) => (
              <div
                key={index}
                className="flex items-center justify-center w-40 h-24 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-16 max-w-36 object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default TrustedPartnerships;
