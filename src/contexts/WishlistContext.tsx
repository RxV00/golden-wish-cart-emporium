
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WishlistContextType {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load wishlist items from localStorage or database
  useEffect(() => {
    const loadWishlistItems = async () => {
      if (user) {
        console.log('WishlistContext: Loading wishlist from database for user:', user.email);
        await loadFromDatabase();
      } else {
        console.log('WishlistContext: Loading wishlist from localStorage');
        loadFromLocalStorage();
      }
    };

    loadWishlistItems();
  }, [user]);

  // Transfer localStorage wishlist to database when user logs in
  useEffect(() => {
    if (user && wishlistItems.length > 0) {
      const hasLocalStorageItems = localStorage.getItem('jewelry-wishlist');
      if (hasLocalStorageItems) {
        console.log('WishlistContext: Transferring localStorage wishlist to database');
        transferLocalStorageToDatabase();
      }
    }
  }, [user]);

  const loadFromLocalStorage = () => {
    const savedWishlist = localStorage.getItem('jewelry-wishlist');
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
  };

  const loadFromDatabase = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('WishlistContext: Error loading wishlist from database:', error);
        toast.error('Failed to load wishlist items');
        return;
      }

      const dbWishlistItems: Product[] = data.map(item => ({
        id: item.product_id,
        name: item.product_name,
        price: parseFloat(item.product_price.toString()),
        image: item.product_image,
        description: item.product_description || '',
        category: '', // This field is not stored in wishlist_items table
        material: item.product_material || '',
        color: '' // This field is not stored in wishlist_items table
      }));

      setWishlistItems(dbWishlistItems);
      console.log('WishlistContext: Loaded wishlist from database:', dbWishlistItems.length, 'items');
    } catch (error) {
      console.error('WishlistContext: Error loading wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const transferLocalStorageToDatabase = async () => {
    if (!user) return;

    const localWishlist = localStorage.getItem('jewelry-wishlist');
    if (!localWishlist) return;

    try {
      const localWishlistItems: Product[] = JSON.parse(localWishlist);
      console.log('WishlistContext: Transferring', localWishlistItems.length, 'items to database');

      for (const item of localWishlistItems) {
        await supabase
          .from('wishlist_items')
          .upsert({
            user_id: user.id,
            product_id: item.id,
            product_name: item.name,
            product_price: item.price,
            product_image: item.image,
            product_description: item.description,
            product_material: item.material
          }, {
            onConflict: 'user_id,product_id'
          });
      }

      localStorage.removeItem('jewelry-wishlist');
      await loadFromDatabase();
      toast.success('Wishlist items transferred to your account!');
    } catch (error) {
      console.error('WishlistContext: Error transferring wishlist:', error);
      toast.error('Failed to transfer wishlist items');
    }
  };

  const saveToLocalStorage = (items: Product[]) => {
    localStorage.setItem('jewelry-wishlist', JSON.stringify(items));
  };

  const saveToDatabase = async (items: Product[]) => {
    if (!user) return;

    try {
      // Delete all existing wishlist items for this user
      await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', user.id);

      // Insert updated wishlist items
      if (items.length > 0) {
        const wishlistData = items.map(item => ({
          user_id: user.id,
          product_id: item.id,
          product_name: item.name,
          product_price: item.price,
          product_image: item.image,
          product_description: item.description,
          product_material: item.material
        }));

        const { error } = await supabase
          .from('wishlist_items')
          .insert(wishlistData);

        if (error) {
          console.error('WishlistContext: Error saving to database:', error);
          toast.error('Failed to save wishlist');
        }
      }
    } catch (error) {
      console.error('WishlistContext: Error saving wishlist:', error);
    }
  };

  const addToWishlist = async (product: Product) => {
    const newWishlistItems = [...wishlistItems];
    if (newWishlistItems.find(item => item.id === product.id)) {
      return; // Item already in wishlist
    }

    newWishlistItems.push(product);
    setWishlistItems(newWishlistItems);

    if (user) {
      await saveToDatabase(newWishlistItems);
    } else {
      saveToLocalStorage(newWishlistItems);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    const newWishlistItems = wishlistItems.filter(item => item.id !== productId);
    setWishlistItems(newWishlistItems);

    if (user) {
      await saveToDatabase(newWishlistItems);
    } else {
      saveToLocalStorage(newWishlistItems);
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
