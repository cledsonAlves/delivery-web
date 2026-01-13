import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
    const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginType, setLoginType] = useState<'email' | 'cpf'>('email');
  const [formData, setFormData] = useState({
    identifier: '', // email ou cpf
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({ identifier: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.identifier) {
        setError('Por favor, preencha o campo.');
        setLoading(false);
        return;
      }

      let cliente;
      
      if (loginType === 'email') {
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.identifier)) {
          setError('Por favor, insira um email válido.');
          setLoading(false);
          return;
        }
        cliente = await api.obterClientePorEmail(formData.identifier);
      } else {
        // Limpar CPF
        const cpfLimpo = formData.identifier.replace(/[^\d]/g, '');
        if (cpfLimpo.length !== 11) {
          setError('CPF deve conter 11 dígitos.');
          setLoading(false);
          return;
        }
        cliente = await api.obterClientePorCpf(cpfLimpo);
      }

      if (cliente && cliente.id) {
          // Fazer login usando o contexto
          login(cliente);
        
        // Redirecionar para a home
          navigate('/profile');
      } else {
        setError('Cliente não encontrado. Verifique seus dados ou cadastre-se.');
      }
    } catch (err: any) {
      console.error('Erro ao fazer login:', err);
      if (err.message.includes('404')) {
        setError('Cliente não encontrado. Verifique seus dados ou cadastre-se.');
      } else if (err.response?.detail) {
        setError(err.response.detail);
      } else {
        setError('Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-12">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-primary text-3xl">login</span>
            </div>
            <h1 className="text-2xl font-black text-text-main dark:text-white mb-2">
              Bem-vindo de volta!
            </h1>
            <p className="text-sm text-text-muted">
              Faça login para continuar
            </p>
          </div>

          {/* Login Type Toggle */}
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 dark:bg-neutral-800 rounded-xl">
            <button
              type="button"
              onClick={() => setLoginType('email')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${
                loginType === 'email'
                  ? 'bg-white dark:bg-neutral-700 text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-main dark:hover:text-white'
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setLoginType('cpf')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${
                loginType === 'cpf'
                  ? 'bg-white dark:bg-neutral-700 text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-main dark:hover:text-white'
              }`}
            >
              CPF
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email or CPF */}
            <div>
              <label className="block text-sm font-semibold text-text-main dark:text-white mb-2">
                {loginType === 'email' ? 'Email' : 'CPF'}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                  <span className="material-symbols-outlined">
                    {loginType === 'email' ? 'mail' : 'badge'}
                  </span>
                </div>
                <input
                  type={loginType === 'email' ? 'email' : 'text'}
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder={loginType === 'email' ? 'seu@email.com' : '000.000.000-00'}
                  required
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <p className="text-sm text-blue-600 dark:text-blue-400 flex items-start gap-2">
                <span className="material-symbols-outlined text-lg">info</span>
                <span>
                  Por segurança, o login é feito apenas com {loginType === 'email' ? 'email' : 'CPF'}. 
                  Seus dados estarão seguros e protegidos.
                </span>
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-bold text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-text-muted">
              Não tem uma conta?{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                Cadastre-se grátis
              </Link>
            </p>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-neutral-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-surface-dark text-text-muted">
                Ou continue como
              </span>
            </div>
          </div>

          {/* Guest Button */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full border-2 border-gray-300 dark:border-neutral-700 text-text-main dark:text-white py-3 rounded-xl font-semibold text-base transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">visibility</span>
            Visitante
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
