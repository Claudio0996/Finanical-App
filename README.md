# 💰 Financial App

Aplicativo financeiro completo desenvolvido com React e Node.js, oferecendo funcionalidades de autenticação. Futuramente adicionando funcionalidades de gerenciamento de transações e controle financeiro pessoal.

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

## 🎯 Sobre o Projeto

O Financial App é uma aplicação web full-stack desenvolvida para auxiliar no gerenciamento financeiro pessoal. O projeto consiste em um frontend moderno construído com React e um backend robusto utilizando Node.js e Express, com autenticação segura baseada em JWT.

O projeto está em fase inicial, apenas foi adicionado o registro, login e auto refresh

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
│   │   ├── app/              # Configuração da aplicação
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── features/         # Funcionalidades por domínio
│   │   │   └── auth/         # Módulo de autenticação
│   │   ├── pages/            # Páginas da aplicação
│   │   ├── shared/           # Utilitários compartilhados
│   │   └── themes/           # Configuração de temas
│   ├── public/               # Arquivos estáticos
│   └── package.json
│
└── FinancialAppBackEnd/       # Backend (Node.js)
    ├── config/               # Configurações
    ├── core/                 # Núcleo da aplicação
    ├── features/             # Funcionalidades por domínio
    │   ├── auth/             # Autenticação
    │   ├── security/         # Segurança
    │   ├── token/            # Gerenciamento de tokens
    │   └── user/             # Gerenciamento de usuários
    ├── middlewares/          # Middlewares Express
    ├── models/               # Modelos do banco de dados
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
git clone https://github.com/Claudio0996/Finanical-App
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
JWT_REFRESH_SECRET=seu_refresh_secret_aqui
```

2. Configure a string de conexão do MongoDB:
   - Para MongoDB local: `mongodb://localhost:27017/financial-app`
   - Para MongoDB Atlas: use a string de conexão fornecida pelo Atlas

### Frontend

1. Crie um arquivo `.env` na pasta `FinancialApp` (se necessário):

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

## ✨ Funcionalidades

### Autenticação
- ✅ Registro de novos usuários
- ✅ Login com validação
- ✅ Refresh token automático
- ✅ Rotas protegidas
- ✅ Gerenciamento de sessão


### Segurança
- 🔐 Hash de senhas com bcrypt
- 🛡️ Validação de dados com Zod e Express Validator
- 🔑 Autenticação JWT com refresh tokens
- 🍪 Gerenciamento seguro de cookies

## 📂 Estrutura de Pastas Detalhada

### Frontend (`FinancialApp/src`)

- **`app/`** - Configuração principal (Redux store, rotas, inicializadores)
- **`components/`** - Componentes reutilizáveis (Sidebar, Button, etc.)
- **`features/auth/`** - Módulo completo de autenticação
  - `components/` - Componentes específicos de auth
  - `context/` - Context API e thunks Redux
  - `hooks/` - Custom hooks
  - `pages/` - Páginas de Login e Registro
  - `schemas/` - Schemas de validação Zod
  - `services/` - Serviços de API
  - `storage/` - Gerenciamento de storage local
  - `util/` - Utilitários de autenticação
- **`pages/`** - Páginas principais (Dashboard, Loading)
- **`shared/`** - Utilitários compartilhados
- **`themes/`** - Configuração de temas

### Backend (`FinancialAppBackEnd`)

- **`config/`** - Configurações (banco de dados)
- **`core/`** - Núcleo (cookies, tratamento de erros)
- **`features/`** - Funcionalidades organizadas por domínio
  - `auth/` - Autenticação (controllers, routes, services)
  - `security/` - Serviços de segurança (hash de senhas)
  - `token/` - Gerenciamento de refresh tokens
  - `user/` - Gerenciamento de usuários (models, repositories, services)
- **`middlewares/`** - Middlewares Express
- **`models/`** - Modelos Mongoose (transactions, installments)
- **`util/`** - Utilitários gerais

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

Desenvolvido para gerenciamento financeiro pessoal
