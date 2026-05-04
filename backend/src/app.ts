// Configuraçoes do express

import express from "express"
import cors from "cors"
import { authRoutes } from "./routes/auth.routes"
import { reimbursementRoutes } from "./routes/reimbursement.routes"
import { categoryRoutes } from "./routes/category.routes"

const app = express() //cria o servidor 

app.use(cors()) // permite que o front acesse o back
app.use(express.json()) //permite receber json no body das requisiçoes 



app.use("/auth", authRoutes)
app.use("/reimbursements", reimbursementRoutes)
app.use("/categories", categoryRoutes)

export default app