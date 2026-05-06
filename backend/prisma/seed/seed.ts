import { PrismaClient, UserRole } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash("123456", 10)

  await prisma.user.createMany({
    data: [
      {
        name: "Admin",
        email: "admin@test.com",
        password: passwordHash,
        role: UserRole.ADMIN
      },
      {
        name: "Colaborador",
        email: "colaborador@test.com",
        password: passwordHash,
        role: UserRole.COLABORADOR
      },
      {
        name: "Gestor",
        email: "gestor@test.com",
        password: passwordHash,
        role: UserRole.GESTOR
      },
      {
        name: "Financeiro",
        email: "financeiro@test.com",
        password: passwordHash,
        role: UserRole.FINANCEIRO
      }
    ]
  })

  await prisma.category.createMany({
    data: [
      { name: "Alimentação" },
      { name: "Transporte" },
      { name: "Hospedagem" }
    ]
  })
}

main()
  .then(() => {
    console.log("Seed executado com sucesso")
  })
  .catch((error) => {
    console.error(error)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })