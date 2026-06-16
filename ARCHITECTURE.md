# 🏗️ Arquitetura do Projeto

## 📐 Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Browser)                        │
│              - HTML/CSS/Vanilla JavaScript                  │
│              - Local Storage para Token JWT                 │
└────────────────┬─────────────────────────────────────────────┘
                 │ HTTP Requests
                 │ JSON
                 ↓
┌─────────────────────────────────────────────────────────────┐
│                   NestJS Backend                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Middleware CORS + Parsing                │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                    │                                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Routes & Controllers                        │   │
│  │  - AuthController (/api/auth)                       │   │
│  │  - TransactionsController (/api/transactions)       │   │
│  │  - UsersController (/api/users)                     │   │
│  └──────────────────┬────────────────────────────────┘   │
│                    │                                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │    Guards & Interceptors                           │   │
│  │  - JwtAuthGuard (proteção de rotas)                │   │
│  │  - ValidationPipe (validação)                      │   │
│  │  - ClassSerializerInterceptor (serialização)       │   │
│  └──────────────────┬────────────────────────────────┘   │
│                    │                                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Services (Lógica de Negócio)               │   │
│  │  - AuthService                                      │   │
│  │  - TransactionsService                              │   │
│  │  - UsersService                                     │   │
│  └──────────────────┬────────────────────────────────┘   │
│                    │                                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │      TypeORM Repositories                          │   │
│  │  - UserRepository                                   │   │
│  │  - TransactionRepository                            │   │
│  └──────────────────┬────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                 │ Database Queries
                 │ SQL
                 ↓
┌─────────────────────────────────────────────────────────────┐
│              MySQL Database                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Tables:                                             │  │
│  │  - user (id, name, email, password, ...)           │  │
│  │  - transaction (id, description, amount, type, ...) │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Fluxo de Requisição

### 1. Requisição Chega ao Servidor

```
Browser → HTTP Request → NestJS
```

### 2. Processamento pela Arquitetura NestJS

```
1. Main.ts
   └─ Bootstrap da aplicação
      └─ Create AppModule
         └─ Carrega todos os módulos

2. AppModule (src/app.module.ts)
   └─ Configura:
      - ConfigModule (variáveis de ambiente)
      - TypeOrmModule (conexão com BD)
      - AuthModule
      - UsersModule
      - TransactionsModule

3. Request atinge o Middleware
   └─ CORS habilitado
   └─ JSON parsing

4. Router resolve a rota
   └─ Mapeia para o Controller correto

5. Guard é executado (se proteção de rota)
   └─ JwtAuthGuard valida token

6. Pipes executam validação
   └─ ClassValidator valida DTO

7. Controller executa método
   └─ Recebe dados validados
   └─ Chama serviço

8. Service executa lógica
   └─ Interage com repository
   └─ Repository executa queries

9. Resposta é formatada
   └─ Interceptor serializa dados
   └─ Retorna JSON

10. Browser recebe resposta
    └─ JavaScript processa dados
    └─ Atualiza UI
```

## 📦 Módulos e Responsabilidades

### AppModule (Módulo Raiz)

**Localização:** `src/app.module.ts`

```typescript
@Module({
  imports: [
    ConfigModule.forRoot(),          // Carrega .env
    TypeOrmModule.forRootAsync(),    // Conexão BD
    AuthModule,                       // Autenticação
    UsersModule,                      // Usuários
    TransactionsModule,               // Transações
  ],
})
export class AppModule {}
```

**Responsabilidades:**
- Registrar todos os módulos
- Configurar banco de dados
- Configurar variáveis de ambiente

---

### AuthModule

**Localização:** `src/auth/`

```
auth/
├── auth.controller.ts    # register, login
├── auth.service.ts       # Lógica de autenticação
├── auth.module.ts        # Exporta auth service
├── dto/
│   ├── register.dto.ts   # Validação de registro
│   └── login.dto.ts      # Validação de login
├── strategies/
│   └── jwt.strategy.ts   # Estratégia Passport JWT
└── guards/
    └── jwt-auth.guard.ts # Proteção de rotas
```

**Componentes Principais:**

1. **AuthService**
   ```typescript
   export class AuthService {
     register(registerDto)  // Cria novo usuário
     login(loginDto)        // Autentica e retorna JWT
     validateUser(email)    // Valida credenciais
   }
   ```

