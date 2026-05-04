import { Router } from "express"
import { createRequestController } from "../modules/reimbursement/controllers/create.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
import { roleMiddleware } from "../middlewares/role.middleware"
import { UserRole } from "@prisma/client"

const router = Router()

router.post(
  "/",
  authMiddleware,
  roleMiddleware([UserRole.COLABORADOR]),
  createRequestController
)

export { router as reimbursementRoutes }