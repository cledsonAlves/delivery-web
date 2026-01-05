
import React, { useState } from 'react';
import { CATEGORIES, MOCK_STORES, MOCK_PRODUCTS } from '../constants';
import StoreCard from '../components/StoreCard';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

interface HomeProps {
  addToCart: (product: Product) => void;
}

const Home: React.FC<HomeProps> = ({ addToCart }) => {
  const [search, setSearch] = useState('');

  return (
    <div className="pb-12">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-900 shadow-2xl">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://picsum.photos/seed/jarinu/1200/600" 
              alt="Jarinu" 
              className="h-full w-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center justify-center gap-8 px-6 py-20 text-center sm:px-12 md:py-32">
            <div className="max-w-3xl space-y-4">
              <h2 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
                Encontre tudo em <span className="text-primary">Jarinu</span>
              </h2>
              <p className="text-lg font-medium text-gray-200 sm:text-2xl max-w-2xl mx-auto">
                Do mercadinho ao presente especial. Entrega rápida por motoboy na sua porta.
              </p>
            </div>

            <div className="w-full max-w-2xl">
              <label className="relative flex h-16 w-full items-center rounded-3xl bg-white shadow-2xl focus-within:ring-4 focus-within:ring-primary/20 transition-all p-2">
                <div className="flex h-full w-12 items-center justify-center text-gray-400">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input 
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-full w-full border-none bg-transparent pr-4 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0" 
                  placeholder="Produtos, lojas ou categorias..." 
                />
                <button className="h-full rounded-2xl bg-primary px-8 text-sm font-black text-white transition hover:bg-primary-dark active:scale-95 shadow-lg shadow-primary/30">
                  Buscar
                </button>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h3 className="text-2xl font-black text-text-main dark:text-white mb-8 px-2">Categorias</h3>
        <div className="scrollbar-hide flex gap-6 overflow-x-auto pb-6 px-2">
          {CATEGORIES.map((cat) => (
            <button 
              key={cat.id} 
              className="group flex min-w-[130px] flex-col items-center justify-center gap-4 rounded-3xl bg-surface-light dark:bg-surface-dark p-6 shadow-sm ring-1 ring-[#f4ebe7] dark:ring-neutral-800 transition-all hover:-translate-y-2 hover:shadow-xl hover:ring-primary/20"
            >
              <div className={`flex size-14 items-center justify-center rounded-2xl ${cat.colorClass} shadow-inner transition-transform group-hover:scale-110`}>
                <span className="material-symbols-outlined text-[32px]">{cat.icon}</span>
              </div>
              <span className="font-bold text-sm tracking-tight">{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Partner Shops */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8 px-2">
          <h3 className="text-2xl font-black text-text-main dark:text-white">Lojas Parceiras</h3>
          <button className="text-sm font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-1 group">
            Ver todas <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
          </button>
        </div>
        <div className="scrollbar-hide flex gap-6 overflow-x-auto pb-6 px-2">
          {MOCK_STORES.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h3 className="text-2xl font-black text-text-main dark:text-white mb-8 px-2">Destaques da Cidade</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAdd={addToCart} 
            />
          ))}
        </div>
        <div className="mt-16 flex justify-center">
          <button className="rounded-full border-2 border-[#f4ebe7] dark:border-neutral-800 bg-surface-light dark:bg-surface-dark px-10 py-4 text-sm font-black text-text-main dark:text-white shadow-sm transition hover:bg-gray-50 dark:hover:bg-neutral-800 hover:border-primary active:scale-95">
            Carregar mais produtos
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
