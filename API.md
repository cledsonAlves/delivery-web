# 📖 Documentação da API - Delivery Backend (Marketplace)

## 🎯 Visão Geral

API REST para gerenciamento de um marketplace de delivery onde múltiplos lojistas cadastram seus produtos (com categorias, imagens e variações) para venda em um site centralizado.

**Base URL:** `http://200.98.64.133:8000` (produção) ou `http://127.0.0.1:8000` (desenvolvimento)

**Recomendação para o front-end:** defina a variável de ambiente `VITE_API_URL` para apontar para a API de produção. Exemplo de `.env.production`:

```
VITE_API_URL="http://200.98.64.133:8000"
```

No código cliente (Vite/React) prefira `import.meta.env.VITE_API_URL` para obter a URL da API em tempo de build.

Observação sobre CORS: verifique que o backend permite requisições do domínio onde sua aplicação está hospedada (ex.: `https://<seu-usuario>.github.io`). Se necessário, habilite CORS no backend ou configure um proxy durante desenvolvimento.

**Formato de resposta:** JSON

---

## 📊 Arquitetura de Dados

```
Lojista
├── Categorias (produtos agrupados)
│   └── Produtos
│       ├── Imagens (múltiplas fotos)
│       └── Variações (tamanhos, cores, etc.)
└── Usuários (vendedores)
```

---

## 🔑 Endpoints Disponíveis

### 1. **LOJISTAS** - Gerenciar lojas

#### Criar Lojista
```http
POST /lojistas/
Content-Type: application/json

{
  "nome": "Burger Master",
  "email": "contato@burgermaster.com"
}
```

**Resposta (200):**
```json
{
  "id": "3a56d5bd-ce8b-4e43-a212-418abd2f667e",
  "nome": "Burger Master",
  "email": "contato@burgermaster.com",
  "ativo": true,
  "criado_em": "2026-01-06T06:36:40.109011-03:00",
  "atualizado_em": "2026-01-06T06:36:40.109011-03:00"
}
```

#### Listar Lojistas
```http
GET /lojistas/?skip=0&limit=10
```

**Resposta (200):** Array de lojistas

#### Obter Lojista Específica
```http
GET /lojistas/{lojista_id}
```

#### Atualizar Lojista
```http
PUT /lojistas/{lojista_id}
Content-Type: application/json

{
  "nome": "Burger Master Premium",
  "email": "novo@email.com"
}
```

#### Deletar Lojista
```http
DELETE /lojistas/{lojista_id}
```

**Resposta (200):**
```json
{
  "message": "Lojista deleted"
}
```

---

### 2. **CATEGORIAS** - Organizar produtos por tipo

#### Criar Categoria
```http
POST /categorias/
Content-Type: application/json

{
  "lojista_id": "3a56d5bd-ce8b-4e43-a212-418abd2f667e",
  "nome": "Combos",
  "descricao": "Combos e promoções",
  "ordem": 1
}
```

**Resposta (200):**
```json
{
  "id": "abc123...",
  "lojista_id": "3a56d5bd-ce8b-4e43-a212-418abd2f667e",
  "nome": "Combos",
  "descricao": "Combos e promoções",
  "ativo": true,
  "ordem": 1,
  "criado_em": "2026-01-06T06:40:00-03:00"
}
```

#### Listar Categorias (por lojista)
```http
GET /categorias/?lojista_id=3a56d5bd-ce8b-4e43-a212-418abd2f667e&skip=0&limit=20
```

#### Obter Categoria
```http
GET /categorias/{categoria_id}
```

#### Atualizar Categoria
```http
PUT /categorias/{categoria_id}
Content-Type: application/json

{
  "lojista_id": "3a56d5bd-ce8b-4e43-a212-418abd2f667e",
  "nome": "Combos Premium",
  "descricao": "Combos especiais",
  "ordem": 2
}
```

#### Deletar Categoria
```http
DELETE /categorias/{categoria_id}
```

---

### 3. **PRODUTOS** - Cadastrar e gerenciar produtos

#### Criar Produto
```http
POST /produtos/
Content-Type: application/json

{
  "lojista_id": "3a56d5bd-ce8b-4e43-a212-418abd2f667e",
  "categoria_id": "cat-abc123",
  "nome": "Combo Jarinu Master",
  "descricao": "Hambúrguer artesanal + batata + refrigerante",
  "preco": "39.90",
  "preco_promocional": "34.90",
  "custo": "15.50",
  "estoque": 20,
  "estoque_minimo": 5,
  "controla_estoque": true,
  "sku": "COMBO-001",
  "codigo_barras": "1234567890",
  "ativo": true,
  "ordem": 1
}
```

