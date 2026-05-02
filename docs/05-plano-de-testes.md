# Plano de Testes

## Objetivo

Garantir que o sistema funcione corretamente, validando autenticação, permissões, regras de negócio e fluxo de status das solicitações de reembolso.

---

## Tipos de teste

### Backend

- Testes de integração com Jest e Supertest
- Testes de regras de negócio
- Testes de autenticação e autorização

---

### Frontend

- Testes de componentes com React Testing Library
- Testes de formulários
- Testes de renderização condicional por perfil

---

# Testes Backend

## 1. Autenticação

### Login

- Deve autenticar com credenciais válidas
- Deve retornar erro com credenciais inválidas

---

## 2. Permissões (RBAC)

- Colaborador não pode aprovar
- Colaborador não pode pagar
- Gestor não pode pagar
- Financeiro não pode aprovar

---

## 3. Regras de criação

- Deve criar solicitação com status RASCUNHO
- Deve falhar com dados inválidos (Zod)

---

## 4. Regras de edição

- Deve permitir edição apenas em RASCUNHO
- Deve bloquear edição em outros status

---

## 5. Fluxo de status

### Enviar

- Deve permitir enviar se estiver RASCUNHO
- Deve bloquear se não estiver RASCUNHO

---

### Aprovar

- Deve permitir aprovação se estiver ENVIADO
- Deve bloquear aprovação fora do fluxo

---

### Rejeitar

- Deve exigir justificativa
- Deve falhar sem justificativa

---

### Pagar

- Deve permitir pagamento se estiver APROVADO
- Deve bloquear pagamento fora do fluxo

---

## 6. Histórico

- Deve criar registro ao criar solicitação
- Deve criar registro ao enviar
- Deve criar registro ao aprovar
- Deve criar registro ao rejeitar
- Deve criar registro ao pagar

---

# Testes Frontend

## 1. Autenticação

- Deve renderizar tela de login
- Deve redirecionar após login

---

## 2. Rotas protegidas

- Deve bloquear acesso sem login
- Deve permitir acesso com login

---

## 3. Permissões por perfil

- Colaborador não vê tela de aprovação
- Gestor vê tela de aprovação
- Financeiro vê tela de pagamento

---

## 4. Formulários

- Deve validar campos obrigatórios
- Deve exibir erro ao enviar dados inválidos

---

## 5. Fluxo de interface

- Deve permitir criar solicitação
- Deve permitir enviar
- Deve refletir mudança de status na tela

---

# Critérios de sucesso

O sistema será considerado testado quando:

- Fluxo completo funcionar sem erros
- Permissões forem respeitadas
- Validações funcionarem corretamente
- Testes cobrirem os principais cenários