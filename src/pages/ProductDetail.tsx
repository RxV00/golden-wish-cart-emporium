
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart } from 'lucide-react';
import { mockProducts } from '@/data/mockProducts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const product = mockProducts.find(p => p.id === productId);
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-16 flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-forest-green mb-4">Product Not Found</h2>
            <p className="text-forest-green/70 mb-8">The product you're looking for doesn't exist or has been removed.</p>
            <Link to="/" className="inline-flex items-center text-forest-green hover:text-gold transition-colors">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Collection
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  
  const handleWishlistClick = () => {
    setIsTogglingWishlist(true);
    
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
    
    setTimeout(() => {
      setIsTogglingWishlist(false);
    }, 300);
  };

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    addToCart(product);
    toast.success("Added to cart");
    
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-6">
          <Link to="/#products" className="inline-flex items-center text-forest-green hover:text-gold transition-colors">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Collection
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="rounded-lg overflow-hidden bg-white shadow-lg">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover aspect-square"
            />
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-forest-green">{product.name}</h1>
              <p className="text-2xl font-bold text-forest-green mt-2">${product.price}</p>
            </div>
            
            <div>
              <p className="text-forest-green/70">{product.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-forest-green/20">
              <div>
                <h3 className="font-semibold text-forest-green">Material</h3>
                <p className="text-forest-green/70">{product.material}</p>
              </div>
              <div>
                <h3 className="font-semibold text-forest-green">Color</h3>
                <p className="text-forest-green/70">{product.color}</p>
              </div>
              <div>
                <h3 className="font-semibold text-forest-green">Category</h3>
                <p className="text-forest-green/70">{product.category}</p>
              </div>
            </div>
            
            <div className="pt-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <Button 
                onClick={handleAddToCart}
                className={`flex-1 bg-forest-green text-cream hover:bg-forest-green/90 py-6 transition-all duration-300 ${
                  isAddingToCart ? 'animate-pulse scale-95' : ''
                }`}
                disabled={isAddingToCart}
              >
                <ShoppingCart className={`mr-2 h-5 w-5 ${isAddingToCart ? 'animate-spin' : ''}`} />
                {isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}
              </Button>
              <Button 
                onClick={handleWishlistClick}
                variant="outline"
                disabled={isTogglingWishlist}
                className={`${
                  isWishlisted 
                    ? 'bg-red-500 text-white border-red-500 hover:bg-red-600' 
                    : 'bg-cream border-forest-green text-forest-green hover:bg-forest-green hover:text-cream'
                } transition-all duration-300 ${
                  isTogglingWishlist ? 'scale-95' : ''
                }`}
              >
                <Heart className={`mr-2 h-5 w-5 ${isWishlisted ? 'fill-current' : ''} ${
                  isTogglingWishlist ? 'animate-pulse' : ''
                }`} />
                {isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>
          </div>
        </div>
        
        <Card className="mb-12">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-forest-green mb-4">Product Details</h2>
            <p className="text-forest-green/70 leading-relaxed">
              This exquisite {product.name.toLowerCase()} is crafted with premium {product.material.toLowerCase()} 
              and finished with a beautiful {product.color.toLowerCase()} tone. Each piece is meticulously 
              created by our master artisans to ensure the highest quality and attention to detail.
              {product.category === 'Ring' && ' Perfect for engagements, anniversaries, or as a special gift to yourself.'}
              {product.category === 'Necklace' && ' A stunning addition to any outfit, this necklace sits elegantly around the neck and catches the light beautifully.'}
              {product.category === 'Earrings' && ' These earrings add a touch of elegance to any look, whether for everyday wear or special occasions.'}
              {product.category === 'Bracelet' && ' This bracelet wraps comfortably around the wrist and makes a sophisticated statement.'}
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
};

export default ProductDetail;
