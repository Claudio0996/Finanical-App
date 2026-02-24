# 💰 Financial App

Aplicativo financeiro full-stack desenvolvido com **React (Vite)** e **Node.js/Express + MongoDB**, com autenticação via **JWT** e refresh token via **cookie HTTP-only**. O backend já expõe os domínios financeiros (contas, categorias, transações e saldo); o frontend está em evolução, com base de autenticação e estrutura de rotas/layouts.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Como Executar](#como-executar)
- [Funcionalidades](#funcionalidades)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Domínios Funcionais](#domínios-funcionais)
- [Documentação Completa](#documentação-completa)

## 🎯 Sobre o Projeto

O Financial App é uma aplicação web full-stack desenvolvida para auxiliar no gerenciamento financeiro pessoal. O projeto consiste em um frontend moderno construído com React e um backend robusto utilizando Node.js e Express, com autenticação segura baseada em JWT.

## 🛠️ Tecnologias Utilizadas

### Frontend (`FinancialApp`)
- **React 19** - Biblioteca JavaScript para construção de interfaces
- **Vite** - Build tool e dev server de alta performance
- **Redux Toolkit** - Gerenciamento de estado global
- **React Router** - Roteamento e navegação
- **Material-UI (MUI)** - Componentes de interface
- **Tailwind CSS** - Framework CSS utilitário
- **React Query** - Gerenciamento de dados e cache
- **Zod** - Validação de schemas TypeScript-first
- **JWT Decode** - Decodificação de tokens JWT

### Backend (`FinancialAppBackEnd`)
- **Node.js** - Runtime JavaScript
- **Express** - Framework web para Node.js
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT (jsonwebtoken)** - Autenticação baseada em tokens
- **bcrypt** - Hash de senhas
- **Express Validator** - Validação de dados
- **Cookie Parser** - Gerenciamento de cookies HTTP
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Gerenciamento de variáveis de ambiente

## 📁 Estrutura do Projeto

```
Financial App/
├── FinancialApp/              # Frontend (React)
│   ├── src/
│   │   ├── app/              # Bootstrap, store e roteadores
│   │   │   ├── layouts/      # Layouts (public/authenticated/loading)
│   │   │   └── router/       # Routers (public/private/loading)
│   │   ├── features/         # Features por domínio (em progresso)
│   │   │   ├── auth/         # Auth (register + restore session)
│   │   │   └── transactions/ # Base de listagem/filtros (WIP)
│   │   ├── shared/           # Infra compartilhada (ex.: api client)
│   │   └── themes/           # Tema MUI
│   ├── public/               # Arquivos estáticos
│   └── package.json
│
└── FinancialAppBackEnd/       # Backend (Node.js)
    ├── config/               # Configurações
    ├── core/                 # Núcleo da aplicação
    ├── features/             # Funcionalidades por domínio
    │   ├── auth/             # Autenticação
    │   ├── account/          # Contas financeiras
    │   ├── category/         # Categorias
    │   ├── transaction/      # Transações
    │   ├── balance/          # Cálculo de saldo
    │   ├── security/         # Segurança
    │   ├── token/            # Gerenciamento de tokens
    │   └── user/             # Gerenciamento de usuários
    ├── middlewares/          # Middlewares Express
    ├── util/                 # Utilitários
    └── package.json
```

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **MongoDB** (local ou MongoDB Atlas)

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositório>
cd "Financial App"
```

### 2. Instale as dependências do Frontend

```bash
cd FinancialApp
npm install
```

### 3. Instale as dependências do Backend

```bash
cd ../FinancialAppBackEnd
npm install
```

## ⚙️ Configuração

### Backend

1. Crie um arquivo `.env` na pasta `FinancialAppBackEnd`:

```env
PORT=3000
MONGO_URI=sua_string_de_conexão_mongodb
JWT_SECRET=seu_secret_jwt_aqui
REFRESH_TOKEN_TTL_MS=2592000000
```

`REFRESH_TOKEN_TTL_MS` é o tempo de vida do refresh token em milissegundos (ex.: 30 dias = `2592000000`).

2. Configure a string de conexão do MongoDB:
   - Para MongoDB local: `mongodb://localhost:27017/financial-app`
   - Para MongoDB Atlas: use a string de conexão fornecida pelo Atlas

### Frontend

1. O projeto tem **proxy do Vite** configurado para `/api` → backend (`vite.config.js`). Porém, o código atual também usa chamadas diretas para `http://localhost:3000` em alguns pontos (ex.: refresh/registro).

2. (Opcional) Crie um arquivo `.env` na pasta `FinancialApp` (se você quiser padronizar a base URL no futuro):

```env
VITE_API_URL=http://localhost:3000
```

## ▶️ Como Executar

### Backend

1. Navegue até a pasta do backend:
```bash
cd FinancialAppBackEnd
```

2. Execute o servidor em modo desenvolvimento:
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000` (ou na porta configurada no `.env`)

### Frontend

1. Em um novo terminal, navegue até a pasta do frontend:
```bash
cd FinancialApp
```

2. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173` (porta padrão do Vite)

## ✨ Funcionalidades (estado atual do código)

### Backend (API pronta)
- ✅ **Autenticação**: `POST /register`, `POST /login`, `POST /refresh` com access token JWT e refresh token em cookie HTTP-only
- ✅ **Contas**: CRUD completo de contas por usuário, com unicidade por `(bankId, userId, type)`
- ✅ **Categorias**: CRUD completo por usuário, com unicidade por `(userId, type, name)`
- ✅ **Transações**: criação única e parcelada, listagem com filtros (conta/categoria/tipo/período), edição/exclusão com validação de propriedade
- ✅ **Saldo**: `GET /balance` calcula saldo com base no saldo inicial (quando `accountId` é fornecido) e soma algébrica das transações (`receita` soma, `despesa` subtrai)

### Frontend (em desenvolvimento)
- ✅ **Bootstrap da app**: `AppInitializer` dispara restauração de sessão; `AppRouter` alterna routers (loading/public/private) com base em `authStatus`
- ✅ **Registro**: tela `RegisterPage` com validação via Zod e feedback de erro
- ⚠️ **Login**: rota `/login` existe no router público, mas ainda não possui página/elemento implementado
- ⚠️ **Domínios financeiros no UI**: rotas privadas (`/transactions`, `/accounts`, `/categories`, etc.) existem como placeholders no router privado (sem telas conectadas ainda)

### Segurança
- 🔐 Hash de senhas com bcrypt
- 🛡️ Validação de dados com Zod e Express Validator
- 🔑 Autenticação JWT com refresh tokens
- 🍪 Gerenciamento seguro de cookies HTTP-only

## 📂 Estrutura de Pastas Detalhada

### Frontend (`FinancialApp/src`)

- **`app/`** - Bootstrap, estado global e roteamento
  - `AppRoot.jsx` - Root com `Provider`
  - `AppInitializer.jsx` - Dispara restauração de sessão
  - `AppRouter.jsx` - Seleciona router conforme `authStatus`
  - `store.js` - Redux store
  - `layouts/` - Layouts (public/authenticated/loading)
  - `router/` - Routers (public/private/loading)
- **`features/auth/`** - Autenticação (base)
  - `authSlice.js`, `authThunks.js`, `authService.js`, `registerSchema.js`
  - `pages/RegisterPage.jsx`
- **`features/transactions/`** - Base de transações (WIP)
- **`shared/api/`** - Cliente HTTP (refresh flow + Authorization)
- **`themes/`** - Tema MUI (`index.jsx`)

### Backend (`FinancialAppBackEnd`)

- **Entradas**
  - `app.js` - Middlewares globais (JSON/cookies/CORS) + registro de rotas
  - `index.js` - Carrega `.env` e inicia `startServer(app)`
  - `server.js` - Conecta ao MongoDB e sobe o servidor HTTP
- **`config/`** - MongoDB (`db.js`)
- **`core/`** - Erros e cookies (`errors.js`, `cookies.js`)
- **`middlewares/`** - Auth (`authMiddleware.js`), validação (`schemaValidations.js`) e filtros (`parseTransactionFilters.js`)
- **`features/`** - Domínios (rotas/controllers/services/repositories/models/schemas)
  - `auth/`, `user/`, `token/`, `security/`
  - `account/`, `category/`, `transaction/`, `balance/`
- **`util/`** - Utilitários (`validatePassword.js`, `dateFunctions.js`)

## 🧩 Domínios Funcionais

### Backend - API REST Completa

- **Autenticação (`features/auth`)**
  - `POST /register` - Registro de novos usuários
  - `POST /login` - Login com email e senha
  - `POST /refresh` - Revalidação de sessão via refresh token (cookie `refreshToken`)
  - Serviços para geração e verificação de tokens de acesso
  - Integração com refresh tokens e cookies HTTP-only

- **Usuário (`features/user`)**
  - Criação, busca e manipulação de dados de usuário
  - Validação de email único
  - Validação de senha forte

- **Contas (`features/account`)**
  - `GET /accounts` - Lista todas as contas do usuário
  - `GET /accounts/:id` - Busca conta específica
  - `POST /accounts` - Cria nova conta financeira
  - `PUT /accounts/:id` - Atualiza conta existente
  - `DELETE /accounts/:id` - Remove conta
  - Validação para garantir que cada conta pertence ao usuário autenticado
  - Suporte para tipos: corrente, poupança, investimento
  - Suporte para moedas: BRL, USD

- **Categorias (`features/category`)**
  - `GET /categories` - Lista todas as categorias do usuário
  - `GET /categories/:id` - Busca categoria específica
  - `POST /categories` - Cria nova categoria
  - `PUT /categories/:id` - Atualiza categoria existente
  - `DELETE /categories/:id` - Remove categoria
  - CRUD completo de categorias de receita/despesa
  - Verificações para garantir coerência do tipo de categoria com o tipo de transação
  - Personalização de cores

- **Transações (`features/transaction`)**
  - `POST /transactions` - Cria transação única
  - `POST /transactions/installments` - Cria transações parceladas
  - `GET /transactions` - Lista transações com filtros (conta, período, categoria, tipo)
  - `PUT /transactions/:id` - Atualiza transação existente
  - `DELETE /transactions/:id` - Remove transação
  - Criação de transações únicas e parceladas
  - Cálculo automático de parcelas (valores e datas)
  - Agrupamento de transações parceladas
  - Atualização, listagem e exclusão de transações do usuário
  - Integração completa com contas e categorias

- **Saldo (`features/balance`)**
  - `GET /balance` - Calcula saldo com filtros (conta, período)
  - Cálculo de saldo total por conta
  - Cálculo de saldo por período específico
  - Cálculo de saldo até uma data específica
  - Integração completa com sistema de transações

- **Tokens (`features/token`)**
  - Geração, rotação, revogação e persistência de refresh tokens
  - Rotação automática de tokens para segurança

- **Segurança (`features/security`)**
  - Serviços de hash e comparação de senha com bcrypt
  - Suporte para pepper opcional

## 🔌 API Endpoints

### Autenticação
- `POST /register` - Registro de usuário
- `POST /login` - Login de usuário
- `POST /refresh` - Revalidação de sessão

### Contas
- `GET /accounts` - Lista todas as contas do usuário
- `GET /accounts/:id` - Busca conta específica
- `POST /accounts` - Cria nova conta
- `PUT /accounts/:id` - Atualiza conta
- `DELETE /accounts/:id` - Remove conta

### Categorias
- `GET /categories` - Lista todas as categorias do usuário
- `GET /categories/:id` - Busca categoria específica
- `POST /categories` - Cria nova categoria
- `PUT /categories/:id` - Atualiza categoria
- `DELETE /categories/:id` - Remove categoria

### Transações
- `POST /transactions` - Cria transação única
- `POST /transactions/installments` - Cria transações parceladas
- `GET /transactions` - Lista transações (suporta filtros: `accountId`, `categoryId`, `type`, `initialDate`, `finalDate`)
- `PUT /transactions/:id` - Atualiza transação
- `DELETE /transactions/:id` - Remove transação

### Saldo
- `GET /balance` - Calcula saldo (suporta filtros: `accountId`, `initialDate`, `finalDate`)

**Nota:** Todas as rotas (exceto `/register`, `/login` e `/refresh`) requerem autenticação via header `Authorization: Bearer <token>`.

## 📚 Documentação Completa

Para uma visão mais detalhada da arquitetura, fluxos e regras de negócio (separando frontend e backend), consulte os arquivos:

- **`DOCUMENTACAO_PROJETO.md`** – documentação técnica completa do projeto
- **`REQUISITOS_E_REGRAS_DE_NEGOCIO.md`** – requisitos funcionais e regras de negócio do backend

## 🧪 Scripts Disponíveis

### Frontend
- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run lint` - Executa o linter
- `npm run preview` - Preview do build de produção

### Backend
- `npm run dev` - Inicia o servidor com nodemon (hot reload)
- `npm test` - Executa testes (a implementar)

## 📝 Notas de Desenvolvimento

- O projeto utiliza **React Compiler** para otimizações automáticas
- O frontend está configurado com **ESLint** para manter qualidade de código
- A arquitetura segue o padrão de **Feature-Based Structure** para melhor organização
- O backend utiliza **Repository Pattern** para abstração de acesso a dados

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.

## 👤 Autor

**Claudio**

---

Desenvolvido com ❤️ para gerenciamento financeiro pessoal