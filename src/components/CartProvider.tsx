import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Produto } from '../services/api';

export interface CartItem extends Produto {
  quantidade: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (produto: Produto) => void;
  removeItem: (produtoId: string) => void;
  updateQuantity: (produtoId: string, quantidade: number) => void;
  observacao: string;
  setObservacao: (obs: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [observacao, setObservacao] = useState('');

  const addItem = (produto: Produto) => {
    setItems((prev) => {
      const existing = prev.find(item => item.id === produto.id);
      if (existing) {
        return prev.map(item => item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item);
      }
      return [...prev, { ...produto, quantidade: 1 }];
    });
  };

  const removeItem = (produtoId: string) => {
    setItems((prev) => prev.filter(item => item.id !== produtoId));
  };

  const updateQuantity = (produtoId: string, quantidade: number) => {
    if (quantidade <= 0) {
      removeItem(produtoId);
      return;
    }
    setItems((prev) => prev.map(item => item.id === produtoId ? { ...item, quantidade } : item));
  };

  const clearCart = () => {
    setItems([]);
    setObservacao('');
  };

  const total = items.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, observacao, setObservacao, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};
