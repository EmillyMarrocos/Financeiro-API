# 🔧 Guia de Resolução de Problemas

## 🎯 Problemas Comuns e Soluções

---

## 1. Erro de Conexão com Banco de Dados

### Sintoma
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

### Causa
MySQL não está rodando ou não acessível.

### Solução

**Windows (cmd como Administrador):**
```bash
# Verificar se MySQL está rodando
Get-Service MySQL80

# Iniciar MySQL
Start-Service MySQL80

# Parar MySQL
Stop-Service MySQL80

# Reiniciar MySQL
Restart-Service MySQL80
```

**Alternativa - Via CLI:**
```bash
# Conectar como root
"C:\Program Files\MySQL\MySQL Server 9.7\bin\mysql.exe" -u root -p

# Verificar connection
SELECT 1;
```

**Solução Rápida:**
1. Abra "Serviços" (services.msc)
2. Procure por "MySQL80"
3. Clique com botão direito → "Iniciar"

---

## 2. Erro de Autenticação MySQL

### Sintoma
```
Error: ER_ACCESS_DENIED_FOR_USER 'financeiro_user'@'localhost'
```

### Causa
Usuário MySQL não existe ou senha está incorreta.

### Solução

**Verifique a senha em `.env`:**
```env
DB_USER=financeiro_user
DB_PASSWORD=Fin2026Str0ng
```

**Recriar usuário (como root):**
```sql
-- Conectar como root
mysql -u root -p

-- Usar database mysql
USE mysql;

-- Dropar usuário antigo (se houver)
DROP USER IF EXISTS 'financeiro_user'@'localhost';

-- Criar novo usuário
CREATE USER 'financeiro_user'@'localhost' IDENTIFIED BY 'Fin2026Str0ng';

-- Dar todas as permissões
GRANT ALL PRIVILEGES ON financeiro_db.* TO 'financeiro_user'@'localhost';

-- Aplicar mudanças
FLUSH PRIVILEGES;

-- Verificar
SELECT User, Host FROM mysql.user WHERE User='financeiro_user';
```

**Testar conexão:**
```bash
mysql -u financeiro_user -p -h localhost financeiro_db
```

---

## 3. Erro de Variáveis de Ambiente

### Sintoma
```
Error: Missing environment variable: JWT_SECRET
```

### Causa
Arquivo `.env` não existe ou está incompleto.

### Solução

**Criar arquivo `.env`:**
```bash
cd c:\Users\New\Documents\Financeiro-API
```

**Criar arquivo com todos os valores:**
```bash
# No PowerShell
@"
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=financeiro_user
DB_PASSWORD=Fin2026Str0ng
DB_NAME=financeiro_db

# JWT Configuration
JWT_SECRET=9f3d7c4b6a1e2f8c9b0d3e5f7a6c8e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c
JWT_EXPIRATION=24h

# Server Configuration
PORT=3000
"@ | Out-File -FilePath .env -Encoding UTF8
```

**Verificar arquivo:**
```bash
Get-Content .env
```

---

## 4. Porta 3000 já em uso

### Sintoma
```
Error: listen EADDRINUSE :::3000
```

### Causa
Outro processo está usando a porta 3000.

### Solução

**Encontrar processo usando porta 3000:**
```bash
# PowerShell como Admin
netstat -ano | findstr :3000

# Resultado:
# TCP    0.0.0.0:3000    0.0.0.0:0    LISTENING    12345
```

**Matar processo:**
```bash
# Substitua 12345 pelo PID encontrado
taskkill /PID 12345 /F
```

**Ou usar outra porta:**
```bash
# No .env ou ao iniciar
$env:PORT=3001
npm run start:dev
```

---

## 5. Erro de Token JWT Inválido

### Sintoma
```
Error: Unauthorized
```

### Causa
- Token expirado
- Token malformado
- JWT_SECRET incorreto

### Solução

