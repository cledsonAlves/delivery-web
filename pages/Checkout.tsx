
import React from 'react';
import { Link } from 'react-router-dom';
import { CartItem } from '../types';

interface CheckoutProps {
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, updateQuantity, removeItem }) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 8.0 : 0;
  const total = subtotal + deliveryFee;

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
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black flex items-center gap-3">
                <span className="bg-primary text-white size-8 rounded-full flex items-center justify-center text-sm font-black">1</span>
                Seus Itens
              </h3>
              <span className="text-sm font-bold text-text-muted">{cart.length} itens</span>
            </div>
            
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 sm:gap-6 pb-6 border-b border-[#f4ebe7] dark:border-neutral-800 last:border-0 last:pb-0">
                  <div className="size-24 shrink-0 overflow-hidden rounded-2xl bg-background-light dark:bg-neutral-900 shadow-sm">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-text-main dark:text-white text-base sm:text-lg leading-tight">{item.name}</h4>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-text-muted hover:text-red-500 transition-colors p-1"
                        >
                          <span className="material-symbols-outlined text-[22px]">delete</span>
                        </button>
                      </div>
                      <p className="text-xs text-text-muted font-medium mt-1">Vendido por: <span className="font-semibold">{item.storeName || 'Regional Shop'}</span></p>
                    </div>
                    <div className="flex items-end justify-between mt-4">
                      <p className="text-xl font-black text-primary">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                      <div className="flex items-center gap-4 bg-background-light dark:bg-neutral-800 rounded-xl p-1 shadow-inner border border-[#f4ebe7] dark:border-neutral-700">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="size-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-neutral-700 text-text-main dark:text-white transition-colors disabled:opacity-30"
                          disabled={item.quantity <= 1}
                        >
                          <span className="material-symbols-outlined text-[18px]">remove</span>
                        </button>
                        <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="size-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-neutral-700 text-text-main dark:text-white transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Delivery */}
          <section className="bg-surface-light dark:bg-surface-dark rounded-3xl p-8 shadow-sm ring-1 ring-[#f4ebe7] dark:ring-neutral-800">
            <h3 className="text-xl font-black flex items-center gap-3 mb-8">
              <span className="bg-primary text-white size-8 rounded-full flex items-center justify-center text-sm font-black">2</span>
              Endereço de Entrega
            </h3>
            <div className="bg-background-light dark:bg-neutral-900/50 rounded-2xl p-6 flex items-center gap-6 border-2 border-primary/10 group cursor-pointer hover:border-primary/30 transition-all">
              <div className="size-14 bg-white dark:bg-neutral-800 rounded-xl shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[28px] filled">location_on</span>
              </div>
              <div className="flex-1">
                <p className="font-black text-text-main dark:text-white">Casa</p>
                <p className="text-sm text-text-muted mt-0.5">Rua das Flores, 123 - Centro, Jarinu - SP</p>
              </div>
              <button className="text-sm font-black text-primary hover:underline">Alterar</button>
            </div>
          </section>

          {/* Section: Payment */}
          <section className="bg-surface-light dark:bg-surface-dark rounded-3xl p-8 shadow-sm ring-1 ring-[#f4ebe7] dark:ring-neutral-800">
            <h3 className="text-xl font-black flex items-center gap-3 mb-8">
              <span className="bg-primary text-white size-8 rounded-full flex items-center justify-center text-sm font-black">3</span>
              Pagamento
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['Cartão', 'Pix', 'Dinheiro'].map((method, idx) => (
                <label key={method} className="relative cursor-pointer group">
                  <input type="radio" name="payment" defaultChecked={idx === 0} className="peer sr-only" />
                  <div className="h-full rounded-2xl border-2 border-[#f4ebe7] dark:border-neutral-800 bg-background-light dark:bg-neutral-900 p-6 flex flex-col items-center gap-3 transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:border-primary/40">
                    <span className="material-symbols-outlined text-3xl text-text-muted peer-checked:text-primary">
                      {idx === 0 ? 'credit_card' : idx === 1 ? 'qr_code_2' : 'payments'}
                    </span>
                    <span className="text-sm font-black text-text-main dark:text-white">{method}</span>
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Summary */}
        <div className="lg:w-[400px]">
          <div className="sticky top-24 space-y-6">
            <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-8 shadow-lg ring-1 ring-[#f4ebe7] dark:ring-neutral-800">
              <h3 className="text-xl font-black mb-8 text-text-main dark:text-white">Resumo do Pedido</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm font-bold text-text-muted">
                  <span>Subtotal</span>
                  <span className="text-text-main dark:text-white">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-text-muted">
                  <span>Entrega (Motoboy)</span>
                  <span className="text-text-main dark:text-white">R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-green-500">
                  <span>Descontos</span>
                  <span>- R$ 0,00</span>
                </div>
              </div>

              <div className="h-px bg-[#f4ebe7] dark:bg-neutral-800 mb-6"></div>

              <div className="flex justify-between items-end mb-10">
                <span className="text-base font-black text-text-main dark:text-white">Total</span>
                <span className="text-4xl font-black text-primary tracking-tight">
                  R$ {total.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <button className="w-full bg-primary hover:bg-primary-dark text-white font-black py-5 px-6 rounded-2xl shadow-xl shadow-primary/30 transition-all transform active:scale-95 flex items-center justify-center gap-2 group">
                Finalizar Compra
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
              </button>

              <div className="flex items-center justify-center gap-2 mt-8 text-xs font-bold text-text-muted opacity-50">
                <span className="material-symbols-outlined text-sm">lock</span>
                Compra 100% Segura em Jarinu
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
