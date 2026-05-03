import { PrismaClient, UserRole } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Usuário Admin
  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@email.com",
      password: "123456",
      role: UserRole.ADMIN
    }
  })

  // Usuário Colaborador
  await prisma.user.create({
    data: {
      name: "Colaborador",
      email: "colaborador@email.com",
      password: "123456",
      role: UserRole.COLABORADOR
    }
  })

  // Categorias
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