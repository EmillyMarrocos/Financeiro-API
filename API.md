# 📚 Documentação Completa da API

## 🔑 Autenticação e Headers

### Headers Obrigatórios

Todas as requisições para rotas protegidas requerem:

```
Authorization: Bearer {seu_token_jwt}
Content-Type: application/json
```

### Códigos de Status HTTP

| Status | Significado |
|--------|------------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Token inválido ou ausente |
| 409 | Conflict - Recurso já existe |
| 500 | Internal Server Error - Erro do servidor |

---

## 🔐 Endpoints de Autenticação

### `POST /api/auth/register`

Registra um novo usuário no sistema.

**Request:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "minhasenha123"
}
```

**Validações:**
- `name`: string, obrigatório, máximo 255 caracteres
- `email`: email válido, único, obrigatório
- `password`: string, mínimo 6 caracteres, obrigatório

**Response (201):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTcxODQ1MDAwMH0.3fK_xyz...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
```

**Erros Possíveis:**
```json
{
  "message": "E-mail já cadastrado",
  "error": "Conflict",
  "statusCode": 409
}
```

---

### `POST /api/auth/login`

Faz login de um usuário existente.

**Request:**
```json
{
  "email": "joao@email.com",
  "password": "minhasenha123"
}
```

**Validações:**
- `email`: email válido, obrigatório
- `password`: string, obrigatório

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
```

**Erros Possíveis:**
```json
{
  "message": "Credenciais inválidas",
  "error": "Unauthorized",
  "statusCode": 401
}
```

---

## 💳 Endpoints de Transações

### `POST /api/transactions`

Cria uma nova transação.

**Headers Requeridos:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "description": "Café da manhã",
  "amount": 25.50,
  "type": "expense"
}
```

**Validações:**
- `description`: string, obrigatório, máximo 255 caracteres
- `amount`: número, obrigatório, maior que 0
- `type`: enum (`income` ou `expense`), obrigatório

**Response (201):**
```json
{
  "id": 1,
  "description": "Café da manhã",
  "amount": 25.50,
  "type": "expense",
  "userId": 1,
  "createdAt": "2026-06-15T21:00:00.000Z",
  "updatedAt": "2026-06-15T21:00:00.000Z"
}
```

---

### `GET /api/transactions`

Lista todas as transações do usuário autenticado.

**Headers Requeridos:**
```
Authorization: Bearer {token}
```

**Query Parameters (opcionais):**
```
?type=expense                    # Filtrar por tipo (income ou expense)
?startDate=2026-01-01          # Data inicial (YYYY-MM-DD)
&endDate=2026-12-31            # Data final (YYYY-MM-DD)
```

**Exemplos:**
```
GET /api/transactions                                    # Todas
GET /api/transactions?type=income                        # Apenas receitas
GET /api/transactions?type=expense&startDate=2026-01-01 # Filtros múltiplos
```

**Response (200):**
```json
[
  {
    "id": 1,
    "description": "Café da manhã",
    "amount": 25.50,
    "type": "expense",
    "userId": 1,
    "createdAt": "2026-06-15T21:00:00.000Z",
    "updatedAt": "2026-06-15T21:00:00.000Z"
  },
  {
    "id": 2,
    "description": "Salário",
    "amount": 5000.00,
    "type": "income",
    "userId": 1,
    "createdAt": "2026-06-01T00:00:00.000Z",
    "updatedAt": "2026-06-01T00:00:00.000Z"
  }
]
```

---

### `GET /api/transactions/summary`

Retorna resumo financeiro do usuário.

