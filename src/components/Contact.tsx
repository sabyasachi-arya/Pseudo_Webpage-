import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BuildingOfficeIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  ClockIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const SHEET_URL = "https://script.google.com/macros/s/AKfycbxFnZiBpyXPEYLZ51D_BJe9LNBkOYB1tRxYlxZ5anpjm1CauTx9Js5adeQRlWhE8BVj-w/exec";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      await fetch(SHEET_URL, {
        method: 'POST',
        body: JSON.stringify({
          name:    formData.name,
          email:   formData.email,
          phone:   formData.phone,
          service: formData.service,
          message: formData.message,
        }),
      });

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: BuildingOfficeIcon,
      title: "Office Address",
      details: "Office - 213 #05 Sadaf Business Centre, Al Qiyadah exit -2, Al kazim Building, Block A Deira Dubai",
      action: "Get Directions"
    },
    {
      icon: PhoneIcon,
      title: "Phone",
      details: "+971 54 403 4567",
      action: "Call Now"
    },
    {
      icon: EnvelopeIcon,
      title: "Email",
      details: "Info@ajivacargotrading.com",
      action: "Send Email"
    },
    {
      icon: ClockIcon,
      title: "Business Hours",
      details: "Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 9:00 AM - 2:00 PM\nSunday: Closed",
      action: "Schedule Meeting"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-secondary-900 mb-4">
            Contact Us
          </h2>
          <p className="text-lg md:text-xl text-secondary-600 max-w-3xl mx-auto">
            Speak with our team for routing options, documentation requirements and a tailored quote.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-secondary-900 rounded-2xl p-8 text-white mb-8 border border-gray-800">
              <h3 className="text-2xl font-semibold mb-4">Ajiva Global — Dubai HQ</h3>
              <p className="text-gray-200 mb-8 leading-relaxed">
                Fast response for air, sea and GCC road freight. Share your cargo details and preferred timelines — we'll come back with the best routing and pricing.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPinIcon className="w-5 h-5 mr-3" />
                  <span>Dubai, UAE - Global Logistics Hub</span>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="w-5 h-5 mr-3" />
                  <span>+971 54 403 4567</span>
                </div>
                <div className="flex items-center">
                  <EnvelopeIcon className="w-5 h-5 mr-3" />
                  <span>Info@ajivacargotrading.com</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                      <info.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h4 className="font-semibold text-secondary-900">{info.title}</h4>
                  </div>
                  <p className="text-secondary-600 text-sm whitespace-pre-line">{info.details}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-semibold text-secondary-900 mb-2">Request a Quote</h3>
              <p className="text-secondary-600 mb-6">
                Tell us what you're shipping and where it needs to go. We'll respond with the best available option.
              </p>

              {submitted && (
                <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                  Thanks — your request has been recorded. We'll contact you shortly.
                </div>
              )}

              {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  Something went wrong. Please try again or email us directly.
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="+971 5X XXX XXXX"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Service Type *
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    >
                      <option value="">Select a service</option>
                      <option value="air-freight">Air Freight</option>
                      <option value="sea-freight">Sea Freight</option>
                      <option value="land-transport">Land Transport</option>
                      <option value="door-to-door">Door-to-Door Cargo</option>
                      <option value="customs-clearance">Customs Clearance</option>
                      <option value="documents-clearance">Documents Clearance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Tell us about your shipping requirements..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary text-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
