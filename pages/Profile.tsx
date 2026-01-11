import React from 'react';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  const user = {
    name: 'Maria Silva',
    location: 'Jarinu, SP',
    email: 'maria.silva@email.com',
    phone: '(11) 98765-4321',
    cpfMasked: '***.456.789-**',
    status: 'Membro Ativo',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCO-YcNhzm2YFz1IvolWtlacWX5BHKE_8hMCKayzhYtLWL6C0L6kRzODz0DoYpB3RZONSTJxifQeWYbcihY9t_FYzEF1kAxw7Szl-ZYtdr6qzzGKubVHk6Nft9uBX-tNQOPmc8iKJx4YmzjZNBbDb7vSkoerpR20RzMXv9a2QfXfWJYzHJttxxgIYZh12aflnzoT83XA0E0ylEjGU5oXPeRdYFEDIFRtm0JaM2QiG9R5USz9hU-3PZiJUEum31DrXmJlTg68BDnClvN',
  };

  const navItems = [
    { label: 'Meus Dados', icon: 'person', active: true },
    { label: 'Endereços', icon: 'location_on', active: false },
    { label: 'Pagamentos', icon: 'credit_card', active: false },
    { label: 'Meus Pedidos', icon: 'local_shipping', active: false },
    { label: 'Ajuda e Suporte', icon: 'support_agent', active: false },
  ];

  const addresses = [
    {
      title: 'Casa',
      icon: 'home',
      lines: ['Rua das Flores, 123', 'Jardim Primavera', 'Jarinu - SP, 13240-000'],
      primary: true,
    },
    {
      title: 'Trabalho',
      icon: 'work',
      lines: ['Av. Principal, 500, Sala 12', 'Centro', 'Jarinu - SP, 13240-000'],
      primary: false,
    },
  ];

  const walletCard = {
    brand: 'Nubank',
    masked: '•••• •••• •••• 8842',
    holder: 'MARIA A SILVA',
    expires: '12/28',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center text-sm font-medium text-text-muted">
        <Link to="/" className="hover:text-primary transition-colors">
          Início
        </Link>
        <span className="material-symbols-outlined mx-2 text-base">chevron_right</span>
        <span className="text-text-main dark:text-white">Minha Conta</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 shadow-sm ring-1 ring-[#f4ebe7] dark:ring-neutral-800 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div
                className="w-24 h-24 rounded-full bg-cover bg-center ring-4 ring-primary/10 dark:ring-neutral-700"
                style={{ backgroundImage: `url(${user.avatar})` }}
              ></div>
              <button className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full shadow-md hover:bg-primary-dark transition-colors">
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
            </div>
            <h3 className="text-lg font-bold text-text-main dark:text-white">{user.name}</h3>
            <p className="text-sm text-text-muted mb-2">{user.location}</p>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              {user.status}
            </span>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-4 shadow-sm ring-1 ring-[#f4ebe7] dark:ring-neutral-800">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                    item.active
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'text-text-muted hover:bg-primary/5 hover:text-primary dark:text-gray-400 dark:hover:bg-white/5'
                  }`}
                >
                  <span className={`material-symbols-outlined ${item.active ? 'filled' : ''}`}>{item.icon}</span>
                  <span className={item.active ? 'font-semibold' : 'font-medium'}>{item.label}</span>
                </button>
              ))}
              <div className="h-px bg-[#f4ebe7] dark:bg-neutral-800 my-1" />
              <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all text-left">
                <span className="material-symbols-outlined">logout</span>
                <span className="font-medium">Sair da conta</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <div className="lg:col-span-9 space-y-8">
          {/* Personal Info */}
          <section className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm ring-1 ring-[#f4ebe7] dark:ring-neutral-800 overflow-hidden">
            <div className="px-6 py-5 border-b border-[#f4ebe7] dark:border-neutral-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-text-main dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">badge</span>
                Informações Pessoais
              </h2>
              <button className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors">Editar</button>
            </div>
            <div className="p-6">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Nome Completo</label>
                  <input
                    className="w-full px-4 py-3 rounded-xl bg-background-light dark:bg-neutral-900 border-none focus:ring-2 focus:ring-primary/40 text-text-main dark:text-white font-medium"
                    type="text"
                    value={user.name}
                    readOnly
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Email</label>
                  <input
                    className="w-full px-4 py-3 rounded-xl bg-background-light dark:bg-neutral-900 border-none focus:ring-2 focus:ring-primary/40 text-text-main dark:text-white font-medium"
                    type="email"
                    value={user.email}
                    readOnly
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">CPF</label>
                  <input
                    className="w-full px-4 py-3 rounded-xl bg-background-light dark:bg-neutral-900 border-none focus:ring-2 focus:ring-primary/40 text-text-main dark:text-white font-medium"
                    type="text"
                    value={user.cpfMasked}
                    readOnly
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Celular</label>
                  <input
                    className="w-full px-4 py-3 rounded-xl bg-background-light dark:bg-neutral-900 border-none focus:ring-2 focus:ring-primary/40 text-text-main dark:text-white font-medium"
                    type="tel"
                    value={user.phone}
                    readOnly
                  />
                </div>
              </form>
              <div className="mt-6 flex justify-end">
                <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">save</span>
                  Salvar Alterações
                </button>
              </div>
            </div>
          </section>

          {/* Addresses */}
          <section className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm ring-1 ring-[#f4ebe7] dark:ring-neutral-800 overflow-hidden">
            <div className="px-6 py-5 border-b border-[#f4ebe7] dark:border-neutral-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-text-main dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">home_pin</span>
                Endereços de Entrega
              </h2>
              <button className="flex items-center gap-1 text-sm font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-lg">add</span>
                Adicionar
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <div
                  key={address.title}
                  className={`group relative rounded-xl p-4 transition-all cursor-pointer border ${
                    address.primary
                      ? 'border-primary/20 bg-primary/5'
                      : 'border-[#f4ebe7] dark:border-neutral-800 bg-surface-light dark:bg-surface-dark'
                  }`}
                >
                  {address.primary && (
                    <span className="material-symbols-outlined text-primary filled absolute top-4 right-4">
                      check_circle
                    </span>
                  )}
                  <div className="flex items-start gap-4">
                    <div className={`${address.primary ? 'bg-white text-primary' : 'bg-background-light dark:bg-neutral-900 text-text-muted'} p-2.5 rounded-lg shadow-sm`}>
                      <span className="material-symbols-outlined">{address.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-text-main dark:text-white">{address.title}</h4>
                      <div className="text-sm text-text-muted mt-1 leading-relaxed">
                        {address.lines.map((line, idx) => (
                          <p key={idx}>{line}</p>
                        ))}
                      </div>
                      <div className="flex gap-4 mt-3">
                        <button className={`text-xs font-semibold ${address.primary ? 'text-primary hover:text-primary-dark' : 'text-text-muted hover:text-primary'}`}>
                          Editar
                        </button>
                        <button className={`text-xs font-semibold ${address.primary ? 'text-red-500 hover:text-red-600' : 'text-text-muted hover:text-red-500'}`}>
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Wallet */}
            <section className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm ring-1 ring-[#f4ebe7] dark:ring-neutral-800 overflow-hidden flex flex-col">
              <div className="px-6 py-5 border-b border-[#f4ebe7] dark:border-neutral-800">
                <h2 className="text-lg font-bold text-text-main dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">payments</span>
                  Carteira
                </h2>
              </div>
              <div className="p-6 flex-1 flex flex-col gap-4">
                <div className="relative w-full h-40 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 text-white p-5 shadow-lg flex flex-col justify-between overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="flex justify-between items-start z-10">
                    <span className="font-mono text-sm opacity-80">{walletCard.brand}</span>
                    <span className="material-symbols-outlined">contactless</span>
                  </div>
                  <div className="z-10">
                    <p className="font-mono text-lg tracking-widest mb-1">{walletCard.masked}</p>
                    <div className="flex justify-between items-end text-xs opacity-70">
                      <p>{walletCard.holder}</p>
                      <p>{walletCard.expires}</p>
                    </div>
                  </div>
                </div>
                <button className="w-full py-3 border-2 border-dashed border-[#f4ebe7] dark:border-neutral-700 rounded-xl text-text-muted font-semibold hover:border-primary hover:text-primary hover:bg-primary/5 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">add_card</span>
                  Adicionar Novo Cartão
                </button>
              </div>
            </section>

            {/* Support */}
            <section className="bg-primary rounded-2xl shadow-lg shadow-primary/30 text-white overflow-hidden relative flex flex-col justify-between">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" aria-hidden="true"></div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/20 rounded-full blur-3xl" aria-hidden="true"></div>
              <div className="p-8 relative z-10 space-y-4">
                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <span className="material-symbols-outlined text-2xl">support_agent</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Precisa de Ajuda?</h3>
                  <p className="text-white/90 leading-relaxed mt-2">
                    Teve algum problema com seu pedido ou entrega? Nossa equipe está pronta para te atender.
                  </p>
                </div>
                <button className="bg-white text-primary px-6 py-3 rounded-xl font-bold hover:bg-primary/10 transition-colors w-full flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">chat</span>
                  Falar com Suporte
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
