## 📘 Documentação do Projeto – Financial App

Este documento descreve a arquitetura, os fluxos principais e as funcionalidades do projeto **Financial App**, separando claramente a visão de **Frontend** e **Backend**.

---

## 1. Visão Geral

O Financial App é uma aplicação web para **gestão financeira pessoal**, com:

- **Frontend** em React (Vite, Redux Toolkit, React Router, MUI, Tailwind).
- **Backend** em Node.js/Express com MongoDB (Mongoose), autenticação JWT, refresh token e domínios financeiros (contas, categorias, transações e saldo).

O objetivo é permitir que o usuário:

- Crie uma conta e faça login.
- Mantenha sessão autenticada com refresh token.
- Gerencie **contas financeiras**, **categorias** e **transações** (incluindo parceladas).
- Calcule e consulte **saldos** por conta e período (no backend, pronto para ser consumido pelo front).

---

## 2. Arquitetura em Alto Nível

- **Frontend (`FinancialApp/`)**
  - SPA em React.
  - Gerenciamento de estado global com Redux Toolkit.
  - Fluxo de autenticação completo (login, cadastro, restauração de sessão, rotas protegidas).
  - Dashboard autenticado (hoje simples, pronto para evoluir para visão financeira completa).

- **Backend (`FinancialAppBackEnd/`)**
  - API REST em Express.
  - Organizado por **domínios/feature**: `auth`, `user`, `account`, `category`, `transaction`, `balance`, `token`, `security`.
  - Camadas: **rotas → middlewares → controllers → services → repositories/models → MongoDB**.
  - Segurança com:
    - **JWT de acesso** (15 minutos).
    - **Refresh token** persistido no banco e enviado por cookie HTTP-only.
    - Validação de schemas com função `validate(schema)` (ex.: zod).

---

## 3. Fluxo Geral de Autenticação (End-to-End)

### 3.1. Frontend

**Arquivos principais:**

- `src/app/AppRoot.jsx`
- `src/app/AppInitializer.jsx`
- `src/app/AppRouter.jsx`
- `src/app/store.js`
- `src/app/router/publicRouter.jsx`
- `src/app/router/privateRouter.jsx`
- `src/app/router/loadingRouter.jsx`
- `src/features/auth/authSlice.js`
- `src/features/auth/authThunks.js`
- `src/features/auth/authService.js`
- `src/features/auth/registerSchema.js`
- `src/features/auth/pages/RegisterPage.jsx`

**Sequência:**

1. **Inicialização da app**
   - O componente raiz é o `AppRoot`, que monta:
     - `AppInitializer` (dispara `restoreSessionThunk()` no `useEffect`)
     - `AppRouter` (seleciona o router ativo conforme `authStatus`)

2. **Restauração de sessão (`restoreSessionThunk`)**
   - `restoreSessionThunk` chama `refresh()` (`authService.js`), que faz:
     - `POST http://localhost:3000/refresh` com `credentials: "include"` (usa o cookie `refreshToken` do backend).
   - Se sucesso:
     - O Redux atualiza `token`, `user` e `authStatus = "authenticated"`.
   - Se falha:
     - `authStatus = "unauthenticated"`, forçando o usuário a logar novamente.

3. **Roteamento (public/private/loading)**
   - `AppRouter` seleciona um router conforme `authStatus`:
     - `"checking"` → `loadingRouter` (layout de loading)
     - `"unauthenticated"` → `publicRouter` (layout público)
     - `"authenticated"` → `privateRouter` (layout autenticado)
   - `publicRouter` hoje renderiza `RegisterPage` como rota index (`/`). A rota `/login` existe como path, mas ainda não possui elemento implementado.
   - `privateRouter` define paths (`/transactions`, `/accounts`, `/categories`, etc.) como placeholders (sem páginas implementadas ainda).

4. **Login (em desenvolvimento)**
   - O backend possui `POST /login`, porém o frontend ainda não contém uma tela/fluxo de login implementado no código atual.

