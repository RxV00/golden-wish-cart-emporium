
import React from 'react';
import { X, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ isOpen, onClose }) => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      )}
      
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-forest-green">Wishlist</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
            >
              <X className="w-6 h-6 text-forest-green" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {wishlistItems.length === 0 ? (
            <p className="text-center text-forest-green/60 mt-8">Your wishlist is empty</p>
          ) : (
            <div className="space-y-4">
              {wishlistItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-forest-green">{item.name}</h3>
                    <p className="text-forest-green/60 text-sm">${item.price}</p>
                    <p className="text-forest-green/60 text-xs">{item.material}</p>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="p-2 bg-forest-green text-cream rounded-full hover:bg-forest-green-dark transition-colors duration-300"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="p-2 hover:bg-red-50 rounded-full transition-colors duration-300"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistDrawer;
