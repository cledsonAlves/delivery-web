
import React, { useEffect, useState } from 'react';
import { CATEGORIES } from '../constants';
import StoreCard from '../components/StoreCard';
import ProductCard from '../components/ProductCard';
import PromoSlider from '../components/PromoSlider';
import { Product, Store } from '../types';
import api from '../services/api';

interface HomeProps {
  addToCart: (product: Product) => void;
}

const Home: React.FC<HomeProps> = ({ addToCart }) => {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        // Carregar lojistas
        const lojistas = await api.listarLojistas(0, 100);
        let storesData: Store[] = [];
        
        if (mounted && Array.isArray(lojistas)) {
          storesData = lojistas.map((loj: any) => ({
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

  return (
    <div className="pb-12">
      {/* Top Banner Strip - Shopee Style */}
      <section className="bg-gradient-to-r from-primary via-orange-500 to-red-500 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-8 text-white text-sm font-semibold overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="material-symbols-outlined text-yellow-300 text-lg filled">local_fire_department</span>
              <span>Ofertas do Dia</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="material-symbols-outlined text-green-300 text-lg">local_shipping</span>
              <span>Frete Grátis</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="material-symbols-outlined text-blue-300 text-lg">volunteer_activism</span>
              <span>Cashback até 20%</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="material-symbols-outlined text-purple-300 text-lg">bolt</span>
              <span>Entrega Rápida</span>
            </div>
          </div>
        </div>
      </section>

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
            <PromoSlider stores={stores} />
          </div>

          {/* Right Sidebar - Quick Actions */}
          <div className="hidden lg:block lg:col-span-3 space-y-4">
            {/* Quick Login/Register */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 shadow-sm ring-1 ring-[#f4ebe7] dark:ring-neutral-800 text-center">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl">person</span>
                </div>
              </div>
              <h4 className="font-bold text-text-main dark:text-white mb-2">Bem-vindo!</h4>
              <p className="text-xs text-text-muted mb-4">Faça login ou cadastre-se</p>
              <div className="space-y-2">
                <button className="w-full bg-primary text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors">
                  Entrar
                </button>
                <button className="w-full border border-[#f4ebe7] dark:border-neutral-800 text-text-main dark:text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                  Cadastrar
                </button>
              </div>
            </div>

            {/* Mini Offers */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3 text-white text-center">
                <span className="material-symbols-outlined text-2xl mb-1 filled">savings</span>
                <p className="text-xs font-bold">Cupons</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3 text-white text-center">
                <span className="material-symbols-outlined text-2xl mb-1">local_shipping</span>
                <p className="text-xs font-bold">Grátis</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar Below Banner */}
        <div className="mt-6 max-w-4xl mx-auto">
          <label className="relative flex h-14 w-full items-center rounded-2xl bg-white dark:bg-surface-dark shadow-lg ring-1 ring-[#f4ebe7] dark:ring-neutral-800 focus-within:ring-2 focus-within:ring-primary/50 transition-all p-2">
            <div className="flex h-full w-12 items-center justify-center text-text-muted">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-full w-full border-none bg-transparent pr-4 text-sm text-text-main dark:text-white placeholder-text-muted focus:outline-none focus:ring-0"
              placeholder="Busque por produtos, lojas ou categorias..."
            />
            <button className="h-full rounded-xl bg-primary px-6 text-sm font-bold text-white transition hover:bg-primary-dark active:scale-95">
              Buscar
            </button>
          </label>
        </div>
      </section>

      {/* Flash Sale Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3">
              <span className="material-symbols-outlined text-red-500 text-3xl filled">local_fire_department</span>
            </div>
            <div className="text-white">
              <h3 className="text-xl font-black">OFERTAS RELÂMPAGO</h3>
              <p className="text-sm font-medium opacity-90">Descontos de até 50% • Tempo limitado!</p>
            </div>
          </div>
          <button className="hidden sm:flex bg-white text-primary px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors items-center gap-2">
            Ver Todas
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </section>

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
          {stores.length > 0 ? (
            stores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))
          ) : (
            <div className="w-full text-center text-text-muted py-4">Carregando lojas...</div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h3 className="text-2xl font-black text-text-main dark:text-white mb-8 px-2">Destaques da Cidade</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {loading ? (
            <div className="col-span-full px-4 py-8 text-center">Carregando produtos...</div>
          ) : products.length === 0 ? (
            <div className="col-span-full px-4 py-8 text-center">Nenhum produto disponível no momento.</div>
          ) : (
            products.map((product) => (
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
