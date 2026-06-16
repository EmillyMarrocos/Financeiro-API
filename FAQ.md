# ❓ FAQ - Perguntas Frequentes

Respostas para as perguntas mais comuns sobre o Financeiro-API.

---

## 📖 Índice

- [Geral](#geral)
- [Setup e Instalação](#setup-e-instalação)
- [Desenvolvimento](#desenvolvimento)
- [API e Endpoints](#api-e-endpoints)
- [Autenticação](#autenticação)
- [Banco de Dados](#banco-de-dados)
- [Deploy](#deploy)
- [Contribuição](#contribuição)

---

## Geral

### **P: O que é Financeiro-API?**

R: É uma API REST construída com NestJS para gerenciar transações financeiras (receitas e despesas). Inclui backend, banco de dados MySQL e frontend web completo.

### **P: Qual é o objetivo do projeto?**

R: Fornecer um sistema simples mas completo de controle financeiro pessoal, com autenticação segura via JWT, CRUD de transações e resumo financeiro.

### **P: É gratuito?**

R: Sim! O Financeiro-API é um projeto open-source sob licença MIT. Você pode usar, modificar e distribuir livremente.

### **P: Posso usar em produção?**

R: Sim, mas recomenda-se adicionar melhorias de segurança como rate limiting, 2FA e logs estruturados antes de colocar em produção com dados reais.

### **P: Qual é a licença?**

R: MIT License. Veja [LICENSE](LICENSE) para detalhes.

---

## Setup e Instalação

### **P: Quais são os pré-requisitos?**

R: 
- Node.js 20+
- npm 9+
- MySQL 8.0+ (ou compatível)
- Git
- Editor de código (VS Code recomendado)

### **P: Como instalar em Windows?**

R: 
1. Instale Node.js de nodejs.org
2. Instale MySQL (winget: `winget install MySQL.Server`)
3. Clone: `git clone ...`
4. `npm install`
5. Configure `.env`
6. `npm run start:dev`

### **P: Como instalar em Mac?**

R:
1. `brew install node` ou baixe de nodejs.org
2. `brew install mysql`
3. Siga os passos 3-6 de Windows

### **P: Como instalar em Linux?**

R:
1. `apt install nodejs npm` (Ubuntu/Debian)
2. `apt install mysql-server`
3. Siga os passos 3-6 de Windows

### **P: Quanto tempo leva para instalar?**

R: Cerca de 5-10 minutos, dependendo da conexão de internet (npm install leva mais tempo).

### **P: Preciso de Docker?**

R: Não é obrigatório. Você pode usar Docker ou MySQL local. Docker é melhor para desenvolvimento colaborativo e deployment.

---

## Desenvolvimento

### **P: Como inicio o servidor em desenvolvimento?**

R: `npm run start:dev` (com auto-reload)

### **P: Como habilito debug?**

R: `npm run start:debug` (abre debugger)

### **P: Como executo testes?**

R:
- Unit tests: `npm run test`
- E2E tests: `npm run test:e2e`
- Com cobertura: `npm run test:cov`

### **P: Como formato o código?**

R:
- Verificar problemas: `npm run lint`
- Formatar automaticamente: `npm run format`
- Lint e corrigir: `npm run lint:fix`

### **P: Posso mudar a porta 3000?**

R: Sim!
```bash
# Option 1
$env:PORT=3001
npm run start:dev

# Option 2 - editar .env
PORT=3001
```

### **P: Como vejo os logs?**

R: Aparecem automaticamente no terminal durante `npm run start:dev`

### **P: Posso usar TypeScript em desenvolvimento?**

R: Sim! O projeto já usa TypeScript por padrão.

### **P: Como adiciono uma nova feature?**

R: 
1. Crie branch: `git checkout -b feature/sua-feature`
2. Faça mudanças
3. Teste: `npm run test`
4. Commit: `git commit -m "feat: descrição"`
5. Push: `git push origin feature/sua-feature`
6. Abra PR

---

## API e Endpoints

### **P: Qual é a URL base da API?**

R: `http://localhost:3000/api`

### **P: Como faço uma requisição?**

R:
```javascript
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'seu@email.com', password: 'senha' })
});
```

### **P: Quais são os principais endpoints?**

R:
- `POST /auth/register` - Criar conta
- `POST /auth/login` - Fazer login
- `GET/POST /transactions` - Listar/criar transações
- `DELETE /transactions/:id` - Deletar transação
- `GET /transactions/summary` - Resumo financeiro

Ver [API.md](API.md) para lista completa.

### **P: Como uso curl para testar?**

R: Ver seção de exemplos em [API.md](API.md)

### **P: Posso usar Postman?**

R: Sim! Importe a URL base e configure headers conforme [API.md](API.md)

### **P: Como filtro transações?**

R:
```
GET /api/transactions?type=expense
GET /api/transactions?type=income
GET /api/transactions?startDate=2026-01-01&endDate=2026-12-31
```

### **P: Quais são os possíveis status HTTP?**

R:
- `200` - OK
- `201` - Criado
- `400` - Erro de validação
- `401` - Não autorizado
- `404` - Não encontrado
- `409` - Conflito (email já existe)
- `500` - Erro do servidor

---

## Autenticação

### **P: Como faço login?**

R:
1. POST `/api/auth/login` com email e password
2. Receba `access_token`
3. Armazene token (localStorage)
4. Inclua em requests: `Authorization: Bearer {token}`

### **P: Qual é o tempo de expiração do token?**

R: 24 horas por padrão (configurável em .env: `JWT_EXPIRATION=24h`)

### **P: O token expira?**

R: Sim, após 24 horas você precisa fazer login novamente.

### **P: Como armazeno o token com segurança?**

R: 
- Desenvolvimento: localStorage (simples)
- Produção: cookies httpOnly (mais seguro)

Veja [ARCHITECTURE.md](ARCHITECTURE.md) para detalhes.

### **P: Como faço logout?**

R:
```javascript
localStorage.removeItem('token');
localStorage.removeItem('user');
location.reload();
```

### **P: Posso usar diferentes senhas?**

R: Sim, senhas devem ter mínimo 6 caracteres. Use senhas fortes (mix de maiúsculas, números, símbolos).

### **P: Posso resetar minha senha?**

R: Essa feature não está implementada na v1.0. Está planejada para versões futuras.

---

## Banco de Dados

### **P: Qual banco de dados usar?**

R: MySQL 8.0+ recomendado. Compatível com MariaDB e Percona.

### **P: As tabelas são criadas automaticamente?**

R: Sim! TypeORM com `synchronize: true` cria as tabelas na primeira execução.

### **P: Como acesso o banco de dados?**

R:
```bash
mysql -u financeiro_user -p financeiro_db
SHOW TABLES;
SELECT * FROM user;
SELECT * FROM transaction;
EXIT;
```

### **P: Como faço backup?**

R:
```bash
mysqldump -u financeiro_user -p financeiro_db > backup.sql
```

### **P: Como restauro um backup?**

R:
```bash
mysql -u financeiro_user -p financeiro_db < backup.sql
```

### **P: Posso usar PostgreSQL ao invés de MySQL?**

R: Sim, TypeORM suporta PostgreSQL. Mude em `app.module.ts`:
```typescript
type: 'postgres',
```

### **P: Qual é o tamanho máximo de um valor de transação?**

R: 999,999.99 (número decimal de 10 dígitos com 2 casas decimais)

### **P: Como limpo o banco completamente?**

R:
```bash
mysql -u root -p
DROP DATABASE financeiro_db;
CREATE DATABASE financeiro_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
FLUSH PRIVILEGES;
EXIT;
```

---

## Deploy

### **P: Como coloco em produção?**

R: Veja [DEPLOYMENT.md](DEPLOYMENT.md) para guias específicos de:
- Heroku
- AWS EC2
- DigitalOcean
- Docker

### **P: Qual plataforma recomenda?**

R: 
- Iniciante: Heroku (mais simples)
- Intermediário: DigitalOcean
- Enterprise: AWS ou Google Cloud

### **P: Custa dinheiro?**

R:
- Heroku: ~$7/mês (app + DB)
- DigitalOcean: ~$6/mês (droplet + DB)
- AWS: Tier gratuito disponível

### **P: Como configurar um domínio customizado?**

R: Compre domínio, aponte DNS para seu servidor, configure HTTPS com Let's Encrypt.

### **P: Preciso de HTTPS em produção?**

R: Sim, altamente recomendado. Veja [DEPLOYMENT.md](DEPLOYMENT.md) para Let's Encrypt.

### **P: Como monitoro a aplicação?**

R: Use ferramentas como:
- PM2 (logs, restart automático)
- New Relic (APM)
- DataDog (monitoring)
- Sentry (error tracking)

---

## Contribuição

### **P: Como contribuo?**

R: Veja [CONTRIBUTING.md](CONTRIBUTING.md) para:
- Setup de desenvolvimento
- Padrões de código
- Processo de PR
- Orientações

### **P: Quais tipos de contribuição são bem-vindos?**

R:
- Correção de bugs
- Novas features
- Melhoria de documentação
- Testes
- Otimizações

### **P: Como reporto um bug?**

R: Crie um Issue com:
- Descrição clara
- Passos para reproduzir
- Comportamento esperado
- Comportamento atual
- Logs/screenshots

### **P: Como sugiro uma feature?**

R: Crie uma Discussion ou Issue descrevendo:
- Problema que resolve
- Solução proposta
- Alternativas
- Contexto

### **P: Quais são as áreas com maior demanda?**

R: Performance, testes, documentação, UI/UX, e segurança.

### **P: Posso ser um maintainer?**

R: Contribua consistentemente, e converse sobre isso em uma Discussion.

---

## Miscelânea

### **P: Há um roadmap?**

R: Sim, veja seção "Planejado" em [CHANGELOG.md](CHANGELOG.md)

### **P: Posso criar um fork?**

R: Sim! Fork, modifique, e use como desejar (licença MIT).

### **P: Há uma comunidade?**

R: Não oficial ainda, mas você pode abrir Discussions no GitHub.

### **P: Como obtenho ajuda?**

R:
1. Leia a documentação
2. Procure em Issues/Discussions
3. Abra uma nova Discussion
4. Abra um Issue

### **P: Há uma changelog?**

R: Sim! Veja [CHANGELOG.md](CHANGELOG.md)

### **P: Qual versão estou usando?**

R: Veja `package.json` no projeto ou rode:
```bash
npm list
```

### **P: Como atualizo dependências?**

R:
```bash
npm update          # Atualiza compatíveis
npm outdated        # Mostra desatualizadas
npm install @latest # Instala última versão
```

### **P: Há testes de carga/stress?**

R: Não na v1.0, mas planejado para futuras versões.

### **P: Posso integrar com outro sistema?**

R: Sim! É uma REST API, compatível com qualquer cliente HTTP.

### **P: Há um webhook?**

R: Não, mas você pode adicionar. Veja [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📞 Ainda tem dúvidas?

1. Procure em [Issues](https://github.com/seu-usuario/Financeiro-API/issues)
2. Consulte [Discussions](https://github.com/seu-usuario/Financeiro-API/discussions)
3. Abra uma nova Discussion
4. Leia toda [documentação](README.md)

---

**Última atualização:** 2026-06-15
