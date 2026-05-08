import { PrismaClient, UserRole } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  console.log("Limpando banco de dados...");
  
  // A ordem de exclusão evita erros de chave estrangeira
  await prisma.requestHistory.deleteMany()
  await prisma.attachment.deleteMany()
  await prisma.reimbursementRequest.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await bcrypt.hash("123456", 10)

  // 1. Criar Usuários com domínio @pitang.com
  console.log("Criando usuários...");
  await prisma.user.createMany({
    data: [
      { name: "Admin", email: "admin@pitang.com", password: passwordHash, role: UserRole.ADMIN },
      { name: "Colaborador", email: "colaborador@pitang.com", password: passwordHash, role: UserRole.COLABORADOR },
      { name: "Gestor", email: "gestor@pitang.com", password: passwordHash, role: UserRole.GESTOR },
      { name: "Financeiro", email: "financeiro@pitang.com", password: passwordHash, role: UserRole.FINANCEIRO }
    ]
  })

  // 2. Criar Categorias
  console.log("Criando categorias...");
  await prisma.category.createMany({
    data: [
      { name: "Alimentação" },
      { name: "Transporte" },
      { name: "Hospedagem" },
      { name: "Outros" }
    ]
  })
}

main()
  .then(() => console.log(" Seed finalizado com sucesso!"))
  .catch((error) => {
    console.error(" Erro ao rodar o seed:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })