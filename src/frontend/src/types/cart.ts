export interface CartItem {
  restaurantName: string;
  item: {
    name: string;
    description: string;
    price: bigint;
    category: string;
  };
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

export interface CartOperations {
  addItem: (restaurantName: string, item: CartItem['item']) => void;
  removeItem: (restaurantName: string, itemName: string) => void;
  updateQuantity: (restaurantName: string, itemName: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}
