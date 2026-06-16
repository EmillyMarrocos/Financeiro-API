# 🚀 Guia de Implantação (Deployment)

Instruções completas para implantar o Financeiro-API em diferentes ambientes.

---

## 📋 Índice

1. [Implantação Local](#-implantação-local)
2. [Implantação em Produção](#-implantação-em-produção)
3. [Docker](#-docker)
4. [Heroku](#-heroku)
5. [AWS EC2](#-aws-ec2)
6. [DigitalOcean](#-digitalocean)
7. [Verificação Pós-Implantação](#-verificação-pós-implantação)

---

## 💻 Implantação Local

### Pré-requisitos
- Node.js 20+
- npm 9+
- MySQL 8.0+

### Passos

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/Financeiro-API.git
   cd Financeiro-API
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure variáveis de ambiente:**
   ```bash
   # Criar arquivo .env com:
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=financeiro_user
   DB_PASSWORD=Fin2026Str0ng
   DB_NAME=financeiro_db
   JWT_SECRET=seu-secret-super-seguro-aqui
   JWT_EXPIRATION=24h
   PORT=3000
   NODE_ENV=development
   ```

4. **Crie o banco de dados:**
   ```bash
   mysql -u root -p
   CREATE DATABASE financeiro_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'financeiro_user'@'localhost' IDENTIFIED BY 'Fin2026Str0ng';
   GRANT ALL PRIVILEGES ON financeiro_db.* TO 'financeiro_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

5. **Inicie em desenvolvimento:**
   ```bash
   npm run start:dev
   ```

6. **Acesse:**
   ```
   http://localhost:3000
   ```

---

## 🏭 Implantação em Produção

### Diferenças Principais

| Aspecto | Desenvolvimento | Produção |
|---------|---|---|
| NODE_ENV | development | production |
| Logs | Detalhados | Mínimos |
| Syncronize | true | false |
| Cache | Desabilitado | Habilitado |
| HTTPS | Não | Sim |
| Rate Limiting | Não | Sim |

### Configuração de Produção

1. **Variáveis de Ambiente Seguras:**
   ```bash
   # .env.production
   NODE_ENV=production
   DB_HOST=seu-db-host.com
   DB_PORT=3306
   DB_USER=prod_user
   DB_PASSWORD=super-secret-password-here
   DB_NAME=financeiro_prod
   JWT_SECRET=gerar-com-openssl-rand-base64-32
   JWT_EXPIRATION=7d
   PORT=3000
   CORS_ORIGIN=https://seu-dominio.com
   FRONTEND_URL=https://seu-dominio.com
   ```

   **Gerar JWT_SECRET seguro:**
   ```bash
   # Linux/Mac
   openssl rand -base64 32
   
   # Windows PowerShell
   [Convert]::ToBase64String((Get-Random -Count 32 -InputObject (0..255)) | ForEach-Object {[byte]$_})
   ```

2. **Build para Produção:**
   ```bash
   npm run build
   ```

3. **Instale apenas dependências de produção:**
   ```bash
   npm ci --production
   ```

4. **Inicie o servidor:**
   ```bash
   npm run start:prod
   # ou
   node dist/main.js
   ```

### Boas Práticas de Produção

1. **Use gerenciador de processo:**
   ```bash
   # Instale PM2
   npm install -g pm2
   
   # Inicie com PM2
   pm2 start dist/main.js --name "financeiro-api"
   
   # Configure auto-restart
   pm2 startup
   pm2 save
   
   # Monitorar
   pm2 status
   pm2 logs
   ```

2. **Configure HTTPS:**
   ```typescript
   // src/main.ts
   import * as fs from 'fs';
   
   const httpsOptions = {
     key: fs.readFileSync('/etc/ssl/private/key.pem'),
     cert: fs.readFileSync('/etc/ssl/certs/cert.pem'),
   };
   
   await app.listen(443, '0.0.0.0');
   ```

3. **Adicione Rate Limiting:**
   ```bash
   npm install @nestjs/throttler
   ```

   ```typescript
   // app.module.ts
   import { ThrottlerModule } from '@nestjs/throttler';
   
   @Module({
     imports: [
       ThrottlerModule.forRoot({
         ttl: 60,      // segundos
         limit: 10,    // requisições
       }),
     ],
   })
   export class AppModule {}
   ```

4. **Configure logs estruturados:**
   ```bash
   npm install winston
   ```

---

## 🐳 Docker

### Build da Imagem

1. **Dockerfile já incluído:**
   ```dockerfile
   FROM node:20-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   RUN npm run build
   
   ENV NODE_ENV=production
   
   EXPOSE 3000
   
   CMD ["node", "dist/main.js"]
   ```

2. **Build:**
   ```bash
   docker build -t financeiro-api:latest .
   ```

3. **Executar:**
   ```bash
   docker run -p 3000:3000 \
     -e DB_HOST=host.docker.internal \
     -e DB_USER=financeiro_user \
     -e DB_PASSWORD=Fin2026Str0ng \
     -e DB_NAME=financeiro_db \
     financeiro-api:latest
   ```

### Docker Compose

**docker-compose.yml incluído:**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=mysql
      - DB_USER=financeiro_user
      - DB_PASSWORD=Fin2026Str0ng
      - DB_NAME=financeiro_db
      - JWT_SECRET=seu-secret-aqui
    depends_on:
      - mysql

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_USER: financeiro_user
      MYSQL_PASSWORD: Fin2026Str0ng
      MYSQL_DATABASE: financeiro_db
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

volumes:
  mysql_data:
```

**Executar:**
```bash
docker-compose up -d
```

---

## 🦅 Heroku

### Pré-requisitos
- Conta Heroku
- Heroku CLI instalado

### Deploy Steps

1. **Crie Procfile:**
   ```
   web: npm run start:prod
   release: npm run migration:run
   ```

2. **Crie Procfile para build:**
   ```
   # Heroku detecta Node.js automaticamente
   ```

3. **Faça login e crie app:**
   ```bash
   heroku login
   heroku create seu-app-name
   ```

4. **Configure variáveis de ambiente:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=seu-secret-seguro
   heroku config:set DB_HOST=seu-db-url
   heroku config:set DB_USER=seu-user
   heroku config:set DB_PASSWORD=seu-password
   heroku config:set DB_NAME=seu-db-name
   ```

5. **Adicione banco de dados:**
   ```bash
   # Usar JawsDB (MySQL no Heroku)
   heroku addons:create jawsdb:kitefin
   ```

6. **Deploy:**
   ```bash
   git push heroku main
   ```

7. **Monitorar:**
   ```bash
   heroku logs --tail
   heroku ps:scale web=1
   ```

---

## 🔥 AWS EC2

### Setup Inicial

1. **Crie instância EC2:**
   - Ubuntu 22.04 LTS
   - t3.micro ou superior
   - Security Group: liberar portas 80, 443, 3000

2. **Conecte via SSH:**
   ```bash
   ssh -i "seu-key.pem" ubuntu@seu-ip-publico
   ```

3. **Instale dependências:**
   ```bash
   # Update
   sudo apt update && sudo apt upgrade -y
   
   # Node.js
   curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # MySQL
   sudo apt install -y mysql-server
   
   # PM2
   sudo npm install -g pm2
   ```

### Deploy

1. **Clone repositório:**
   ```bash
   cd /home/ubuntu
   git clone https://github.com/seu-usuario/Financeiro-API.git
   cd Financeiro-API
   ```

2. **Setup banco de dados:**
   ```bash
   sudo mysql -u root
   CREATE DATABASE financeiro_prod;
   CREATE USER 'prod_user'@'localhost' IDENTIFIED BY 'senhaForte123';
   GRANT ALL PRIVILEGES ON financeiro_prod.* TO 'prod_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

3. **Crie arquivo .env:**
   ```bash
   nano .env
   # Preenchaa com variáveis de produção
   ```

4. **Instale dependências:**
   ```bash
   npm install
   npm run build
   ```

5. **Inicie com PM2:**
   ```bash
   pm2 start dist/main.js --name "financeiro"
   pm2 startup
   pm2 save
   ```

6. **Configure Nginx (reverse proxy):**
   ```bash
   sudo apt install -y nginx
   ```

   ```bash
   # sudo nano /etc/nginx/sites-available/default
   server {
     listen 80;
     server_name seu-dominio.com;
   
     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

7. **Configure SSL com Let's Encrypt:**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot certonly --nginx -d seu-dominio.com
   ```

---

## 🌊 DigitalOcean

### Usando App Platform (Recomendado)

1. **Prepare repositório:**
   ```bash
   git push origin main
   ```

2. **Crie app no DigitalOcean Dashboard:**
   - Conecte seu repositório GitHub
   - Selecione branch `main`
   - Defina build command: `npm install && npm run build`
   - Defina run command: `npm run start:prod`

3. **Configure ambiente:**
   - Adicione database MySQL gerenciado
   - Defina variáveis de ambiente
   - Configure domínio customizado

4. **Deploy:**
   - DigitalOcean fará deploy automaticamente

### Usando Droplet (VPS)

Siga passos similares ao AWS EC2, mas com:

```bash
# DigitalOcean oferece imagens pré-configuradas
# Escolha: Node.js One-Click App
```

---

## ✅ Verificação Pós-Implantação

### Testes Básicos

```bash
# Verificar se servidor está respondendo
curl http://seu-dominio.com/api

# Fazer registro
curl -X POST http://seu-dominio.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "testpass123"
  }'

# Fazer login
curl -X POST http://seu-dominio.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'

# Buscar transações (com token)
curl -X GET http://seu-dominio.com/api/transactions \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Verificações de Segurança

- [ ] HTTPS habilitado
- [ ] JWT_SECRET é forte (32+ caracteres aleatórios)
- [ ] Credenciais do BD em variáveis de ambiente
- [ ] Rate limiting habilitado
- [ ] CORS configurado com domínios específicos
- [ ] Logs monitored e alertas configurados
- [ ] Backups do DB automatizados
- [ ] Firewall configurado

### Monitoramento

**Com PM2:**
```bash
pm2 monit
pm2 logs
pm2 status
```

**Com Docker:**
```bash
docker ps
docker logs container-id
docker stats
```

**Alertas recomendados:**
- Erro 500 rates acima de X
- Latência acima de X ms
- CPU/Memória acima de X%
- Database connection failures

---

## 📊 Checklist de Deployment

- [ ] Código commitado e pushado
- [ ] Testes passando (`npm run test`)
- [ ] Build realizado com sucesso (`npm run build`)
- [ ] Arquivo `.env` configurado
- [ ] Banco de dados criado e migrado
- [ ] HTTPS configurado
- [ ] DNS apontando para servidor
- [ ] Variáveis de ambiente em produção
- [ ] PM2/supervisor configurado
- [ ] Reverse proxy (Nginx/Apache) funcionando
- [ ] Backups configurados
- [ ] Monitoramento ativo
- [ ] Logs centralizados
- [ ] SSL certificate válido
- [ ] Healthcheck endpoint testado

---

## 🔄 CI/CD com GitHub Actions

**Criar `.github/workflows/deploy.yml`:**

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      
      - run: npm install
      - run: npm run lint
      - run: npm run test
      - run: npm run build
      
      - name: Deploy to Server
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
          DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
          DEPLOY_USER: ${{ secrets.DEPLOY_USER }}
        run: |
          mkdir -p ~/.ssh
          echo "$DEPLOY_KEY" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh -i ~/.ssh/deploy_key $DEPLOY_USER@$DEPLOY_HOST 'cd ~/Financeiro-API && git pull && npm install && npm run build && pm2 restart financeiro'
```

---

## 📚 Recursos Adicionais

- [NestJS Deployment](https://docs.nestjs.com/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Security Checklist](https://cheatsheetseries.owasp.org/)

---

Parabéns! Seu Financeiro-API está pronto para produção! 🎉