**Gerar novo token:**
1. Faça login novamente
2. Novo token será gerado
3. localStorage será atualizado automaticamente

**Se JWT_SECRET mudou:**
```bash
# Todos os tokens antigos serão inválidos
# Recomenda-se fazer logout de todos os usuários
# E fazer login novamente
```

---

## 6. Email já cadastrado

### Sintoma
```
{
  "message": "E-mail já cadastrado",
  "error": "Conflict",
  "statusCode": 409
}
```

### Causa
Email já existe no banco de dados.

### Solução

**Opção 1: Use outro email**
```
joao@email.com → joao2@email.com
```

**Opção 2: Remover usuário do banco**
```bash
mysql -u financeiro_user -p financeiro_db
DELETE FROM user WHERE email = 'joao@email.com';
EXIT;
```

**Opção 3: Resetar banco completamente**
```bash
# No MySQL como root
DROP DATABASE financeiro_db;
CREATE DATABASE financeiro_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON financeiro_db.* TO 'financeiro_user'@'localhost';
FLUSH PRIVILEGES;

# Reiniciar aplicação (TypeORM criará tabelas automaticamente)
npm run start:dev
```

---

## 7. Dashboard não carrega

### Sintoma
- Página branca ou 404
- Formulário de login não aparece

### Causa
- Arquivo `public/index.html` não existe
- Servidor não está servindo arquivos estáticos
- CORS bloqueado

### Solução

**Verificar se arquivo existe:**
```bash
Test-Path .\public\index.html

# Se não existir, restaure:
# Veja o guia de criação no README.md
```

**Verificar se main.ts tem static files middleware:**
```typescript
// src/main.ts deve ter:
import * as express from 'express';
import { join } from 'path';

app.use(express.static(join(__dirname, '..', 'public')));
```

**Limpar cache do navegador:**
```
Ctrl + Shift + Delete → Limpar dados de navegação
```

---

## 8. CORS Error

### Sintoma
```
Access to XMLHttpRequest at 'http://localhost:3000/api/...' 
from origin 'null' has been blocked by CORS policy
```

### Causa
CORS não está configurado corretamente.

### Solução

**Verificar main.ts:**
```typescript
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 200,
});
```

**Se estiver servindo de um domínio diferente:**
```typescript
// Para desenvolvimento (qualquer origem)
app.enableCors({
  origin: true,  // Permite qualquer origem
  credentials: true,
});

// Para produção (origem específica)
app.enableCors({
  origin: 'https://seu-dominio.com',
  credentials: true,
});
```

---

## 9. Validação de DTO falha

### Sintoma
```json
{
  "message": [
    "name must be a string",
    "email must be an email"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

### Causa
Dados enviados não correspondem ao DTO.

### Solução

**Verifique o corpo do request:**

**Para registro:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Para login:**
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Para criar transação:**
```json
{
  "description": "Descrição aqui",
  "amount": 25.50,
  "type": "expense"
}
```

---

## 10. Transação não aparece após criação

### Sintoma
- Mensagem "Transação criada com sucesso"
- Mas transação não aparece na tabela

### Causa
- Erro ao carregar lista de transações
- Token inválido
- Problema com serialização JSON

### Solução

**Abra o DevTools do navegador (F12):**
1. Aba "Console" - procure por erros
2. Aba "Network" - verifique requisições
3. Aba "Storage" - confirme token em localStorage

**Verifique o token:**
```javascript
// No console do navegador
localStorage.getItem('token')
localStorage.getItem('user')
```

**Se token inválido:**
- Faça logout
- Faça login novamente
- Tente criar transação

**Recarregue a página:**
```javascript
// No console
location.reload(true)  // Força recarga
```

---

## 11. npm install falha

### Sintoma
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

### Causa
Conflito de versões de dependências.

### Solução

**Limpar cache e reinstalar:**
```bash
# Remover node_modules
rmdir node_modules -Recurse -Force

# Limpar cache npm
npm cache clean --force

# Reinstalar
npm install

