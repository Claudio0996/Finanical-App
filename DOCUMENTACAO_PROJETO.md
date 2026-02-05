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

- `src/app/AuthInitializer.jsx`
- `src/app/App.jsx`
- `src/app/store.jsx`
- `src/features/auth/context/AuthContext.jsx`
- `src/features/auth/components/ProtectedRoute.jsx`
- `src/features/auth/pages/Login.jsx`
- `src/features/auth/pages/Register.jsx`
- `src/features/auth/context/loginThunk.js`
- `src/features/auth/context/registerThunk.js`
- `src/features/auth/context/restoreSessionThunk.js`
- `src/features/auth/services/loginService.js`
- `src/features/auth/services/registerService.js`
- `src/features/auth/services/refreshService.js`

**Sequência:**

1. **Inicialização da app**
   - O componente raiz é o `AuthInitializer`, que:
     - Lê o estado de autenticação no Redux.
     - Dispara `restoreSessionThunk()` logo ao montar (`useEffect`).
     - Enquanto o estado `authStatus` está `"idle"` ou `"checking"`, o componente não renderiza a SPA (retorna `null`), evitando flickers de tela.

2. **Restauração de sessão (`restoreSessionThunk`)**
   - `restoreSessionThunk` chama `RefreshSession` (`refreshService.js`), que faz:
     - `POST /api/refresh` com `credentials: "include"` (usa o cookie de refresh do backend).
   - Se sucesso:
     - O Redux atualiza `token`, `user` e `authStatus = "authenticated"`.
   - Se falha:
     - `authStatus = "unauthenticated"`, forçando o usuário a logar novamente.

3. **Roteamento e rotas protegidas**
   - `App.jsx` define as rotas com `createBrowserRouter`:
     - `/login` → `LoginPage`
     - `/register` → `RegisterPage`
     - `/` → `ProtectedRoute` (rota raiz protegida), com `DashboardPage` como rota filha `index`.
   - `ProtectedRoute`:
     - Lê `authStatus` do Redux.
     - Se `authStatus` é `"checking"` ou `"idle"` → renderiza `LoadingPage` (tela de carregamento).
     - Se `"unauthenticated"` → redireciona para `/login`.
     - Se `"authenticated"` → renderiza `<Outlet />` (ex.: `DashboardPage`).

4. **Login**
   - Tela: `Login.jsx`
     - Usa `useLoginForm` para gerenciar estado e validação de campos.
     - Dispara `loginThunk({ email, password })` no submit.
   - `loginThunk`:
     - Chama `Login(email, password)` (`loginService.js`).
   - `loginService.js`:
     - Valida o payload com `LoginPayloadSchema.safeParse`.
     - Faz `POST /api/login`:
       - Endpoint configurado como `"/api/login"` (pode estar proxado pelo Vite/servidor).
       - `Content-Type: application/json`
       - `credentials: "include"` para permitir cookie de refresh.
     - Utiliza `checkResponseError` para tratar respostas HTTP de erro.
     - Valida a resposta com `LoginResponseSchema`.
     - Se `success === false` ou schema inválido, lança `Error`.
   - `AuthContext` (slice Redux):
     - `loginThunk.pending` → `loginStatus = "loading"`, limpa erros.
     - `loginThunk.fulfilled` → salva `token` e `user`, `authStatus = "authenticated"`, `loginStatus = "succeeded"`.
     - `loginThunk.rejected` → `authStatus = "unauthenticated"`, `loginStatus = "failed"`, `loginError = action.payload`.
   - Na tela:
     - Se `loginError` existir, mostra mensagem de erro em texto vermelho.
     - Ao alterar campos, se havia erro, chama `clearLoginError()` para limpar.
     - `useEffect` em `Login.jsx` redireciona para `/` assim que `authStatus === "authenticated"`.

5. **Registro (Cadastro)**
   - Tela: `Register.jsx` (similar a login, com mais campos).
   - `registerThunk` chama `Register(name, email, password, confirmPassword)`:
     - `RegisterPayloadSchema.safeParse` valida o corpo.
     - Em caso de erro, é lançado um objeto com `type: "validation"` e `errors` formatados.
     - Faz `POST http://localhost:3000/register` com `credentials: "include"`.
     - Valida a resposta com `RegisterResponseSchema`.
   - `AuthContext`:
     - `registerThunk.fulfilled` → salva `token`, `user`, `authStatus = "authenticated"`.
     - Erros de registro são salvos em `registerError`.

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
  - `main.jsx`: monta a aplicação, conecta o Redux Provider, tema e `AuthInitializer`.
  - `AuthInitializer.jsx`: cuida da restauração de sessão antes de montar o `App`.
  - `App.jsx`: define o roteamento principal.

### 4.2. Estado Global – Auth

**Arquivo:** `src/features/auth/context/AuthContext.jsx`

- **Estado inicial (`initialState`)**
  - `token`: JWT de acesso.
  - `user`: dados públicos do usuário autenticado.
  - `authStatus`: `"idle" | "checking" | "authenticated" | "unauthenticated"`.
  - `loginStatus`: `"idle" | "loading" | "succeeded" | "failed"`.
  - `registerError`: erro da tentativa de cadastro.
  - `loginError`: erro da tentativa de login.