**Resposta (200):**
```json
{
  "id": "prod-xyz789",
  "lojista_id": "3a56d5bd-ce8b-4e43-a212-418abd2f667e",
  "categoria_id": "cat-abc123",
  "nome": "Combo Jarinu Master",
  "descricao": "Hambúrguer artesanal + batata + refrigerante",
  "preco": "39.90",
  "preco_promocional": "34.90",
  "custo": "15.50",
  "estoque": 20,
  "estoque_minimo": 5,
  "controla_estoque": true,
  "sku": "COMBO-001",
  "codigo_barras": "1234567890",
  "ativo": true,
  "ordem": 1,
  "criado_em": "2026-01-06T07:00:00-03:00",
  "atualizado_em": "2026-01-06T07:00:00-03:00"
}
```

#### Listar Produtos (com filtros)
```http
GET /produtos/?lojista_id=3a56d5bd-ce8b-4e43-a212-418abd2f667e&categoria_id=cat-abc123&ativo=true&skip=0&limit=50
```

#### Obter Produto
```http
GET /produtos/{produto_id}
```

#### Atualizar Produto
```http
PUT /produtos/{produto_id}
Content-Type: application/json

{
  "lojista_id": "3a56d5bd-ce8b-4e43-a212-418abd2f667e",
  "categoria_id": "cat-abc123",
  "nome": "Combo Jarinu Master v2",
  "descricao": "Hambúrguer artesanal + batata + refrigerante + molho",
  "preco": "42.90",
  "preco_promocional": "37.90",
  "custo": "16.00",
  "estoque": 25,
  "estoque_minimo": 5,
  "controla_estoque": true,
  "sku": "COMBO-001",
  "codigo_barras": "1234567890",
  "ativo": true,
  "ordem": 1
}
```

#### Deletar Produto
```http
DELETE /produtos/{produto_id}
```

---

### 4. **IMAGENS** - Galeria de fotos do produto

#### Adicionar Imagem
```http
POST /produto-imagens/
Content-Type: application/json

{
  "produto_id": "prod-xyz789",
  "url": "https://cdn.exemplo.com/produtos/combo-master-1.jpg",
  "principal": true,
  "ordem": 1
}
```

**Resposta (200):**
```json
{
  "id": "img-001",
  "produto_id": "prod-xyz789",
  "url": "https://cdn.exemplo.com/produtos/combo-master-1.jpg",
  "principal": true,
  "ordem": 1
}
```

#### Listar Imagens (por produto)
```http
GET /produto-imagens/?produto_id=prod-xyz789
```

#### Obter Imagem
```http
GET /produto-imagens/{imagem_id}
```

#### Atualizar Imagem
```http
PUT /produto-imagens/{imagem_id}
Content-Type: application/json

{
  "produto_id": "prod-xyz789",
  "url": "https://cdn.exemplo.com/produtos/combo-master-atualizado.jpg",
  "principal": true,
  "ordem": 1
}
```

#### Deletar Imagem
```http
DELETE /produto-imagens/{imagem_id}
```

---

### 5. **VARIAÇÕES** - Tamanhos, cores, sabores, etc.

#### Criar Variação
```http
POST /produto-variacoes/
Content-Type: application/json

{
  "produto_id": "prod-xyz789",
  "nome": "Pequeno",
  "preco_adicional": "-5.00",
  "estoque": 30,
  "ativo": true
}
```

**Resposta (200):**
```json
{
  "id": "var-001",
  "produto_id": "prod-xyz789",
  "nome": "Pequeno",
  "preco_adicional": "-5.00",
  "estoque": 30,
  "ativo": true
}
```

#### Listar Variações (por produto)
```http
GET /produto-variacoes/?produto_id=prod-xyz789
```

#### Obter Variação
```http
GET /produto-variacoes/{variacao_id}
```

#### Atualizar Variação
```http
PUT /produto-variacoes/{variacao_id}
Content-Type: application/json

{
  "produto_id": "prod-xyz789",
  "nome": "Pequeno",
  "preco_adicional": "-4.90",
  "estoque": 25,
  "ativo": true
}
```

#### Deletar Variação
```http
DELETE /produto-variacoes/{variacao_id}
```

---

## 💻 Exemplos de Código (JavaScript/TypeScript)

### Configuração Base

