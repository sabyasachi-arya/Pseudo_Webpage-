import React, { useState } from 'react';
import { Bars3Icon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

var WA_PATH_1 = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z';
var WA_PATH_2 = 'M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.05 21.95a.5.5 0 0 0 .612.612l4.782-1.388A9.954 9.954 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z';
var LI_PATH = 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z';

var URL_WA_DESKTOP = 'https://wa.me/971544034567?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20your%20freight%20services.';
var URL_WA_MOBILE = 'https://wa.me/971544034567';
var URL_IG = 'https://www.instagram.com/ajiva_global_cargo/';
var URL_LI = 'https://www.linkedin.com/in/ajiva-global-26652a40a/';

var CLS_SOCIAL_DESKTOP = 'flex items-center justify-center w-9 h-9 rounded-full border border-white/40 hover:border-white hover:bg-white/10 transition-all duration-200';
var CLS_SOCIAL_MOBILE = 'flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 hover:bg-gray-100 transition-all';

function WhatsAppNavIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={WA_PATH_1} />
      <path d={WA_PATH_2} />
    </svg>
  );
}

function InstagramNavIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" />
    </svg>
  );
}

function LinkedInNavIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={LI_PATH} />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function WhatsAppNavIconDark() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#2d7a5e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={WA_PATH_1} />
      <path d={WA_PATH_2} />
    </svg>
  );
}

function InstagramNavIconDark() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#2d7a5e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" />
    </svg>
  );
}

function LinkedInNavIconDark() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#2d7a5e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={LI_PATH} />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  return (
    <nav className="w-full z-50">

      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container-custom">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-3">
              <img src="/company_logo_2.png" alt="Ajiva Global Logo" className="h-14 w-14 object-contain" />
              <div className="leading-tight">
                <div className="font-bold text-base text-secondary-900" style={{ fontFamily: "'Cinzel', serif" }}>AJIVA GLOBAL CARGO TRADING LLC</div>
                <div className="hidden sm:block text-xs text-secondary-500">Freight Forwarding · Customs · GCC Road Freight</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a href="#contact" className="btn-primary hidden sm:inline-block">Get a Quote</a>
              <Link to="/login" aria-label="Login" className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors text-secondary-700 font-semibold text-sm">
                <UserCircleIcon className="w-5 h-5" />
                <span className="hidden sm:inline"></span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-darkteal">
        <div className="container-custom">

          <div className="hidden md:flex justify-between items-center py-3">
            <div className="flex items-center space-x-7">
              <a href="#home" className="font-medium text-white/85 hover:text-white transition-colors text-sm">Home</a>
              <a href="#services" className="font-medium text-white/85 hover:text-white transition-colors text-sm">Services</a>
              <a href="#advantage" className="font-medium text-white/85 hover:text-white transition-colors text-sm">Strategic Advantage</a>
              <a href="#gcc" className="font-medium text-white/85 hover:text-white transition-colors text-sm">GCC Network</a>
              <a href="#contact" className="font-medium text-white/85 hover:text-white transition-colors text-sm">Contact</a>
            </div>
            <div className="flex items-center gap-3">
              <a href={URL_WA_DESKTOP} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={CLS_SOCIAL_DESKTOP}><WhatsAppNavIcon /></a>
              <a href={URL_IG} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={CLS_SOCIAL_DESKTOP}><InstagramNavIcon /></a>
              <a href={URL_LI} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={CLS_SOCIAL_DESKTOP}><LinkedInNavIcon /></a>
            </div>
          </div>

          <div className="md:hidden flex justify-between items-center py-3">
            <span className="text-white/70 text-xs font-medium tracking-wide">MENU</span>
            <button className="text-white" onClick={toggleMenu}>
              {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg px-4 pb-4 pt-2">
            <a href="#home" className="block py-2 text-secondary-700 hover:text-secondary-900 font-medium border-b border-gray-100">Home</a>
            <a href="#services" className="block py-2 text-secondary-700 hover:text-secondary-900 font-medium border-b border-gray-100">Services</a>
            <a href="#advantage" className="block py-2 text-secondary-700 hover:text-secondary-900 font-medium border-b border-gray-100">Strategic Advantage</a>
            <a href="#gcc" className="block py-2 text-secondary-700 hover:text-secondary-900 font-medium border-b border-gray-100">GCC Network</a>
            <a href="#contact" className="block py-2 text-secondary-700 hover:text-secondary-900 font-medium border-b border-gray-100">Contact</a>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <a href="#contact" className="btn-primary w-full block text-center">Get a Quote</a>
              <Link to="/login" className="w-full inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors text-secondary-700 font-semibold text-sm py-2">
                <UserCircleIcon className="w-5 h-5 mr-2" />
                CRM Login
              </Link>
            </div>
            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100">
              <a href={URL_WA_MOBILE} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={CLS_SOCIAL_MOBILE}><WhatsAppNavIconDark /></a>
              <a href={URL_IG} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={CLS_SOCIAL_MOBILE}><InstagramNavIconDark /></a>
              <a href={URL_LI} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={CLS_SOCIAL_MOBILE}><LinkedInNavIconDark /></a>
            </div>
          </div>
        )}
      </div>

    </nav>
  );
};

export default Navbar;