- **Reducers**
  - `logout`: limpa `token`, `user`, `authStatus = "unauthenticated"`, `loginStatus = "idle"`.
  - `clearLoginError`: limpa `loginError`.
  - `clearRegisterError`: limpa `registerError`.

- **ExtraReducers (thunks)**
  - `loginThunk`:
    - `pending` → inicia loading, limpa erros.
    - `fulfilled` → armazena `token`, `user`, marca `authenticated`.
    - `rejected` → marca `unauthenticated`, seta `loginError`.
  - `restoreSessionThunk`:
    - `pending` → `authStatus = "checking"`.
    - `fulfilled` → restaura `token`, `user`, marca `authenticated`.
    - `rejected` → `authStatus = "unauthenticated"`.
  - `registerThunk`:
    - `fulfilled` → armazena `token`, `user`, marca `authenticated`.
    - `rejected` → `authStatus = "unauthenticated"`, seta `registerError`.

### 4.3. Componentes e Páginas Relevantes

- **`Login.jsx`**
  - Formulário com `TextField` do MUI para email/senha.
  - Integração com hook `useForm` para controle de estado e validação onBlur.
  - Feedback de erro de login (`loginError`).
  - Link para a rota de registro.

- **`Register.jsx`**
  - Formulário de cadastro com campos nome/email/senha/confirmar senha.
  - Validação com `RegisterPayloadSchema` no serviço.
  - Exibição de mensagens de erro de validação da API.

- **`ProtectedRoute.jsx`**
  - Wrapper que:
    - Mostra `LoadingPage` enquanto a sessão é checada.
    - Redireciona para `/login` se não autenticado.
    - Renderiza as rotas filhas (`<Outlet />`) se autenticado.

- **`DashboardPage.jsx`**
  - Página inicial após login.
  - Hoje: simples texto `"Autenticado"`, servindo como placeholder para futuras features (gráficos, listas de contas, transações, etc.).

- **`Sidebar.jsx` e componentes de UI**
  - `Sidebar.jsx`: componente para navegação lateral (pode ser usado em layout autenticado).
  - `components/ui/Button.jsx`: abstração de botão customizado (pode ser conectado a MUI/Tailwind).

### 4.4. Comportamento Esperado do Frontend

- Sempre que o usuário abre a aplicação:
  - O front tenta restaurar sessão com `/api/refresh`.
  - Se houver refresh token válido:
    - Usuário é automaticamente autenticado e redirecionado para `/`.
  - Se não houver:
    - Usuário é enviado para `/login`.

- Ao logar ou se registrar:
  - O token de acesso é guardado no Redux.
  - O refresh token fica em cookie HTTP-only, controlado pelo backend.
  - `ProtectedRoute` garante que apenas usuários autenticados acessem rotas protegidas.

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
      - `authRoutes`
      - `categoryRoutes`
      - `accountRoutes`
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

### 5.8. Domínio: Saldo (`features/balance/services/balanceService.js`)

- Função interna `calculateBalance(initialBalance, transactions)`:
  - Percorre transações:
    - Se `type === "income"` → soma `amount`.
    - Senão (despesa) → subtrai `amount`.
  - Retorna `initialBalance + sumTransactions`.

- `getAccountBalance(accountId, userId)`:
  - Valida conta do usuário via `AccountService.getAccount`.
  - Busca todas transações ligadas à conta via `TransactionRepository.find`.
  - Retorna saldo total.

- `getAccountBalanceByPeriod(accountId, userId, initialDate, finalDate)`:
  - Valida conta.
  - Busca transações filtradas por período.
  - Calcula saldo no período.

- `getAccountBalaceUntilPeriod(userId, accountId, date)`:
  - Valida conta.
  - Busca transações até a data fornecida.
  - Calcula saldo até esse momento.

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
2. `AuthInitializer` chama `/api/refresh`:
   - Se existir cookie de refresh válido → usuário autenticado, vai para `/`.
   - Se não existir → `authStatus = "unauthenticated"`, `ProtectedRoute` redireciona para `/login`.
3. Usuário faz login em `/login`:
   - Front envia `POST /api/login` com email/senha.
   - Backend valida dados, busca usuário, verifica senha, gera access token e refresh token.
   - Backend responde com `{ user, token }` e seta cookie `refreshToken`.
   - Front salva `token` e `user` no Redux e redireciona para `/`.
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
- Possível `JWT_REFRESH_SECRET` ou similar (caso queira separar chaves).

### Frontend

- `VITE_API_URL` – Base da API (ex.: `http://localhost:3000`), utilizada para configurar proxy ou chamadas diretas.

---

## 8. Como Utilizar Esta Documentação em Word

- Abra o arquivo `DOCUMENTACAO_PROJETO.md` no seu editor.
- Copie todo o conteúdo.
- Cole em um documento do Word.
- Opcionalmente:
  - Ajuste estilos de título (Heading 1, Heading 2, etc.).
  - Adicione sumário automático baseado nos títulos.

Assim você terá uma documentação técnica organizada, pronta para ser compartilhada com outros desenvolvedores ou stakeholders.

