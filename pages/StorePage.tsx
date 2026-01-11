import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

interface StorePageProps {
  addToCart: (product: Product) => void;
}

interface StoreInfo {
  id: string;
  nome: string;
  email: string;
  avatar_url?: string;
  ativo: boolean;
  categoria?: string;
}

const StorePage: React.FC<StorePageProps> = ({ addToCart }) => {
  const { id } = useParams<{ id: string }>();
  const [store, setStore] = useState<StoreInfo | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        // Buscar dados do lojista
        const lojistaData = await api.obterLojista(id);
        if (mounted) setStore(lojistaData);

        // Buscar produtos do lojista
        const produtosData = await api.listarProdutos({ lojistaId: id, limit: 100 });
        
        if (mounted && Array.isArray(produtosData)) {
          // Carregar imagens para cada produto
          const produtosComImagens = await Promise.all(
            produtosData.map(async (produto: any) => {
              try {
                const imagens = await api.listarImagensProduto(produto.id);
                const imagemPrincipal = imagens?.find((img: any) => img.principal);

                return {
                  id: produto.id,
                  storeId: produto.lojista_id,
                  storeName: lojistaData.nome,
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
                return {
                  id: produto.id,
                  storeId: produto.lojista_id,
                  storeName: lojistaData.nome,
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
        }
      } catch (err: any) {
        console.error('Erro ao carregar loja:', err);
        if (mounted) setError('Não foi possível carregar os dados da loja.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center text-text-muted">
        Carregando loja...
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <p className="text-text-muted mb-4">{error || 'Loja não encontrada.'}</p>
        <Link to="/" className="text-primary font-bold hover:underline">
          Voltar para a Home
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-12">
      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center gap-2 text-sm text-text-muted">
        <Link to="/" className="hover:text-primary hover:underline">
          Início
        </Link>
        <span className="material-symbols-outlined text-base">chevron_right</span>
        <span className="text-text-main dark:text-white font-medium">Lojas</span>
        <span className="material-symbols-outlined text-base">chevron_right</span>
        <span className="text-text-main dark:text-white font-medium line-clamp-1">{store.nome}</span>
      </nav>

      {/* Store Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-8 shadow-lg ring-1 ring-[#f4ebe7] dark:ring-neutral-800">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Logo */}
            <div className="size-24 md:size-32 rounded-2xl overflow-hidden bg-background-light dark:bg-neutral-900 shadow-md ring-2 ring-white dark:ring-neutral-800 flex-shrink-0">
              <img
                src={store.avatar_url || 'https://via.placeholder.com/200'}
                alt={store.nome}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                <h1 className="text-3xl md:text-4xl font-black text-text-main dark:text-white">{store.nome}</h1>
                {store.ativo && (
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                    <span className="material-symbols-outlined text-sm filled">check_circle</span>
                    Aberto
                  </span>
                )}
              </div>

              {store.categoria && (
                <p className="text-text-muted mb-4">
                  <span className="material-symbols-outlined text-sm align-middle mr-1">category</span>
                  {store.categoria}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
                <div className="flex items-center gap-2 text-text-muted">
                  <span className="material-symbols-outlined text-yellow-500 filled">star</span>
                  <span className="font-bold text-text-main dark:text-white">4.8</span>
                  <span>(120 avaliações)</span>
                </div>
                <div className="flex items-center gap-2 text-text-muted">
                  <span className="material-symbols-outlined">schedule</span>
                  <span>30-45 min</span>
                </div>
                <div className="flex items-center gap-2 text-text-muted">
                  <span className="material-symbols-outlined">local_shipping</span>
                  <span>Frete: R$ 5,00</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="p-3 rounded-xl bg-background-light dark:bg-neutral-900 text-text-main dark:text-white hover:bg-primary hover:text-white transition-colors">
                <span className="material-symbols-outlined">favorite_border</span>
              </button>
              <button className="p-3 rounded-xl bg-background-light dark:bg-neutral-900 text-text-main dark:text-white hover:bg-primary hover:text-white transition-colors">
                <span className="material-symbols-outlined">share</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-[#f4ebe7] dark:border-neutral-800">
            <div className="text-center">
              <div className="text-3xl font-black text-primary mb-1">{products.length}</div>
              <div className="text-xs font-semibold text-text-muted uppercase">Produtos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-primary mb-1">500+</div>
              <div className="text-xs font-semibold text-text-muted uppercase">Vendas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-primary mb-1">98%</div>
              <div className="text-xs font-semibold text-text-muted uppercase">Satisfação</div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-text-main dark:text-white">
            Produtos da Loja
            <span className="text-text-muted font-medium text-lg ml-2">({products.length})</span>
          </h2>
          <div className="flex items-center gap-2">
            <select className="bg-surface-light dark:bg-surface-dark border-none rounded-xl px-4 py-2 text-sm font-semibold text-text-main dark:text-white focus:ring-2 focus:ring-primary/50">
              <option>Mais relevantes</option>
              <option>Menor preço</option>
              <option>Maior preço</option>
              <option>Mais vendidos</option>
            </select>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center size-20 bg-background-light dark:bg-neutral-900 rounded-full mb-4">
              <span className="material-symbols-outlined text-4xl text-text-muted">shopping_bag</span>
            </div>
            <p className="text-text-muted">Esta loja ainda não possui produtos cadastrados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={addToCart} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default StorePage;