5. **Registro (Cadastro)**
   - Tela: `RegisterPage.jsx`.
   - `registerThunk` chama `register(payload)` (`authService.js`):
     - Valida o payload com `registerSchema` (Zod).
     - Faz `POST http://localhost:3000/register` com JSON.
     - Em caso de erro HTTP, lê `error.message` do backend e salva no Redux como `registerError`.

6. **Logout**
   - A action `logout` do slice `auth` limpa `token`, `user` e marca `authStatus = "unauthenticated"`.
   - Pode ser usada em botões de sair no futuro (ex.: no `Sidebar` ou `Dashboard`).

---

## 4. Documentação do Frontend

### 4.1. Stack e Estrutura

- **Stack principal**
  - React 19 (com React Compiler).
  - Vite como bundler/dev server.
  - Redux Toolkit (`configureStore`, `createSlice`, `createAsyncThunk`).
  - React Router para SPA e rotas protegidas.
  - Material UI + Tailwind CSS para UI.
  - Zod para validação de dados (payloads e respostas da API).

- **Pontos de entrada**
  - `main.jsx`: monta a aplicação (`ThemeProvider`) e renderiza `AppRoot`.
  - `AppRoot.jsx`: conecta o Redux Provider e monta `AppInitializer` + `AppRouter`.
  - `AppInitializer.jsx`: dispara `restoreSessionThunk()` no `useEffect`.
  - `AppRouter.jsx`: alterna entre routers (loading/public/private) conforme `authStatus`.

### 4.2. Estado Global – Auth

**Arquivo:** `src/features/auth/authSlice.js`

- **Estado inicial (`initialState`)**
  - `token`: JWT de acesso.
  - `user`: dados públicos do usuário autenticado.
  - `authStatus`: `"checking" | "authenticated" | "unauthenticated"`.
  - `logoutReason`: motivo de logout (quando aplicável).
  - `registerStatus`: status do cadastro.
  - `registerError`: erro do cadastro.
  - `loginStatus`/`loginError`: previstos, mas o fluxo de login ainda está em desenvolvimento no código atual.

- **Reducers**
  - `logout`: limpa `token`, `user`, e seta `authStatus = "unauthenticated"`.
  - `updateToken`: atualiza o access token (usado no refresh flow do `apiClient`).
  - `clearLoginError`: limpa `loginError`.
  - `clearRegisterError`: limpa `registerError`.

- **ExtraReducers (thunks)**
  - `restoreSessionThunk`:
    - `pending` → `authStatus = "checking"`.
    - `fulfilled` → restaura `token`, `user`, marca `authenticated`.
    - `rejected` → `authStatus = "unauthenticated"`.
  - `registerThunk`:
    - `fulfilled` → armazena `token`, `user`, marca `authenticated`.
    - `rejected` → `authStatus = "unauthenticated"`, seta `registerError`.

### 4.3. Componentes e Páginas Relevantes

- **`RegisterPage.jsx`**
  - Formulário de cadastro com campos `name`, `email`, `password`, `passwordConfirmation`.
  - Validação com Zod (`registerSchema`) e feedback via `Snackbar`.
- **Layouts**
  - `PublicLayout.jsx`: container centralizado para páginas públicas.
  - `AuthenticatedLayout.jsx`: layout base para rotas privadas (placeholder).
  - `LoadingPage.jsx`: layout exibido durante `authStatus = "checking"`.

### 4.4. Comportamento Esperado do Frontend

- Sempre que o usuário abre a aplicação:
  - O front tenta restaurar sessão com `POST http://localhost:3000/refresh` (cookie `refreshToken`).
  - Se houver refresh token válido:
    - Usuário é automaticamente autenticado e redirecionado para `/`.
  - Se não houver:
    - O router público é ativado (no estado atual, a rota index renderiza o cadastro).

