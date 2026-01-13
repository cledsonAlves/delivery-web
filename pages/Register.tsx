import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Register: React.FC = () => {
  const navigate = useNavigate();
    const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    data_nascimento: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validações básicas
      if (!formData.nome || !formData.email || !formData.telefone || !formData.cpf) {
        setError('Por favor, preencha todos os campos obrigatórios.');
        setLoading(false);
        return;
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Por favor, insira um email válido.');
        setLoading(false);
        return;
      }

      // Formatar CPF (remover pontos e traços)
      const cpfLimpo = formData.cpf.replace(/[^\d]/g, '');
      if (cpfLimpo.length !== 11) {
        setError('CPF deve conter 11 dígitos.');
        setLoading(false);
        return;
      }

      const payload = {
        ...formData,
        cpf: cpfLimpo,
        data_nascimento: formData.data_nascimento || null,
        ativo: true,
      };

      const response = await api.criarCliente(payload);
      
      if (response && response.id) {
          // Fazer login usando o contexto
          login(response);
        
          // Redirecionar para o perfil
          navigate('/profile');
      }
    } catch (err: any) {
      console.error('Erro ao cadastrar:', err);
      if (err.response?.detail) {
        setError(err.response.detail);
      } else {
        setError('Erro ao cadastrar. Verifique seus dados e tente novamente.');
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
              <span className="material-symbols-outlined text-primary text-3xl">person_add</span>
            </div>
            <h1 className="text-2xl font-black text-text-main dark:text-white mb-2">
              Criar Conta
            </h1>
            <p className="text-sm text-text-muted">
              Preencha seus dados para se cadastrar
            </p>
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
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome */}
            <div>
              <label className="block text-sm font-semibold text-text-main dark:text-white mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Seu nome completo"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-text-main dark:text-white mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="seu@email.com"
                required
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-semibold text-text-main dark:text-white mb-2">
                Telefone *
              </label>
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="(00) 00000-0000"
                required
              />
            </div>

            {/* CPF */}
            <div>
              <label className="block text-sm font-semibold text-text-main dark:text-white mb-2">
                CPF *
              </label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="000.000.000-00"
                maxLength={14}
                required
              />
            </div>

            {/* Data de Nascimento */}
            <div>
              <label className="block text-sm font-semibold text-text-main dark:text-white mb-2">
                Data de Nascimento
              </label>
              <input
                type="date"
                name="data_nascimento"
                value={formData.data_nascimento}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Endereço */}
            <div>
              <label className="block text-sm font-semibold text-text-main dark:text-white mb-2">
                Endereço
              </label>
              <input
                type="text"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Rua, número, complemento"
              />
            </div>

            {/* Cidade e Estado */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-main dark:text-white mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Sua cidade"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-main dark:text-white mb-2">
                  Estado
                </label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">UF</option>
                  <option value="AC">AC</option>
                  <option value="AL">AL</option>
                  <option value="AP">AP</option>
                  <option value="AM">AM</option>
                  <option value="BA">BA</option>
                  <option value="CE">CE</option>
                  <option value="DF">DF</option>
                  <option value="ES">ES</option>
                  <option value="GO">GO</option>
                  <option value="MA">MA</option>
                  <option value="MT">MT</option>
                  <option value="MS">MS</option>
                  <option value="MG">MG</option>
                  <option value="PA">PA</option>
                  <option value="PB">PB</option>
                  <option value="PR">PR</option>
                  <option value="PE">PE</option>
                  <option value="PI">PI</option>
                  <option value="RJ">RJ</option>
                  <option value="RN">RN</option>
                  <option value="RS">RS</option>
                  <option value="RO">RO</option>
                  <option value="RR">RR</option>
                  <option value="SC">SC</option>
                  <option value="SP">SP</option>
                  <option value="SE">SE</option>
                  <option value="TO">TO</option>
                </select>
              </div>
            </div>

            {/* CEP */}
            <div>
              <label className="block text-sm font-semibold text-text-main dark:text-white mb-2">
                CEP
              </label>
              <input
                type="text"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="00000-000"
                maxLength={9}
              />
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
                  Cadastrando...
                </>
              ) : (
                <>
                  Cadastrar
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-text-muted">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
