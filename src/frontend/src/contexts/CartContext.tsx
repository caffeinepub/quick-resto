import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, CartState, CartOperations } from '../types/cart';

interface CartContextType extends CartState, CartOperations {}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = sessionStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (restaurantName: string, item: CartItem['item']) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (cartItem) =>
          cartItem.restaurantName === restaurantName &&
          cartItem.item.name === item.name
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }

      return [...prev, { restaurantName, item, quantity: 1 }];
    });
  };

  const removeItem = (restaurantName: string, itemName: string) => {
    setItems((prev) =>
      prev.filter(
        (cartItem) =>
          !(cartItem.restaurantName === restaurantName && cartItem.item.name === itemName)
      )
    );
  };

  const updateQuantity = (restaurantName: string, itemName: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(restaurantName, itemName);
      return;
    }

    setItems((prev) =>
      prev.map((cartItem) =>
        cartItem.restaurantName === restaurantName && cartItem.item.name === itemName
          ? { ...cartItem, quantity }
          : cartItem
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    sessionStorage.removeItem('cart');
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => {
      return total + Number(item.item.price) * item.quantity;
    }, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const totalItems = getItemCount();
  const totalAmount = getCartTotal();

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalAmount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getCartTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
