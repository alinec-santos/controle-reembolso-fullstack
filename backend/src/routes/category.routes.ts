import { Router } from "express"
import { listCategoriesController } from "../modules/category/controllers/list.controller"
import { authMiddleware } from "../middlewares/auth.middleware"

const router = Router()

router.get("/", authMiddleware, listCategoriesController) //define uma rota get e exige que o usuario esteja autenticado. Ou seja, qualquer usuário logado pode listar categorias

export { router as categoryRoutes }