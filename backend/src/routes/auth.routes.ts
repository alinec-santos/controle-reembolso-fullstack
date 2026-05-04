import { Router } from "express"
import { loginController } from "../modules/auth/controllers/login.controller"
import { authMiddleware } from "../middlewares/auth.middleware"

const router = Router()

router.post("/login", loginController)

router.get("/me", authMiddleware, (req, res) => {
  return res.status(200).json(req.user)
})

export { router as authRoutes }