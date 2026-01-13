import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { pagamentoService, PagamentoResponse } from '../services/pagamentoService';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [pagamento, setPagamento] = useState<PagamentoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pedidoId = searchParams.get('external_reference');
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');

  useEffect(() => {
    const consultarStatusPagamento = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!pedidoId) {
          throw new Error('ID do pedido não encontrado na URL');
        }

        // Consultar status do pagamento através do pedido
        const dadosPagamento = await pagamentoService.consultarPagamentoPorPedido(pedidoId);
        setPagamento(dadosPagamento);

        // Se houver paymentId e status, também consultar status manual
        if (paymentId && status) {
          console.log(`Pagamento ${paymentId} com status ${status}`);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao consultar status do pagamento';
        setError(errorMessage);
        console.error('Erro ao consultar pagamento:', err);
      } finally {
        setIsLoading(false);
      }
    };

    consultarStatusPagamento();
  }, [pedidoId, paymentId, status]);

  // Estado de carregamento
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 flex flex-col items-center justify-center gap-6 min-h-screen">
        <div className="animate-spin">
          <span className="material-symbols-outlined text-6xl text-primary">hourglass_empty</span>
        </div>
        <h2 className="text-2xl font-black text-text-main dark:text-white">Verificando seu pagamento...</h2>
        <p className="text-text-muted text-center">Por favor aguarde enquanto confirmamos seu pagamento</p>
      </div>
    );
  }

  // Erro ao carregar
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 flex flex-col items-center justify-center gap-6 min-h-screen">
        <div className="size-24 bg-red-100 rounded-full flex items-center justify-center text-red-600">
          <span className="material-symbols-outlined text-[48px]">error</span>
        </div>
        <h2 className="text-2xl font-black text-text-main dark:text-white">Erro ao verificar pagamento</h2>
        <p className="text-text-muted text-center max-w-sm">{error}</p>
        <Link 
          to="/" 
          className="bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:bg-primary-dark transition-colors"
        >
          Voltar para Home
        </Link>
      </div>
    );
  }

  // Sem dados de pagamento
  if (!pagamento) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 flex flex-col items-center justify-center gap-6 min-h-screen">
        <div className="size-24 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
          <span className="material-symbols-outlined text-[48px]">info</span>
        </div>
        <h2 className="text-2xl font-black text-text-main dark:text-white">Pagamento não encontrado</h2>
        <p className="text-text-muted text-center max-w-sm">Não conseguimos encontrar informações sobre seu pagamento</p>
        <Link 
          to="/" 
          className="bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:bg-primary-dark transition-colors"
        >
          Voltar para Home
        </Link>
      </div>
    );
  }

  // Pagamento aprovado
  if (pagamento.status === 'approved') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 flex flex-col items-center justify-center gap-6 min-h-screen">
        <div className="animate-bounce">
          <div className="size-24 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <span className="material-symbols-outlined text-[48px]">check_circle</span>
          </div>
        </div>
        <h2 className="text-3xl font-black text-text-main dark:text-white text-center">Pagamento Aprovado!</h2>
        <p className="text-text-muted text-center max-w-md">
          Seu pedido foi confirmado com sucesso. Você receberá uma confirmação por email em breve.
        </p>

        <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-8 w-full max-w-md ring-1 ring-[#f4ebe7] dark:ring-neutral-800">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-text-muted">ID do Pedido:</span>
              <code className="text-sm font-mono bg-background-light dark:bg-neutral-900 px-2 py-1 rounded">
                {pagamento.pedido_id}
              </code>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-text-muted">ID do Pagamento:</span>
              <code className="text-sm font-mono bg-background-light dark:bg-neutral-900 px-2 py-1 rounded">
                {pagamento.id}
              </code>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Valor:</span>
              <span className="font-bold text-primary text-lg">R$ {pagamento.valor.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Método:</span>
              <span className="font-semibold text-text-main dark:text-white capitalize">
                {pagamento.payment_method?.replace('_', ' ') || 'Cartão de crédito'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Status:</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                Aprovado
              </span>
            </div>
            {pagamento.payer_email && (
              <div className="flex justify-between items-start">
                <span className="text-text-muted">Email:</span>
                <span className="text-sm text-text-main dark:text-white">{pagamento.payer_email}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 w-full max-w-md">
          <Link 
            to="/profile"
            className="flex-1 bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:bg-primary-dark transition-colors text-center"
          >
            Ver Meus Pedidos
          </Link>
          <Link 
            to="/"
            className="flex-1 bg-surface-light dark:bg-surface-dark text-primary px-8 py-3 rounded-2xl font-bold hover:bg-[#f4ebe7] dark:hover:bg-neutral-800 transition-colors text-center"
          >
            Voltar à Home
          </Link>
        </div>
      </div>
    );
  }

  // Pagamento pendente
  if (pagamento.status === 'pending') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 flex flex-col items-center justify-center gap-6 min-h-screen">
        <div className="animate-spin">
          <div className="size-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <span className="material-symbols-outlined text-[48px]">schedule</span>
          </div>
        </div>
        <h2 className="text-3xl font-black text-text-main dark:text-white text-center">Pagamento Pendente</h2>
        <p className="text-text-muted text-center max-w-md">
          Seu pagamento está sendo processado. Você receberá uma confirmação assim que for aprovado.
        </p>

        <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-8 w-full max-w-md ring-1 ring-[#f4ebe7] dark:ring-neutral-800">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">ID do Pedido:</span>
              <code className="font-mono">{pagamento.pedido_id}</code>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Status:</span>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">
                Pendente
              </span>
            </div>
          </div>
        </div>

        <Link 
          to="/"
          className="bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:bg-primary-dark transition-colors"
        >
          Voltar à Home
        </Link>
      </div>
    );
  }

  // Pagamento rejeitado ou cancelado
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 flex flex-col items-center justify-center gap-6 min-h-screen">
      <div className="size-24 bg-red-100 rounded-full flex items-center justify-center text-red-600">
        <span className="material-symbols-outlined text-[48px]">cancel</span>
      </div>
      <h2 className="text-3xl font-black text-text-main dark:text-white text-center">
        {pagamento.status === 'rejected' ? 'Pagamento Recusado' : 'Pagamento Cancelado'}
      </h2>
      <p className="text-text-muted text-center max-w-md">
        {pagamento.status === 'rejected' 
          ? 'Seu pagamento foi recusado. Verifique seus dados e tente novamente.'
          : 'Seu pagamento foi cancelado.'}
      </p>

      <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-8 w-full max-w-md ring-1 ring-[#f4ebe7] dark:ring-neutral-800">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">ID do Pedido:</span>
            <code className="font-mono">{pagamento.pedido_id}</code>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Status:</span>
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold capitalize">
              {pagamento.status}
            </span>
          </div>
          {pagamento.status_detail && (
            <div className="flex justify-between">
              <span className="text-text-muted">Detalhes:</span>
              <span className="text-xs">{pagamento.status_detail}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 w-full max-w-md">
        <Link 
          to="/checkout"
          className="flex-1 bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:bg-primary-dark transition-colors text-center"
        >
          Tentar Novamente
        </Link>
        <Link 
          to="/"
          className="flex-1 bg-surface-light dark:bg-surface-dark text-primary px-8 py-3 rounded-2xl font-bold hover:bg-[#f4ebe7] dark:hover:bg-neutral-800 transition-colors text-center"
        >
          Voltar à Home
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
