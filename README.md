# 💰 Financeiro API

> Uma API RESTful moderna para gestão financeira pessoal com autenticação segura e dashboard interativo.

[![NestJS](https://img.shields.io/badge/NestJS-11.0-red?style=flat-square)](https://nestjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square)](https://www.typescriptlang.org)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?style=flat-square)](https://www.mysql.com)
[![Node.js](https://img.shields.io/badge/Node.js-20-green?style=flat-square)](https://nodejs.org)

## 📋 Descrição

**Financeiro API** é uma aplicação completa para gerenciar transações financeiras (receitas e despesas) com:

- ✅ Autenticação JWT segura
- ✅ API RESTful robusta
- ✅ Dashboard interativo responsivo
- ✅ Validação de dados completa
- ✅ Banco de dados persistente
- ✅ Interface web moderna

## 🎯 Características Principais

| Funcionalidade | Descrição |
|---|---|
| 👤 **Autenticação** | Registro e login com JWT, senhas criptografadas com bcrypt |
| 💳 **Transações** | CRUD completo de receitas e despesas |
| 📊 **Resumo Financeiro** | Totalizações automáticas de receitas, despesas e saldo |
| 🎨 **Dashboard** | Interface web intuitiva e responsiva |
| 🔒 **Segurança** | Proteção de rotas com JWT, validação de dados |
| 📱 **Responsivo** | Funciona em desktop, tablet e mobile |

## 📁 Estrutura do Projeto

```
src/
├── app.controller.ts          # Controller raiz
├── app.module.ts              # Módulo raiz (configuração geral)
├── app.service.ts             # Serviço raiz
├── main.ts                    # Ponto de entrada da aplicação
│
├── auth/                      # Módulo de Autenticação
│   ├── auth.controller.ts     # Endpoints: register, login
│   ├── auth.service.ts        # Lógica de autenticação
│   ├── auth.module.ts         # Importações do módulo
│   ├── strategies/            # Estratégias Passport
│   │   └── jwt.strategy.ts    # Validação de JWT
│   ├── guards/                # Guards de proteção
│   │   └── jwt-auth.guard.ts  # Proteção de rotas
│   └── dto/                   # Data Transfer Objects
│       ├── login.dto.ts       # Schema do login
│       └── register.dto.ts    # Schema do registro
│
├── users/                     # Módulo de Usuários
│   ├── users.controller.ts    # Endpoints de usuários
│   ├── users.service.ts       # Lógica de usuários
│   ├── users.module.ts        # Importações do módulo
│   └── entities/
│       └── user.entity.ts     # Entidade User (banco de dados)
│
├── transactions/              # Módulo de Transações
│   ├── transactions.controller.ts  # Endpoints CRUD
│   ├── transactions.service.ts     # Lógica de transações
│   ├── transactions.module.ts      # Importações
│   ├── entities/
│   │   └── transaction.entity.ts   # Entidade Transaction
│   └── dto/
│       ├── create-transaction.dto.ts
│       ├── update-transaction.dto.ts
│       └── filter-transaction.dto.ts
│
test/                         # Testes E2E
├── app.e2e-spec.ts
└── jest-e2e.json
```

## 🚀 Tecnologias Utilizadas

### Backend
- **NestJS 11** - Framework TypeScript progressivo
- **TypeScript** - Linguagem tipada
- **TypeORM** - ORM para mapeamento objeto-relacional
- **Passport.js** - Autenticação modular
- **JWT (jsonwebtoken)** - Autenticação por token
- **bcrypt** - Criptografia de senhas
- **class-validator** - Validação de dados
- **MySQL2** - Driver MySQL

### Frontend
- **HTML5** - Estrutura
- **CSS3** - Estilos responsivos
- **Vanilla JavaScript** - Sem dependências

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração
- **MySQL 8.0/9.7** - Banco de dados

## 📋 Pré-requisitos

- **Node.js** >= 20.x
- **npm** >= 9.x
- **MySQL** 8.0 ou superior
- **Git** (opcional)

## 💻 Instalação e Setup

### 1. Clonar o Repositório

```bash
git clone https://github.com/EmillyMarrocos/Financeiro-API.git
cd Financeiro-API
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (já existe um `.env.example`):

```env
# Banco de dados
DB_HOST=localhost
DB_PORT=3306
DB_USER=financeiro_user
DB_PASSWORD=Fin2026Str0ng
DB_NAME=financeiro_db

# JWT
JWT_SECRET=9f3d7c4b6a1e2f8c9b0d3e5f7a6c8e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c

# MySQL (para Docker)
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=financeiro_db
MYSQL_USER=financeiro_user
MYSQL_PASSWORD=Fin2026Str0ng

# Porta da aplicação
PORT=3000
```

### 4. Criar Banco de Dados e Usuário

**Com MySQL CLI:**

```sql
CREATE DATABASE financeiro_db;
CREATE USER 'financeiro_user'@'localhost' IDENTIFIED BY 'Fin2026Str0ng';
GRANT ALL PRIVILEGES ON financeiro_db.* TO 'financeiro_user'@'localhost';
FLUSH PRIVILEGES;
```

Ou **Com Docker:**

```bash
docker-compose up
```

### 5. Iniciar a Aplicação

```bash
# Desenvolvimento (com hot-reload)
npm run start:dev

# Produção
npm run build
npm run start:prod

# Apenas build
npm run build
```

A aplicação estará disponível em: **http://localhost:3000**

## 📚 API Endpoints

### Autenticação

#### Registrar Usuário
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Response (201 Created):**
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

#### Fazer Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Response (200 OK):**
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

### Transações

#### Criar Transação
```http
POST /api/transactions
Authorization: Bearer <seu_token>
Content-Type: application/json

{
  "description": "Café da manhã",
  "amount": 25.50,
  "type": "expense"
}
```

**Response (201 Created):**
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

#### Listar Transações
```http
GET /api/transactions
Authorization: Bearer <seu_token>

# Com filtros (opcionais):
GET /api/transactions?type=expense
GET /api/transactions?startDate=2026-01-01&endDate=2026-12-31
```

**Response (200 OK):**
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
  }
]
```

#### Resumo Financeiro
```http
GET /api/transactions/summary
Authorization: Bearer <seu_token>
```

**Response (200 OK):**
```json
{
  "totalIncome": 5000.00,
  "totalExpense": 1500.50,
  "balance": 3499.50,
  "count": 25
}
```

#### Atualizar Transação
```http
PATCH /api/transactions/1
Authorization: Bearer <seu_token>
Content-Type: application/json

{
  "description": "Café da tarde",
  "amount": 30.00
}
```

#### Deletar Transação
```http
DELETE /api/transactions/1
Authorization: Bearer <seu_token>
```

## 🔐 Autenticação

### Como Funciona

1. **Registro**: Senha é criptografada com bcrypt
2. **Login**: Retorna JWT com validade e dados do usuário
3. **Proteção de Rotas**: JWT é validado em cada requisição
4. **Token**: Deve ser enviado no header `Authorization: Bearer <token>`

### Exemplo com curl

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","password":"senha123"}'

# Usar token para acessar rotas protegidas
TOKEN="seu_token_aqui"
curl -X GET http://localhost:3000/api/transactions \
  -H "Authorization: Bearer $TOKEN"
```

## 🎨 Dashboard Web

Acesse a interface em: **http://localhost:3000**

### Funcionalidades

1. **Login/Registro**
   - Crie uma nova conta ou acesse com suas credenciais
   - Senhas são criptografadas no banco

2. **Painel Principal**
   - Resumo financeiro com totalizações
   - Formulário para adicionar transações
   - Tabela com todas as transações

3. **Operações**
   - ➕ Adicionar receita ou despesa
   - 🗑️ Deletar transações
   - 📊 Ver resumo automático
   - 👤 Seu perfil

## 📊 Modelos de Dados

### User (Usuário)

```typescript
{
  id: number;
  name: string;           // Nome completo
  email: string;          // Email único
  password: string;       // Hash bcrypt
  createdAt: Date;        // Data de criação
  updatedAt: Date;        // Data de atualização
  transactions: Transaction[];  // Relação com transações
}
```

### Transaction (Transação)

```typescript
{
  id: number;
  description: string;    // "Café", "Salário", etc
  amount: number;         // Valor (ex: 25.50)
  type: 'income' | 'expense';  // Tipo
  userId: number;         // ID do usuário proprietário
  createdAt: Date;        // Data de criação
  updatedAt: Date;        // Data de atualização
  user: User;             // Relação com usuário
}
```

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes E2E
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## 📦 Build e Deploy

### Build para Produção

```bash
npm run build
```

Cria pasta `dist/` com código compilado.

### Rodando em Produção

```bash
npm run start:prod
```

### Com Docker

```bash
# Build da imagem
docker build -t financeiro-api .

# Rodar com Docker Compose
docker-compose up --build
```

## 🔧 Comandos NPM

| Comando | Descrição |
|---------|-----------|
| `npm run start` | Iniciar aplicação |
| `npm run start:dev` | Iniciar com watch mode (recarrega ao salvar) |
| `npm run start:debug` | Iniciar com debugger |
| `npm run start:prod` | Iniciar versão otimizada |
| `npm run build` | Compilar TypeScript para JavaScript |
| `npm run lint` | Verificar e corrigir código (ESLint) |
| `npm run format` | Formatar código (Prettier) |
| `npm run test` | Rodar testes unitários |
| `npm run test:e2e` | Rodar testes E2E |
| `npm run test:cov` | Gerar cobertura de testes |

## 🐛 Troubleshooting

### Erro: "Access denied for user 'financeiro_user'"

**Solução**: Certifique-se de que o usuário MySQL foi criado:

```sql
CREATE USER 'financeiro_user'@'localhost' IDENTIFIED BY 'Fin2026Str0ng';
GRANT ALL PRIVILEGES ON financeiro_db.* TO 'financeiro_user'@'localhost';
FLUSH PRIVILEGES;
```

### Erro: "Cannot connect to database"

**Solução**: Verifique se:
1. MySQL está rodando (`net start MySQL80` no Windows)
2. Credenciais do `.env` estão corretas
3. Banco de dados foi criado

### Erro: "Port 3000 already in use"

**Solução**: Use outra porta:

```bash
PORT=3001 npm run start:dev
```

### Interface web não carrega

**Solução**: 
1. Verifique se servidor está rodando em http://localhost:3000
2. Limpe cache do navegador (Ctrl+Shift+Del)
3. Verifique console do navegador para erros (F12)

## 📝 Variáveis de Ambiente

```env
# Banco de dados
DB_HOST              # Host do MySQL (padrão: localhost)
DB_PORT              # Porta MySQL (padrão: 3306)
DB_USER              # Usuário MySQL
DB_PASSWORD          # Senha MySQL
DB_NAME              # Nome do banco de dados

# JWT
JWT_SECRET           # Chave secreta para assinar tokens

# Aplicação
PORT                 # Porta da aplicação (padrão: 3000)
NODE_ENV             # development, production, test
```

## 📄 Licença

MIT

## 👨‍💻 Autor

Desenvolvido por **Emilly Marrocos**

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se livre para:
1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Fazer commit (`git commit -m 'Adiciona MinhaFeature'`)
4. Fazer push (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request
