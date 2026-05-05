import request from "supertest"
import app from "../app"
import { prisma } from "../lib/prisma"
import bcrypt from "bcrypt"
import { UserRole } from "@prisma/client"

describe("Reimbursements", () => {
  let colaboradorToken: string
  let gestorToken: string
  let financeiroToken: string
  let categoryId: string

  beforeEach(async () => {
    await prisma.attachment.deleteMany()
    await prisma.requestHistory.deleteMany()
    await prisma.reimbursementRequest.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()

    await prisma.user.createMany({
      data: [
        {
          name: "Colaborador",
          email: "colaborador@test.com",
          password: await bcrypt.hash("123456", 8),
          role: UserRole.COLABORADOR
        },
        {
          name: "Gestor",
          email: "gestor@test.com",
          password: await bcrypt.hash("123456", 8),
          role: UserRole.GESTOR
        },
        {
          name: "Financeiro",
          email: "financeiro@test.com",
          password: await bcrypt.hash("123456", 8),
          role: UserRole.FINANCEIRO
        }
      ]
    })

    const category = await prisma.category.create({
      data: { name: "Transporte" }
    })

    categoryId = category.id

    const colaboradorLogin = await request(app).post("/auth/login").send({
      email: "colaborador@test.com",
      password: "123456"
    })

    const gestorLogin = await request(app).post("/auth/login").send({
      email: "gestor@test.com",
      password: "123456"
    })

    const financeiroLogin = await request(app).post("/auth/login").send({
      email: "financeiro@test.com",
      password: "123456"
    })

    colaboradorToken = colaboradorLogin.body.token
    gestorToken = gestorLogin.body.token
    financeiroToken = financeiroLogin.body.token
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  // ========================
  // CREATE
  // ========================
  it("deve criar solicitação (RASCUNHO)", async () => {
    const res = await request(app)
      .post("/reimbursements")
      .set("Authorization", `Bearer ${colaboradorToken}`)
      .send({
        categoryId,
        description: "Uber reunião",
        amount: 50,
        expenseDate: "2026-05-01"
      })

    expect(res.status).toBe(201)
    expect(res.body.status).toBe("RASCUNHO")
  })

  // ========================
  // LIST
  // ========================
  it("colaborador vê apenas suas solicitações", async () => {
    await request(app)
      .post("/reimbursements")
      .set("Authorization", `Bearer ${colaboradorToken}`)
      .send({
        categoryId,
        description: "Almoço",
        amount: 30,
        expenseDate: "2026-05-01"
      })

    const res = await request(app)
      .get("/reimbursements")
      .set("Authorization", `Bearer ${colaboradorToken}`)

    expect(res.status).toBe(200)
    expect(res.body.length).toBe(1)
  })

  // ========================
  // SUBMIT
  // ========================
  it("deve enviar solicitação", async () => {
    const create = await request(app)
      .post("/reimbursements")
      .set("Authorization", `Bearer ${colaboradorToken}`)
      .send({
        categoryId,
        description: "Taxi",
        amount: 40,
        expenseDate: "2026-05-01"
      })

    const id = create.body.id

    const submit = await request(app)
      .post(`/reimbursements/${id}/submit`)
      .set("Authorization", `Bearer ${colaboradorToken}`)

    expect(submit.status).toBe(200)
    expect(submit.body.status).toBe("ENVIADO")
  })

  it("não deve enviar duas vezes", async () => {
    const create = await request(app)
      .post("/reimbursements")
      .set("Authorization", `Bearer ${colaboradorToken}`)
      .send({
        categoryId,
        description: "Taxi",
        amount: 40,
        expenseDate: "2026-05-01"
      })

    const id = create.body.id

    await request(app)
      .post(`/reimbursements/${id}/submit`)
      .set("Authorization", `Bearer ${colaboradorToken}`)

    const second = await request(app)
      .post(`/reimbursements/${id}/submit`)
      .set("Authorization", `Bearer ${colaboradorToken}`)

    expect(second.status).toBe(400)
  })

  // ========================
  // APPROVE
  // ========================
  it("gestor aprova solicitação", async () => {
    const create = await request(app)
      .post("/reimbursements")
      .set("Authorization", `Bearer ${colaboradorToken}`)
      .send({
        categoryId,
        description: "Viagem",
        amount: 100,
        expenseDate: "2026-05-01"
      })

    const id = create.body.id

    await request(app)
      .post(`/reimbursements/${id}/submit`)
      .set("Authorization", `Bearer ${colaboradorToken}`)

    const approve = await request(app)
      .post(`/reimbursements/${id}/approve`)
      .set("Authorization", `Bearer ${gestorToken}`)

    expect(approve.status).toBe(200)
    expect(approve.body.status).toBe("APROVADO")
  })

  it("colaborador não pode aprovar", async () => {
    const create = await request(app)
      .post("/reimbursements")
      .set("Authorization", `Bearer ${colaboradorToken}`)
      .send({
        categoryId,
        description: "Teste",
        amount: 50,
        expenseDate: "2026-05-01"
      })

    const id = create.body.id

    await request(app)
      .post(`/reimbursements/${id}/submit`)
      .set("Authorization", `Bearer ${colaboradorToken}`)

    const approve = await request(app)
      .post(`/reimbursements/${id}/approve`)
      .set("Authorization", `Bearer ${colaboradorToken}`)

    expect(approve.status).toBe(403)
  })

  // ========================
  // REJECT
  // ========================
  it("gestor rejeita com justificativa", async () => {
    const create = await request(app)
      .post("/reimbursements")
      .set("Authorization", `Bearer ${colaboradorToken}`)
      .send({
        categoryId,
        description: "Erro",
        amount: 70,
        expenseDate: "2026-05-01"
      })

    const id = create.body.id

    await request(app)
      .post(`/reimbursements/${id}/submit`)
      .set("Authorization", `Bearer ${colaboradorToken}`)

    const reject = await request(app)
      .post(`/reimbursements/${id}/reject`)
      .set("Authorization", `Bearer ${gestorToken}`)
      .send({ reason: "Inconsistente" })

    expect(reject.status).toBe(200)
    expect(reject.body.status).toBe("REJEITADO")
  })

  // ========================
  // PAY
  // ========================
  it("financeiro paga solicitação aprovada", async () => {
    const create = await request(app)
      .post("/reimbursements")
      .set("Authorization", `Bearer ${colaboradorToken}`)
      .send({
        categoryId,
        description: "Hotel",
        amount: 200,
        expenseDate: "2026-05-01"
      })

    const id = create.body.id

    await request(app)
      .post(`/reimbursements/${id}/submit`)
      .set("Authorization", `Bearer ${colaboradorToken}`)

    await request(app)
      .post(`/reimbursements/${id}/approve`)
      .set("Authorization", `Bearer ${gestorToken}`)

    const pay = await request(app)
      .post(`/reimbursements/${id}/pay`)
      .set("Authorization", `Bearer ${financeiroToken}`)

    expect(pay.status).toBe(200)
    expect(pay.body.status).toBe("PAGO")
  })

  // ========================
  // HISTORY
  // ========================
  it("deve listar histórico", async () => {
    const create = await request(app)
      .post("/reimbursements")
      .set("Authorization", `Bearer ${colaboradorToken}`)
      .send({
        categoryId,
        description: "Teste",
        amount: 10,
        expenseDate: "2026-05-01"
      })

    const id = create.body.id

    await request(app)
      .post(`/reimbursements/${id}/submit`)
      .set("Authorization", `Bearer ${colaboradorToken}`)

    const history = await request(app)
      .get(`/reimbursements/${id}/history`)
      .set("Authorization", `Bearer ${colaboradorToken}`)

    expect(history.status).toBe(200)
    expect(history.body.length).toBeGreaterThan(0)
  })
})