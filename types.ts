
export interface Store {
  id: string;
  name: string;
  logo: string;
  cover: string;
  rating: number;
  reviewsCount: number;
  deliveryTime: string;
  deliveryFee: number;
  category: string;
  isOpen: boolean;
}

export interface ProdutoImagem {
  id: string;
  produto_id: string;
  url: string;
  principal: boolean;
  ordem: number;
}

export interface Product {
  id: string;
  storeId: string;
  storeName?: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  imagens?: ProdutoImagem[];
  category: string;
  isPromotion?: boolean;
  isNew?: boolean;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  colorClass: string;
}

export interface CartItem extends Product {
  quantity: number;
}
