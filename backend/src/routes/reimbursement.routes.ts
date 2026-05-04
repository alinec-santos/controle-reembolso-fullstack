import { Router } from "express"
import { createRequestController } from "../modules/reimbursement/controllers/create.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
import { roleMiddleware } from "../middlewares/role.middleware"
import { UserRole } from "@prisma/client"
import { listRequestsController } from "../modules/reimbursement/controllers/list.controller"
import { showRequestController } from "../modules/reimbursement/controllers/show.controller"

const router = Router()

router.post(
  "/",
  authMiddleware,
  roleMiddleware([UserRole.COLABORADOR]),
  createRequestController
)
router.get(
  "/",
  authMiddleware,
  listRequestsController
)
router.get(
  "/:id",
  authMiddleware,
  showRequestController
)

export { router as reimbursementRoutes }