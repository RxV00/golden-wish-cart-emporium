
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { Toaster } from 'sonner';

const Index = () => {
  return (
    <CartProvider>
      <WishlistProvider>
        <div className="min-h-screen bg-cream">
          <Header />
          <Hero />
          <ProductGrid />
          <Footer />
          <Toaster position="top-right" />
        </div>
      </WishlistProvider>
    </CartProvider>
  );
};

export default Index;
