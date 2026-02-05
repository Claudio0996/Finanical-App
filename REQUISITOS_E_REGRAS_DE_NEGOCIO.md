# Requisitos e Regras de Negócio – Financial App

Documento gerado com base na estrutura atual do **backend** do sistema. Contém os requisitos funcionais implícitos nos domínios e as regras de negócio aplicadas nas camadas de serviço, validação e persistência.

---

## 1. Requisitos do Sistema

### 1.1. Requisitos Funcionais

| ID | Descrição | Domínio |
|----|-----------|---------|
| RF01 | O sistema deve permitir o cadastro de usuários (nome, e-mail e senha). | Usuário / Auth |
| RF02 | O sistema deve permitir o login por e-mail e senha. | Auth |
| RF03 | O sistema deve permitir a revalidação de sessão via refresh token (cookie). | Auth / Token |
| RF04 | O sistema deve permitir o cadastro de contas financeiras por usuário autenticado. | Conta |
| RF05 | O sistema deve permitir listar, editar e excluir contas do usuário autenticado. | Conta |
| RF06 | O sistema deve permitir o cadastro de categorias (receita/despesa) por usuário. | Categoria |
| RF07 | O sistema deve permitir listar, editar e excluir categorias do usuário. | Categoria |
| RF08 | O sistema deve permitir a criação de transações únicas (receita ou despesa) vinculadas a conta e categoria. | Transação |
| RF09 | O sistema deve permitir a criação de transações parceladas com valor total e número de parcelas. | Transação |
| RF10 | O sistema deve permitir listar transações do usuário (com filtros opcionais por conta, período, categoria, tipo). | Transação |
| RF11 | O sistema deve permitir editar e excluir transações do usuário. | Transação |
| RF12 | O sistema deve calcular o saldo de uma conta (total ou em período determinado) com base no saldo inicial e nas transações. | Saldo |

### 1.2. Requisitos Não Funcionais

| ID | Descrição |
|----|-----------|
| RNF01 | Autenticação de rotas protegidas via token JWT no header `Authorization: Bearer <token>`. |
| RNF02 | Refresh token enviado e recebido via cookie HTTP-only. |
| RNF03 | Senhas armazenadas com hash (bcrypt) e, opcionalmente, pepper. |
| RNF04 | Validação de entrada via schemas (ex.: Zod) antes do processamento. |
| RNF05 | Respostas de erro padronizadas com `success`, `message` e `data`. |
| RNF06 | CORS configurado para origem do frontend (ex.: `http://localhost:5173`) com `credentials: true`. |

---

## 2. Regras de Negócio por Domínio

### 2.1. Usuário e Autenticação

| ID | Regra | Onde se aplica |
|----|--------|------------------|
| RN01 | **E-mail único:** Não pode existir mais de um usuário com o mesmo e-mail. | `userService.createUser` |
| RN02 | **Senha forte:** A senha deve conter: ao menos uma letra minúscula, uma maiúscula, um número e um símbolo. | Schema de usuário / `validatePassword` |
| RN03 | **Confirmação de senha:** No cadastro, os campos `password` e `confirmPassword` devem ser iguais. | Schema de usuário (registro) |
| RN04 | **Login:** Só é possível logar com e-mail cadastrado e senha correta; caso contrário, retorna erro de credencial ou usuário não encontrado. | `authService.loginUser` |
| RN05 | **Sessão:** Após login ou registro, o sistema emite um access token (JWT) e um refresh token; o refresh token é persistido e enviado em cookie. | `authController` / `authService` |
| RN06 | **Refresh:** A rota de refresh exige o cookie com o refresh token; o token é rotacionado (antigo revogado, novo emitido) e um novo access token é retornado. | `authService.refreshSession` / `refreshTokenService.rotateToken` |
| RN07 | **Token expirado/revogado:** Refresh token inválido, expirado ou já substituído resulta em erro e não gera nova sessão. | `refreshToken` repository / `findValidForRead` / `rotateTokenAtomic` |

### 2.2. Contas

| ID | Regra | Onde se aplica |
|----|--------|------------------|
| RN08 | **Unicidade por usuário:** Para um mesmo usuário, não pode existir mais de uma conta com a mesma combinação `(bankId, type)` — ex.: uma única conta “corrente” do mesmo `bankId`. | Índice único no modelo `Account` / `accountService.createAccount` |
| RN09 | **Propriedade:** Toda operação (leitura, atualização, exclusão) sobre uma conta deve ser feita apenas pelo dono (`userId` da conta deve coincidir com o usuário autenticado). | `accountService` (getAccount, updateAccount, deleteAccount) |
| RN10 | **Tipos de conta permitidos:** `poupança`, `corrente`, `investimento`. | Schema e modelo `Account` |
| RN11 | **Moedas permitidas:** `BRL` ou `USD`. | Schema e modelo `Account` |
| RN12 | **Saldo inicial:** Deve ser numérico e não negativo. | Schema `accountSchema` |
| RN13 | **Nome da conta:** Mínimo 4 caracteres. | Schema `accountSchema` |

### 2.3. Categorias

| ID | Regra | Onde se aplica |
|----|--------|------------------|
| RN14 | **Unicidade por usuário:** Para um mesmo usuário, não pode existir mais de uma categoria com a mesma combinação `(type, name)` — ex.: uma única categoria “Salário” do tipo “receita”. | Índice único no modelo `Category` / `categoryService.createCategory` |
| RN15 | **Propriedade:** Categorias só podem ser criadas, listadas, alteradas ou excluídas pelo dono (`userId`). | `categoryService` (todas as operações) |
| RN16 | **Tipo de categoria:** Apenas `receita` ou `despesa`. | Schema e modelo `Category` |
| RN17 | **Nome da categoria:** Mínimo 4 caracteres. | Schema `CategorySchema` |
| RN18 | **Cor:** Campo obrigatório (string) para identificação visual. | Schema e modelo `Category` |

