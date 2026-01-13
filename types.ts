
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
  city?: string;
}

export interface ProdutoImagem {
  id: string;
  produto_id: string;
  url: string;
  principal: boolean;
  ordem: number;
}

export interface Offer {
  id: string;
  store_id: string;
  title: string;
  description: string;
  price_original: number | string;
  price_discount: number | string;
  image_url: string;
  category: string;
  priority: number;
  valid_from: string;
  valid_to: string;
  is_active: boolean;
  criado_em: string;
  atualizado_em: string;
}

export interface Cliente {
  id?: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  data_nascimento?: string;
  ativo?: boolean;
  criado_em?: string;
  atualizado_em?: string;
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

