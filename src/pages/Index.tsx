
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';
import { Toaster } from 'sonner';

const Index = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <Hero />
      <ProductGrid />
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
};

export default Index;