2. **AuthController**
   ```typescript
   @Controller('auth')
   export class AuthController {
     @Post('register')      // POST /api/auth/register
     @Post('login')         // POST /api/auth/login
   }
   ```

3. **JwtStrategy**
   ```typescript
   export class JwtStrategy extends PassportStrategy(Strategy) {
     validate(payload)      // Valida JWT e retorna usuário
   }
   ```

4. **JwtAuthGuard**
   ```typescript
   @Injectable()
   export class JwtAuthGuard extends AuthGuard('jwt') {}
   // Usado como @UseGuards(JwtAuthGuard)
   ```

---

### UsersModule

**Localização:** `src/users/`

```
users/
├── users.controller.ts   # Endpoints de usuários
├── users.service.ts      # Lógica de usuários
├── users.module.ts       # Exporta user service
└── entities/
    └── user.entity.ts    # Entidade User (ORM)
```

**User Entity:**
```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];
}
```

---

### TransactionsModule

**Localização:** `src/transactions/`

```
transactions/
├── transactions.controller.ts   # Endpoints CRUD
├── transactions.service.ts      # Lógica de transações
├── transactions.module.ts       # Exporta transaction service
├── entities/
│   └── transaction.entity.ts    # Entidade Transaction
└── dto/
    ├── create-transaction.dto.ts
    ├── update-transaction.dto.ts
    └── filter-transaction.dto.ts
```

**Transaction Entity:**
```typescript
@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: ['income', 'expense'] })
  type: 'income' | 'expense';

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

## 🔐 Fluxo de Autenticação

### Registro

```
1. Usuário preenche formulário
   └─ name, email, password

2. Frontend → POST /api/auth/register
   └─ Body: RegisterDto

3. AuthController.register()
   ├─ Valida DTO (pipes)
   └─ Chama AuthService.register()

4. AuthService.register()
   ├─ Verifica se email já existe
   ├─ Criptografa senha com bcrypt
   └─ Cria usuário no BD

5. Retorna
   ├─ access_token (JWT)
   └─ Dados do usuário
```

### Login

```
1. Usuário preenche login
   └─ email, password

2. Frontend → POST /api/auth/login
   └─ Body: LoginDto

3. AuthController.login()
   ├─ Valida DTO
   └─ Chama AuthService.login()

4. AuthService.login()
   ├─ Busca usuário por email
   ├─ Compara password com hash (bcrypt)
   └─ Se OK, gera JWT

5. Payload do JWT inclui:
   {
     sub: userId,
     email: userEmail,
     iat: timestamp,
     exp: timestamp + 24h
   }

6. Retorna
   ├─ access_token
   └─ Dados do usuário
```

### Acesso a Rotas Protegidas

```
1. Frontend armazena token no localStorage
   └─ Incluir em Authorization header

2. Frontend → GET /api/transactions
   └─ Header: Authorization: Bearer {token}

3. Request atinge middleware

4. JwtAuthGuard ativado
   └─ Extrai token do header
   └─ JwtStrategy.validate() executa
   └─ Valida assinatura do JWT
   └─ Se válido, anexa usuário ao request

5. Controller recebe request com usuário
   └─ Pode acessar request.user

6. Controller chama service
   └─ Service usa userId do request.user

7. Resposta retorna ao frontend
```

## 🗄️ Banco de Dados

### Relacionamentos

```
┌────────────┐
│    User    │
├────────────┤
│ id (PK)    │
│ name       │
│ email      │
│ password   │
│ createdAt  │
│ updatedAt  │
└────────┬───┘
         │ (1:N)
         │
┌────────────────────────┐
│   Transaction          │
├────────────────────────┤
│ id (PK)                │
│ description            │
│ amount                 │
│ type (income/expense)  │
│ userId (FK) ──────────→
│ createdAt              │
│ updatedAt              │
└────────────────────────┘
```

### Queries Importantes

**Buscar usuário por email:**
```typescript
const user = await userRepository.findOne({
  where: { email: 'joao@email.com' }
});
```

**Buscar transações de um usuário:**
```typescript
const transactions = await transactionRepository.find({
  where: { userId: 1 }
});
```

**Calcular totais:**
```typescript
const totalIncome = await transactionRepository
  .createQueryBuilder('t')
  .where('t.userId = :userId', { userId: 1 })
  .andWhere('t.type = :type', { type: 'income' })
  .select('SUM(t.amount)', 'total')
  .getRawOne();
