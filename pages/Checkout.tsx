import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CartItem } from '../types';
import { Payment, StatusScreen } from '@mercadopago/sdk-react';
import { pagamentoService } from '../services/pagamentoService';
import { apiRequest } from '../services/api';

interface CheckoutProps {
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  pedidoId?: string;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, updateQuantity, removeItem, pedidoId: initialPedidoId }) => {
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pedidoId, setPedidoId] = useState<string | null>(initialPedidoId || null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 8.0 : 0;
  const total = subtotal + deliveryFee;

  // Criar pedido ao montar o componente se não existir um pedidoId
  useEffect(() => {
    const criarPedido = async () => {
      if (pedidoId || isCreatingOrder) return;
      
      try {
        setIsCreatingOrder(true);
        const response = await apiRequest<{ id: string }>(
          'POST',
          '/pedidos',
          {
            itens: cart.map(item => ({
              produto_id: item.id,
              quantidade: item.quantity,
              preco_unitario: item.price,
              nome: item.name,
              loja_id: item.storeId,
            })),
            subtotal: subtotal,
            taxa_entrega: deliveryFee,
            total: total,
            endereco: 'Rua das Flores, 123 - Centro, Jarinu - SP',
          }
        );
        
        if (response && response.id) {
          setPedidoId(response.id);
        }
      } catch (err) {
        console.error('Erro ao criar pedido:', err);
        setError('Erro ao criar pedido. Tente novamente.');
      } finally {
        setIsCreatingOrder(false);
      }
    };

    criarPedido();
  }, [cart, pedidoId, isCreatingOrder, subtotal, deliveryFee, total]);

  const handlePayment = async (data: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validar se temos um pedido ID
      if (!pedidoId) {
        throw new Error('ID do pedido não encontrado. Crie o pedido primeiro.');
      }

      // 1. Criar preferência de pagamento no Mercado Pago via backend
      const preferencia = await pagamentoService.criarPreferencia(pedidoId);
      
      // 2. Armazenar o payment ID para consultas posteriores
      setPaymentId(preferencia.pagamento_id);
      
      // 3. Redirecionar para o checkout do Mercado Pago
      // Em produção: preferencia.init_point
      // Em sandbox: preferencia.sandbox_init_point
      const checkoutUrl = process.env.NODE_ENV === 'production' 
        ? preferencia.init_point 
        : preferencia.sandbox_init_point;
      
      window.location.href = checkoutUrl;

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro ao processar o pagamento. Tente novamente.';
      setError(errorMessage);
      console.error('Erro ao processar pagamento:', e);
    } finally {
      setIsLoading(false);
    }
  };

  if (paymentStatus) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <StatusScreen
          initialization={{ paymentId: paymentId! }}
          onReady={() => console.log('Status Screen pronto!')}
          onError={(err) => console.error('Erro no Status Screen:', err)}
        />
      </div>
    );
  }

  if (isCreatingOrder) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 flex flex-col items-center text-center gap-6">
        <div className="animate-spin size-16 text-primary">
          <span className="material-symbols-outlined text-[48px]">hourglass_empty</span>
        </div>
        <h2 className="text-2xl font-black text-text-main dark:text-white">Criando seu pedido...</h2>
        <p className="text-text-muted">Aguarde um momento enquanto preparamos tudo.</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 flex flex-col items-center text-center gap-6">
        <div className="size-24 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-[48px]">shopping_basket</span>
        </div>
        <h2 className="text-3xl font-black text-text-main dark:text-white">Seu carrinho está vazio</h2>
        <p className="text-text-muted max-w-sm">Parece que você ainda não adicionou nada. Que tal dar uma olhada nas lojas locais?</p>
        <Link to="/" className="bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary/30 transition-transform active:scale-95 hover:bg-primary-dark">
          Voltar às compras
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-black mb-10 text-text-main dark:text-white">Carrinho & Checkout</h2>
      
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: Items and Steps */}
        <div className="flex-1 space-y-8">
          {/* Section: Items */}
          <section className="bg-surface-light dark:bg-surface-dark rounded-3xl p-8 shadow-sm ring-1 ring-[#f4ebe7] dark:ring-neutral-800">
            <h3 className="text-xl font-black flex items-center gap-3 mb-8">Seus Itens</h3>
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 sm:gap-6 pb-6 border-b border-[#f4ebe7] dark:border-neutral-800 last:border-0 last:pb-0">
                  <img src={item.image} alt={item.name} className="size-24 shrink-0 rounded-2xl object-cover bg-background-light dark:bg-neutral-900 shadow-sm" />
                  <div className="flex-1">
                    <h4 className="font-bold text-text-main dark:text-white">{item.name}</h4>
                    <p className="text-xs text-text-muted font-medium mt-1">Vendido por: {item.storeName || 'Regional Shopee'}</p>
                    <div className="flex items-end justify-between mt-4">
                      <p className="text-xl font-black text-primary">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, -1)} disabled={item.quantity <= 1}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-text-muted hover:text-red-500">&times;</button>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Delivery */}
          <section className="bg-surface-light dark:bg-surface-dark rounded-3xl p-8 shadow-sm ring-1 ring-[#f4ebe7] dark:ring-neutral-800">
            <h3 className="text-xl font-black mb-4">Endereço de Entrega</h3>
            <div className="bg-background-light dark:bg-neutral-900/50 rounded-2xl p-4">
              <p className="font-bold">Casa</p>
              <p className="text-sm text-text-muted">Rua das Flores, 123 - Centro, Jarinu - SP</p>
              <button className="text-sm font-bold text-primary mt-2">Alterar</button>
            </div>
          </section>
        </div>

        {/* Right: Summary & Payment */}
        <div className="lg:w-[400px]">
          <div className="sticky top-24 space-y-6">
            <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-8 shadow-lg ring-1 ring-[#f4ebe7] dark:ring-neutral-800">
              <h3 className="text-xl font-black mb-6">Resumo do Pedido</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm"><span>Subtotal</span><span>R$ {subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span>Entrega</span><span>R$ {deliveryFee.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-lg"><span>Total</span><span>R$ {total.toFixed(2)}</span></div>
              </div>
              
              <div className="h-px bg-[#f4ebe7] dark:bg-neutral-800 my-6"></div>

              <h3 className="text-xl font-black mb-4">Pagamento</h3>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              
              <div className={isLoading ? 'opacity-50 pointer-events-none' : ''}>
                <Payment
                  initialization={{ amount: total }}
                  onSubmit={handlePayment}
                  customization={{
                    visual: {
                      style: {
                        theme: 'flat',
                      }
                    },
                    paymentMethods: {
                      ticket: 'all',
                      creditCard: 'all',
                      debitCard: 'all'
                    }
                  }}
                />
              </div>
              {isLoading && (
                <div className="absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center rounded-3xl">
                  <p className="font-bold">Processando pagamento...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;