# Se ainda falhar, force:
npm install --legacy-peer-deps
```

---

## 12. TypeORM não criou as tabelas

### Sintoma
- Erro ao tentar registrar usuário
- Erro: "Table 'financeiro_db.user' doesn't exist"

### Causa
- TypeORM synchronize está desabilitado
- Entidades não foram importadas corretamente

### Solução

**Verificar app.module.ts:**
```typescript
synchronize: true,  // Deve estar true em desenvolvimento
```

**Forçar sincronização manual:**
```bash
# Via CLI (se implementado)
npm run migration:run

# Ou recriar banco:
# DROP DATABASE financeiro_db;
# CREATE DATABASE financeiro_db;
# npm run start:dev
```

---

## 13. Senha incorreta mesmo assim entra

### Sintoma
Qualquer senha funciona no login.

### Causa
Validação de senha não implementada corretamente.

### Solução

**Verificar auth.service.ts:**
```typescript
async validateUser(email: string, password: string) {
  const user = await this.userRepository.findOne({ where: { email } });
  
  // Deve validar senha com bcrypt
  if (user && await bcrypt.compare(password, user.password)) {
    return user;
  }
  
  return null;
}
```

---

## 14. Erro ao deletar transação

### Sintoma
```json
{
  "message": "Transação não encontrada",
  "statusCode": 404
}
```

### Causa
- Transação já foi deletada
- ID incorreto
- Usuário tentando deletar transação de outro usuário

### Solução

**Recarregue a página:**
```javascript
location.reload()
```

**Use ID correto:**
- Abra DevTools → Network
- Veja a requisição DELETE
- Confirme o ID

---

## 15. Aplicação lenta ou travando

### Sintoma
- Aplicação demora para responder
- Página fica travada ao carregar

### Causa
- Muitas transações carregadas
- Query sem limite
- Problemas de memória

### Solução

**Adicionar paginação (recomendado):**
```typescript
@Get()
async findAll(
  @Query('page') page = 1,
  @Query('limit') limit = 20
) {
  return this.transactionService.findPaginated(page, limit);
}
```

**Limitar resultados no frontend:**
```javascript
// Carregar apenas últimas 100 transações
const url = new URL(`${API_URL}/transactions`);
url.searchParams.append('limit', '100');
const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
```

**Reiniciar servidor:**
```bash
# Parar: Ctrl + C
# Iniciar: npm run start:dev
```

---

## 📞 Ainda Precisa de Ajuda?

Se nenhuma solução funcionou:

1. **Verifique os logs:**
   ```bash
   npm run start:debug
   ```

2. **Consulte a documentação:**
   - [README.md](README.md) - Setup básico
   - [API.md](API.md) - Endpoints
   - [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitetura

3. **Abra uma Issue:**
   - Descreva o problema
   - Compartilhe logs
   - Inclua versões (Node.js, npm, MySQL)

4. **Verifique Stack Trace:**
   - Anote a mensagem de erro completa
   - Procure a linha exata do código
   - Veja arquivo de log

---

## ✅ Checklist de Debug

Use esse checklist para resolver a maioria dos problemas:

- [ ] MySQL está rodando? `Get-Service MySQL80`
- [ ] Arquivo `.env` existe e tem todos os valores?
- [ ] `node_modules` foi instalado? `Test-Path .\node_modules`
- [ ] Porta 3000 está disponível? `netstat -ano | findstr :3000`
- [ ] Banco de dados foi criado? `mysql ... "SHOW DATABASES;"`
- [ ] Tabelas existem? `mysql ... "SHOW TABLES;"`
- [ ] Servidor iniciou sem erros? Veja output do `npm run start:dev`
- [ ] Token é válido? Verifique localStorage
- [ ] DevTools mostra erros? Abra Console (F12)
- [ ] Requisições chegam no servidor? Verifique Network tab

---

Boa sorte! Se tiver outras dúvidas, abra uma Issue. 🚀
