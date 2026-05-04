import { Router } from "express"
import { loginController } from "../modules/auth/controllers/login.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
import { UserRole } from "@prisma/client"
import { roleMiddleware } from "../middlewares/role.middleware"

const router = Router()

router.post("/login", loginController)

router.get("/me", authMiddleware, (req, res) => {
  return res.status(200).json(req.user)
})
router.get(
  "/admin-test",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN]),
  (req, res) => {
    return res.status(200).json({ message: "Acesso permitido para ADMIN" })
  }
)

export { router as authRoutes }