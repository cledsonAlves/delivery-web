Cria integraçao de checkout mercado pago 


# 💳 Integração Mercado Pago - Documentação

## 🎯 Visão Geral

Integração completa com Mercado Pago para processar pagamentos no marketplace. O backend cria a preferência de pagamento e recebe webhooks automaticamente.

**Ambiente:** Teste (Sandbox)

---

## 🔑 Credenciais Configuradas

```env
MP_ACCESS_TOKEN=TEST-6866597558774003-011307-8a2304259b89b76e143f8fcce0c14cbd-1659876876
MP_PUBLIC_KEY=TEST-9568abd0-c1f6-490c-8908-3d14d6a88ada
```

---

## 📍 Endpoints da API

### 1. Criar Preferência de Pagamento

**Endpoint:** `POST /pagamentos/criar-preferencia`

**Descrição:** Cria uma preferência de pagamento no Mercado Pago e retorna o link de checkout.

**Request Body:**
```json
{
  "pedido_id": "925d1b27-18c0-4301-aa50-bf53b9bfb2a7"
}
```

**Response 200:**
```json
{
  "id": "1659876876-abc123def456",
  "init_point": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=...",
  "sandbox_init_point": "https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=...",
  "pagamento_id": "550e8400-e29b-41d4-a716-446655440000",
  "pedido_id": "925d1b27-18c0-4301-aa50-bf53b9bfb2a7"
}
```

### 2. Webhook (Notificações do MP)

**Endpoint:** `POST /pagamentos/webhook`

**Descrição:** Recebe notificações automáticas do Mercado Pago sobre status de pagamento.

**Configurado para:** `https://api.jarifast.com.br/pagamentos/webhook`

**Ações automáticas:**
- Atualiza status do pagamento
- Atualiza status do pedido:
  - `approved` → pedido muda para `confirmado`
  - `rejected` ou `cancelled` → pedido muda para `cancelado`

### 3. Consultar Pagamento

**Endpoint:** `GET /pagamentos/{pagamento_id}`

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "pedido_id": "925d1b27-18c0-4301-aa50-bf53b9bfb2a7",
  "preference_id": "1659876876-abc123def456",
  "payment_id": "12345678901",
  "status": "approved",
  "status_detail": "accredited",
  "payment_type": "credit_card",
  "payment_method": "visa",
  "valor": 160.00,
  "payer_email": "cliente@email.com",
  "init_point": "https://www.mercadopago.com.br/checkout/...",
  "criado_em": "2026-01-13T10:00:00Z",
  "atualizado_em": "2026-01-13T10:05:00Z"
}
```

### 4. Consultar Pagamento por Pedido

**Endpoint:** `GET /pagamentos/pedido/{pedido_id}`

### 5. Consultar Status Manualmente

**Endpoint:** `POST /pagamentos/consultar-status/{payment_id}`

---

## 🎨 Integração no Front-end

### Fluxo Completo

```
1. Cliente finaliza pedido → POST /pedidos/
2. Front recebe pedido_id
3. Front solicita link de pagamento → POST /pagamentos/criar-preferencia
4. Front recebe init_point
5. Front redireciona cliente → window.location.href = init_point
6. Cliente paga no Mercado Pago
7. MP notifica backend via webhook (automático)
8. Backend atualiza status do pedido (automático)
9. Cliente é redirecionado de volta → success_url
10. Front consulta status → GET /pagamentos/pedido/{pedido_id}
```

### Exemplo React/TypeScript

```typescript
// services/pagamentoService.ts
import axios from 'axios';

const API_URL = 'https://api.jarifast.com.br';

export const pagamentoService = {
  // Criar preferência e obter link de checkout
  async criarPreferencia(pedidoId: string) {
    const response = await axios.post(
      `${API_URL}/pagamentos/criar-preferencia`,
      { pedido_id: pedidoId }
    );
    return response.data;
  },
  
  // Consultar status do pagamento
  async consultarPagamento(pedidoId: string) {
    const response = await axios.get(
      `${API_URL}/pagamentos/pedido/${pedidoId}`
    );
    return response.data;
  }
};

