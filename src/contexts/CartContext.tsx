
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getTotalPrice: () => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load cart items from localStorage or database
  useEffect(() => {
    const loadCartItems = async () => {
      if (user) {
        console.log('CartContext: Loading cart from database for user:', user.email);
        await loadFromDatabase();
      } else {
        console.log('CartContext: Loading cart from localStorage');
        loadFromLocalStorage();
      }
    };

    loadCartItems();
  }, [user]);

  // Transfer localStorage cart to database when user logs in
  useEffect(() => {
    if (user && cartItems.length > 0) {
      const hasLocalStorageItems = localStorage.getItem('jewelry-cart');
      if (hasLocalStorageItems) {
        console.log('CartContext: Transferring localStorage cart to database');
        transferLocalStorageToDatabase();
      }
    }
  }, [user]);

  const loadFromLocalStorage = () => {
    const savedCart = localStorage.getItem('jewelry-cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  };

  const loadFromDatabase = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('CartContext: Error loading cart from database:', error);
        toast.error('Failed to load cart items');
        return;
      }

      const dbCartItems: CartItem[] = data.map(item => ({
        id: item.product_id,
        name: item.product_name,
        price: parseFloat(item.product_price.toString()),
        image: item.product_image,
        description: item.product_description || '',
        category: '', // This field is not stored in cart_items table
        material: item.product_material || '',
        color: '', // This field is not stored in cart_items table
        quantity: item.quantity
      }));

      setCartItems(dbCartItems);
      console.log('CartContext: Loaded cart from database:', dbCartItems.length, 'items');
    } catch (error) {
      console.error('CartContext: Error loading cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const transferLocalStorageToDatabase = async () => {
    if (!user) return;

    const localCart = localStorage.getItem('jewelry-cart');
    if (!localCart) return;

    try {
      const localCartItems: CartItem[] = JSON.parse(localCart);
      console.log('CartContext: Transferring', localCartItems.length, 'items to database');

      for (const item of localCartItems) {
        await supabase
          .from('cart_items')
          .upsert({
            user_id: user.id,
            product_id: item.id,
            product_name: item.name,
            product_price: item.price,
            product_image: item.image,
            product_description: item.description,
            product_material: item.material,
            quantity: item.quantity
          }, {
            onConflict: 'user_id,product_id'
          });
      }

      localStorage.removeItem('jewelry-cart');
      await loadFromDatabase();
      toast.success('Cart items transferred to your account!');
    } catch (error) {
      console.error('CartContext: Error transferring cart:', error);
      toast.error('Failed to transfer cart items');
    }
  };

  const saveToLocalStorage = (items: CartItem[]) => {
    localStorage.setItem('jewelry-cart', JSON.stringify(items));
  };

  const saveToDatabase = async (items: CartItem[]) => {
    if (!user) return;

    try {
      // Delete all existing cart items for this user
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      // Insert updated cart items
      if (items.length > 0) {
        const cartData = items.map(item => ({
          user_id: user.id,
          product_id: item.id,
          product_name: item.name,
          product_price: item.price,
          product_image: item.image,
          product_description: item.description,
          product_material: item.material,
          quantity: item.quantity
        }));

        const { error } = await supabase
          .from('cart_items')
          .insert(cartData);

        if (error) {
          console.error('CartContext: Error saving to database:', error);
          toast.error('Failed to save cart');
        }
      }
    } catch (error) {
      console.error('CartContext: Error saving cart:', error);
    }
  };

  const addToCart = async (product: Product) => {
    const newCartItems = [...cartItems];
    const existingItem = newCartItems.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      newCartItems.push({ ...product, quantity: 1 });
    }

    setCartItems(newCartItems);

    if (user) {
      await saveToDatabase(newCartItems);
    } else {
      saveToLocalStorage(newCartItems);
    }
  };

  const removeFromCart = async (productId: string) => {
    const newCartItems = cartItems.filter(item => item.id !== productId);
    setCartItems(newCartItems);

    if (user) {
      await saveToDatabase(newCartItems);
    } else {
      saveToLocalStorage(newCartItems);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity === 0) {
      await removeFromCart(productId);
      return;
    }

    const newCartItems = cartItems.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );

    setCartItems(newCartItems);

    if (user) {
      await saveToDatabase(newCartItems);
    } else {
      saveToLocalStorage(newCartItems);
    }
  };

  const getTotalPrice = (): string => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return total.toFixed(2);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