### 2.4. Transações

| ID | Regra | Onde se aplica |
|----|--------|------------------|
| RN19 | **Conta e categoria do usuário:** Ao criar ou atualizar uma transação, a conta (`accountId`) e a categoria (`categoryId`) devem existir e pertencer ao usuário autenticado. | `transactionService` (createSingleTransaction, createMultipleTransaction, updateTransaction) |
| RN20 | **Consistência de tipo:** O tipo da transação (`receita` ou `despesa`) deve ser igual ao tipo da categoria escolhida. Ex.: não é permitido criar uma transação do tipo “receita” com uma categoria do tipo “despesa”. | `transactionService` (createSingleTransaction, createMultipleTransaction) |
| RN21 | **Edição de tipo:** Na atualização de uma transação, o tipo da transação não pode ser alterado (“Transações não são do mesmo tipo”). | `transactionService.updateTransaction` |
| RN22 | **Propriedade:** Transações só podem ser listadas, alteradas ou excluídas pelo dono (`userId`). | `transactionService` (getTransactions, updateTransaction, deleteTransaction) |
| RN23 | **Transação única:** Deve ter `type`, `amount` (positivo), `date`, `accountId`, `categoryId` e `description` (mín. 4 caracteres). | Schema `singleTransactionSchema` |
| RN24 | **Transação parcelada:** Deve ter `type`, `totalAmount` (positivo), `installments` (inteiro ≥ 2), `firstDate`, `accountId`, `categoryId` e `description` (mín. 4 caracteres). | Schema `multipleTransactionSchema` |
| RN25 | **Cálculo de parcelas:** O valor de cada parcela é `(valor total / número de parcelas)` arredondado em 2 casas decimais; as datas das parcelas são obtidas somando meses à data inicial (parcela 1 = mês 0, parcela 2 = mês 1, etc.). | `transactionService.createMultipleTransaction` e `getInstallmentDate` |
| RN26 | **Agrupamento de parcelas:** Transações parceladas são agrupadas por `installmentGroupId` (UUID) e possuem `installmentNumber` e `totalInstallments`. | Modelo `Transaction` e `transactionService.createMultipleTransaction` |

### 2.5. Saldo

| ID | Regra | Onde se aplica |
|----|--------|------------------|
| RN27 | **Cálculo do saldo:** O saldo é o saldo inicial da conta mais a soma algébrica das transações: transações do tipo receita somam; transações do tipo despesa subtraem. | `balanceService.calculateBalance` |
| RN28 | **Saldo por conta:** O saldo é sempre calculado para uma conta específica, que deve pertencer ao usuário autenticado. | `balanceService` (getAccountBalance, getAccountBalanceByPeriod, getAccountBalaceUntilPeriod) |
| RN29 | **Saldo em período:** O sistema suporta cálculo de saldo considerando apenas transações em um intervalo de datas ou até uma data. | `balanceService.getAccountBalanceByPeriod` e `getAccountBalaceUntilPeriod` |

*Nota:* No código do `balanceService`, o tipo é tratado como `"income"` para soma; no restante do sistema o tipo é `"receita"`/`"despesa"`. Para consistência, a regra de negócio é: receita soma, despesa subtrai.

### 2.6. Tokens e Segurança

| ID | Regra | Onde se aplica |
|----|--------|------------------|
| RN30 | **Access token:** JWT com tempo de vida limitado (ex.: 15 min), usado no header `Authorization` para rotas protegidas. | `accessTokenService` |
| RN31 | **Refresh token:** Gerado de forma criptograficamente segura, persistido no banco com `userId`, `expiresAt` e, opcionalmente, `userAgent`/`ipAddress`; pode ser revogado ou substituído na rotação. | `refreshTokenService` / modelo `RefreshToken` |
| RN32 | **Rotação de refresh token:** Ao usar o refresh token, o antigo é marcado como revogado e substituído por um novo; apenas um token válido (não revogado, não expirado, não substituído) pode ser usado. | `refreshTokenService.rotateToken` / `refreshToken.rotateTokenAtomic` |
| RN33 | **Hash de senha:** Senha armazenada com bcrypt; pode ser usado pepper (variável de ambiente) e número de rounds configurável. | `passwordService.hashPassword` / `comparePassword` |
| RN34 | **Cookie de refresh:** Enviado com `httpOnly`, `path: "/"` e data de expiração, para reduzir risco de acesso via script no cliente. | `core/cookies.sendRefreshCookie` |

---

## 3. Resumo da Estrutura do Backend (Referência)

- **Auth:** registro, login, refresh; emissão de access token + refresh token em cookie.
- **User:** criação e busca por e-mail/ID; validação de e-mail único e senha forte.
- **Account:** CRUD de contas; unicidade (bankId + userId + type); propriedade por usuário.
- **Category:** CRUD de categorias; unicidade (userId + type + name); propriedade por usuário.
- **Transaction:** transações únicas e parceladas; validação de conta/categoria e tipo; propriedade por usuário.
- **Balance:** cálculo de saldo por conta (total, por período ou até data).
- **Token:** geração, rotação, revogação e persistência de refresh tokens.
- **Security:** hash e comparação de senhas (bcrypt + pepper opcional).

Rotas expostas no `app.js` atualmente: **auth**, **category**, **account**. Os domínios de **transaction** e **balance** possuem regras de negócio implementadas nos serviços e podem ser expostos via novos controllers/rotas quando necessário.

---

*Documento gerado com base no código do backend do Financial App. Para detalhes de fluxos e arquitetura, consulte `DOCUMENTACAO_PROJETO.md`.*