- Ao se registrar:
  - O token de acesso é guardado no Redux.
  - O refresh token fica em cookie HTTP-only, controlado pelo backend.
  - O router privado é ativado após autenticação.

---

## 5. Documentação do Backend

### 5.1. Stack e Organização

- **Stack**
  - Node.js + Express.
  - MongoDB + Mongoose.
  - JWT (`jsonwebtoken`) para tokens de acesso.
  - `bcrypt` para hash de senhas.
  - `cookie-parser` para manipular cookies.
  - `zod` (ou similar) para validação de schemas.

- **Estrutura por domínios (`features/`)**
  - `auth/` – autenticação e sessão.
  - `user/` – gerenciamento de usuário.
  - `account/` – contas financeiras.
  - `category/` – categorias de transação (ex.: receita, despesa).
  - `transaction/` – transações únicas e parceladas.
  - `balance/` – cálculo de saldos.
  - `token/` – refresh tokens.
  - `security/` – serviços de segurança (senhas).

- **Arquivos centrais**
  - `app.js`:
    - Configura middlewares globais:
      - `bodyParser.json()`
      - `cookieParser()`
      - `cors` com origem `http://localhost:5173` e `credentials: true`.
    - Registra rotas:
      - `authRoutes` - Autenticação (register, login, refresh)
      - `categoryRoutes` - Categorias (CRUD completo)
      - `accountRoutes` - Contas financeiras (CRUD completo)
      - `transactionsRoutes` - Transações (CRUD completo + parceladas)
      - `balanceRoutes` - Cálculo de saldos
  - `index.js`:
    - Carrega `.env`, cria app e chama `startServer(app)`.
  - `server.js`:
    - Conecta ao MongoDB (`connectDb`) e inicia o servidor na `PORT` do `.env`.

### 5.2. Domínio: Autenticação (`features/auth`)

**Rotas: `features/auth/routes/authRoutes.js`**

- `POST /register`
  - Middlewares:
    - `validate(User)` – valida payload de cadastro com schema de usuário.
  - Controller: `registerUser`.

- `POST /login`
  - Middlewares:
    - `validate(loginSchema)` – valida email/senha.
  - Controller: `loginUser`.

- `POST /refresh`
  - Sem validação de body (usa cookie).
  - Controller: `refreshSession`.

**Controller: `features/auth/controller/authController.js`**

- `registerUser`:
  - Recebe `name`, `email`, `password`.
  - Chama `authService.registerUser`.
  - Recebe: `user`, `token` (access token), `refreshToken` persistido.
  - Usa `sendRefreshCookie` para setar cookie `refreshToken` (HTTP-only, com `expires`).
  - Resposta `201`:
    - `{ success: true, message, data: { user, token } }`.

- `loginUser`:
  - Recebe `email`, `password`.
  - Chama `authService.loginUser`.
  - Seta cookie de refresh novamente.
  - Resposta `200`:
    - `{ success: true, message, data: { user, token } }`.

- `refreshSession`:
  - Lê `refreshToken` de `req.cookies`.
  - Se inexistente, lança erro.
  - Chama `authService.refreshSession(oldRefreshToken)`.
  - Atualiza cookie com novo refresh token.
  - Resposta `200`:
    - `{ success: true, message: "Token revalidado", data: { user, token } }`.

**Service: `features/auth/service/authService.js`**

- `loginUser({ inputEmail, inputPassword })`:
  - Busca usuário por email via `userService.findUserByEmail`.
  - Compara senha com `passwordService.comparePassword`.
  - Gera access token (`accessTokenService.generateAccessToken(user._id, "admin")`).
  - Cria refresh token (`refreshTokenService.generateTokenObject` + `persistTokenObject`).
  - Retorna:
    - `{ user: publicUser, token: accessToken, refreshToken: persistedToken }`.

- `registerUser({ inputName, inputEmail, inputPassword })`:
  - Cria usuário via `userService.createUser`.
  - Retira campo `password` do objeto retornado.
  - Gera access token e refresh token (mesma lógica do login).

- `refreshSession(oldRefreshToken)`:
  - Usa `refreshTokenService.rotateToken` para:
    - Verificar validade do token antigo.
    - Gerar novo token e persistir.
  - Busca usuário associado (`userService.findUserById`).
  - Gera novo access token.
  - Retorna `{ user: safeUser, accessToken, refreshToken: newRefreshToken }`.

**Service de token: `features/token/services/refreshTokenSerivce.js`**

- Responsável por:
  - Gerar `tokenString` criptograficamente seguro (`crypto.randomBytes`).
  - Criar objetos de refresh token com:
    - `userId`, `token`, `userAgent`, `ipAddress`, `expiresAt`.
  - Persistir token com `save`.
  - Encontrar tokens válidos (`findValidForRead`).
  - Revogar token ou todos os tokens de um usuário.
  - **Rotacionar** tokens (`rotateTokenAtomic`):
    - Gera novo token string.
    - Atualiza registro de forma atômica.
    - Se falhar → erro de token expirado.

**Service de access token: `features/auth/service/accessTokenService.js`**

- Usa `jsonwebtoken`:
  - `generateAccessToken(userId, roles)`:
    - Cria JWT com payload `{ id: userId, roles }`.
    - Assina com `process.env.JWT_SECRET`.
    - Expira em 15 minutos.
  - `verifyAccessToken(token)`:
    - Valida a assinatura e retorna payload (incluindo `id`).

### 5.3. Middleware de Autenticação (`middlewares/authMiddleware.js`)

- Função `setUserId`:
  - Lê cabeçalho `Authorization`.
  - Espera formato: `Bearer <token>`.
  - Valida token com `AccessTokenService.verifyAccessToken(token)`.
  - Seta `req.userId` com o `id` do payload.
  - Em caso de erro:
    - Loga mensagem.
    - Responde `401` com `{ success: false, message: "token inválido ou expirado", data: null }`.

Esse middleware é usado nas rotas de **contas**, **categorias** e provavelmente **transações** e **saldo**, garantindo que apenas recursos do próprio usuário sejam acessados.

### 5.4. Validação de Schemas (`middlewares/schemaValidations.js`)

- Função `validate(schema)`:
  - Chama `schema.parse(req.body)` (ex.: schema Zod).
  - Se sucesso:
    - Substitui `req.body` pelos dados validados.
    - Chama `next()`.
  - Se falha:
    - Retorna `422` com:
      - `{ message: err.errors || "Dados inválidos" }`.

Usado em rotas como:

- `/register`
- `/login`
- `/accounts`
- `/categories`

garantindo integridade dos dados de entrada.

### 5.5. Domínio: Contas (`features/account`)

**Rotas: `features/account/routes/accountRoutes.js`**

- `GET /accounts/:id` – Busca uma conta específica.
- `GET /accounts` – Lista todas as contas do usuário autenticado.
- `POST /accounts` – Cria nova conta.
- `PUT /accounts/:id` – Atualiza uma conta existente.
- `DELETE /accounts/:id` – Remove uma conta.

Todas usam:

- `setUserId` para amarrar a requisição ao usuário logado.
- `validate(accountSchema)` em operações que recebem body (create/update).

**Controller: `features/account/controllers/accountController.js`**

- `createAccount(userId, accountData)`:
  - Encaminha para `AccountService.createAccount`.
  - Retorna `201` com a conta criada.

- `getAccount(accountId, userId)`:
  - Busca uma conta específica do usuário.

- `getAccounts(userId)`:
  - Retorna todas as contas do usuário.

- `updateAccount(accountId, userId, accountData)`:
  - Atualiza conta do usuário.

- `deleteAccount(accountId, userId)`:
  - Deleta conta do usuário.

Todos os métodos:

- Tratam erros com logs e retornam `{ success: false, message: err.message, data: null }` com status adequado.

**Service: `features/account/services/accountService.js`**

- `createAccount(userId, accountData)`:
  - Verifica se já existe conta com a mesma combinação `(bankId, userId, type)` via `Account.findByIndex`.
  - Se existir, lança `conflictError("Conta já existe")`.
  - Cria nova conta com o `userId` associado.

- `updateAccount(accountData, id, userId)`:
  - Busca a conta.
  - Verifica se pertence ao usuário (`existingAccount.userId.toString() === userId`).
  - Atualiza via `Account.updateAccount`.

- `deleteAccount(id, userId)`:
  - Verifica existência.
  - Verifica propriedade (usuário dono).
  - Deleta via `Account.deleteById`.

- `getAccount(id, userId)`:
  - Verifica existência e propriedade; retorna conta.

- `getAccounts(userId)`:
  - Retorna todas as contas do usuário via `Account.findAccount(userId)`.

### 5.6. Domínio: Categorias (`features/category`)

**Rotas: `features/category/routes/categoryRoutes.js`**

- `GET /categories/:id`
- `GET /categories/`
- `POST /categories`
- `PUT /categories/:id`
- `DELETE /categories/:id`

Com:

- `setUserId`: garante que só o dono acesse/edite.
- `validate(CategorySchema)`: valida body em criação/atualização.

**Controller: `features/category/controllers/categoryController.js`**

- `createCategory(userId, categoryData)` – cria categoria para o usuário.
- `getCategory(categoryId, userId)` – retorna uma categoria específica.
- `getCategories(userId)` – retorna todas do usuário.
- `updateCategory(categoryId, userId, categoryData)` – atualiza categoria.
- `deleteCategory(categoryId, userId)` – exclui categoria.

Cada método retorna sempre um JSON com `{ success, message, data }` e trata erros de forma consistente.

**Service: `features/category/services/categoryService.js`**

- Responsável por:
  - Garantir que a categoria pertence ao usuário.
  - Garantir coerência de tipo (ex.: tipo de categoria compatível com transações).
  - Encapsular regras de negócio antes dos repositórios.

### 5.7. Domínio: Transações e Parcelas (`features/transaction`)

**Rotas: `features/transaction/routes/transactionRoutes.js`**

- `POST /transactions`
  - Middlewares:
    - `validate(singleTransactionSchema)` – valida payload de transação única.
    - `setUserId` – autenticação obrigatória.
  - Controller: `createSingleTransaction`.

- `POST /transactions/installments`
  - Middlewares:
    - `validate(multipleTransactionSchema)` – valida payload de transação parcelada.
    - `setUserId` – autenticação obrigatória.
  - Controller: `createMultipleTransactions`.

- `GET /transactions`
  - Middlewares:
    - `setUserId` – autenticação obrigatória.
  - Controller: `getTransactions`.
  - Suporta query parameters para filtros: `accountId`, `categoryId`, `type`, `initialDate`, `finalDate`.

- `PUT /transactions/:id`
  - Middlewares:
    - `setUserId` – autenticação obrigatória.
    - `validate(singleTransactionSchema)` – valida payload de atualização.
  - Controller: `updateTransaction`.

- `DELETE /transactions/:id`
  - Middlewares:
    - `setUserId` – autenticação obrigatória.
  - Controller: `deleteTransaction`.

**Controller: `features/transaction/controllers/transactionController.js`**

- `createSingleTransaction(userId, transactionData)`:
  - Encaminha para `TransactionService.createSingleTransaction`.
  - Retorna `201` com a transação criada.

- `createMultipleTransactions(userId, transactionData)`:
  - Encaminha para `TransactionService.createMultipleTransaction`.
  - Retorna `201` com array de transações criadas (parcelas).

- `getTransactions(userId, filters)`:
  - Encaminha para `TransactionService.getTransaction` com filtros da query string.
  - Retorna `200` com lista de transações.

- `updateTransaction(transactionId, userId, updatedData)`:
  - Encaminha para `TransactionService.updateTransaction`.
  - Retorna `200` com transação atualizada.

