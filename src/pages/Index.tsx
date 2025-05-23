
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import DealsCarousel from '@/components/DealsCarousel';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';
import { Toaster } from 'sonner';

const Index = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <Hero />
      <DealsCarousel />
      <ProductGrid />
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
};

export default Index;
