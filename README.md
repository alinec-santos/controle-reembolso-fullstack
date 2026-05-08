# controle-reembolso-fullstack# Controle de Reembolso Fullstack

Sistema fullstack para gerenciamento de solicitações de reembolso, desenvolvido como desafio técnico para a trilha de desenvolvimento fullstack da Pitang Agile IT.

O sistema permite:
- autenticação com JWT
- controle de acesso por perfil (RBAC)
- criação e gerenciamento de solicitações de reembolso
- aprovação e rejeição por gestores
- controle de pagamento pelo financeiro
- histórico de ações da solicitação
- gerenciamento de categorias
- anexos simulados via URL

---

# Tecnologias Utilizadas

## Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- React Router
- React Hook Form
- Zod
- Axios
- Vitest + React Testing Library

## Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- SQLite
- JWT
- Zod
- Bcrypt
- DayJS
- Jest + Supertest

## DevOps
- Docker
- Docker Compose

---

# Estrutura do Projeto

```txt
controle-reembolso-fullstack/
│
├── backend/
├── frontend/
├── docs/
├── docker-compose.yml
└── README.md
```

---

# Como Rodar o Projeto com Docker (Recomendado)

## Pré-requisitos

- Docker Desktop instalado e aberto na máquina

Download:
https://www.docker.com/products/docker-desktop/

---

## Clonar o projeto

```bash
git clone https://github.com/alinec-santos/controle-reembolso-fullstack.git
```

```bash
cd controle-reembolso-fullstack
```

---

## Rodar a aplicação

```bash
docker compose up --build
```

O Docker irá:
- instalar dependências
- configurar o ambiente
- iniciar frontend e backend
- gerar o banco SQLite
- executar as migrations
- popular o banco automaticamente com seed

---

## Acessar a aplicação

Frontend:
```txt
http://localhost:5173
```

Backend:
```txt
http://localhost:3000
```

---

## Parar os containers

```bash
docker compose down
```

---

# Como Rodar Sem Docker

## Backend

```bash
cd backend
```

Instalar dependências:

```bash
npm install
```

Executar migrations:

```bash
npx prisma migrate dev
```

Popular banco manualmente:

```bash
npx prisma db seed
```

Iniciar backend:

```bash
npm run dev
```

Backend disponível em:

```txt
http://localhost:3000
```

---

## Frontend

Abrir outro terminal:

```bash
cd frontend
```

Instalar dependências:

```bash
npm install
```

Iniciar frontend:

```bash
npm run dev
```

Frontend disponível em:

```txt
http://localhost:5173
```

---

# Variáveis de Ambiente

## Backend (.env)

Criar arquivo `.env` dentro de `backend/`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="secret"
```

---

# Banco de Dados

O projeto utiliza:
- Prisma ORM
- SQLite

---

## Popular banco manualmente

```bash
cd backend
npx prisma db seed
```

Observação:
- com Docker o seed já é executado automaticamente
- sem Docker o seed deve ser executado manualmente

---

## Visualizar banco com Prisma Studio

```bash
cd backend
npx prisma studio
```

---

# Usuários de Teste

## ADMIN

```txt
Email: admin@pitang.com
Senha: 123456
```

---

## GESTOR

```txt
Email: gestor@pitang.com
Senha: 123456
```

---

## FINANCEIRO

```txt
Email: financeiro@pitang.com
Senha: 123456
```

---

## COLABORADOR

```txt
Email: colaborador@pitang.com
Senha: 123456
```

---

# Testes Automatizados

## Backend

```bash
cd backend
npm test
```

Testes incluem:
- autenticação
- regras de negócio
- validações
- RBAC
- fluxos de aprovação/rejeição/pagamento

---

## Frontend

```bash
cd frontend
npm test
```

Testes incluem:
- login
- formulários
- validações
- ações de reembolso
- componentes principais

---

# Testes Manuais da API

A API pode ser testada utilizando:
- Postman
- Insomnia

Collection do Postman:
> Em desenvolvimento

---

# Funcionalidades Implementadas

## Autenticação
- login com JWT
- proteção de rotas
- persistência de autenticação

## Usuários
- cadastro de usuários
- listagem de usuários
- controle por perfil

## Categorias
- criação de categorias
- ativação/inativação

## Solicitações
- criação de solicitação
- edição de rascunho
- cancelamento
- envio para aprovação

## Fluxo Financeiro
- aprovação
- rejeição com justificativa
- marcação como pago

## Histórico
- trilha de auditoria
- registro de ações

## Anexos
- anexos simulados por URL

---

# Documentação

Documentações complementares disponíveis na pasta:

```txt
/docs
```

---

# Autor

Aline Santos

GitHub:
https://github.com/alinec-santos