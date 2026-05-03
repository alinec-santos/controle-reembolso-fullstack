import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient() //cria a conexao com o banco - aqui criamos uma unica instancia e reutilizamos 