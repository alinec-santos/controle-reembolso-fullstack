# Arquitetura do Projeto

## Objetivo

Definir a organização do projeto, separando responsabilidades entre backend, frontend e infraestrutura, garantindo escalabilidade, organização e facilidade de manutenção.

---

## Estrutura geral do projeto
controle-reembolso-fullstack/  
├── backend/  
├── frontend/  
├── docs/  
├── docker-compose.yml  
├── .env  


---

# Backend

## Tecnologias

- Node.js
- Express
- TypeScript
- Prisma (ORM)
- JWT (autenticação)
- Zod (validação)
- Jest + Supertest (testes)

---

## Estrutura de pastas


backend/  
├── src/  
│ ├── controllers/  
│ ├── services/  
│ ├── repositories/  
│ ├── middlewares/  
│ ├── routes/  
│ ├── schemas/  
│ ├── utils/  
│ └── app.ts   
├── prisma/  
├── tests/  


---

## Padrão de arquitetura

### Controller
Responsável por:
- receber requisição
- chamar service
- retornar resposta HTTP

---

### Service
Responsável por:
- regras de negócio
- validações de fluxo
- execução das ações

---

### Repository
Responsável por:
- comunicação com o banco de dados
- queries (Prisma)

---

### Middleware
Responsável por:
- autenticação JWT
- controle de permissões (RBAC)
- tratamento de erros

---

### Schema (Zod)
Responsável por:
- validar entrada de dados (body, params, query)

---

## Fluxo de uma requisição
Request → Controller → Service → Repository → Banco
↓
Response

---

# Frontend

## Tecnologias

- React
- TypeScript
- React Router
- Context API
- Axios (ou Fetch)
- Biblioteca de UI (Material UI, Chakra ou similar)
- React Testing Library

---

## Estrutura de pastas


frontend/  
├── src/  
│ ├── pages/  
│ ├── components/  
│ ├── services/  
│ ├── contexts/  
│ ├── routes/  
│ ├── hooks/  
│ └── App.tsx  

---

## Organização

### Pages
Telas principais:
- Login
- Dashboard
- Minhas solicitações
- Aprovações
- Pagamentos

---

### Components
Componentes reutilizáveis:
- botões
- formulários
- tabelas
- modais

---

### Services
Comunicação com a API:
- chamadas HTTP
- tratamento de erros

---

### Contexts
Controle de estado global:
- usuário autenticado
- token JWT
- permissões

---

### Routes
- rotas públicas
- rotas privadas
- proteção por perfil

---

# Integração frontend e backend

- O frontend consome a API via HTTP
- O backend valida requisições e retorna respostas
- O token JWT é armazenado no frontend e enviado nas requisições

---

# Infraestrutura

## Banco de dados

- PostgreSQL (ou outro relacional compatível)

---

## ORM

- Prisma para modelagem, migrations e queries

---

## Docker

- docker-compose para subir:
  - backend
  - banco de dados

---


# Observações importantes

- O backend deve ser responsável por toda regra de negócio
- O frontend deve apenas consumir e exibir dados
- Nenhuma regra crítica deve ficar apenas no frontend