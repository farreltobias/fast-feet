# FastFeet

O desafio se baseia na proposta de uma API para controle de encomendas de uma transportadora fictícia, a FastFeet.

### Regras da aplicação

- [x] A aplicação deve ter dois tipos de usuário, entregador e/ou admin
- [x] Deve ser possível realizar login com CPF e Senha
- [ ] Deve ser possível realizar o CRUD dos entregadores
- [ ] Deve ser possível realizar o CRUD das encomendas
- [ ] Deve ser possível realizar o CRUD dos destinatários
- [x] Deve ser possível marcar uma encomenda como aguardando (Disponível para retirada)
- [x] Deve ser possível retirar uma encomenda
- [x] Deve ser possível marcar uma encomenda como entregue
- [x] Deve ser possível marcar uma encomenda como devolvida
- [x] Deve ser possível listar as encomendas com endereços de entrega próximo ao local do entregador
- [x] Deve ser possível alterar a senha de um usuário
- [x] Deve ser possível listar as entregas de um usuário
- [x] Deve ser possível notificar o destinatário a cada alteração no status da encomenda

### Regras de negócio

- [ ] Somente usuário do tipo admin pode realizar operações de CRUD nas encomendas
- [ ] Somente usuário do tipo admin pode realizar operações de CRUD dos entregadores
- [ ] Somente usuário do tipo admin pode realizar operações de CRUD dos destinatários
- [x] Para marcar uma encomenda como entregue é obrigatório o envio de uma foto
- [x] Somente o entregador que retirou a encomenda pode marcar ela como entregue
- [ ] Somente o admin pode alterar a senha de um usuário
- [x] Não deve ser possível um entregador listar as encomendas de outro entregador

### Conceitos que pode praticar

- DDD, Domain Events, Clean Architecture
- Autenticação e Autorização (RBAC)
- Testes unitários e e2e
- Integração com serviços externos

## Entities

- Deliveryman
  - documentId (CPF)
  - password
  - name

- Admin
  - documentId (CPF)
  - password
  - name

- Delivery
  - name
  - status [created, pending, withdrawn, delivered, returned]
  - createdAt
  - withdrawalAt
  - deliveredAt
  - confirmationPhoto

ConfirmationPhoto
  - title
  - url

- Recipient
  - name
  - street
  - number
  - complement?
  - neighborhood
  - city
  - state
  - zipCode