- `deleteTransaction(transactionId, userId)`:
  - Encaminha para `TransactionService.deleteTransaction`.
  - Retorna `200` com transação removida.

Todos os métodos tratam erros com logs e retornam `{ success: false, message: err.message, data: null }` com status adequado.

**Service: `features/transaction/services/transactionService.js`**

- `createSingleTransaction(transactionData, userId)`:
  - Verifica se a conta (`accountId`) pertence ao usuário via `AccountService.getAccount`.
  - Verifica se a categoria (`categoryId`) pertence ao usuário via `CategoryService.getCategory`.
  - Garante que `transactionData.type === category.type` (ex.: receita x despesa).
  - Cria transação única via `TransactionRepository.createSingleTransaction`.

- `createMultipleTransaction(transactionData, userId)`:
  - Similar à transação única, mas:
    - Calcula valor de cada parcela com:
      - `value = (amount / totalInstallments).toFixed(2)`.
    - Gera `installmentGroupId` (UUID).
    - Para `i` de `0` a `totalInstallments - 1`:
      - Cria transação com:
        - `installmentNumber`
        - `date` calculada por `getInstallmentDate(transactionData.date, i)`
        - `amount` (valor da parcela)
        - `installmentGroupId`
        - `userId`
    - Persiste todas com `TransactionRepository.createManyTransactions`.

- `getTransactions(filters, userId)`:
  - Se `filters.accountId` existir, valida a conta com `AccountService.getAccount`.
  - Busca lista de transações com `TransactionRepository.find({ ...filters, userId })`.

- `updateTransaction(id, data, userId)`:
  - Busca transação por ID.
  - Garante que pertence ao usuário.
  - Garante que `data.type` é igual ao tipo original.
  - Se `accountId` mudou, valida nova conta.
  - Se `categoryId` mudou, valida nova categoria.
  - Atualiza via `TransactionRepository.updateTransaction`.

- `deleteTransaction(id, userId)`:
  - Busca transação.
  - Garante propriedade.
  - Deleta com `TransactionRepository.deleteById`.

### 5.8. Domínio: Saldo (`features/balance`)

**Rotas: `features/balance/routes/ballanceRoutes.js`**

- `GET /balance`
  - Middlewares:
    - `setUserId` – autenticação obrigatória.
    - `parseTransactionFilter(TransactionQuerySchema)` – parseia e valida filtros da query string.
  - Controller: `getBalance`.
  - Suporta query parameters: `accountId` (obrigatório), `initialDate`, `finalDate`.

**Controller: `features/balance/controllers/balanceController.js`**

- `getBalance(userId, balanceFilters)`:
  - Encaminha para `BalanceService.getBalance`.
  - Retorna `200` com objeto contendo o saldo calculado.

Trata erros com logs e retorna `{ success: false, message: err.message, data: null }` com status adequado.

**Service: `features/balance/services/balanceService.js`**

- Função interna `calculateBalance(initialBalance, transactions)`:
  - Percorre transações:
    - Se `type === "income"` → soma `amount`.
    - Senão (despesa) → subtrai `amount`.
  - Retorna `initialBalance + sumTransactions`.

- `getBalance(userId, filters)`:
  - Valida que `filters.accountId` existe e pertence ao usuário via `AccountService.getAccount`.
  - Se `filters.initialDate` e `filters.finalDate` existirem:
    - Busca transações no período via `TransactionRepository.find`.
    - Calcula saldo no período usando `calculateBalance`.
  - Se apenas `filters.initialDate` existir (ou nenhuma data):
    - Busca todas as transações até a data (ou todas se não houver data).
    - Calcula saldo total ou até a data especificada.
  - Retorna objeto com saldo calculado.

Função interna `calculateBalance(initialBalance, transactions)`:
  - Percorre transações:
    - Se `type === "income"` → soma `amount`.
    - Senão (despesa) → subtrai `amount`.
  - Retorna `initialBalance + sumTransactions`.