```javascript
// Em produção defina VITE_API_URL (ex: .env.production). O Vite expõe variáveis prefixadas com VITE_
const API_URL = import.meta.env.VITE_API_URL || 'http://200.98.64.133:8000';

// Função auxiliar para requisições (compatível com TypeScript/JS moderno)
async function apiRequest(method, endpoint, data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) options.body = JSON.stringify(data);

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const responseData = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return responseData;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}
```

### CRUD de Lojistas

```javascript
// CREATE - Criar lojista
async function criarLojista(nome, email) {
  const result = await apiRequest('POST', '/lojistas/', {
    nome,
    email,
  });
  console.log('Lojista criada:', result);
  return result;
}

// READ - Listar lojistas
async function listarLojistas(skip = 0, limit = 10) {
  const result = await apiRequest('GET', `/lojistas/?skip=${skip}&limit=${limit}`);
  console.log('Lojistas:', result);
  return result;
}

// READ - Obter lojista específica
async function obterLojista(lojistaId) {
  const result = await apiRequest('GET', `/lojistas/${lojistaId}`);
  console.log('Lojista:', result);
  return result;
}

// UPDATE - Atualizar lojista
async function atualizarLojista(lojistaId, nome, email) {
  const result = await apiRequest('PUT', `/lojistas/${lojistaId}`, {
    nome,
    email,
  });
  console.log('Lojista atualizada:', result);
  return result;
}

// DELETE - Deletar lojista
async function deletarLojista(lojistaId) {
  const result = await apiRequest('DELETE', `/lojistas/${lojistaId}`);
  console.log('Resposta:', result);
  return result;
}

// Exemplo de uso
(async () => {
  const lojista = await criarLojista('Pizza Gourmet', 'pizza@gourmet.com');
  const lojistaId = lojista.id;

  await listarLojistas();
  await obterLojista(lojistaId);
  await atualizarLojista(lojistaId, 'Pizza Gourmet Premium', 'contato@pizza.com');
  await deletarLojista(lojistaId);
})();
```

### CRUD de Categorias

```javascript
// CREATE - Criar categoria
async function criarCategoria(lojistaId, nome, descricao) {
  const result = await apiRequest('POST', '/categorias/', {
    lojista_id: lojistaId,
    nome,
    descricao,
    ordem: 0,
  });
  console.log('Categoria criada:', result);
  return result;
}

// READ - Listar categorias de uma lojista
async function listarCategorias(lojistaId, skip = 0, limit = 20) {
  const result = await apiRequest(
    'GET',
    `/categorias/?lojista_id=${lojistaId}&skip=${skip}&limit=${limit}`
  );
  console.log('Categorias:', result);
  return result;
}

// UPDATE - Atualizar categoria
async function atualizarCategoria(categoriaId, lojistaId, nome, descricao) {
  const result = await apiRequest('PUT', `/categorias/${categoriaId}`, {
    lojista_id: lojistaId,
    nome,
    descricao,
    ordem: 0,
  });
  console.log('Categoria atualizada:', result);
  return result;
}

// DELETE - Deletar categoria
async function deletarCategoria(categoriaId) {
  const result = await apiRequest('DELETE', `/categorias/${categoriaId}`);
  return result;
}
```

### CRUD de Produtos

