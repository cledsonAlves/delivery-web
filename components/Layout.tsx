
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
      <header className="sticky top-0 z-50 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md border-b border-[#f4ebe7] dark:border-neutral-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30 transition-transform group-hover:scale-110">
              <span className="material-symbols-outlined filled">storefront</span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-text-main dark:text-white hidden sm:block">Regional Shopee</h1>
          </Link>

          {/* Location & Search */}
          <div className="flex-1 flex items-center justify-center gap-4 max-w-2xl px-4">
            <div className="hidden lg:flex items-center gap-2 rounded-full bg-background-light dark:bg-neutral-800 py-2.5 px-5 shadow-sm ring-1 ring-inset ring-gray-100 dark:ring-neutral-700 transition hover:ring-primary">
              <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-bold text-text-main dark:text-white"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c} className="text-text-main dark:text-white">
                    {c}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined text-gray-400 text-[18px]">expand_more</span>
            </div>

            <div className="flex-1 relative group max-w-md hidden sm:block">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted material-symbols-outlined group-focus-within:text-primary">search</span>
              <input 
                type="text" 
                placeholder="O que você procura hoje?"
                className="w-full bg-background-light dark:bg-neutral-800 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-text-muted/60"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="sm:hidden p-2 text-text-muted" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <span className="material-symbols-outlined">search</span>
            </button>
            
            <Link to="/orders" className="p-2 text-text-muted hover:text-primary transition-colors hidden sm:block">
              <span className="material-symbols-outlined">package_2</span>
            </Link>

            <Link to="/checkout" className="relative p-2.5 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-all">
              <span className="material-symbols-outlined filled">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 size-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-surface-light dark:border-surface-dark">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link to="/profile" className="flex items-center gap-2 p-1 pr-3 bg-surface-light dark:bg-neutral-800 rounded-full border border-[#f4ebe7] dark:border-neutral-700 hover:border-primary transition-all">
                <div className="size-8 rounded-full overflow-hidden bg-primary flex items-center justify-center text-white text-sm font-bold">
                  {isAuthenticated && cliente ? cliente.nome.charAt(0).toUpperCase() : '?'}
              </div>
                <span className="text-xs font-bold hidden md:block">
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
