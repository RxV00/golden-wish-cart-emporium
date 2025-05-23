
import React from 'react';

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-cream to-cream-dark py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-forest-green mb-6">
          Exquisite Jewelry
        </h2>
        <p className="text-xl md:text-2xl text-forest-green/80 mb-8 max-w-2xl mx-auto">
          Discover our curated collection of timeless pieces crafted with precision and passion
        </p>
        <button className="bg-forest-green text-cream px-8 py-4 rounded-lg text-lg font-semibold hover:bg-forest-green-dark transition-colors duration-300 shadow-lg hover:shadow-xl">
          Shop Collection
        </button>
      </div>
    </section>
  );
};

export default Hero;
