# ⚡ Guia Rápido (Quick Start)

Começe a usar o Financeiro-API em 5 minutos!

---

## 🚀 Início Rápido (5 min)

### 1️⃣ Clone e Instale

```bash
git clone https://github.com/seu-usuario/Financeiro-API.git
cd Financeiro-API
npm install
```

### 2️⃣ Configure Banco de Dados

```bash
# Abra MySQL CLI
mysql -u root -p

# Cole (no MySQL):
CREATE DATABASE financeiro_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'financeiro_user'@'localhost' IDENTIFIED BY 'Fin2026Str0ng';
GRANT ALL PRIVILEGES ON financeiro_db.* TO 'financeiro_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3️⃣ Configure Variáveis de Ambiente

**Crie arquivo `.env` na raiz do projeto:**

```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=financeiro_user
DB_PASSWORD=Fin2026Str0ng
DB_NAME=financeiro_db
JWT_SECRET=seu-secret-super-seguro-aqui
JWT_EXPIRATION=24h
PORT=3000
```

### 4️⃣ Inicie o Servidor

```bash
npm run start:dev
```

### 5️⃣ Acesse a Aplicação

Abra o navegador e vá para:
```
http://localhost:3000
```

**Parabéns!** 🎉 Seu Financeiro-API está rodando!

---

## 📋 Próximos Passos

### Fazer Registro

1. Clique em "Criar Conta"
2. Preencha:
   - Nome: `Seu Nome`
   - Email: `seu@email.com`
   - Senha: `suasenha123`
3. Clique em "Registrar"

### Fazer Login

1. Digite seu email
2. Digite sua senha
3. Clique em "Login"

### Criar Transação

1. No dashboard, preencha:
   - Descrição: `Café da manhã`
   - Valor: `25.50`
   - Tipo: `Despesa` ou `Receita`
2. Clique em "Adicionar Transação"

---

## 🛑 Problemas Comuns?

| Problema | Solução |
|----------|---------|
| **Erro de conexão BD** | Verifique se MySQL está rodando: `Get-Service MySQL80` |
| **Porta 3000 em uso** | Use outra porta: `$env:PORT=3001; npm run start:dev` |
| **Erro de autenticação** | Confirme credenciais em `.env` |
| **Dashboard não carrega** | Limpe cache: `Ctrl+Shift+Del` → Limpar cache |

Mais problemas? Veja [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 📚 Documentação Completa

- 🏠 [README.md](README.md) - Visão geral
- 📖 [API.md](API.md) - Todos os endpoints
- 🏗️ [ARCHITECTURE.md](ARCHITECTURE.md) - Como funciona
- 🤝 [CONTRIBUTING.md](CONTRIBUTING.md) - Contribuir
- 🔧 [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Resolver problemas
- 🚀 [DEPLOYMENT.md](DEPLOYMENT.md) - Colocar em produção

---

## 💡 Dicas Úteis

### Ver Logs

```bash
# Logs em tempo real
npm run start:dev

# Logs de debug
npm run start:debug
```

### Executar Testes

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Com cobertura
npm run test:cov
```

### Formatar Código

```bash
# Lint (encontrar problemas)
npm run lint

# Formatar (corrigir automaticamente)
npm run format
```

### Acessar Banco de Dados

```bash
# Conectar ao MySQL
mysql -u financeiro_user -p financeiro_db

# Ver tabelas
SHOW TABLES;

# Ver usuários
SELECT * FROM user;

# Ver transações
SELECT * FROM transaction;

# Sair
EXIT;
```

---

## 🔑 Credenciais Padrão

Se usou as instruções acima:

| Item | Valor |
|------|-------|
| **DB Host** | localhost |
| **DB Port** | 3306 |
| **DB User** | financeiro_user |
| **DB Password** | Fin2026Str0ng |
| **DB Name** | financeiro_db |
| **API URL** | http://localhost:3000 |
| **Frontend URL** | http://localhost:3000 |

---

## 📲 Testar API com cURL

### Registrar

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "senha123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "senha123"
  }'

# Copie o "access_token" da resposta
```

### Listar Transações

```bash
# Substitua SEU_TOKEN pelo token recebido no login
curl -X GET http://localhost:3000/api/transactions \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Criar Transação

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Supermercado",
    "amount": 150.75,
    "type": "expense"
  }'
```

---

## ⌨️ Atalhos Úteis

### VS Code

- `Ctrl+Shift+\`` - Abrir terminal
- `Ctrl+K Ctrl+O` - Abrir pasta
- `Ctrl+Shift+P` - Command palette
- `F5` - Start debugging
- `Ctrl+.` - Quick fix

### Terminal

- `npm run start:dev` - Inicia servidor
- `npm run build` - Build produção
- `npm run lint` - Verificar código
- `npm run test` - Rodar testes
- `Ctrl+C` - Parar servidor

### MySQL

- `mysql -u root -p` - Conectar como root
- `SHOW DATABASES;` - Listar BDs
- `USE banco;` - Selecionar BD
- `SHOW TABLES;` - Listar tabelas
- `DESC tabela;` - Ver estrutura
- `EXIT;` - Sair

---

## 🎯 Próximas Etapas

### Aprender

1. Leia [ARCHITECTURE.md](ARCHITECTURE.md) - entenda a estrutura
2. Explore o código em `src/`
3. Leia [API.md](API.md) - todos os endpoints
4. Rode os testes: `npm run test`

### Desenvolver

1. Crie uma branch: `git checkout -b feature/minha-feature`
2. Faça mudanças
3. Commit: `git commit -m "feat: descrição"`
4. Push: `git push origin feature/minha-feature`
5. Abra Pull Request

### Implantar

1. Leia [DEPLOYMENT.md](DEPLOYMENT.md)
2. Escolha plataforma (Heroku, AWS, DigitalOcean, etc)
3. Siga as instruções específicas
4. Configure domínio e HTTPS

---

## 🆘 Precisa de Ajuda?

1. 📖 Consulte a [Documentação](README.md)
2. 🔍 Procure em [Issues](https://github.com/seu-usuario/Financeiro-API/issues)
3. 💬 Crie uma [Discussion](https://github.com/seu-usuario/Financeiro-API/discussions)
4. 🐛 Abra um [Issue](https://github.com/seu-usuario/Financeiro-API/issues/new)

---

## ✨ Comandos Principais

```bash
# Desenvolvimento
npm run start:dev      # Inicia com auto-reload
npm run start:debug    # Com debugger
npm run build          # Build produção
npm run start:prod     # Roda build produção

# Qualidade
npm run lint           # Verificar código
npm run format         # Formatar código
npm run lint:fix       # Lint e corrigir

# Testes
npm run test           # Unit tests
npm run test:e2e       # E2E tests
npm run test:cov       # Com cobertura

# Database
npm run migration:run  # Rodar migrações
```

---

## 📊 Estrutura do Projeto

```
Financeiro-API/
├── src/                    # Código fonte
│   ├── auth/              # Autenticação
│   ├── transactions/       # Transações
│   ├── users/             # Usuários
│   ├── app.module.ts      # Módulo raiz
│   └── main.ts            # Bootstrap
├── public/                # Frontend
│   └── index.html         # Dashboard
├── test/                  # Testes E2E
├── .env                   # Variáveis de ambiente
├── package.json           # Dependências
├── tsconfig.json          # TypeScript config
├── docker-compose.yml     # Docker
└── README.md              # Documentação
```

---

## 🎉 Você está pronto!

Aproveite o Financeiro-API! 🚀

**Dúvidas?** Leia a [documentação completa](README.md).

Boa diversão! 😊
