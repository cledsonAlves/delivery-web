# Sprint 1 - Sistema de Autenticação de Clientes

## Objetivo
Implementar sistema completo de cadastro e login de clientes utilizando a API real.

## Mudanças Realizadas

### 1. API Service (`services/api.ts`)
- ✅ `criarCliente(payload)` - POST `/clientes/` para cadastro
- ✅ `obterClientePorEmail(email)` - GET `/clientes/email/{email}` para login
- ✅ `obterClientePorCpf(cpf)` - GET `/clientes/cpf/{cpf}` para login alternativo

### 2. Tipos (`types.ts`)
- ✅ Nova interface `Cliente` com campos:
  - `nome`, `email`, `telefone`, `cpf` (obrigatórios)
  - `endereco`, `cidade`, `estado`, `cep` (opcionais)
  - `data_nascimento`, `ativo`
  - Campos de sistema: `id`, `criado_em`, `atualizado_em`

### 3. Página de Cadastro (`pages/Register.tsx`)
- ✅ Formulário completo com validações
- ✅ Campos: nome, email, telefone, CPF, data nascimento
- ✅ Endereço completo: rua, cidade, estado (select), CEP
- ✅ Validação de email e CPF
- ✅ Formatação automática de CPF (remove pontos/traços)
- ✅ Feedback visual de erros
- ✅ Estado de loading durante cadastro
- ✅ Salvamento no localStorage após sucesso
- ✅ Redirecionamento automático para home
- ✅ Link para página de login

### 4. Página de Login (`pages/Login.tsx`)
- ✅ Toggle entre login por Email ou CPF
- ✅ Design clean e intuitivo
- ✅ Validação de formato (email ou CPF)
- ✅ Busca cliente na API
- ✅ Feedback de "cliente não encontrado"
- ✅ Salvamento no localStorage
- ✅ Opção de continuar como visitante
- ✅ Link para cadastro
- ✅ Estado de loading

### 5. App Router (`App.tsx`)
- ✅ Rotas `/login` e `/register` adicionadas
- ✅ Imports dos novos componentes

### 6. Home Page (`pages/Home.tsx`)
- ✅ Botões "Entrar" e "Cadastrar" agora são Links funcionais
- ✅ Redirecionam para `/login` e `/register`

## API Endpoints Utilizados

### Cadastro
```http
POST /clientes/
Content-Type: application/json

{
  "nome": "João da Silva",
  "email": "joao.silva@email.com",
  "telefone": "(11) 98765-4321",
  "cpf": "12345678900",
  "endereco": "Rua das Flores, 123",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01234-567",
  "data_nascimento": "1990-05-15T00:00:00Z",
  "ativo": true
}
```

### Login por Email
```http
GET /clientes/email/{email}
```

### Login por CPF
```http
GET /clientes/cpf/{cpf}
```

## Exemplo de Resposta
```json
{
  "id": "228e95b5-b76c-4020-8b49-654d53c98135",
  "nome": "João da Silva",
  "email": "joao.silva@email.com",
  "telefone": "(11) 98765-4321",
  "cpf": "123.456.789-00",
  "endereco": "Rua das Flores, 123 - Apto 45",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01234-567",
  "data_nascimento": "1990-05-15T00:00:00-03:00",
  "ativo": true,
  "criado_em": "2026-01-12T22:23:45.971795-03:00",
  "atualizado_em": "2026-01-12T22:23:45.971795-03:00"
}
```

## Fluxo de Autenticação

### Cadastro:
1. Usuário preenche formulário em `/register`
2. Validações client-side (email, CPF, campos obrigatórios)
3. POST para `/clientes/`
4. Dados salvos no localStorage
5. Redirecionamento para home

### Login:
1. Usuário acessa `/login`
2. Escolhe login por email ou CPF
3. GET para `/clientes/email/{email}` ou `/clientes/cpf/{cpf}`
4. Se encontrado: dados salvos no localStorage + redirect
5. Se não encontrado: mensagem de erro + link para cadastro

### Persistência:
- Dados do cliente armazenados em `localStorage` com chave `'cliente'`
- Formato: JSON serializado do objeto Cliente
- Acessível em qualquer página da aplicação

## Próximos Passos
- [ ] Implementar proteção de rotas (checkout, perfil)
- [ ] Exibir nome do usuário no header quando logado
- [ ] Adicionar botão de logout
- [ ] Integrar dados do cliente no checkout
- [ ] Criar página de edição de perfil

## Segurança
⚠️ **Nota**: Sistema atual não possui senha. Login é feito apenas com email/CPF para simplificar MVP. Em produção, implementar:
- Sistema de senhas com hash bcrypt
- Tokens JWT para sessão
- Refresh tokens
- Proteção CSRF
- Rate limiting