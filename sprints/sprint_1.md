Recupera e loga cliente

curl -X 'GET' \
  'https://api.jarifast.com.br/clientes/228e95b5-b76c-4020-8b49-654d53c98135' \
  -H 'accept: application/json'

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