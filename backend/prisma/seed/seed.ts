import { PrismaClient, UserRole, RequestStatus } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  // Limpando o banco para evitar duplicidade ao rodar o seed várias vezes
  // A ordem importa por causa das chaves estrangeiras (histórico e anexo dependem da solicitação)
  await prisma.requestHistory.deleteMany()
  await prisma.attachment.deleteMany()
  await prisma.reimbursementRequest.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await bcrypt.hash("123456", 10)

  // 1. Criar Usuários
  console.log("Criando usuários...")
  await prisma.user.createMany({
    data: [
      { name: "Admin", email: "admin@test.com", password: passwordHash, role: UserRole.ADMIN },
      { name: "Colaborador", email: "colaborador@test.com", password: passwordHash, role: UserRole.COLABORADOR },
      { name: "Gestor", email: "gestor@test.com", password: passwordHash, role: UserRole.GESTOR },
      { name: "Financeiro", email: "financeiro@test.com", password: passwordHash, role: UserRole.FINANCEIRO }
    ]
  })

  // 2. Criar Categorias
  console.log("Criando categorias...")
  await prisma.category.createMany({
    data: [
      { name: "Alimentação" },
      { name: "Transporte" },
      { name: "Hospedagem" },
      { name: "Outros" }
    ]
  })

  // 3. Buscar referências para as solicitações
  const colaborador = await prisma.user.findUnique({ where: { email: "colaborador@test.com" } })
  const catAlimentacao = await prisma.category.findFirst({ where: { name: "Alimentação" } })
  const catTransporte = await prisma.category.findFirst({ where: { name: "Transporte" } })

  if (colaborador && catAlimentacao && catTransporte) {
    console.log("Criando solicitações de reembolso...")
    
    await prisma.reimbursementRequest.createMany({
      data: [
        {
          userId: colaborador.id,
          categoryId: catAlimentacao.id,
          description: "Almoço de negócios - Projeto X",
          amount: 65.50,
          expenseDate: new Date("2026-05-01"),
          status: RequestStatus.ENVIADO,
        },
        {
          userId: colaborador.id,
          categoryId: catTransporte.id,
          description: "Uber para o escritório",
          amount: 32.00,
          expenseDate: new Date("2026-05-02"),
          status: RequestStatus.APROVADO,
        },
        {
          userId: colaborador.id,
          categoryId: catAlimentacao.id,
          description: "Jantar com equipe",
          amount: 150.00,
          expenseDate: new Date("2026-05-03"),
          status: RequestStatus.RASCUNHO,
        }
      ]
    })
  }
}

main()
  .then(() => console.log("Seed finalizado com sucesso!"))
  .catch((error) => {
    console.error("Erro ao rodar o seed:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })