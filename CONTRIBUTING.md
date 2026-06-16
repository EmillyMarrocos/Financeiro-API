# 🤝 Guia de Contribuição

Obrigado por considerar contribuir para o projeto Financeiro-API! Este documento fornece diretrizes e instruções para contribuir.

## 📋 Índice

- [Código de Conduta](#-código-de-conduta)
- [Como Começar](#-como-começar)
- [Processo de Desenvolvimento](#-processo-de-desenvolvimento)
- [Padrões de Código](#-padrões-de-código)
- [Envio de Pull Request](#-envio-de-pull-request)
- [Reportando Bugs](#-reportando-bugs)
- [Sugestões de Funcionalidades](#-sugestões-de-funcionalidades)

---

## 💬 Código de Conduta

Esperamos que todos os contribuidores:

- Sejam respeitosos com outros contribuidores
- Valorizem a comunicação clara e construtiva
- Focarem no código, não em pessoas
- Sejam inclusivos e receptivos a novas ideias
- Ajudem a criar um ambiente positivo

---

## 🚀 Como Começar

### 1. Prepare seu Ambiente

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/Financeiro-API.git
cd Financeiro-API

# Instale as dependências
npm install

# Configure suas variáveis de ambiente
cp .env.example .env

# Configure MySQL
# Siga as instruções em README.md

# Inicie o servidor em modo desenvolvimento
npm run start:dev
```

### 2. Entenda a Estrutura

```
src/
├── auth/           # Autenticação e JWT
├── transactions/   # CRUD de transações
├── users/          # Gerenciamento de usuários
└── main.ts         # Bootstrap da aplicação
```

Leia [ARCHITECTURE.md](ARCHITECTURE.md) para entender a arquitetura completa.

### 3. Familiarize-se com o Projeto

- Leia o [README.md](README.md)
- Consulte a [documentação da API](API.md)
- Explore a [arquitetura](ARCHITECTURE.md)
- Rode os testes existentes: `npm run test`

---

## 🔧 Processo de Desenvolvimento

### 1. Crie uma Branch

Use nomes descritivos e convenções:

```bash
# Feature nova
git checkout -b feature/adicionar-categorias

# Bug fix
git checkout -b bugfix/corrigir-validacao-email

# Documentação
git checkout -b docs/melhorar-setup-guide

# Refatoração
git checkout -b refactor/simplificar-auth-service
```

### 2. Faça Commits Semânticos

Use o padrão Conventional Commits:

```bash
# Feature
git commit -m "feat: adicionar categorias nas transações"

# Bug fix
git commit -m "fix: corrigir validação de email no registro"

# Documentação
git commit -m "docs: atualizar guia de instalação"

# Refatoração
git commit -m "refactor: simplificar lógica de autenticação"

# Tests
git commit -m "test: adicionar testes para AuthService"

# Chore
git commit -m "chore: atualizar dependências"
```

### 3. Escreva Testes

Para cada funcionalidade nova, adicione testes:

```typescript
// exemplo.spec.ts
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthService, /* mocks */],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('deve registrar um novo usuário', async () => {
    const dto = {
      name: 'João',
      email: 'joao@test.com',
      password: 'senha123'
    };

    const result = await service.register(dto);

    expect(result).toBeDefined();
    expect(result.access_token).toBeDefined();
  });
});
```

**Rode os testes:**
```bash
npm run test              # Unit tests
npm run test:e2e         # E2E tests
npm run test:cov         # Com cobertura
```

### 4. Mantenha a Qualidade do Código

```bash
# Lint
npm run lint

# Formato
npm run format

# Verificação estática
npm run lint:fix
```

---

## 📝 Padrões de Código

### NestJS/TypeScript

1. **Use Type Safety**
   ```typescript
   // ✅ Bom
   async register(registerDto: RegisterDto): Promise<{ access_token: string; user: User }> {
     // ...
   }

   // ❌ Evite
   async register(registerDto: any): Promise<any> {
     // ...
   }
   ```

2. **Decoradores do NestJS**
   ```typescript
   // ✅ Use decoradores
   @Controller('auth')
   export class AuthController {
     @Post('login')
     @UseGuards(ValidationPipe)
     login(@Body() loginDto: LoginDto) { }
   }

   // ❌ Evite lógica em controllers
   login(req: Request) {
     // Validação, autenticação, tudo aqui...
   }
   ```

3. **Injeção de Dependência**
   ```typescript
   // ✅ Use constructor injection
   @Injectable()
   export class AuthService {
     constructor(private userRepository: UserRepository) {}
   }

   // ❌ Evite service instantiation
   const repo = new UserRepository();
   ```

4. **DTOs e Validação**
   ```typescript
   // ✅ Use class-validator
   export class CreateTransactionDto {
     @IsString()
     @MaxLength(255)
     description: string;

     @IsNumber()
     @Min(0.01)
     amount: number;

     @IsEnum(['income', 'expense'])
     type: string;
   }
   ```

5. **Tratamento de Erros**
   ```typescript
   // ✅ Use exceções HTTP
   if (!user) {
     throw new NotFoundException('Usuário não encontrado');
   }

   // ❌ Evite
   if (!user) {
     throw new Error('User not found');
   }
   ```

### Nomenclatura

- **Classes:** PascalCase
  ```typescript
  class AuthService { }
  class UserController { }
  ```

- **Métodos/Funções:** camelCase
  ```typescript
  getUserById() { }
  validatePassword() { }
  ```

- **Constantes:** UPPER_SNAKE_CASE
  ```typescript
  const JWT_EXPIRATION = '24h';
  const MAX_LOGIN_ATTEMPTS = 5;
  ```

- **Variáveis:** camelCase
  ```typescript
  const userId = 1;
  const userEmail = 'joao@email.com';
  ```

### Comentários

```typescript
// ✅ Bom: Explica o porquê
// Usamos bcrypt ao invés de plain text por segurança
const hashedPassword = await bcrypt.hash(password, 10);

// ❌ Evite: Óbvio
// Hash da senha
const hashedPassword = await bcrypt.hash(password, 10);
```

---

## 🔄 Envio de Pull Request

### Antes de Enviar

1. **Atualize sua branch com main:**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Teste tudo:**
   ```bash
   npm run lint
   npm run format
   npm run test
   npm run test:e2e
   ```

3. **Verifique a cobertura de testes:**
   ```bash
   npm run test:cov
   ```

### Criando o PR

1. **Push para seu fork:**
   ```bash
   git push origin feature/sua-feature
   ```

2. **Abra um Pull Request** no GitHub

3. **Preencha o template:**
   ```markdown
   ## 📝 Descrição
   Descrição clara do que foi implementado

   ## 🔗 Issues Relacionadas
   Fixes #123

   ## 📸 Screenshots (se aplicável)
   Screenshots de UI changes

   ## ✅ Checklist
   - [ ] Testes passando
   - [ ] Cobertura de testes adequada
   - [ ] Lint sem erros
   - [ ] Documentação atualizada
   - [ ] Commits semânticos
   ```

### Após Enviar

- Responda a comentários de review em até 48 horas
- Faça push de alterações solicitadas
- Não force push após reviews começarem
- Seja respeitoso com feedback

---

## 🐛 Reportando Bugs

### Como Reportar

1. **Verifique se o bug já foi reportado:**
   ```bash
   # Procure nas issues existentes
   ```

2. **Crie um novo issue** com:
   - **Título:** Breve descrição
   - **Descrição:** Contexto do problema
   - **Passos para Reproduzir:** Instruções claras
   - **Comportamento Esperado:** O que deveria acontecer
   - **Comportamento Atual:** O que realmente acontece
   - **Ambiente:** SO, Node.js version, etc.
   - **Logs/Screenshots:** Evidência do problema

### Exemplo de Bom Relatório

```markdown
**Título:** Login falha com email contendo pontos

**Descrição:**
Ao tentar fazer login com um email contendo pontos, a validação falha.

**Passos para Reproduzir:**
1. Vá para a página de login
2. Digite "joao.silva@email.com" (com ponto no nome)
3. Digite a senha correta
4. Clique em Login

**Comportamento Esperado:**
Deve fazer login com sucesso

**Comportamento Atual:**
Erro: "Email inválido"

**Ambiente:**
- SO: Windows 10
- Node.js: v20.0.0
- npm: 9.6.4

**Logs:**
```
[Error] ValidationError: email must be a valid email
```
```

---

## 💡 Sugestões de Funcionalidades

### Como Sugerir

1. **Verifique se já existe:**
   ```bash
   # Procure nas issues e discussions
   ```

2. **Crie uma discussão** descrevendo:
   - **Problema:** Qual problema isso resolve?
   - **Solução:** Como você imaginaria?
   - **Alternativas:** Outras abordagens?
   - **Contexto Adicional:** Exemplos, use cases, etc.

### Exemplo de Boa Sugestão

```markdown
**Título:** Adicionar filtro por data em transações

**Problema:**
Usuários com muitas transações precisam scrollar muito para encontrar 
transações de um período específico.

**Solução Proposta:**
Adicionar campos "Data Inicial" e "Data Final" no dashboard para filtrar 
a tabela de transações.

**Implementação:**
1. Adicionar campos de input (HTML)
2. Criar método no TransactionsService para filtrar por data
3. Adicionar query parameters na API

**Exemplo de Uso:**
GET /api/transactions?startDate=2026-01-01&endDate=2026-12-31
```

---

## 🎯 Áreas com Prioridade

Essas áreas têm maior demanda por contribuições:

- [ ] **Performance:** Otimizações de queries
- [ ] **Testes:** Aumentar cobertura de testes
- [ ] **Documentação:** Melhorias e correções
- [ ] **UI/UX:** Dashboard mais responsivo
- [ ] **Features:** Categorias, recurring transactions
- [ ] **Segurança:** Rate limiting, input sanitization

---

## 📚 Recursos Úteis

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [JWT Guide](https://jwt.io/introduction)
- [Testing NestJS](https://docs.nestjs.com/fundamentals/testing)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## ❓ Dúvidas?

- 📧 Abra uma Discussion
- 💬 Comente em issues relacionadas
- 🔍 Procure na documentação

---

## 🎉 Obrigado!

Sua contribuição faz diferença! Agradeço tempo e esforço dedicados a melhorar este projeto.

**Happy coding! 🚀**
