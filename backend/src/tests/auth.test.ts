import request from "supertest"
import app from "../app"
import { prisma } from "../lib/prisma"
import bcrypt from "bcrypt"
import { UserRole } from "@prisma/client"

describe("Auth", () => {
    beforeEach(async () => {
        await prisma.attachment.deleteMany()
        await prisma.requestHistory.deleteMany()
        await prisma.reimbursementRequest.deleteMany()
        await prisma.category.deleteMany()
        await prisma.user.deleteMany()

        await prisma.user.create({
            data: {
            name: "Admin",
            email: "admin@test.com",
            password: await bcrypt.hash("123456", 8),
            role: UserRole.ADMIN
            }
        })
    })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it("deve autenticar um usuário com credenciais válidas", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "admin@test.com",
        password: "123456"
      })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("token")
    expect(response.body.user.email).toBe("admin@test.com")
    expect(response.body.user.role).toBe(UserRole.ADMIN)
  })

  it("não deve autenticar com senha inválida", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "admin@test.com",
        password: "senha-errada"
      })

    expect(response.status).toBe(401)
  })
})