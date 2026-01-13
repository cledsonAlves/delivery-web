import React, { useState, useEffect } from 'react';
import { Store } from '../types';
import api from '../services/api';

interface PromoSliderProps {
  stores: Store[];
}

interface PromoCard {
  id: string;
  storeName: string;
  title: string;
  subtitle: string;
  discount: string;
  bgGradient: string;
  icon: string;
  imageUrl?: string;
}

const PromoSlider: React.FC<PromoSliderProps> = ({ stores }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [promos, setPromos] = useState<PromoCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    async function loadOffers() {
      try {
        const response = await api.listarOfertas(0, 10);
        
        if (mounted) {
          // Se a resposta contém ofertas em um campo 'offers'
          const offers = response.offers || (Array.isArray(response) ? response : []);
          
          const gradients = [
            'from-purple-500 to-pink-500',
            'from-orange-500 to-red-500',
            'from-green-500 to-teal-500',
            'from-blue-500 to-cyan-500',
            'from-yellow-500 to-orange-500',
            'from-indigo-500 to-purple-500',
          ];

          const icons = [
            'volunteer_activism',
            'local_fire_department',
            'savings',
            'local_shipping',
            'star',
            'bolt',
          ];

          // Carregar nomes das lojas para cada oferta
          const transformedPromos: PromoCard[] = await Promise.all(
            offers
              .filter((offer: any) => offer.is_active)
              .slice(0, 6)
              .map(async (offer: any, idx: number) => {
                const originalPrice = parseFloat(offer.price_original) || 0;
                const discountPrice = parseFloat(offer.price_discount) || 0;
                const discountPercent = originalPrice > 0 
                  ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
                  : 0;

                let storeName = offer.store_id;
                try {
                  const lojista = await api.obterLojista(offer.store_id);
                  storeName = lojista?.nome || offer.store_id;
                } catch (err) {
                  console.error(`Erro ao carregar lojista ${offer.store_id}:`, err);
                  // Mantém o store_id como fallback
                }

                return {
                  id: offer.id,
                  storeName: storeName,
                  title: offer.title,
                  subtitle: offer.description || 'Confira essa promoção!',
                  discount: discountPercent > 0 ? `${discountPercent}%` : 'FREE',
                  bgGradient: gradients[idx % gradients.length],
                  icon: icons[idx % icons.length],
                  imageUrl: offer.image_url,
                };
              })
          );

          if (mounted) {
            setPromos(transformedPromos);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar ofertas:', err);
        // Mantém o estado anterior em caso de erro
        setPromos([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadOffers();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (promos.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [promos.length]);

  if (loading) return null;
  if (promos.length === 0) return null;

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % promos.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + promos.length) % promos.length);
  };

  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {promos.map((promo) => (
            <div key={promo.id} className="min-w-full">
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${promo.bgGradient} p-6 md:p-8 shadow-xl aspect-[2/1] md:aspect-[3/1]`}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-black/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 h-full">
                  <div className="flex-1 text-white">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold mb-2">
                      <span className="material-symbols-outlined filled text-yellow-300 text-sm">{promo.icon}</span>
                      <span>{promo.storeName}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black mb-2 leading-tight">{promo.title}</h2>
                    <p className="text-sm md:text-base font-medium opacity-90 mb-3">{promo.subtitle}</p>
                    <button className="bg-white text-gray-900 px-4 py-2 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all shadow-lg active:scale-95 inline-flex items-center gap-2">
                      <span>Ver Ofertas</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>

                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-white/30 blur-xl rounded-full"></div>
                      <div className="relative bg-white/20 backdrop-blur-sm rounded-2xl p-4 md:p-6 border-2 border-white/40">
                        <div className="text-center">
                          <div className="text-4xl md:text-5xl font-black text-white leading-none mb-1">
                            {promo.discount}
                          </div>
                          <div className="text-sm md:text-base font-bold text-white/90">
                            {promo.discount === 'FREE' ? 'Delivery' : 'OFF'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex justify-center gap-1.5 z-10">
          {promos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromoSlider;
