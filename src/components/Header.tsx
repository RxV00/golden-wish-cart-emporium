
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Menu, X, User, LogIn } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import CartDrawer from './CartDrawer';
import WishlistDrawer from './WishlistDrawer';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { user } = useAuth();

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <header className="bg-forest-green text-cream shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/">
                <h1 className="text-2xl md:text-3xl font-bold tracking-wide hover:text-gold transition-colors">
                  Lumière Jewelry
                </h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="hover:text-gold transition-colors duration-300">Home</Link>
              <a href="#" className="hover:text-gold transition-colors duration-300">Rings</a>
              <a href="#" className="hover:text-gold transition-colors duration-300">Necklaces</a>
              <a href="#" className="hover:text-gold transition-colors duration-300">Earrings</a>
              <a href="#" className="hover:text-gold transition-colors duration-300">Bracelets</a>
              <a href="#" className="hover:text-gold transition-colors duration-300">About</a>
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              {user ? (
                <Link
                  to="/profile"
                  className="relative p-2 hover:bg-forest-green-light rounded-full transition-colors duration-300"
                  title="Profile"
                >
                  <User className="w-6 h-6" />
                </Link>
              ) : (
                <Link
                  to="/auth"
                  className="relative p-2 hover:bg-forest-green-light rounded-full transition-colors duration-300"
                  title="Sign In"
                >
                  <LogIn className="w-6 h-6" />
                </Link>
              )}
              
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="relative p-2 hover:bg-forest-green-light rounded-full transition-colors duration-300"
              >
                <Heart className="w-6 h-6" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold text-forest-green text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {wishlistItems.length}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:bg-forest-green-light rounded-full transition-colors duration-300"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold text-forest-green text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-forest-green-light rounded-full transition-colors duration-300"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)}>
          <nav 
            className={`fixed top-0 left-0 h-full w-3/4 max-w-sm bg-forest-green text-cream shadow-2xl transform transition-transform duration-300 ease-in-out ${
              isMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } ml-4`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 pt-20">
              <div className="flex flex-col space-y-6">
                <Link to="/" className="text-lg hover:text-gold transition-colors duration-300 border-b border-cream/20 pb-3">Home</Link>
                <a href="#" className="text-lg hover:text-gold transition-colors duration-300 border-b border-cream/20 pb-3">Rings</a>
                <a href="#" className="text-lg hover:text-gold transition-colors duration-300 border-b border-cream/20 pb-3">Necklaces</a>
                <a href="#" className="text-lg hover:text-gold transition-colors duration-300 border-b border-cream/20 pb-3">Earrings</a>
                <a href="#" className="text-lg hover:text-gold transition-colors duration-300 border-b border-cream/20 pb-3">Bracelets</a>
                <a href="#" className="text-lg hover:text-gold transition-colors duration-300 border-b border-cream/20 pb-3">About</a>
                {user ? (
                  <Link to="/profile" className="text-lg hover:text-gold transition-colors duration-300">Profile</Link>
                ) : (
                  <Link to="/auth" className="text-lg hover:text-gold transition-colors duration-300">Sign In</Link>
                )}
              </div>
            </div>
          </nav>
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </>
  );
};

export default Header;
