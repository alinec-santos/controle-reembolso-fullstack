# Contrato da API

## Objetivo

Definir as rotas da API que serão consumidas pelo frontend.

A API deve seguir o padrão REST, usar autenticação JWT, validar dados com Zod e aplicar permissões de acordo com o perfil do usuário.

---

## URL base

/api

---

## Autenticação

Rotas privadas devem receber o token JWT no header:

Authorization: Bearer <token>

---

## Perfis do sistema

- `COLABORADOR`
- `GESTOR`
- `FINANCEIRO`
- `ADMIN`

---

# Auth

## Login

`POST /auth/login`

### Body

```json
{
  "email": "usuario@email.com",
  "password": "123456"
}
```

### Resposta 200

```json
{
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "name": "Nome do Usuário",
    "email": "usuario@email.com",
    "role": "COLABORADOR"
  }
}
```

---

## Buscar usuário autenticado

`GET /auth/me`

**Permissão:** Usuário autenticado

---

# Usuários

## Criar usuário

`POST /users`

**Permissão:** `ADMIN`

---

## Listar usuários

`GET /users`

**Permissão:** `ADMIN`

---

# Categorias

## Criar categoria

`POST /categories`

**Permissão:** `ADMIN`

---

## Listar categorias

`GET /categories`

**Permissão:** Usuário autenticado

---

## Atualizar categoria

`PUT /categories/:id`

**Permissão:** `ADMIN`

---

## Inativar categoria

`PATCH /categories/:id/deactivate`

**Permissão:** `ADMIN`

---

# Solicitações de Reembolso

## Criar solicitação

`POST /reimbursements`

**Permissão:** `COLABORADOR`  
**Regra:** Criada com status `RASCUNHO`

---

## Listar solicitações

`GET /reimbursements`

**Permissão:** Usuário autenticado

**Regra por perfil:**

| Perfil | Visualiza |
|---|---|
| `COLABORADOR` | Próprias |
| `GESTOR` | Enviadas |
| `FINANCEIRO` | Aprovadas |
| `ADMIN` | Todas |

---

## Buscar por ID

`GET /reimbursements/:id`

---

## Editar

`PUT /reimbursements/:id`

**Regra:** Apenas status `RASCUNHO`

---

## Enviar

`PATCH /reimbursements/:id/submit`

**Regra:** `RASCUNHO` → `ENVIADO`

---

## Aprovar

`PATCH /reimbursements/:id/approve`

**Permissão:** `GESTOR`

---

## Rejeitar

`PATCH /reimbursements/:id/reject`

**Permissão:** `GESTOR`  
**Regra:** Obrigatório justificar

---

## Pagar

`PATCH /reimbursements/:id/pay`

**Permissão:** `FINANCEIRO`

---

## Cancelar

`PATCH /reimbursements/:id/cancel`

**Regra:** Apenas status `RASCUNHO`

---

# Status HTTP

| Código | Descrição |
|---|---|
| `200` | Sucesso |
| `201` | Criado |
| `400` | Erro de dados |
| `401` | Não autenticado |
| `403` | Sem permissão |
| `404` | Não encontrado |
| `422` | Regra de negócio |
| `500` | Erro interno |

---

# Padrão de erro

```json
{
  "message": "Mensagem do erro"
}
```

---

# Observações

- Validar JWT em rotas privadas
- Validar dados com Zod
- Validar permissões por perfil
- Toda ação gera histórico

# Informações adicionais

## REST
 Estamos usando o padrão REST:
 GET - buscar
 POST - criar
 PUT - atualizar
 PATCH - ação específica

## JWT
Authorization: Bearer <token> - isso garante usuário autenticado e controle de acesso