// components/Checkout.tsx
import { useState } from 'react';
import { pagamentoService } from '../services/pagamentoService';

export const Checkout = ({ pedidoId }) => {
  const [loading, setLoading] = useState(false);
  
  const handlePagarComMercadoPago = async () => {
    try {
      setLoading(true);
      
      // 1. Criar preferência de pagamento
      const preferencia = await pagamentoService.criarPreferencia(pedidoId);
      
      // 2. Redirecionar para checkout do MP
      // Em produção, use init_point
      // Em teste, use sandbox_init_point
      window.location.href = preferencia.sandbox_init_point;
      
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <button 
        onClick={handlePagarComMercadoPago}
        disabled={loading}
        className="btn-mercadopago"
      >
        {loading ? 'Processando...' : 'Pagar com Mercado Pago'}
      </button>
    </div>
  );
};

// pages/PagamentoSucesso.tsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { pagamentoService } from '../services/pagamentoService';

export const PagamentoSucesso = () => {
  const [searchParams] = useSearchParams();
  const [pagamento, setPagamento] = useState(null);
  
  const pedidoId = searchParams.get('external_reference');
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');
  
  useEffect(() => {
    if (pedidoId) {
      // Consultar status do pagamento
      pagamentoService.consultarPagamento(pedidoId)
        .then(data => setPagamento(data))
        .catch(err => console.error(err));
    }
  }, [pedidoId]);
  
  return (
    <div className="pagamento-sucesso">
      <h1>✅ Pagamento Aprovado!</h1>
      <p>Pedido: {pedidoId}</p>
      <p>ID do Pagamento: {paymentId}</p>
      <p>Status: {status}</p>
      
      {pagamento && (
        <div>
          <p>Forma de Pagamento: {pagamento.payment_method}</p>
          <p>Valor: R$ {pagamento.valor}</p>
        </div>
      )}
      
      <a href="/meus-pedidos">Ver meus pedidos</a>
    </div>
  );
};
```

### Exemplo Vue.js

```javascript
// composables/usePagamento.js
import { ref } from 'vue';
import axios from 'axios';

export function usePagamento() {
  const loading = ref(false);
  const error = ref(null);
  
  const criarPreferencia = async (pedidoId) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.post(
        'https://api.jarifast.com.br/pagamentos/criar-preferencia',
        { pedido_id: pedidoId }
      );
      
      // Redirecionar para checkout
      window.location.href = response.data.sandbox_init_point;
      
    } catch (err) {
      error.value = err.message;
      console.error('Erro ao criar pagamento:', err);
    } finally {
      loading.value = false;
    }
  };
  
  return {
    loading,
    error,
    criarPreferencia
  };
}

// components/BotaoPagamento.vue
<template>
  <button 
    @click="handlePagar"
    :disabled="loading"
    class="btn-mercadopago"
  >
    <img src="/mercadopago-logo.svg" alt="Mercado Pago" />
    {{ loading ? 'Processando...' : 'Pagar com Mercado Pago' }}
  </button>
</template>

<script setup>
import { usePagamento } from '@/composables/usePagamento';

const props = defineProps(['pedidoId']);
const { loading, criarPreferencia } = usePagamento();

