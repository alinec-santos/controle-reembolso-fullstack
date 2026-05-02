# Requisitos do Sistema

## Requisitos Funcionais

### Autenticação

* O sistema deve permitir que usuários façam login com email e senha
* O sistema deve retornar um token JWT ao autenticar com sucesso
* O sistema deve proteger rotas privadas usando autenticação

---

### Usuários

* O sistema deve permitir cadastro de usuários (admin)
* O sistema deve permitir listar usuários (admin)
* O sistema deve permitir definir o perfil do usuário:

  * COLABORADOR
  * GESTOR
  * FINANCEIRO
  * ADMIN

---

### Categorias

* O sistema deve permitir criar categorias de reembolso (admin)
* O sistema deve permitir listar categorias
* O sistema deve permitir ativar/desativar categorias

---

### Solicitações de Reembolso

* O sistema deve permitir que o colaborador:

  * crie uma solicitação
  * edite uma solicitação em rascunho
  * visualize suas próprias solicitações

* A solicitação deve conter:

  * categoria
  * descrição
  * valor
  * data da despesa

---

### Envio para análise

* O sistema deve permitir que o colaborador envie uma solicitação
* Apenas solicitações em RASCUNHO podem ser enviadas

---

### Aprovação e rejeição

* O sistema deve permitir que o gestor:

  * visualize solicitações enviadas
  * aprove solicitações
  * rejeite solicitações

* A rejeição deve exigir justificativa

---

### Pagamento

* O sistema deve permitir que o financeiro:

  * visualize solicitações aprovadas
  * marque solicitações como pagas

---

### Histórico

* O sistema deve registrar todas as ações relevantes:

  * criação
  * edição
  * envio
  * aprovação
  * rejeição
  * pagamento

* O histórico deve armazenar:

  * usuário que realizou a ação
  * tipo da ação
  * data/hora
  * observações

---

### Anexos

* O sistema deve permitir adicionar anexos à solicitação
* O sistema pode armazenar apenas:

  * nome do arquivo
  * tipo
  * URL simulada

---

## Requisitos Não Funcionais

### Segurança

* As rotas privadas devem exigir autenticação via JWT
* O sistema deve validar permissões por perfil

---

### Validação

* O sistema deve validar dados de entrada usando Zod
* O sistema deve impedir ações inválidas (ex: aprovar fora de ordem)

---

### API

* A API deve seguir padrão REST
* Deve usar status HTTP corretos
* Deve retornar mensagens claras em caso de erro

---

### Código

* O projeto deve usar TypeScript
* O código deve ser organizado por responsabilidade

---

### Testes

* O backend deve possuir testes com Jest e Supertest
* O frontend deve possuir testes com React Testing Library

---

### Frontend

* O sistema deve ter interface funcional

* Deve exibir feedback de:

  * loading
  * erro
  * sucesso

* Deve proteger rotas por perfil

---

## Critérios de sucesso

O projeto será considerado completo quando:

* todas as regras de negócio forem respeitadas
* todas as permissões estiverem corretas
* o fluxo de status funcionar corretamente
* frontend e backend estiverem integrados
* testes cobrirem os principais fluxos


# Regras de Negócio

## 1. Regras gerais

* Toda solicitação pertence a um único usuário (solicitante)
* Toda solicitação possui um status
* Toda ação relevante deve gerar um registro no histórico
* O sistema deve validar permissões antes de executar qualquer ação

---

## 2. Perfis e permissões

### Colaborador

* Pode criar solicitação
* Pode editar solicitação própria apenas se estiver em RASCUNHO
* Pode visualizar apenas suas próprias solicitações
* Pode enviar solicitação para análise

---

### Gestor

* Pode visualizar solicitações com status ENVIADO
* Pode aprovar solicitações
* Pode rejeitar solicitações

---

### Financeiro

* Pode visualizar solicitações com status APROVADO
* Pode marcar solicitações como pagas

---

### Admin

* Pode gerenciar usuários
* Pode gerenciar categorias

---

## 3. Regras de criação

* Apenas usuários autenticados podem criar solicitações
* A solicitação deve conter:

  * categoria válida
  * descrição
  * valor maior que zero
  * data da despesa válida
* A solicitação deve ser criada com status RASCUNHO

---

## 4. Regras de edição

* Apenas o solicitante pode editar a solicitação
* A solicitação só pode ser editada se estiver em RASCUNHO
* Não é permitido editar solicitações em outros status

---

## 5. Regras de envio

* Apenas o solicitante pode enviar a solicitação
* Apenas solicitações em RASCUNHO podem ser enviadas
* Ao enviar, o status deve mudar para ENVIADO

---

## 6. Regras de aprovação

* Apenas usuários com perfil GESTOR podem aprovar
* Apenas solicitações com status ENVIADO podem ser aprovadas
* Ao aprovar, o status deve mudar para APROVADO

---

## 7. Regras de rejeição

* Apenas usuários com perfil GESTOR podem rejeitar
* Apenas solicitações com status ENVIADO podem ser rejeitadas
* A rejeição deve conter uma justificativa obrigatória
* Ao rejeitar, o status deve mudar para REJEITADO

---

## 8. Regras de pagamento

* Apenas usuários com perfil FINANCEIRO podem marcar como paga
* Apenas solicitações com status APROVADO podem ser pagas
* Ao marcar como paga, o status deve mudar para PAGO

---

## 9. Regras de cancelamento

* O solicitante pode cancelar a solicitação
* Apenas solicitações em RASCUNHO podem ser canceladas
* Ao cancelar, o status deve mudar para CANCELADO

---

## 10. Regras de bloqueio

* Solicitações com status PAGO não podem ser alteradas
* Solicitações com status REJEITADO não podem ser alteradas
* Solicitações com status CANCELADO não podem ser alteradas

---

## 11. Regras de histórico

Cada ação deve gerar um registro contendo:

* usuário que executou a ação
* tipo da ação (CRIADO, EDITADO, ENVIADO, APROVADO, REJEITADO, PAGO)
* data/hora
* observação (quando aplicável)

---

## 12. Regras de validação

* Todos os dados devem ser validados antes de executar ações
* A API deve impedir ações inválidas
* A API deve retornar erro com status HTTP adequado

---

## 13. Regras de segurança

* Todas as rotas protegidas devem exigir autenticação
* O sistema deve validar o perfil do usuário antes de executar ações
