Tela de Pedidos

curl -X 'GET' \
  'https://api.jarifast.com.br/pedidos/925d1b27-18c0-4301-aa50-bf53b9bfb2a7' \
  -H 'accept: application/json'



  {
  "id": "925d1b27-18c0-4301-aa50-bf53b9bfb2a7",
  "cliente_id": "228e95b5-b76c-4020-8b49-654d53c98135",
  "lojista_id": "a420e219-ea32-42cb-b8a8-b5980a444191",
  "status": "pendente",
  "subtotal": "10500.00",
  "taxa_entrega": "10.00",
  "desconto": "0.00",
  "total": "10510.00",
  "forma_pagamento": "pix",
  "endereco_entrega": "Rua das Flores, 123 - Apto 45",
  "cidade_entrega": "São Paulo",
  "estado_entrega": "SP",
  "cep_entrega": "01234-567",
  "observacoes": "Deixar com o porteiro",
  "tempo_estimado_entrega": 45,
  "criado_em": "2026-01-12T22:35:06.764860-03:00",
  "atualizado_em": "2026-01-12T22:35:06.764860-03:00",
  "itens": [
    {
      "id": "fb26e39d-8a29-4f70-aa91-61aed32e6866",
      "pedido_id": "925d1b27-18c0-4301-aa50-bf53b9bfb2a7",
      "produto_id": "8668aa79-2ae5-4ff0-b31e-ce0e22f1739d",
      "nome_produto": "Playstation 5",
      "quantidade": 1,
      "preco_unitario": "6500.00",
      "preco_total": "6500.00",
      "observacoes": null
    },
    {
      "id": "7d8f0253-0de7-4d26-b4ce-38b37faa3309",
      "pedido_id": "925d1b27-18c0-4301-aa50-bf53b9bfb2a7",
      "produto_id": "8ec220cf-4c24-40f7-a231-1bcf9c837853",
      "nome_produto": "Iphone ProMax",
      "quantidade": 2,
      "preco_unitario": "2000.00",
      "preco_total": "4000.00",
      "observacoes": null
    }
  ]
}