
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  return (
    <div className="group relative flex flex-col rounded-3xl bg-surface-light dark:bg-surface-dark p-3 shadow-sm ring-1 ring-[#f4ebe7] dark:ring-neutral-800 transition-all hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/product/${product.id}`} className="relative aspect-square w-full overflow-hidden rounded-2xl bg-background-light dark:bg-neutral-900">
        <img 
          src={product.image} 
          alt={product.name} 
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110" 
        />
        {product.isPromotion && (
          <div className="absolute left-3 top-3 rounded-lg bg-green-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
            Promoção
          </div>
        )}
        {product.isNew && (
          <div className="absolute left-3 top-3 rounded-lg bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
            Novo
          </div>
        )}
        <button 
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-gray-400 shadow-sm backdrop-blur-sm transition hover:text-red-500 active:scale-90"
          onClick={(e) => { e.preventDefault(); /* Favorite logic */ }}
        >
          <span className="material-symbols-outlined text-[20px] leading-none">favorite</span>
        </button>
      </Link>
      
      <div className="flex flex-1 flex-col p-2 pt-4">
        <Link to={`/product/${product.id}`}>
          <h4 className="mb-2 line-clamp-2 text-sm font-bold text-text-main dark:text-white group-hover:text-primary transition-colors h-10">
            {product.name}
          </h4>
        </Link>
        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-[10px] text-text-muted line-through font-medium">
                R$ {product.originalPrice.toFixed(2).replace('.', ',')}
              </span>
            )}
            <span className="text-lg font-extrabold text-primary">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <button 
            onClick={() => onAdd(product)}
            className="rounded-xl bg-primary/10 p-3 text-primary transition-all hover:bg-primary hover:text-white active:scale-90 shadow-sm"
          >
            <span className="material-symbols-outlined filled text-[22px]">add_shopping_cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
