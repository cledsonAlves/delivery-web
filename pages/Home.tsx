
import React, { useEffect, useState, useMemo, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, CITIES } from '../constants';
import StoreCard from '../components/StoreCard';
import ProductCard from '../components/ProductCard';
import PromoSlider from '../components/PromoSlider';
import { Product, Store } from '../types';
import api from '../services/api';
import { CityContext } from '../context/CityContext';
import { AuthContext } from '../context/AuthContext';

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

interface HomeProps {
  addToCart: (product: Product) => void;
}

const Home: React.FC<HomeProps> = ({ addToCart }) => {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 23, minutes: 59, seconds: 59 });
  const { selectedCity } = useContext(CityContext);
  const { cliente, isAuthenticated, logout } = useContext(AuthContext);

  // Countdown timer for flash sale
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 23;
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        // Carregar lojistas
        const lojistas = await api.listarLojistas(0, 100);
        let storesData: Store[] = [];
        
        if (mounted && Array.isArray(lojistas)) {
          storesData = lojistas.map((loj: any, idx: number) => ({
            id: loj.id,
            name: loj.nome,
            logo: loj.avatar_url || 'https://via.placeholder.com/100',
            cover: 'https://picsum.photos/seed/' + loj.id + '/800/400',
            rating: 4.8,
            reviewsCount: 0,
            deliveryTime: '30-45 min',
            deliveryFee: 5.0,
            category: loj.categoria || 'Loja local',
            isOpen: loj.ativo ?? true,
            city: CITIES[idx % CITIES.length],
          }));
          setStores(storesData);
        }

        // Carregar produtos
        const res = await api.listarProdutos({ skip: 0, limit: 50 });
        if (mounted && res && res.length > 0) {
          const produtosComImagens = await Promise.all(
            res.map(async (produto: any) => {
              try {
                const imagens = await api.listarImagensProduto(produto.id);
                const imagemPrincipal = imagens?.find((img: any) => img.principal);
                
                // Encontrar nome do lojista no array storesData
                const lojista = storesData.find((s: Store) => s.id === produto.lojista_id);
                
                return {
                  id: produto.id,
                  storeId: produto.lojista_id,
                  storeName: lojista?.name || 'Loja desconhecida',
                  name: produto.nome,
                  description: produto.descricao || '',
                  price: parseFloat(produto.preco) || 0,
                  originalPrice: produto.preco_promocional ? parseFloat(produto.preco) : undefined,
                  image: imagemPrincipal?.url || produto.imagem_url || 'https://via.placeholder.com/400',
                  imagens: imagens || [],
                  category: produto.categoria_id || '',
                  isPromotion: !!produto.preco_promocional,
                  isNew: false,
                };
              } catch (err) {
                console.error(`Erro ao carregar imagens do produto ${produto.id}:`, err);
                const lojista = storesData.find((s: Store) => s.id === produto.lojista_id);
                return {
                  id: produto.id,
                  storeId: produto.lojista_id,
                  storeName: lojista?.name || 'Loja desconhecida',
                  name: produto.nome,
                  description: produto.descricao || '',
                  price: parseFloat(produto.preco) || 0,
                  originalPrice: produto.preco_promocional ? parseFloat(produto.preco) : undefined,
                  image: produto.imagem_url || 'https://via.placeholder.com/400',
                  imagens: [],
                  category: produto.categoria_id || '',
                  isPromotion: !!produto.preco_promocional,
                  isNew: false,
                };
              }
            })
          );
          setProducts(produtosComImagens);
        } else if (mounted) {
          setProducts([]);
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        if (mounted) {
          setStores([]);
          setProducts([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const filteredStores = useMemo(() => {
    return stores.filter((s) => s.city === selectedCity);
  }, [stores, selectedCity]);

  const filteredProducts = useMemo(() => {
    const cityStoreIds = new Set(filteredStores.map((s) => s.id));
    return products.filter((p) => cityStoreIds.has(p.storeId));
  }, [products, filteredStores]);

  const papelaoStore = useMemo(() => {
    const matchInCity = filteredStores.find((s) =>
      (s.name && (s.name.toLowerCase().includes('papelaria') || s.name.toLowerCase().includes('papelao') || s.name.toLowerCase().includes('papelão')))
      || (s.category && s.category.toLowerCase().includes('papelaria'))
    );
    if (matchInCity) return matchInCity;
    return stores.find((s) =>
      (s.name && (s.name.toLowerCase().includes('papelaria') || s.name.toLowerCase().includes('papelao') || s.name.toLowerCase().includes('papelão')))
      || (s.category && s.category.toLowerCase().includes('papelaria'))
    ) || null;
  }, [filteredStores, stores]);

  return (
    <div className="pb-12">

      {/* Main Banner Section - Shopee Inspired */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Sidebar - Categories */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-3 shadow-sm ring-1 ring-[#f4ebe7] dark:ring-neutral-800">
              <h4 className="text-xs font-bold uppercase text-text-muted mb-3 px-2">Categorias</h4>
              <div className="space-y-1">
                {CATEGORIES.slice(0, 6).map((cat) => (
                  <button
                    key={cat.id}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium text-text-main dark:text-white hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    <span className={`material-symbols-outlined text-[20px] ${cat.colorClass.split(' ')[1]}`}>{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center - Main Banner Slider */}
          <div className="lg:col-span-7">
            <PromoSlider stores={filteredStores} />
          </div>

          {/* Right Sidebar - Quick Actions */}
          <div className="hidden lg:block lg:col-span-3 space-y-4">
            {/* Flash Sale / Ofertas Relâmpago */}
            <div className="bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500 rounded-2xl p-5 shadow-lg ring-1 ring-red-300 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-2xl filled animate-pulse">flash_on</span>
                  <h4 className="font-black text-lg">Ofertas Relâmpago</h4>
                </div>
                <p className="text-xs opacity-90 mb-3">Até {timeLeft.hours}h de descontos!</p>
                
                {/* Countdown Timer */}
                <div className="bg-black/30 rounded-xl p-3 backdrop-blur-sm mb-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="bg-white/20 rounded-lg py-2 px-1 font-black text-xl">
                        {String(timeLeft.hours).padStart(2, '0')}
                      </div>
                      <span className="text-xs mt-1 opacity-80">Horas</span>
                    </div>
                    <div>
                      <div className="bg-white/20 rounded-lg py-2 px-1 font-black text-xl">
                        {String(timeLeft.minutes).padStart(2, '0')}
                      </div>
                      <span className="text-xs mt-1 opacity-80">Min</span>
                    </div>
                    <div>
                      <div className="bg-white/20 rounded-lg py-2 px-1 font-black text-xl">
                        {String(timeLeft.seconds).padStart(2, '0')}
                      </div>
                      <span className="text-xs mt-1 opacity-80">Seg</span>
                    </div>
                  </div>
                </div>
                
                <button className="w-full bg-white text-red-600 font-black py-2 rounded-xl hover:bg-gray-100 transition-colors text-sm">
                  Ver Ofertas
                </button>
              </div>
            </div>

            {/* Quick User/Login/Register */}
            {!isAuthenticated && (
              <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 shadow-sm ring-1 ring-[#f4ebe7] dark:ring-neutral-800 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-3xl">person</span>
                  </div>
                </div>
                <h4 className="font-bold text-text-main dark:text-white mb-2">Bem-vindo!</h4>
                <p className="text-xs text-text-muted mb-4">Faça login ou cadastre-se</p>
                <div className="space-y-2">
                  <Link to="/login" className="block w-full bg-primary text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors">
                    Entrar
                  </Link>
                  <Link to="/register" className="block w-full border border-[#f4ebe7] dark:border-neutral-800 text-text-main dark:text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                    Cadastrar
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Search Bar Removed for cleaner UI */}
      </section>

      {/* Flash Sale Banner removed for cleaner UI */}

      {/* Back to School - Papelaria Papelao */}
      {papelaoStore && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 text-white shadow-lg">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-3xl filled">school</span>
                  <h3 className="text-2xl md:text-3xl font-black">Volta às Aulas</h3>
                </div>
                <p className="text-sm md:text-base font-medium opacity-90">
                  Na <span className="font-bold">{papelaoStore.name}</span>: cadernos, mochilas e materiais com descontos.
                </p>
                <div className="mt-4">
                  <Link to={`/store/${papelaoStore.id}`} className="inline-flex items-center gap-2 bg-white text-blue-700 px-5 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                    Ver loja
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </Link>
                </div>
              </div>
              <div className="hidden md:block w-40 h-40 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl">backpack</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories Grid - Mobile */}
      <section className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-surface-light dark:bg-surface-dark hover:shadow-md transition-all"
            >
              <div className={`size-12 flex items-center justify-center rounded-xl ${cat.colorClass}`}>
                <span className="material-symbols-outlined text-[24px]">{cat.icon}</span>
              </div>
              <span className="text-xs font-semibold text-text-main dark:text-white text-center leading-tight">{cat.label}</span>
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
          {filteredStores.length > 0 ? (
            filteredStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))
          ) : (
            <div className="w-full text-center text-text-muted py-4">Carregando lojas...</div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h3 className="text-2xl font-black text-text-main dark:text-white mb-1 px-2">Destaques em {selectedCity}</h3>
        <p className="text-xs text-text-muted px-2 mb-7">Produtos de lojas em {selectedCity}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {loading ? (
            <div className="col-span-full px-4 py-8 text-center">Carregando produtos...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full px-4 py-8 text-center">Nenhum produto disponível no momento.</div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAdd={addToCart} 
              />
            ))
          )}
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
