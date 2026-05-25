import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import StrategicAdvantage from '../components/StrategicAdvantage';
import GCCNetwork from '../components/GCCNetwork';
import Contact from '../components/Contact';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import Testimonials from '../components/Testimonials';

export default function MarketingHome() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Services />
      <StrategicAdvantage />
      <GCCNetwork />
      <Testimonials />
      <Contact />
      <FAQ />
      <Footer />
    </div>
  );
}
