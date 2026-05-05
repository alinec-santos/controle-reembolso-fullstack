import request from "supertest"
import app from "../app"
import { prisma } from "../lib/prisma"
import bcrypt from "bcrypt"
import { UserRole } from "@prisma/client"

describe("Categories", () => {
  let adminToken: string
  let colaboradorToken: string

  beforeEach(async () => {
    await prisma.attachment.deleteMany()
    await prisma.requestHistory.deleteMany()
    await prisma.reimbursementRequest.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()

    await prisma.user.createMany({
      data: [
        {
          name: "Admin",
          email: "admin@test.com",
          password: await bcrypt.hash("123456", 8),
          role: UserRole.ADMIN
        },
        {
          name: "Colaborador",
          email: "colaborador@test.com",
          password: await bcrypt.hash("123456", 8),
          role: UserRole.COLABORADOR
        }
      ]
    })

    const adminLogin = await request(app)
      .post("/auth/login")
      .send({
        email: "admin@test.com",
        password: "123456"
      })

    const colaboradorLogin = await request(app)
      .post("/auth/login")
      .send({
        email: "colaborador@test.com",
        password: "123456"
      })

    adminToken = adminLogin.body.token
    colaboradorToken = colaboradorLogin.body.token
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it("deve listar categorias", async () => {
    await prisma.category.create({
      data: {
        name: "Transporte"
      }
    })

    const response = await request(app)
      .get("/categories")
      .set("Authorization", `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
    expect(response.body.length).toBeGreaterThan(0)
  })

  it("admin deve criar uma categoria", async () => {
    const response = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Alimentação"
      })

    expect(response.status).toBe(201)
    expect(response.body.name).toBe("Alimentação")
    expect(response.body.active).toBe(true)
  })

  it("colaborador não deve criar categoria", async () => {
    const response = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${colaboradorToken}`)
      .send({
        name: "Hospedagem"
      })

    expect(response.status).toBe(403)
  })

  it("admin deve atualizar uma categoria", async () => {
    const category = await prisma.category.create({
      data: {
        name: "Transporte"
      }
    })

    const response = await request(app)
      .put(`/categories/${category.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Transporte atualizado",
        active: false
      })

    expect(response.status).toBe(200)
    expect(response.body.name).toBe("Transporte atualizado")
    expect(response.body.active).toBe(false)
  })

  it("não deve listar categorias sem autenticação", async () => {
    const response = await request(app)
      .get("/categories")

    expect(response.status).toBe(401)
  })
})