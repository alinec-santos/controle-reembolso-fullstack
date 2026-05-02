# Modelagem do Banco de Dados

## Objetivo

Definir as entidades do sistema, seus campos e os relacionamentos entre elas.

---

## Entidades principais

- User - para representar os usuários do sistema
- Category - padronizar e classificar o tipo de despesa das solicitaçoes de reembolso para evitar dados inconsistentes e facilitar filtragem em relatórios
- ReimbursementRequest - representa cada solicitação de reembolso feita por um usuário (tudo no sistema gira em torno dela)
- Attachment - representa os arquivos anexados a uma solicitação de reembolso
- RequestHistory - registrar todas as ações feitas em uma solicitação para garantir rastreabilidade e auditoria do sistema

---

## Tabela: User

| Campo | Tipo | Descrição |
|------|------|----------|
| id | UUID | Identificador único |
| name | string | Nome do usuário |
| email | string | Email único |
| password | string | Senha criptografada |
| role | enum | Perfil (COLABORADOR, GESTOR, FINANCEIRO, ADMIN) |
| createdAt | datetime | Data de criação |
| updatedAt | datetime | Data de atualização |

---

## Tabela: Category

| Campo | Tipo | Descrição |
|------|------|----------|
| id | UUID | Identificador único |
| name | string | Nome da categoria |
| active | boolean | Indica se está ativa (Soft delete para preservar a integridade dos dados e o histórico de solicitações já existentes) |
| createdAt | datetime | Data de criação |
| updatedAt | datetime | Data de atualização |

---

## Tabela: ReimbursementRequest

| Campo | Tipo | Descrição |
|------|------|----------|
| id | UUID | Identificador único |
| userId | UUID | Referência ao usuário solicitante |
| categoryId | UUID | Referência à categoria |
| description | string | Descrição da despesa |
| amount | decimal | Valor da despesa |
| expenseDate | datetime | Data da despesa |
| status | enum | Status da solicitação |
| rejectionReason | string | Justificativa (se rejeitada) |
| createdAt | datetime | Data de criação |
| updatedAt | datetime | Data de atualização |

---

## Tabela: Attachment

| Campo | Tipo | Descrição |
|------|------|----------|
| id | UUID | Identificador único |
| requestId | UUID | Referência à solicitação |
| fileName | string | Nome do arquivo |
| fileType | string | Tipo do arquivo |
| fileUrl | string | URL simulada |
| createdAt | datetime | Data de criação |

---

## Tabela: RequestHistory

| Campo | Tipo | Descrição |
|------|------|----------|
| id | UUID | Identificador único |
| requestId | UUID | Referência à solicitação |
| userId | UUID | Usuário que realizou a ação |
| action | enum | Tipo da ação |
| observation | string | Observação (opcional) |
| createdAt | datetime | Data da ação |

---

## Relacionamentos

- Um User pode ter várias ReimbursementRequest - um usuário pode criar várias solicitações mas cada solicitaçao pertence a um único usuário
- Uma Category pode ter várias ReimbursementRequest - uma categoria está em várias solicitaçoes mas cada solicitaçao tem uma única categoria
- Uma ReimbursementRequest pode ter vários Attachment - uma solicitaçao pode ter vários anexos mas cada anexo pertence a uma única solicitaçao
- Uma ReimbursementRequest pode ter vários RequestHistory - uma solicitaçao pode ter vários registros de histórico mas cada registro pertence a uma única solicitaçao
- Um User pode gerar vários registros de RequestHistory - um usuário pode executar várias açoes registradas no historico mas cada historico foi gerado por um unico usuario
---

## Enums (Conjunto fixo de valores permitidos)

### UserRole
(controlar permissões(RBAC))
- COLABORADOR
- GESTOR
- FINANCEIRO
- ADMIN

---

### RequestStatus
(controlar o fluxo de solicitação - representa o estado atual da solicitação)
- RASCUNHO
- ENVIADO
- APROVADO
- REJEITADO
- PAGO
- CANCELADO

---

### RequestAction
(Definir o tipo de ação no histórico - representa uma ação que acontenceu)
- CREATED
- UPDATED
- SUBMITTED
- APPROVED
- REJECTED
- PAID
- CANCELED

---

## Observações importantes

- A senha deve ser armazenada de forma criptografada
- O status deve sempre seguir o fluxo definido nas regras de negócio
- A justificativa de rejeição deve ser obrigatória quando status for REJEITADO
- O histórico deve ser criado automaticamente a cada ação relevante