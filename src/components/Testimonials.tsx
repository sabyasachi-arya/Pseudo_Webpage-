import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from '@heroicons/react/24/solid';

const testimonials = [
  {
    title: "Absolute Lifesavers for Our Business",
    quote: "We were facing a massive delay with a shipment coming from Guangzhou just before peak season. The team at Ajiva Global stepped in, took over the communication, and cleared customs in Dubai faster than we thought possible. They aren't just a logistics provider; they feel like an extension of our own team. Highly recommended!",
    name: "Sarah Al-Mansoori",
    role: "Founder of Zaza Boutique, Dubai"
  },
  {
    title: "Seamless and Stress-Free Shipping",
    quote: "Moving goods into the GCC can be a headache with all the paperwork, but Ajiva made it completely seamless. From the initial quote to final delivery in Riyadh, everything was transparent. No hidden fees, no unexpected delays—just honest, reliable service.",
    name: "Rajesh Kumar",
    role: "Operations Director at Apex Electronics"
  },
  {
    title: "They Actually Care About the Little Things",
    quote: "As a small business owner, I usually get ignored by big freight forwarders because my volumes aren't huge. Ajiva treated me like their most important client. They walked me through the door-to-door process, helped with packaging guidance, and kept me updated every step of the way. Their customer support is incredibly human and empathetic.",
    name: "Michael Obi",
    role: "General Manager at BrightLines Trading, Africa Division"
  },
  {
    title: "The Best Customs Experts in the Region",
    quote: "Customs clearance used to be our biggest bottleneck. Ever since we partnered with Ajiva Global, that stress is entirely gone. They handle our complex documentation flawlessly, saving us thousands in potential demurrage fees. They are professional, knowledgeable, and always available when you call.",
    name: "Fatima Al-Suwaidi",
    role: "Logistics Manager at Gulf Horizon Group"
  }
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const prev = () => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  };

  const next = () => {
    setDirection(1);
    setCurrent((c) => (c + 1) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container-custom">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-secondary-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg md:text-xl text-secondary-600 max-w-3xl mx-auto">
            Real experiences from businesses we've helped move faster and smarter.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">

          {/* Card */}
          <div className="overflow-hidden rounded-3xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={{ opacity: 0, x: direction * 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -80 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="bg-gray-50 border border-gray-100 rounded-3xl p-10 md:p-14"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-lime" />
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-secondary-900 mb-5">
                  "{testimonials[current].title}"
                </h3>

                {/* Quote */}
                <p className="text-secondary-600 text-lg leading-relaxed mb-8">
                  {testimonials[current].quote}
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-darkteal flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">
                      {testimonials[current].name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-secondary-900">
                      {testimonials[current].name}
                    </div>
                    <div className="text-secondary-500 text-sm">
                      {testimonials[current].role}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={prev}
              className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-darkteal text-darkteal hover:bg-darkteal hover:text-white transition-all duration-200"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > current ? 1 : -1);
                    setCurrent(idx);
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    idx === current
                      ? 'w-8 h-3 bg-darkteal'
                      : 'w-3 h-3 bg-gray-300 hover:bg-darkteal/50'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-darkteal text-darkteal hover:bg-darkteal hover:text-white transition-all duration-200"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Counter */}
          <p className="text-center text-secondary-400 text-sm mt-4">
            {current + 1} of {testimonials.length}
          </p>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
