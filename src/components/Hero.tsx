import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRightIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const Hero = () => {
  const slides = useMemo(
    () => [
      {
        src: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2400&q=80',
        alt: 'Container terminal operations',
      },
      {
        src: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=2400&q=80',
        alt: 'Air freight cargo operations',
      },
      {
        src: 'company_image_1.png?auto=format&fit=crop&w=2400&q=80',
        alt: 'Custom Image 1',
      },
      {
        src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=2400&q=80',
        alt: 'Global trade network',
      },
      {
        src: 'company_image_2.png?auto=format&fit=crop&w=2400&q=80',
        alt: 'Custom Image 2',
      },
      {
        src: 'door-to-door.png?auto=format&fit=crop&w=2400&q=80',
        alt: 'Custom Image 3',
      },
      {
        src: 'land-transport.png?auto=format&fit=crop&w=2400&q=80',
        alt: 'Custom Image 5',
      },
      {
        src: 'doc-clearance.png?auto=format&fit=crop&w=2400&q=80',
        alt: 'Custom Image 4',
      },
      {
        src: 'custom-clearance.png?auto=format&fit=crop&w=2400&q=80',
        alt: 'Custom Image 5',
      },
      {
        src: 'air-freight.png?auto=format&fit=crop&w=2400&q=80',
        alt: 'Custom Image 6',
      },
      {
        src: 'cargo-freight.png?auto=format&fit=crop&w=2400&q=80',
        alt: 'Custom Image 7',
      },
    ],
    [],
  );

  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, [slides.length]);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={slides[active].src}
            src={slides[active].src}
            alt={slides[active].alt}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: 'easeInOut' }}
          />
        </AnimatePresence>
        
<div className="absolute inset-0 bg-gradient-to-b from-orange/90 via-orange/70 to-orange/90" />
<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(146,220,0,0.25),transparent_55%)]" />
      </div>

      <div className="relative container-custom pt-16 md:pt-20 pb-14">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-white mx-auto"
          >
            <GlobeAltIcon className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Dubai, UAE · Freight Forwarding & Logistics</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-6xl font-semibold tracking-tight text-white leading-[1.06]"
          >
            AJIVA GLOBAL
            <span className="block text-primary-200">Reliable Freight Services: Best Way Forward</span>
            <span className="block text-primary-200">Dubai, UAE</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-gray-200 leading-relaxed"
          >
            Experience proven freight and logistics services designed for thrilling new possibilities. Transform your supply chain with our world-class solutions
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="#contact" className="btn-primary inline-flex items-center justify-center">
              Request a Quote
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </a>
            <a
              href="#services"
              className="border border-white/40 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors duration-200 text-center"
            >
              Explore Services
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div className="rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm p-4">
              <div className="text-2xl font-semibold text-white">Air Freight</div>
              <div className="text-sm text-gray-200 mt-1">Express worldwide · Door delivery</div>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm p-4">
              <div className="text-2xl font-semibold text-white">Sea Freight</div>
              <div className="text-sm text-gray-200 mt-1">FCL · LCL · Import & export</div>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm p-4">
              <div className="text-2xl font-semibold text-white">GCC Road</div>
              <div className="text-sm text-gray-200 mt-1">UAE & GCC trucking · Scheduled runs</div>
            </div>
          </motion.div>

          <div className="mt-10 flex items-center gap-2 justify-center flex-wrap px-4">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActive(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all ${idx === active ? 'w-8 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/65'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
