// Configuraçoes do express

import express from "express"
import cors from "cors"

const app = express() //cria o servidor 

app.use(cors()) // permite que o front acesse o back
app.use(express.json()) //permite receber json no body das requisiçoes 

// rota de teste
app.get("/health", (req, res) => {
  return res.status(200).json({ message: "API funcionando" })
})

export default app