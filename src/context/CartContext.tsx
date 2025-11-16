// context/CartContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  isCartLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Load cart from database when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCartFromDatabase();
    } else {
      // Load from localStorage for guest users
      const savedCart = localStorage.getItem('guestCart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    }
  }, [isAuthenticated, user]);

  // Save cart to localStorage for guest users
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('guestCart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const loadCartFromDatabase = async () => {
    if (!user) return;
    
    setIsCartLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/carts?userId=${user.id}`);
      if (response.ok) {
        const userCart = await response.json();
        if (userCart.length > 0) {
          setCartItems(userCart[0].items || []);
        }
      }
    } catch (error) {
      console.error('Error loading cart from database:', error);
    } finally {
      setIsCartLoading(false);
    }
  };

  const saveCartToDatabase = async (items: CartItem[]) => {
    if (!user) return;

    try {
      // First, check if user already has a cart
      const existingCartResponse = await fetch(`http://localhost:5000/carts?userId=${user.id}`);
      const existingCart = await existingCartResponse.json();

      if (existingCart.length > 0) {
        // Update existing cart
        await fetch(`http://localhost:5000/carts/${existingCart[0].id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...existingCart[0],
            items: items,
            updatedAt: new Date().toISOString()
          })
        });
      } else {
        // Create new cart
        await fetch('http://localhost:5000/carts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            items: items,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
        });
      }
    } catch (error) {
      console.error('Error saving cart to database:', error);
    }
  };

  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      let newItems: CartItem[];
      if (existingItem) {
        newItems = prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...prevItems, { ...product, quantity: 1 }];
      }

      // Save to database if user is authenticated
      if (isAuthenticated && user) {
        saveCartToDatabase(newItems);
      }

      return newItems;
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== productId);
      
      if (isAuthenticated && user) {
        saveCartToDatabase(newItems);
      }

      return newItems;
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems => {
      const newItems = prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );

      if (isAuthenticated && user) {
        saveCartToDatabase(newItems);
      }

      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    if (isAuthenticated && user) {
      saveCartToDatabase([]);
    }
    localStorage.removeItem('guestCart');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartItemsCount,
      isCartLoading
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};