import { Router } from "express"
import { loginController } from "../modules/auth/controllers/login.controller"

const router = Router()

router.post("/login", loginController)

export { router as authRoutes }