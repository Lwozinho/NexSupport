# 🚀 Sistema de Helpdesk & Chamados

Sistema completo para gestão de chamados de TI, desenvolvido para facilitar a comunicação entre clientes e suporte técnico. O projeto conta com autenticação, controle de permissões (ACL), dashboard de métricas e atualizações em tempo real.

## ✨ Funcionalidades

### 🔐 Autenticação & Segurança
- Login seguro com **JWT (JSON Web Tokens)**.
- Senhas criptografadas com **BCrypt**.
- Rotas protegidas (Middleware de autenticação).

### 👥 Perfis de Acesso (ACL)
- **Cliente:** Abre chamados, visualiza apenas os seus próprios tickets.
- **Técnico:** Visualiza todos os chamados, altera status e visualiza métricas administrativas.

### 🎫 Gestão de Chamados
- Abertura de chamados com **Upload de Imagens**.
- Kanban de acompanhamento (Aberto, Em Andamento, Encerrado).
- Filtro de busca em tempo real (por ID, Assunto ou Cliente).

### 📊 Dashboard Administrativo
- Gráficos interativos com **Recharts**.
- Contadores de chamados por status.
- Cadastro rápido de novos clientes pelo painel do técnico.

## 🛠 Tecnologias Utilizadas

### Backend (API)
- **Node.js** com **Express**
- **TypeScript**
- **Prisma ORM** (Banco de dados)
- **SQLite** (Dev) / **PostgreSQL** (Prod)
- **Multer** (Uploads)

### Frontend (Web)
- **React.js**
- **Vite**
- **Tailwind CSS** (Estilização)
- **Axios** (Consumo de API)
- **Recharts** (Gráficos)

## 🚀 Como rodar o projeto

### Pré-requisitos
Antes de começar, você precisa ter instalado em sua máquina:
- [Node.js](https://nodejs.org/en/)
- [Git](https://git-scm.com)

### 🎲 Rodando o Backend (Servidor)

```bash
# Clone este repositório
$ git clone 

# Acesse a pasta do projeto no terminal/cmd
$ cd backend-helpdesk

# Instale as dependências
$ npm install

# Crie o arquivo .env e configure a JWT_SECRET
$ cp .env.example .env

# Execute as migrações do banco de dados
$ npx prisma migrate dev

# Execute a aplicação em modo de desenvolvimento
$ npm run dev

# O servidor iniciará na porta:3333

### RODANDO O FRONTEND

# Acesse a pasta do projeto web
$ cd painel-chamados

# Instale as dependências
$ npm install

# Execute a aplicação
$ npm run dev

# A aplicação será aberta na porta:5173


📝 Licença
Este projeto está sob a licença MIT.

Feito por Leonardo Nascimento 👋