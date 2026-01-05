
import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import { Product, CartItem } from './types';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <HashRouter>
      <Layout cartCount={cartCount}>
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route 
            path="/checkout" 
            element={
              <Checkout 
                cart={cart} 
                updateQuantity={updateQuantity} 
                removeItem={removeItem} 
              />
            } 
          />
          <Route path="/orders" element={<div className="p-10 text-center text-text-muted">Em breve: Meus Pedidos</div>} />
          <Route path="/profile" element={<div className="p-10 text-center text-text-muted">Em breve: Seu Perfil</div>} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
