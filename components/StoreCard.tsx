
import React from 'react';
import { Link } from 'react-router-dom';
import { Store } from '../types';

interface StoreCardProps {
  store: Store;
}

const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
  return (
    <Link 
      to={`/store/${store.id}`}
      className="flex min-w-[280px] sm:min-w-[320px] flex-col gap-4 rounded-3xl bg-surface-light dark:bg-surface-dark p-5 shadow-sm ring-1 ring-[#f4ebe7] dark:ring-neutral-800 transition-all hover:shadow-xl hover:-translate-y-1"
    >
      <div className="flex items-center gap-4">
        <div className="size-16 shrink-0 rounded-2xl bg-primary text-white flex items-center justify-center shadow-sm">
          <span className="text-xl font-black">
            {store.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="font-bold text-text-main dark:text-white leading-tight">{store.name}</h4>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5 text-yellow-500">
              <span className="material-symbols-outlined text-[16px] filled">star</span>
              <span className="text-sm font-bold text-text-main dark:text-white">{store.rating}</span>
            </div>
            <span className="text-xs text-text-muted">({store.reviewsCount})</span>
            <span className="text-gray-300 mx-1">•</span>
            <span className="text-xs font-medium text-text-muted">{store.category}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-[#f4ebe7] dark:border-neutral-800 pt-4 mt-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-text-muted">
          <span className="material-symbols-outlined text-[18px]">schedule</span>
          <span>{store.deliveryTime}</span>
        </div>
        <div className={`text-xs font-bold px-2 py-1 rounded-full ${store.isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {store.isOpen ? 'Aberto' : 'Fechado'}
        </div>
      </div>
    </Link>
  );
};

export default StoreCard;
