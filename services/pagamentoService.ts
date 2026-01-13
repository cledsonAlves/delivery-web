import { apiRequest } from './api';

export interface PreferenciaResponse {
  id: string;
  init_point: string;
  sandbox_init_point: string;
  pagamento_id: string;
  pedido_id: string;
}

export interface PagamentoResponse {
  id: string;
  pedido_id: string;
  preference_id: string;
  payment_id: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  status_detail: string;
  payment_type: string | null;
  payment_method: string | null;
  valor: number;
  payer_email: string | null;
  init_point: string;
  criado_em: string;
  atualizado_em: string;
}

export const pagamentoService = {
  /**
   * Criar preferência de pagamento no Mercado Pago
   * @param pedidoId - ID do pedido
   * @returns Dados da preferência com links de checkout
   */
  async criarPreferencia(pedidoId: string): Promise<PreferenciaResponse> {
    return await apiRequest<PreferenciaResponse>(
      'POST',
      '/pagamentos/criar-preferencia',
      { pedido_id: pedidoId }
    );
  },

  /**
   * Consultar status do pagamento por ID do pedido
   * @param pedidoId - ID do pedido
   * @returns Dados do pagamento com status atualizado
   */
  async consultarPagamentoPorPedido(pedidoId: string): Promise<PagamentoResponse> {
    return await apiRequest<PagamentoResponse>(
      'GET',
      `/pagamentos/pedido/${pedidoId}`
    );
  },

  /**
   * Consultar status do pagamento por ID do pagamento
   * @param pagamentoId - ID do pagamento
   * @returns Dados do pagamento com status atualizado
   */
  async consultarPagamento(pagamentoId: string): Promise<PagamentoResponse> {
    return await apiRequest<PagamentoResponse>(
      'GET',
      `/pagamentos/${pagamentoId}`
    );
  },

  /**
   * Consultar status manualmente (polling)
   * @param paymentId - ID do pagamento do Mercado Pago
   * @returns Status atualizado do pagamento
   */
  async consultarStatusManual(paymentId: string): Promise<PagamentoResponse> {
    return await apiRequest<PagamentoResponse>(
      'POST',
      `/pagamentos/consultar-status/${paymentId}`
    );
  },
};
