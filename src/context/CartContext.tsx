import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Track } from '../types';

export interface CartItem {
  id: string;
  track: Track;
  format: 'Vinyl' | 'Digital';
  price: number;
  quantity: number;
  coverUrl: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (track: Track, format: 'Vinyl' | 'Digital', coverUrl: string) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (track: Track, format: 'Vinyl' | 'Digital', coverUrl: string) => {
    setItems(prev => {
      const price = format === 'Vinyl' ? 29.99 : 9.99;
      const existing = prev.find(item => item.track.id === track.id && item.format === format);
      if (existing) {
        return prev.map(item => 
          item === existing 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id: `${track.id}-${format}`, track, format, price, quantity: 1, coverUrl }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const clearCart = () => setItems([]);

  const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