Essas funções preparam os dados que podem ser consumidos pelo frontend para:

- Gráficos de evolução de saldo.
- Relatórios por período.
- Dashboard de visão geral.

### 5.9. Segurança e Senhas (`features/security`)

- `passwordService`:
  - Responsável por:
    - Gerar hashes de senha (provavelmente com `bcrypt.hash`).
    - Comparar senhas em texto com hashes (`bcrypt.compare`).
  - Integrado a `authService` e `userService` para:
    - Armazenar senhas de forma segura.
    - Validar credenciais de login.

### 5.10. Cookies de Refresh (`core/cookies.js`)

- `sendRefreshCookie(res, refreshToken, expiration)`:
  - Seta cookie `refreshToken` com:
    - `httpOnly: true` (não acessível via JS no navegador).
    - `path: "/"`.
    - `expires: expiration` (timestamp calculado via TTL configurado no `.env`).

Isso garante:

- Menor exposição do refresh token (não fica em `localStorage`/`sessionStorage`).
- Possibilidade de revalidar sessão com segurança via `/refresh`.

---

## 6. Fluxo Completo Exemplo (Login e Acesso a Contas)

1. Usuário acessa `http://localhost:5173/`.
2. `AppInitializer` dispara `restoreSessionThunk`, que chama `POST http://localhost:3000/refresh`:
   - Se existir cookie de refresh válido → usuário autenticado, vai para `/`.
   - Se não existir → `authStatus = "unauthenticated"` e o `publicRouter` é ativado (no código atual, o index renderiza o cadastro).
3. Usuário se registra em `/` (rota index pública no estado atual):
   - Front envia `POST http://localhost:3000/register` com dados do usuário.
   - Backend valida dados, cria usuário, gera access token e refresh token.
   - Backend responde com `{ user, token }` e seta cookie `refreshToken`.
   - Front salva `token` e `user` no Redux e ativa o router privado.
4. Para acessar recursos protegidos (ex.: `/accounts`):
   - Front envia requisição ao backend com header `Authorization: Bearer <token>`.
   - Backend executa `setUserId`, valida token e seta `req.userId`.
   - Controllers de `account`, `category`, `transaction` usam `req.userId` para filtrar/validar dados.

---

## 7. Variáveis de Ambiente Importantes

### Backend

- `PORT` – Porta HTTP do servidor (ex.: `3000`).
- `MONGO_URI` – String de conexão com MongoDB.
- `JWT_SECRET` – Segredo para assinar tokens de acesso.
- `REFRESH_TOKEN_TTL_MS` – Tempo de vida do refresh token em milissegundos.

### Frontend

- `VITE_API_URL` – Base da API (ex.: `http://localhost:3000`), utilizada para configurar proxy ou chamadas diretas.

---

## 8. Pontos de atenção (WIP)

- O frontend ainda não possui tela/fluxo de **login** implementado (rota `/login` existe como placeholder).
- No backend, `authService.refreshSession` retorna `accessToken`, mas o controller responde `data.token` (padronizar para evitar `token` indefinido no refresh).
- No cadastro via frontend, a chamada de `register()` não envia `credentials: "include"`; isso impede o browser de persistir o cookie `refreshToken` em cenário cross-origin.
- O middleware `parseTransactionFilters` usa `safeParse`, mas não está populando `req.filters` com os filtros validados no formato esperado.

## 9. Como Utilizar Esta Documentação em Word

- Abra o arquivo `DOCUMENTACAO_PROJETO.md` no seu editor.
- Copie todo o conteúdo.
- Cole em um documento do Word.
- Opcionalmente:
  - Ajuste estilos de título (Heading 1, Heading 2, etc.).
  - Adicione sumário automático baseado nos títulos.

Assim você terá uma documentação técnica organizada, pronta para ser compartilhada com outros desenvolvedores ou stakeholders.

