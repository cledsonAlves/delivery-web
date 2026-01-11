const API_URL = 'https://api.jarifast.com.br';

export async function apiRequest<T = any>(method: string, endpoint: string, data: any = null): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const options: RequestInit = { method, headers };
  if (data) options.body = JSON.stringify(data);

  const res = await fetch(`${API_URL}${endpoint}`, options);
  const text = await res.text();
  let parsed: any = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text;
  }

  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}: ${res.statusText}`);
    // @ts-ignore
    err.response = parsed;
    throw err;
  }

  return parsed as T;
}

export async function listarProdutos(filtros: {
  lojistaId?: string;
  categoriaId?: string;
  ativo?: boolean;
  skip?: number;
  limit?: number;
} = {}) {
  const params = new URLSearchParams();
  if (filtros.lojistaId) params.append('lojista_id', filtros.lojistaId);
  if (filtros.categoriaId) params.append('categoria_id', filtros.categoriaId);
  if (filtros.ativo !== undefined) params.append('ativo', String(filtros.ativo));
  params.append('skip', String(filtros.skip ?? 0));
  params.append('limit', String(filtros.limit ?? 50));

  return await apiRequest<any[]>('GET', `/produtos/?${params.toString()}`);
}

export async function obterProduto(produtoId: string) {
  return await apiRequest<any>('GET', `/produtos/${produtoId}`);
}

export async function criarProduto(payload: any) {
  return await apiRequest<any>('POST', '/produtos/', payload);
}

export async function listarLojistas(skip = 0, limit = 50) {
  const params = new URLSearchParams();
  params.append('skip', String(skip));
  params.append('limit', String(limit));
  return await apiRequest<any[]>('GET', `/lojistas/?${params.toString()}`);
}

export async function obterLojista(lojistaId: string) {
  return await apiRequest<any>('GET', `/lojistas/${lojistaId}`);
}

export async function listarImagensProduto(produtoId: string) {
  return await apiRequest<any[]>('GET', `/produto-imagens?produto_id=${produtoId}`);
}

export default {
  API_URL,
  apiRequest,
  listarProdutos,
  obterProduto,
  criarProduto,
  listarLojistas,
  obterLojista,
  listarImagensProduto,
};