**Headers Requeridos:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "totalIncome": 5000.00,
  "totalExpense": 250.50,
  "balance": 4749.50,
  "count": 12
}
```

**Descrição dos campos:**
- `totalIncome`: Soma de todas as receitas
- `totalExpense`: Soma de todas as despesas
- `balance`: Diferença (receitas - despesas)
- `count`: Total de transações

---

### `PATCH /api/transactions/:id`

Atualiza uma transação existente.

**Headers Requeridos:**
```
Authorization: Bearer {token}
```

**URL Parameters:**
- `id`: ID da transação (numérico)

**Request (qualquer campo pode ser enviado):**
```json
{
  "description": "Café da tarde",
  "amount": 30.00,
  "type": "income"
}
```

**Response (200):**
```json
{
  "id": 1,
  "description": "Café da tarde",
  "amount": 30.00,
  "type": "income",
  "userId": 1,
  "createdAt": "2026-06-15T21:00:00.000Z",
  "updatedAt": "2026-06-15T22:00:00.000Z"
}
```

**Erros Possíveis:**
```json
{
  "message": "Transação não encontrada",
  "error": "Not Found",
  "statusCode": 404
}
```

---

### `DELETE /api/transactions/:id`

Deleta uma transação.

**Headers Requeridos:**
```
Authorization: Bearer {token}
```

**URL Parameters:**
- `id`: ID da transação (numérico)

**Response (200):**
```json
{
  "message": "Transação deletada com sucesso"
}
```

ou (apenas status 200 sem body)

**Erros Possíveis:**
```json
{
  "message": "Transação não encontrada",
  "error": "Not Found",
  "statusCode": 404
}
```

---

## 👤 Endpoints de Usuários

### `GET /api/users/:id`

Obtém informações de um usuário.

**Headers Requeridos:**
```
Authorization: Bearer {token}
```

**URL Parameters:**
- `id`: ID do usuário

**Response (200):**
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@email.com",
  "createdAt": "2026-06-15T21:00:00.000Z",
  "updatedAt": "2026-06-15T21:00:00.000Z"
}
```

---

## 📊 Exemplos com cURL

### Registrar Novo Usuário

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Santos",
    "email": "maria@email.com",
    "password": "senha123"
  }'
```

### Fazer Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@email.com",
    "password": "senha123"
  }'
```

### Armazenar Token

```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@email.com",
    "password": "senha123"
  }' | jq -r '.access_token')

echo $TOKEN
```

### Criar Transação

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Supermercado",
    "amount": 150.75,
    "type": "expense"
  }'
```

### Listar Transações

```bash
curl -X GET http://localhost:3000/api/transactions \
  -H "Authorization: Bearer $TOKEN"
```

### Filtrar por Tipo

```bash
curl -X GET "http://localhost:3000/api/transactions?type=income" \
  -H "Authorization: Bearer $TOKEN"
```

### Obter Resumo

```bash
curl -X GET http://localhost:3000/api/transactions/summary \
  -H "Authorization: Bearer $TOKEN"
```

### Atualizar Transação

```bash
curl -X PATCH http://localhost:3000/api/transactions/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Supermercado Premium",
    "amount": 200.00
  }'
```

### Deletar Transação

```bash
curl -X DELETE http://localhost:3000/api/transactions/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📝 Exemplo com Postman

1. **Registrar**
   - Method: `POST`
   - URL: `http://localhost:3000/api/auth/register`
   - Body (JSON):
     ```json
     {
       "name": "Seu Nome",
       "email": "seu@email.com",
       "password": "senha123"
     }
     ```

2. **Copie o `access_token`** da resposta

3. **Configure Authorization**
   - Type: `Bearer Token`
   - Token: `{seu_token}`

4. **Crie uma Transação**
   - Method: `POST`
   - URL: `http://localhost:3000/api/transactions`
   - Body (JSON):
     ```json
     {
       "description": "Almoço",
       "amount": 45.00,
       "type": "expense"
     }
     ```

---

## ⚠️ Tratamento de Erros

### Estrutura de Erro Padrão

```json
{
  "message": "Descrição do erro ou array de mensagens",
  "error": "Tipo do erro",
  "statusCode": 400
}
```

### Exemplos Comuns

**Validação Falhou (400):**
```json
{
  "message": [
    "name must be a string",
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

**Token Inválido (401):**
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

**Recurso não Encontrado (404):**
```json
{
  "message": "Cannot GET /api/transactions/999",
  "error": "Not Found",
  "statusCode": 404
}
```

---

## 🔄 Fluxo de Autenticação

```
1. Usuário preenche formulário de registro/login
                    ↓
2. POST para /api/auth/register ou /api/auth/login
                    ↓
3. API valida dados
                    ↓
4. Se válido, gera JWT
                    ↓
5. Retorna token + dados do usuário
                    ↓
6. Cliente armazena token (localStorage)
                    ↓
7. Todas as requisições futuras incluem: Authorization: Bearer {token}
                    ↓
8. API valida token em middleware JWT
                    ↓
9. Se válido, processa a requisição
```

---

## ℹ️ Informações Adicionais

### Limite de Taxa (Rate Limiting)
Não implementado nessa versão. Considere adicionar para produção.

### Paginação
Não implementada nessa versão. Liste adiciona limite de 1000 registros.

### Cache
Não implementado. Considere adicionar Redis para melhor performance.

### Logs
Implementado com built-in do NestJS. Veja `npm run start:debug`.
