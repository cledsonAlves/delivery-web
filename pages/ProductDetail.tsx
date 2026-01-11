import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';

interface ProductDetailProps {
  addToCart: (product: Product) => void;
}

interface StoreInfo {
  id: string;
  name: string;
  category?: string;
  rating?: number;
  reviewsCount?: number;
  deliveryTime?: string;
  deliveryFee?: number;
  logo?: string;
}

const placeholderImg = 'https://via.placeholder.com/800x600?text=Produto';

const ProductDetail: React.FC<ProductDetailProps> = ({ addToCart }) => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [store, setStore] = useState<StoreInfo | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [obs, setObs] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [related, setRelated] = useState<Product[]>([]);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        // Buscar todos os lojistas uma única vez
        const lojistas = await api.listarLojistas(0, 100).catch(() => []);
        
        const prod = await api.obterProduto(id);
        
        // Procurar o lojista específico no array de todos
        const lojista = Array.isArray(lojistas) 
          ? lojistas.find((l: any) => l.id === prod.lojista_id) 
          : null;
        
        const mappedProduct: Product = {
          id: prod.id,
          storeId: prod.lojista_id,
          storeName: lojista?.nome || 'Loja desconhecida',
          name: prod.nome,
          description: prod.descricao || '',
          price: parseFloat(prod.preco) || 0,
          originalPrice: prod.preco_promocional ? parseFloat(prod.preco_promocional) : undefined,
          image: prod.imagem_url || placeholderImg,
          imagens: [],
          category: prod.categoria_id || '',
          isPromotion: !!prod.preco_promocional,
          isNew: false,
        };

        const [imgs] = await Promise.all([
          api.listarImagensProduto(prod.id).catch(() => []),
        ]);

        const orderedImgs: string[] = Array.isArray(imgs)
          ? imgs
              .sort((a: any, b: any) => (a.principal === b.principal ? (a.ordem ?? 0) - (b.ordem ?? 0) : a.principal ? -1 : 1))
              .map((img: any) => img.url)
          : [];
        const hero = orderedImgs[0] || mappedProduct.image || placeholderImg;

        if (!active) return;
        setProduct({ ...mappedProduct, image: hero, imagens: imgs });
        setImages(orderedImgs.length > 0 ? orderedImgs : [hero]);
        setSelectedIndex(0);

        if (lojista) {
          setStore({
            id: lojista.id,
            name: lojista.nome,
            category: lojista.categoria || 'Loja local',
            rating: lojista.nota || 4.8,
            reviewsCount: lojista.reviews || 0,
            deliveryTime: lojista.tempo_entrega || '30-45 min',
            deliveryFee: lojista.taxa_entrega ?? 0,
            logo: lojista.logo_url,
          });
        }

        if (prod.lojista_id) {
          const rel = await api
            .listarProdutos({ lojistaId: prod.lojista_id, limit: 8 })
            .catch(() => [] as any[]);
          const mappedRelated = Array.isArray(rel)
            ? rel
                .filter((p: any) => p.id !== prod.id)
                .map((p: any) => ({
                  id: p.id,
                  storeId: p.lojista_id,
                  name: p.nome,
                  description: p.descricao || '',
                  price: parseFloat(p.preco) || 0,
                  originalPrice: p.preco_promocional ? parseFloat(p.preco) : undefined,
                  image: p.imagem_url || placeholderImg,
                  category: p.categoria_id || '',
                  isPromotion: !!p.preco_promocional,
                  isNew: false,
                }))
                .slice(0, 4)
            : [];
          if (active) setRelated(mappedRelated);
        }
      } catch (err: any) {
        console.error('Erro ao carregar produto:', err);
        if (active) setError('Não foi possível carregar este produto.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [id]);

  const currentImage = useMemo(() => images[selectedIndex] || images[0] || placeholderImg, [images, selectedIndex]);

  const handleAdd = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i += 1) addToCart(product);
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center text-text-muted">Carregando produto...</div>;
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <p className="text-text-muted mb-4">{error || 'Produto não encontrado.'}</p>
        <Link to="/" className="text-primary font-bold hover:underline">
          Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm mb-8 text-text-muted">
        <Link to="/" className="hover:text-primary hover:underline">
          Início
        </Link>
        <span className="material-symbols-outlined text-base">chevron_right</span>
        <span className="text-text-main dark:text-white font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
        {/* Left */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] md:aspect-video w-full rounded-2xl overflow-hidden shadow-sm bg-gray-100 group">
              <img
                src={currentImage}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {product.isPromotion && (
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">local_fire_department</span>
                  Promoção
                </div>
              )}
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, idx) => (
                <button
                  key={img + idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`shrink-0 size-20 md:size-24 rounded-xl border-2 overflow-hidden p-0.5 bg-white transition-colors ${
                    idx === selectedIndex ? 'border-primary' : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 md:p-8 shadow-sm ring-1 ring-[#f4ebe7] dark:ring-neutral-800">
            <h3 className="text-xl font-bold mb-3 text-text-main dark:text-white">Descrição do Produto</h3>
            <p className="text-text-muted leading-relaxed mb-4 whitespace-pre-line">{product.description || 'Sem descrição informada.'}</p>
            <div className="p-4 bg-background-light dark:bg-background-dark border border-[#f4ebe7] dark:border-neutral-800 rounded-xl">
              <p className="text-sm text-text-muted font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">info</span>
                Observações especiais? Informe abaixo para personalizarmos seu pedido.
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="sticky top-24 space-y-6">
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 shadow-lg ring-1 ring-[#f4ebe7] dark:ring-neutral-800">
              {/* Vendor */}
              {store && (
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-dashed border-[#f4ebe7] dark:border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full overflow-hidden bg-background-light dark:bg-neutral-800">
                      <img src={store.logo || 'https://via.placeholder.com/80'} alt={store.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-main dark:text-white leading-tight">{store.name}</p>
                      <div className="flex items-center gap-1 text-xs text-text-muted">
                        <span className="material-symbols-outlined text-[14px] text-yellow-400 filled">star</span>
                        <span>{store.rating?.toFixed(1) ?? '4.8'}</span>
                        <span>•</span>
                        <span>{store.category || 'Loja local'}</span>
                      </div>
                    </div>
                  </div>
                  <Link to={`/store/${store.id || ''}`} className="text-primary hover:text-primary-dark text-sm font-semibold transition-colors">
                    Ver loja
                  </Link>
                </div>
              )}

              <h1 className="text-2xl md:text-3xl font-extrabold text-text-main dark:text-white mb-2 leading-tight">{product.name}</h1>
              <p className="text-text-muted text-sm mb-6 line-clamp-3">{product.description || 'Produto sem descrição.'}</p>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold text-primary">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                {product.originalPrice && (
                  <span className="text-lg text-text-muted line-through decoration-1">R$ {product.originalPrice.toFixed(2).replace('.', ',')}</span>
                )}
              </div>

              <div className="flex items-center gap-3 p-3 bg-primary/5 text-primary rounded-xl mb-6">
                <div className="bg-white dark:bg-surface-dark p-1.5 rounded-lg shadow-sm">
                  <span className="material-symbols-outlined">two_wheeler</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">Entrega rápida</p>
                  <p className="text-xs opacity-80">
                    {store?.deliveryTime || '30-45 min'} • Frete: R$ {(store?.deliveryFee ?? 0).toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-text-main dark:text-gray-300 mb-2 block" htmlFor="obs">
                    Alguma observação?
                  </label>
                  <textarea
                    id="obs"
                    className="w-full bg-background-light dark:bg-neutral-900 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/50 resize-none placeholder:text-text-muted/70"
                    placeholder="Ex: tirar cebola, ponto da carne..."
                    rows={2}
                    value={obs}
                    onChange={(e) => setObs(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <div className="flex items-center bg-background-light dark:bg-neutral-900 rounded-full border border-[#f4ebe7] dark:border-neutral-800 h-14 px-1 shrink-0">
                    <button
                      className="size-10 rounded-full flex items-center justify-center text-text-muted hover:bg-white hover:text-primary hover:shadow-sm transition-all dark:hover:bg-neutral-800"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      type="button"
                    >
                      <span className="material-symbols-outlined">remove</span>
                    </button>
                    <span className="w-8 text-center font-bold text-lg text-text-main dark:text-white">{quantity}</span>
                    <button
                      className="size-10 rounded-full flex items-center justify-center text-text-muted hover:bg-white hover:text-primary hover:shadow-sm transition-all dark:hover:bg-neutral-800"
                      onClick={() => setQuantity((q) => q + 1)}
                      type="button"
                    >
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                  <button
                    onClick={handleAdd}
                    type="button"
                    className="flex-1 h-14 bg-primary hover:bg-primary-dark text-white font-bold rounded-full shadow-lg shadow-primary/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg"
                  >
                    <span>Adicionar</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded text-sm font-semibold">R$ {(product.price * quantity).toFixed(2).replace('.', ',')}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-6 text-text-muted text-xs font-medium opacity-80">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                Compra Segura
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">thumb_up</span>
                Qualidade Garantida
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16 md:mt-24 mb-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-text-main dark:text-white">Mais desta loja</h2>
              <p className="text-text-muted mt-1">Outras opções que você pode gostar</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} onAdd={addToCart} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
