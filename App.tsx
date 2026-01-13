
import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail';
import StorePage from './pages/StorePage';
import Login from './pages/Login';
import Register from './pages/Register';
import PaymentSuccess from './pages/PaymentSuccess';
import { Product, CartItem } from './types';
import { initMercadoPago } from '@mercadopago/sdk-react';
import { AuthProvider } from './context/AuthContext';
import { CityProvider } from './context/CityContext';

// Inicializa o SDK do Mercado Pago com uma chave de teste
initMercadoPago('', {
  locale: 'pt-BR'
});

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
      <AuthProvider>
        <CityProvider>
        <HashRouter>
      <Layout cartCount={cartCount}>
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
          <Route path="/store/:id" element={<StorePage addToCart={addToCart} />} />
          <Route path="/orders" element={<div className="p-10 text-center text-text-muted">Em breve: Meus Pedidos</div>} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
        </HashRouter>
        </CityProvider>
      </AuthProvider>
  );
};

export default App;
