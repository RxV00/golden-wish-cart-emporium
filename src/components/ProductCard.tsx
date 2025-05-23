
import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const isWishlisted = isInWishlist(product.id);

  const handleWishlistClick = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={handleWishlistClick}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors duration-300 ${
            isWishlisted 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 text-forest-green hover:bg-white'
          }`}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-forest-green mb-2">{product.name}</h3>
        <p className="text-forest-green/60 text-sm mb-3">{product.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-forest-green">${product.price}</span>
          <span className="text-sm text-forest-green/60 bg-cream px-2 py-1 rounded">
            {product.material}
          </span>
        </div>
        
        <button
          onClick={handleAddToCart}
          className="w-full bg-forest-green text-cream py-3 rounded-lg hover:bg-forest-green-dark transition-colors duration-300 flex items-center justify-center space-x-2 font-semibold"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
