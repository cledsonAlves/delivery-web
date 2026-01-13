# Sprint 0 - Integração com API de Ofertas

## Objetivo
Remover mocks dos cards da página inicial e implementar consumo da API real de ofertas.

## Mudanças Realizadas

### 1. API Service (`services/api.ts`)
- ✅ Adicionada função `listarOfertas()` para consumir o endpoint `/offers/` da API
- ✅ Função aceita parâmetros `skip` e `limit` para paginação
- ✅ Integrada à exportação padrão do módulo

### 2. Tipos (`types.ts`)
- ✅ Adicionada interface `Offer` com todos os campos da API:
  - `id`: Identificador único da oferta
  - `store_id`: ID da loja associada
  - `title`: Título da oferta
  - `description`: Descrição
  - `price_original`: Preço original
  - `price_discount`: Preço com desconto
  - `image_url`: URL da imagem
  - `category`: Categoria da oferta
  - `priority`: Prioridade de exibição
  - `valid_from` / `valid_to`: Datas de validade
  - `is_active`: Status ativo/inativo

### 3. PromoSlider (`components/PromoSlider.tsx`)
- ✅ Removido mock estático de promos com dados hardcoded
- ✅ Implementado `useEffect` para carregar ofertas reais via API
- ✅ Cálculo automático de percentual de desconto a partir dos preços
- ✅ Filtragem de ofertas ativas (`is_active === true`)
- ✅ Limitação a 6 ofertas principais
- ✅ Gradientes e ícones rotativos aplicados às ofertas reais
- ✅ Estados de loading tratados
- ✅ Fallback seguro em caso de erros

### 4. Home Page (`pages/Home.tsx`)
- ✨ Página já estava consumindo API real de produtos e lojas
- ✨ Continua exibindo produtos dinâmicos da API

## API Endpoint

**GET** `/offers/` - Lista ofertas ativas

```json
{
  "page": 0,
  "limit": 10,
  "total": 50,
  "offers": [
    {
      "id": "string",
      "store_id": "string",
      "title": "string",
      "description": "string",
      "price_original": 99.99,
      "price_discount": 79.99,
      "image_url": "https://...",
      "category": "string",
      "priority": 0,
      "valid_from": "2026-01-13T01:53:52.563Z",
      "valid_to": "2026-01-13T01:53:52.563Z",
      "is_active": true,
      "criado_em": "2026-01-13T01:53:52.563Z",
      "atualizado_em": "2026-01-13T01:53:52.563Z"
    }
  ]
}
```

## Como Funciona

1. PromoSlider carrega ofertas ao ser montado
2. Filtra apenas ofertas ativas
3. Calcula percentual de desconto automaticamente
4. Exibe até 6 ofertas em carrossel rotativo
5. Gradientes e ícones variam a cada oferta
6. AutoPlay a cada 4 segundos (configurável)

## Benefícios

- ✨ Sem dados hardcoded na interface
- ✨ Ofertas atualizadas em tempo real
- ✨ Descontos calculados dinamicamente
- ✨ Melhor experiência de usuário
- ✨ Facilita manutenção e escalabilidade
