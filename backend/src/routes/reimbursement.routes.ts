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
import { rejectRequestController } from "../modules/reimbursement/controllers/reject.controller"
import { payRequestController } from "../modules/reimbursement/controllers/pay.controller"
import { historyRequestController } from "../modules/reimbursement/controllers/history.controller"

const router = Router()

router.post( //cria a solicitacao de reembolso
  "/",
  authMiddleware,
  roleMiddleware([UserRole.COLABORADOR]),
  createRequestController
)
router.get( //lista solicitacoes conforme perfil do usuario 
  "/",
  authMiddleware,
  listRequestsController
)
router.get( //Lista histórico da solicitação
  "/:id/history",
  authMiddleware,
  historyRequestController
)
router.get( //	Detalha solicitação específica.
  "/:id",
  authMiddleware,
  showRequestController
)
router.post( //Envia solicitação para análise.
  "/:id/submit",
  authMiddleware,
  roleMiddleware([UserRole.COLABORADOR]),
  submitRequestController
)
router.put( //Edita solicitação quando permitido
  "/:id",
  authMiddleware,
  roleMiddleware([UserRole.COLABORADOR]),
  updateRequestController
)
router.post( //Aprova solicitação enviada
  "/:id/approve",
  authMiddleware,
  roleMiddleware([UserRole.GESTOR]),
  approveRequestController
)
router.post(//Rejeita solicitação enviada com justificativa
  "/:id/reject",
  authMiddleware,
  roleMiddleware([UserRole.GESTOR]),
  rejectRequestController
)
router.post(//Marca solicitação aprovada como paga
  "/:id/pay",
  authMiddleware,
  roleMiddleware([UserRole.FINANCEIRO]),
  payRequestController
)

export { router as reimbursementRoutes }