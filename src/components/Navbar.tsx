import React, { useState } from 'react';
import { Bars3Icon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full z-50 bg-peach py-4">
      <div className="container-custom">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img
  src="/company_logo_2.png"
  alt="Ajiva Global Logo"
  className="h-20 w-20"
/>

            <div className="leading-tight">
              <div className="font-bold text-xl text-emerald">AJIVA GLOBAL CARGO TRADING LLC</div>
              <div className="hidden sm:block text-xs text-emerald/70">Freight Forwarding · Customs · GCC Road Freight</div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="font-medium text-emerald/85 hover:text-emerald transition-colors">Home</a>
            <a href="#services" className="font-medium text-emerald/85 hover:text-emerald transition-colors">Services</a>
            <a href="#advantage" className="font-medium text-emerald/85 hover:text-emerald transition-colors">Strategic Advantage</a>
            <a href="#gcc" className="font-medium text-emerald/85 hover:text-emerald transition-colors">GCC Network</a>
            <a href="#contact" className="font-medium text-emerald/85 hover:text-emerald transition-colors">Contact</a>
            <div className="flex items-center gap-3">
              <a href="#contact" className="btn-primary">Get Quote</a>
              <Link
                to="/login"
                aria-label="Login"
                className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 transition-colors"
              >
                <UserCircleIcon className="w-6 h-6 text-white" />
              </Link>
            </div>
          </div>

          <button
            className="md:hidden text-white pr-4"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden bg-secondary-900/95 border border-white/10 shadow-lg rounded-lg mt-4 p-4">
            <a href="#home" className="block py-2 text-white/85 hover:text-white font-medium">Home</a>
            <a href="#services" className="block py-2 text-white/85 hover:text-white font-medium">Services</a>
            <a href="#advantage" className="block py-2 text-white/85 hover:text-white font-medium">Strategic Advantage</a>
            <a href="#gcc" className="block py-2 text-white/85 hover:text-white font-medium">GCC Network</a>
            <a href="#contact" className="block py-2 text-white/85 hover:text-white font-medium">Contact</a>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <a href="#contact" className="btn-primary w-full block text-center">Get Quote</a>
              <Link to="/login" className="w-full inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 transition-colors text-white font-semibold">
                <UserCircleIcon className="w-5 h-5 mr-2" />
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
