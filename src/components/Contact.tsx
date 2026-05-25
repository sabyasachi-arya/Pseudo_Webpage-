import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const SHEET_URL = "https://script.google.com/macros/s/AKfycbxPrYZB6ipV2LiC0iZqldw6usF6S9OrYMcBGEITqerKNyr4-u7ycGo95oLIE3hLwxL-Dw/exec";

const INSTAGRAM_URL = "https://www.instagram.com/ajiva_global_cargo/";
const FACEBOOK_URL  = "https://www.facebook.com/profile.php?id=61590182633624";
const YOUTUBE_URL   = "https://www.youtube.com/@YOUR_CHANNEL";
const LINKEDIN_URL  = "https://www.linkedin.com/in/ajiva-global-26652a40a/";
const GMAPS_URL     = "https://maps.google.com/?q=YOUR_LOCATION";
const WHATSAPP_NUMBER = "971544034567";

const WA_BASE: React.CSSProperties = {
  position: 'fixed',
  bottom: '28px',
  right: '28px',
  zIndex: 9999,
  backgroundColor: '#25D366',
  borderRadius: '50%',
  width: '60px',
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  boxShadow: '0 4px 20px rgba(37,211,102,0.5)',
  transform: 'scale(1)',
};

const WA_HOVERED: React.CSSProperties = {
  position: 'fixed',
  bottom: '28px',
  right: '28px',
  zIndex: 9999,
  backgroundColor: '#25D366',
  borderRadius: '50%',
  width: '60px',
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  boxShadow: '0 6px 28px rgba(37,211,102,0.75)',
  transform: 'scale(1.12)',
};

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#F37324" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="36" height="36">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#F37324" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="36" height="36">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#F37324" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="36" height="36">
      <path d="M22.54 6.42A2.78 2.78 0 0 0 20.6 4.47C18.88 4 12 4 12 4s-6.88 0-8.6.47A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.53C5.12 20 12 20 12 20s6.88 0 8.6-.47a2.78 2.78 0 0 0 1.94-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#F37324" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="36" height="36">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GoogleMapsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#F37324" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="36" height="36">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.523 5.847L.057 23.571a.75.75 0 0 0 .92.92l5.724-1.466A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.725 9.725 0 0 1-4.964-1.355l-.356-.212-3.694.947.964-3.595-.232-.371A9.718 9.718 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
    </svg>
  );
}

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
  const [waHovered, setWaHovered] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: BuildingOfficeIcon, title: "Office Address",  details: "Office - 213 #05 Sadaf Business Centre, Al Qiyadah exit -2, Al kazim Building, Block A Deira Dubai" },
    { icon: PhoneIcon,          title: "Phone",           details: "+971 54 403 4567" },
    { icon: EnvelopeIcon,       title: "Email",           details: "Info@ajivacargotrading.com" },
    { icon: ClockIcon,          title: "Business Hours",  details: "Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 9:00 AM - 2:00 PM\nSunday: Closed" },
  ];

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container-custom">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-secondary-900 mb-4">
            Contact Us
          </h2>
          <p className="text-lg md:text-xl text-secondary-600 max-w-3xl mx-auto">
            Speak with our team for routing options, documentation requirements and a tailored quote.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center justify-center gap-3 w-44 py-6 px-4 rounded-2xl border-2 border-gray-100 bg-gray-50 hover:border-[#F37324] hover:bg-orange-50 transition-all duration-300 shadow-sm hover:shadow-md">
            <span className="transition-transform duration-300 group-hover:scale-110"><InstagramIcon /></span>
            <span className="text-center text-xs font-semibold text-secondary-700 group-hover:text-[#F37324] leading-tight transition-colors duration-300">Follow us on Instagram</span>
          </a>
          <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center justify-center gap-3 w-44 py-6 px-4 rounded-2xl border-2 border-gray-100 bg-gray-50 hover:border-[#F37324] hover:bg-orange-50 transition-all duration-300 shadow-sm hover:shadow-md">
            <span className="transition-transform duration-300 group-hover:scale-110"><FacebookIcon /></span>
            <span className="text-center text-xs font-semibold text-secondary-700 group-hover:text-[#F37324] leading-tight transition-colors duration-300">Like us on Facebook</span>
          </a>
          <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center justify-center gap-3 w-44 py-6 px-4 rounded-2xl border-2 border-gray-100 bg-gray-50 hover:border-[#F37324] hover:bg-orange-50 transition-all duration-300 shadow-sm hover:shadow-md">
            <span className="transition-transform duration-300 group-hover:scale-110"><YouTubeIcon /></span>
            <span className="text-center text-xs font-semibold text-secondary-700 group-hover:text-[#F37324] leading-tight transition-colors duration-300">Subscribe to our YouTube Channel</span>
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center justify-center gap-3 w-44 py-6 px-4 rounded-2xl border-2 border-gray-100 bg-gray-50 hover:border-[#F37324] hover:bg-orange-50 transition-all duration-300 shadow-sm hover:shadow-md">
            <span className="transition-transform duration-300 group-hover:scale-110"><LinkedInIcon /></span>
            <span className="text-center text-xs font-semibold text-secondary-700 group-hover:text-[#F37324] leading-tight transition-colors duration-300">Follow Us on LinkedIn</span>
          </a>
          <a href={GMAPS_URL} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center justify-center gap-3 w-44 py-6 px-4 rounded-2xl border-2 border-gray-100 bg-gray-50 hover:border-[#F37324] hover:bg-orange-50 transition-all duration-300 shadow-sm hover:shadow-md">
            <span className="transition-transform duration-300 group-hover:scale-110"><GoogleMapsIcon /></span>
            <span className="text-center text-xs font-semibold text-secondary-700 group-hover:text-[#F37324] leading-tight transition-colors duration-300">Find us on Google Maps</span>
          </a>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-darkteal rounded-2xl p-8 text-white mb-8 border border-gray-800">
              <h3 className="text-2xl font-semibold mb-4">Ajiva Global - Dubai HQ</h3>
              <p className="text-gray-200 mb-8 leading-relaxed">
                Fast response for air, sea and GCC road freight. Share your cargo details and preferred timelines, we will come back with the best routing and pricing.
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
              {contactInfo.map(function(info, index) {
                return (
                  <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-orange/10 rounded-lg flex items-center justify-center mr-4">
  <info.icon className="w-6 h-6 text-orange" />
</div>
                      <h4 className="font-semibold text-secondary-900">{info.title}</h4>
                    </div>
                    <p className="text-secondary-600 text-sm whitespace-pre-line">{info.details}</p>
                  </div>
                );
              })}
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
                Tell us what you are shipping and where it needs to go. We will respond with the best available option.
              </p>

              {submitted && (
                <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                  Thanks — your request has been recorded. We will contact you shortly.
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
                    <label className="block text-sm font-medium text-secondary-700 mb-2">Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" placeholder="john@example.com" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" placeholder="+971 5X XXX XXXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">Service Type *</label>
                    <select name="service" value={formData.service} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors">
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
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Message *</label>
                  <textarea name="message" value={formData.message} onChange={handleInputChange} required rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" placeholder="Tell us about your shipping requirements..." />
                </div>

                <button type="submit" disabled={loading} className="w-full btn-primary text-center disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>

      </div>

      {/* ── Fixed WhatsApp bubble ── */}
      <a
        href={"https://wa.me/" + WHATSAPP_NUMBER + "?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20your%20freight%20services."}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        style={waHovered ? WA_HOVERED : WA_BASE}
        onMouseEnter={function() { setWaHovered(true); }}
        onMouseLeave={function() { setWaHovered(false); }}
      >
        <WhatsAppIcon />
      </a>

    </section>
  );
};

export default Contact;