```javascript
// CREATE - Criar produto
async function criarProduto(produto) {
  const result = await apiRequest('POST', '/produtos/', {
    lojista_id: produto.lojistaId,
    categoria_id: produto.categoriaId,
    nome: produto.nome,
    descricao: produto.descricao,
    preco: produto.preco,
    preco_promocional: produto.precoPromocional,
    custo: produto.custo,
    estoque: produto.estoque,
    estoque_minimo: produto.estoqueMinimo,
    controla_estoque: true,
    sku: produto.sku,
    codigo_barras: produto.codigoBarras,
    ativo: true,
    ordem: produto.ordem || 0,
  });
  return result;
}

// READ - Listar produtos com filtros
async function listarProdutos(filtros = {}) {
  const params = new URLSearchParams();
  if (filtros.lojistaId) params.append('lojista_id', filtros.lojistaId);
  if (filtros.categoriaId) params.append('categoria_id', filtros.categoriaId);
  if (filtros.ativo !== undefined) params.append('ativo', filtros.ativo);
  params.append('skip', filtros.skip || 0);
  params.append('limit', filtros.limit || 50);

  const result = await apiRequest('GET', `/produtos/?${params.toString()}`);
  return result;
}

// UPDATE - Atualizar produto
async function atualizarProduto(produtoId, produto) {
  const result = await apiRequest('PUT', `/produtos/${produtoId}`, {
    lojista_id: produto.lojistaId,
    categoria_id: produto.categoriaId,
    nome: produto.nome,
    descricao: produto.descricao,
    preco: produto.preco,
    preco_promocional: produto.precoPromocional,
    custo: produto.custo,
    estoque: produto.estoque,
    estoque_minimo: produto.estoqueMinimo,
    controla_estoque: true,
    sku: produto.sku,
    codigo_barras: produto.codigoBarras,
    ativo: produto.ativo,
    ordem: produto.ordem || 0,
  });
  return result;
}

// DELETE - Deletar produto
async function deletarProduto(produtoId) {
  return await apiRequest('DELETE', `/produtos/${produtoId}`);
}

// Exemplo de uso
(async () => {
  const novoProduto = {
    lojistaId: '3a56d5bd-ce8b-4e43-a212-418abd2f667e',
    categoriaId: 'cat-abc123',
    nome: 'Hambúrguer Clássico',
    descricao: 'Hambúrguer 150g com cheddar e bacon',
    preco: '24.90',
    precoPromocional: '19.90',
    custo: '8.50',
    estoque: 50,
    estoqueMinimo: 10,
    sku: 'HAMB-001',
    codigoBarras: '987654321',
    ordem: 2,
  };

  const produto = await criarProduto(novoProduto);
  console.log('Produto criado com ID:', produto.id);

  const produtos = await listarProdutos({
    lojistaId: '3a56d5bd-ce8b-4e43-a212-418abd2f667e',
  });
  console.log('Total de produtos:', produtos.length);

  await atualizarProduto(produto.id, {
    ...novoProduto,
    estoque: 45,
  });

  await deletarProduto(produto.id);
})();
```

### CRUD de Imagens

```javascript
// CREATE - Adicionar imagem
async function adicionarImagem(produtoId, url, principal = false) {
  const result = await apiRequest('POST', '/produto-imagens/', {
    produto_id: produtoId,
    url,
    principal,
    ordem: 0,
  });
  return result;
}

// READ - Listar imagens de um produto
async function listarImagens(produtoId) {
  const result = await apiRequest('GET', `/produto-imagens/?produto_id=${produtoId}`);
  return result;
}

// UPDATE - Atualizar imagem
async function atualizarImagem(imagemId, produtoId, url, principal) {
  const result = await apiRequest('PUT', `/produto-imagens/${imagemId}`, {
    produto_id: produtoId,
    url,
    principal,
    ordem: 0,
  });
  return result;
}

// DELETE - Deletar imagem
async function deletarImagem(imagemId) {
  return await apiRequest('DELETE', `/produto-imagens/${imagemId}`);
}
```

### CRUD de Variações

```javascript
// CREATE - Criar variação
async function criarVariacao(produtoId, nome, precoAdicional = 0) {
  const result = await apiRequest('POST', '/produto-variacoes/', {
    produto_id: produtoId,
    nome,
    preco_adicional: precoAdicional,
    estoque: 0,
    ativo: true,
  });
  return result;
}

// READ - Listar variações de um produto
async function listarVariacoes(produtoId) {
  const result = await apiRequest('GET', `/produto-variacoes/?produto_id=${produtoId}`);
  return result;
}

// UPDATE - Atualizar variação
async function atualizarVariacao(variacaoId, produtoId, nome, precoAdicional, estoque) {
  const result = await apiRequest('PUT', `/produto-variacoes/${variacaoId}`, {
    produto_id: produtoId,
    nome,
    preco_adicional: precoAdicional,
    estoque,
    ativo: true,
  });
  return result;
}

// DELETE - Deletar variação
async function deletarVariacao(variacaoId) {
  return await apiRequest('DELETE', `/produto-variacoes/${variacaoId}`);
}

// Exemplo: Adicionar variações de tamanho
(async () => {
  const produtoId = 'prod-xyz789';

  const pequeno = await criarVariacao(produtoId, 'Pequeno', -5);
  const medio = await criarVariacao(produtoId, 'Médio', 0);
  const grande = await criarVariacao(produtoId, 'Grande', 5);

  const variacoes = await listarVariacoes(produtoId);
  console.log('Variações:', variacoes);
})();
```

---

## 🔄 Fluxo Completo - Cadastrar Lojista e Produtos

