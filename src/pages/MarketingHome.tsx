import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import StrategicAdvantage from '../components/StrategicAdvantage';
import GCCNetwork from '../components/GCCNetwork';
import Contact from '../components/Contact';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

export default function MarketingHome() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Services />
      <StrategicAdvantage />
      <GCCNetwork />
      <Contact />
      <FAQ />
      <Footer />
    </div>
  );
}
