
import React, { useState, useContext } from 'react';
import { CITIES } from '../constants';
import { Link, useLocation } from 'react-router-dom';
import { CityContext } from '../context/CityContext';
import { AuthContext } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  cartCount: number;
}

const Layout: React.FC<LayoutProps> = ({ children, cartCount }) => {
  const location = useLocation();
  const { cliente, isAuthenticated } = useContext(AuthContext);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>(CITIES[0]);

  return (
    <CityContext.Provider value={{ selectedCity, setSelectedCity }}>
      <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#F0623A] shadow-lg transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="size-12 bg-white/20 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110">
              <span className="material-symbols-outlined text-3xl">shopping_bag</span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-white hidden sm:block" style={{ fontFamily: 'Montserrat, sans-serif' }}>Regional Shopee</h1>
          </Link>

          {/* Location & Search */}
          <div className="flex-1 flex items-center justify-center gap-4 max-w-2xl px-4">
            <div className="hidden lg:flex items-center gap-2 rounded-full bg-white/20 py-2.5 px-5 shadow-sm ring-1 ring-inset ring-white/30 transition hover:bg-white/30">
              <span className="material-symbols-outlined text-white text-[20px]">location_on</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-bold text-white placeholder:text-white/60 appearance-none cursor-pointer"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c} className="text-[#1A1A1A] bg-white">
                    {c}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined text-white/60 text-[18px] pointer-events-none">expand_more</span>
            </div>

            <div className="flex-1 relative group max-w-md hidden sm:block">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 material-symbols-outlined group-focus-within:text-white">search</span>
              <input 
                type="text" 
                placeholder="O que você procura hoje?"
                className="w-full bg-white/20 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/40 transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button className="sm:hidden p-1.5 text-white/80 hover:text-white transition-colors text-[20px]" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <span className="material-symbols-outlined">search</span>
            </button>
            
            <Link to="/orders" className="p-1.5 text-white/80 hover:text-white transition-colors hidden sm:block text-[20px]">
              <span className="material-symbols-outlined">package_2</span>
            </Link>

            <Link to="/checkout" className="relative p-1.5 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all text-[20px]">
              <span className="material-symbols-outlined filled">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 size-5 bg-white text-[#F0623A] text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#F0623A]">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link to="/profile" className="flex items-center gap-1 p-1 pr-2 bg-white/20 rounded-full border border-white/30 hover:border-white transition-all hidden sm:flex">
                <div className="size-7 rounded-full overflow-hidden bg-white flex items-center justify-center text-[#F0623A] text-xs font-bold flex-shrink-0">
                  {isAuthenticated && cliente ? cliente.nome.charAt(0).toUpperCase() : '?'}
              </div>
                <span className="text-xs font-bold hidden md:block text-white truncate" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {isAuthenticated && cliente ? cliente.nome.split(' ')[0] : 'Perfil'}
                </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-surface-light dark:bg-surface-dark border-t border-[#f4ebe7] dark:border-neutral-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <span className="material-symbols-outlined text-primary">storefront</span>
            <span className="font-bold">Regional Shopee</span>
          </div>
          <div className="flex gap-8 text-sm font-medium text-text-muted">
            <Link to="/" className="hover:text-primary">Início</Link>
            <Link to="/stores" className="hover:text-primary">Lojas</Link>
            <Link to="/orders" className="hover:text-primary">Meus Pedidos</Link>
            <Link to="/help" className="hover:text-primary">Ajuda</Link>
          </div>Regional Shopee
          <p className="text-xs text-text-muted opacity-60">© 2026 Regional Shopee.  para nossa cidade.</p>
        </div>
      </footer>
      </div>
    </CityContext.Provider>
  );
};

export default Layout;