```javascript
async function cadastroCompleto() {
  try {
    // 1. Criar lojista
    const lojista = await criarLojista('Burger Master', 'contato@burgermaster.com');
    const lojistaId = lojista.id;
    console.log('✓ Lojista criada:', lojistaId);

    // 2. Criar categorias
    const combos = await criarCategoria(lojistaId, 'Combos', 'Combos e promoções');
    const lanches = await criarCategoria(lojistaId, 'Lanches', 'Lanches simples');
    console.log('✓ Categorias criadas');

    // 3. Criar produto
    const produto = await criarProduto({
      lojistaId,
      categoriaId: combos.id,
      nome: 'Combo Jarinu Master',
      descricao: 'Hambúrguer + batata + refrigerante',
      preco: '39.90',
      precoPromocional: '34.90',
      custo: '15.50',
      estoque: 20,
      estoqueMinimo: 5,
      sku: 'COMBO-001',
      codigoBarras: '1234567890',
    });
    console.log('✓ Produto criado:', produto.id);

    // 4. Adicionar imagens
    await adicionarImagem(
      produto.id,
      'https://cdn.exemplo.com/combo-master-1.jpg',
      true
    );
    await adicionarImagem(
      produto.id,
      'https://cdn.exemplo.com/combo-master-2.jpg',
      false
    );
    console.log('✓ Imagens adicionadas');

    // 5. Criar variações
    await criarVariacao(produto.id, 'Pequeno', -5);
    await criarVariacao(produto.id, 'Médio', 0);
    await criarVariacao(produto.id, 'Grande', 5);
    console.log('✓ Variações criadas');

    console.log('\n✅ Cadastro completo realizado com sucesso!');
    console.log('Lojista ID:', lojistaId);
    console.log('Produto ID:', produto.id);
  } catch (error) {
    console.error('❌ Erro no cadastro:', error.message);
  }
}

// Executar
cadastroCompleto();
```

---

## ⚠️ Tratamento de Erros

```javascript
async function apiRequest(method, endpoint, data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Erro HTTP:', {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      });

      // Tratamento específico por status
      switch (response.status) {
        case 404:
          throw new Error(`Recurso não encontrado: ${endpoint}`);
        case 400:
          throw new Error(`Dados inválidos: ${responseData.detail || 'Verifique os campos'}`);
        case 500:
          throw new Error('Erro no servidor. Tente novamente mais tarde.');
        default:
          throw new Error(`Erro: ${response.statusText}`);
      }
    }

    return responseData;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}
```

---

## 📋 Resumo dos Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/lojistas/` | Criar lojista |
| GET | `/lojistas/` | Listar lojistas |
| GET | `/lojistas/{id}` | Obter lojista |
| PUT | `/lojistas/{id}` | Atualizar lojista |
| DELETE | `/lojistas/{id}` | Deletar lojista |
| POST | `/categorias/` | Criar categoria |
| GET | `/categorias/` | Listar categorias |
| GET | `/categorias/{id}` | Obter categoria |
| PUT | `/categorias/{id}` | Atualizar categoria |
| DELETE | `/categorias/{id}` | Deletar categoria |
| POST | `/produtos/` | Criar produto |
| GET | `/produtos/` | Listar produtos |
| GET | `/produtos/{id}` | Obter produto |
| PUT | `/produtos/{id}` | Atualizar produto |
| DELETE | `/produtos/{id}` | Deletar produto |
| POST | `/produto-imagens/` | Adicionar imagem |
| GET | `/produto-imagens/` | Listar imagens |
| PUT | `/produto-imagens/{id}` | Atualizar imagem |
| DELETE | `/produto-imagens/{id}` | Deletar imagem |
| POST | `/produto-variacoes/` | Criar variação |
| GET | `/produto-variacoes/` | Listar variações |
| PUT | `/produto-variacoes/{id}` | Atualizar variação |
| DELETE | `/produto-variacoes/{id}` | Deletar variação |

---

## 🎨 Dicas para Front-end

1. **Use um Cliente HTTP**: Considere usar `axios` ou `fetch` com wrapper
2. **Armazene IDs em localStorage**: Guarde `lojistaId` e `produtoId` para fácil acesso
3. **Implemente Paginação**: Use `skip` e `limit` para grandes listas
4. **Valide Dados**: Valide campos antes de enviar (ex: preço > 0)
5. **Tratamento de Erros**: Sempre tenha try/catch para melhor UX
6. **Loading States**: Mostre indicadores enquanto aguarda a API
7. **Cache de Dados**: Considere cachear categorias e lojistas

---

## 📞 Contato & Suporte

Se encontrar problemas, verifique:
- URL base está correta
- Campos obrigatórios estão preenchidos
- Tipos de dados estão corretos (string, number, boolean)
- IDs referenciados existem no banco
