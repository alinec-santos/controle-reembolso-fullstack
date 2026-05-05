import { Router } from "express"
import { createRequestController } from "../modules/reimbursement/controllers/create.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
import { roleMiddleware } from "../middlewares/role.middleware"
import { UserRole } from "@prisma/client"
import { listRequestsController } from "../modules/reimbursement/controllers/list.controller"
import { showRequestController } from "../modules/reimbursement/controllers/show.controller"
import { submitRequestController } from "../modules/reimbursement/controllers/submit.controller"
import { updateRequestController } from "../modules/reimbursement/controllers/update.controller"
import { approveRequestController } from "../modules/reimbursement/controllers/approve.controller"

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
router.post(
  "/:id/submit",
  authMiddleware,
  roleMiddleware([UserRole.COLABORADOR]),
  submitRequestController
)
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware([UserRole.COLABORADOR]),
  updateRequestController
)
router.post(
  "/:id/approve",
  authMiddleware,
  roleMiddleware([UserRole.GESTOR]),
  approveRequestController
)
export { router as reimbursementRoutes }