const handlePagar = () => {
  criarPreferencia(props.pedidoId);
};
</script>
```

---

## 🔄 Status de Pagamento

| Status MP | Descrição | Ação no Pedido |
|-----------|-----------|----------------|
| `pending` | Pagamento pendente | Mantém "pendente" |
| `approved` | Pagamento aprovado | Muda para "confirmado" |
| `authorized` | Pagamento autorizado | Mantém "pendente" |
| `in_process` | Em processamento | Mantém "pendente" |
| `in_mediation` | Em mediação | Mantém "pendente" |
| `rejected` | Pagamento rejeitado | Muda para "cancelado" |
| `cancelled` | Pagamento cancelado | Muda para "cancelado" |
| `refunded` | Pagamento reembolsado | Muda para "cancelado" |
| `charged_back` | Estornado | Muda para "cancelado" |

---

## 🎨 URLs de Redirecionamento

Configuradas no backend:

```javascript
"back_urls": {
  "success": "https://www.jarifast.com.br/pagamento/sucesso",
  "failure": "https://www.jarifast.com.br/pagamento/falha",
  "pending": "https://www.jarifast.com.br/pagamento/pendente"
}
```

**Query params recebidos:**
- `collection_id` - ID do pagamento
- `collection_status` - Status do pagamento
- `payment_id` - ID do pagamento (mesmo que collection_id)
- `status` - Status simplificado (approved, pending, rejected)
- `external_reference` - Seu pedido_id
- `payment_type` - Tipo de pagamento
- `merchant_order_id` - ID da ordem
- `preference_id` - ID da preferência

---

## 🧪 Testar com Cartões de Teste

**Cartões aprovados:**
```
Mastercard: 5031 4332 1540 6351
Visa: 4509 9535 6623 3704
```

**CVV:** Qualquer 3 dígitos  
**Validade:** Qualquer data futura  
**Titular:** Qualquer nome

**Cartões para simular rejeição:**
```
Fundos insuficientes: 5031 7557 3453 0604
Chamada para autorizar: 5031 4332 1540 6351 (com valor > 1000)
```

---

## 📊 Tipos de Pagamento Disponíveis

- ✅ **Cartão de crédito** (Visa, Master, Elo, Amex, etc)
- ✅ **Cartão de débito**
- ✅ **PIX** (pagamento instantâneo)
- ✅ **Boleto bancário**
- ✅ **Dinheiro** (Mercado Pago, Rapipago, etc)
- ✅ **Parcelamento** (até 12x)

---

## 🚀 Deploy e Produção

### Alterar para Credenciais de Produção

1. Obter credenciais em: https://www.mercadopago.com.br/developers
2. Atualizar `.env`:
```env
MP_ACCESS_TOKEN=APP-XXXXXXXXXXXXX (produção)
MP_PUBLIC_KEY=APP-XXXXXXXXXXXXX (produção)
```

3. Atualizar webhook URL para produção
4. Usar `init_point` ao invés de `sandbox_init_point`

### Webhook em Produção

Certifique-se que:
- URL do webhook está acessível publicamente
- HTTPS está configurado
- Webhook responde rápido (< 3 segundos)

---

## 📞 Suporte

**Documentação Oficial:** https://www.mercadopago.com.br/developers/pt/docs

**Swagger Local:** http://localhost:8000/docs#/pagamentos

**Status do Sistema MP:** https://status.mercadopago.com/

---

## ✅ Checklist de Implementação

### Backend ✅
- [x] SDK Mercado Pago instalado
- [x] Modelo Pagamento criado
- [x] Endpoint criar preferência
- [x] Webhook configurado
- [x] Atualização automática de status
- [x] Credenciais no .env

### Front-end ⏳
- [ ] Botão "Pagar com Mercado Pago"
- [ ] Redirecionamento para checkout
- [ ] Páginas de sucesso/falha/pendente
- [ ] Consulta de status após pagamento
- [ ] Loading states
- [ ] Tratamento de erros
- [ ] Design do botão MP (usar logo oficial)

---

## 🎯 Próximos Passos

1. **Front-end:** Implementar botão de pagamento
2. **Front-end:** Criar páginas de retorno (sucesso/falha/pendente)
3. **Teste:** Testar fluxo completo em sandbox
4. **Produção:** Migrar para credenciais de produção
5. **Monitoramento:** Implementar logs de transações