```

## 🎨 Frontend Architecture

### Estrutura HTML

```html
<!DOCTYPE html>
<html>
<head>
  <title>Financeiro API</title>
  <style>/* CSS dos componentes */</style>
</head>
<body>
  <!-- Tela de Login/Registro -->
  <div id="loginContainer">...</div>
  
  <!-- Dashboard Principal -->
  <div id="dashboard" class="dashboard active">
    <!-- Header -->
    <div class="header">...</div>
    
    <!-- Formulário Nova Transação -->
    <div class="form-section">...</div>
    
    <!-- Resumo Financeiro -->
    <div id="summary" class="summary">...</div>
    
    <!-- Tabela de Transações -->
    <div class="table-section">...</div>
  </div>
  
  <script>
    // Lógica da aplicação
  </script>
</body>
</html>
```

### Fluxo de Estados (Frontend)

```
Página Carrega
    ↓
Verifica localStorage (token + usuário)
    ├─ Tem token? → Mostra Dashboard
    └─ Sem token? → Mostra Login/Registro
    
Login/Registro
    ↓
Usuário submete formulário
    ↓
POST para API (/api/auth/register ou /api/auth/login)
    ↓
Resposta com token
    ↓
Armazena em localStorage
    ↓
Mostra Dashboard
    ↓
Carrega Transações
    ↓
GET /api/transactions (com token)
    ↓
Renderiza tabela
    ↓
Usuário interage
    └─ Criar, atualizar, deletar
       └─ Requisições para API
          └─ Atualiza tabela
```

## 📝 Padrões de Projeto

### 1. **MVC (Model-View-Controller)**
- **Model:** Entities (User, Transaction)
- **View:** HTML/CSS/JavaScript
- **Controller:** AuthController, TransactionsController

### 2. **Repository Pattern**
```typescript
// TypeORM automaticamente cria repositories
const userRepository = dataSource.getRepository(User);
```

### 3. **Dependency Injection**
```typescript
@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}
}
```

### 4. **Guard Pattern**
```typescript
@UseGuards(JwtAuthGuard)
@Get('protected-route')
getProtected() { }
```

### 5. **DTO (Data Transfer Object)**
```typescript
export class CreateTransactionDto {
  @IsString() description: string;
  @IsNumber() amount: number;
  @IsEnum(['income', 'expense']) type: string;
}
```

## 🚀 Performance e Otimizações

### Implementadas
- ✅ Índice único em `user.email`
- ✅ Índice em `transaction.userId`
- ✅ TypeORM lazy loading
- ✅ JWT caching

### Recomendadas para Produção
- 🔲 Implementar Redis cache
- 🔲 Rate limiting
- 🔲 Paginação de transações
- 🔲 Compressão gzip
- 🔲 CDN para assets estáticos
- 🔲 Load balancing

## 📊 Diagrama de Sequência - Login

```
Usuario          Browser         NestJS           MySQL
   │               │               │               │
   ├─ digita email ─→               │               │
   │               │               │               │
   ├─ digita senha ─→               │               │
   │               │               │               │
   │               ├─ POST /auth/login ────────────→
   │               │               │               │
   │               │               ├─ findOne(email)
   │               │               ├──────────────→
   │               │               │ ← User data
   │               │               │
   │               │               ├─ compare(pwd)
   │               │               │
   │               │               ├─ sign(JWT)
   │               │               │
   │               │ ← {token, user} ←
   │               │               │
   │               ├─ armazena token (localStorage)
   │               │
   ├─ dashboard ←─ ┘
```

## 📊 Diagrama de Sequência - Criar Transação

```
Usuario          Browser         NestJS           MySQL
   │               │               │               │
   ├─ preenche form ─→              │               │
   │               │               │               │
   │               ├─ POST /transactions ─────────→
   │               │  {auth: Bearer token}         │
   │               │               │               │
   │               │               ├─ validate JWT
   │               │               │
   │               │               ├─ validate DTO
   │               │               │
   │               │               ├─ save(transaction)
   │               │               ├──────────────→
   │               │               │ ← saved transaction
   │               │               │
   │               │ ← {id, ...}  ←
   │               │               │
   │               ├─ recarrega tabela
   │               │
   │               ├─ GET /transactions ──────────→
   │               │               │
   │               │               ├─ find(userId)
   │               │               ├──────────────→
   │               │               │ ← transactions[]
   │               │               │
   │               │ ← [trans...] ←
   │               │
   │ ← exibe tabela ←
```

Essa é a arquitetura completa do projeto! 🎉
