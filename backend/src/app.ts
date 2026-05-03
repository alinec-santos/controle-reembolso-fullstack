// Configuraçoes do express

import express from "express"
import cors from "cors"
import { authRoutes } from "./routes/auth.routes"

const app = express() //cria o servidor 

app.use(cors()) // permite que o front acesse o back
app.use(express.json()) //permite receber json no body das requisiçoes 



app.use("/auth", authRoutes)

export default app