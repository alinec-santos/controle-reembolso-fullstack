import request from "supertest"
import app from "../app"
import { prisma } from "../lib/prisma"
import bcrypt from "bcrypt"
import { UserRole } from "@prisma/client"

describe("Users", () => {
  let adminToken: string

  beforeEach(async () => {
    // limpa banco
    await prisma.attachment.deleteMany()
    await prisma.requestHistory.deleteMany()
    await prisma.reimbursementRequest.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()

    // cria admin
    await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@test.com",
        password: await bcrypt.hash("123456", 8),
        role: UserRole.ADMIN
      }
    })

    // faz login pra pegar token
    const login = await request(app)
      .post("/auth/login")
      .send({
        email: "admin@test.com",
        password: "123456"
      })

    adminToken = login.body.token
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it("deve criar um novo usuário", async () => {
    const response = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "User Test",
        email: "user@test.com",
        password: "123456",
        role: "COLABORADOR"
      })

    expect(response.status).toBe(201)
    expect(response.body.email).toBe("user@test.com")
  })

  it("deve listar usuários (ADMIN)", async () => {
    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
    expect(response.body.length).toBeGreaterThan(0)
  })

  it("não deve permitir acesso sem token", async () => {
    const response = await request(app)
      .get("/users")

    expect(response.status).toBe(401)
  })
})