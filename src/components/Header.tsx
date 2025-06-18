
import React from 'react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-orange-900 to-orange-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-200 to-cyan-200 bg-clip-text text-transparent">
              HypoRED+
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 font-medium">
              Autonomous Redhead Hypothesis Generator
            </p>
            <p className="text-orange-300 text-lg max-w-3xl mx-auto">
              An AI-powered scientific hypothesis engine that generates unique, 
              plausible research hypotheses about redheads and their genetic, 
              physiological, and behavioral characteristics.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
