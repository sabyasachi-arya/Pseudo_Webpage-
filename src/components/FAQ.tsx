import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const faqs = [
  {
    question: "What services does Ajiva Global provide?",
    answer: "We offer comprehensive logistics solutions, including Air Freight, Sea Freight (FCL/LCL), Land Transport (UAE & GCC trucking), Door-to-Door Cargo, and complete Customs & Document Clearance."
  },
  {
    question: "Which regions do you serve?",
    answer: "Based in Dubai, UAE, we specialize in high-velocity trade lanes across China, India, Africa, and the GCC countries."
  },
  {
    question: "Do you handle both commercial and personal shipments?",
    answer: "Yes. We handle commercial cargo (electronics, SME goods, etc.) as well as personal consignments, providing packaging guidance and door-to-door delivery."
  },
  {
    question: "Can you help with customs and legal documentation?",
    answer: "Yes, we manage all import/export documentation, Dubai customs handling, regulatory compliance, and trade legal clearance to prevent shipment delays."
  },
  {
    question: "How can I request a pricing estimate?",
    answer: "You can request a tailored quote by contacting us via phone (+971 54 403 4567) or email (Info@ajivacargotrading.com) with your cargo details and preferred timeline."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-secondary-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg md:text-xl text-secondary-600 max-w-3xl mx-auto">
            Everything you need to know about our freight and logistics services.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between px-8 py-6 text-left"
              >
                <span className="text-secondary-900 font-semibold text-lg pr-4">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDownIcon className="w-5 h-5 text-emerald" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-8 pb-6">
                      <div className="h-px bg-emerald/20 mb-5" />
                      <p className="text-secondary-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
