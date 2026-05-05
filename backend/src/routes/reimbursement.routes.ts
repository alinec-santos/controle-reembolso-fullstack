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
import { createAttachmentController } from "../modules/attachment/controllers/create-attachment.controller"
import { listAttachmentsController } from "../modules/attachment/controllers/list-attachments.controller"
import { validateParams } from "../middlewares/validate-params.middleware"
import { idParamsSchema } from "../schemas/params.schema"
import { validateQuery } from "../middlewares/validate-query.middleware"
import { listRequestsQuerySchema } from "../schemas/query.schema"

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
  validateQuery(listRequestsQuerySchema),
  listRequestsController
)
router.get( //Lista histórico da solicitação
  "/:id/history",
  authMiddleware,
  validateParams(idParamsSchema),
  historyRequestController
)
router.post(
  "/:id/attachments",
  authMiddleware,
  validateParams(idParamsSchema),
  createAttachmentController
)

router.get(
  "/:id/attachments",
  authMiddleware,
  validateParams(idParamsSchema),
  listAttachmentsController
)
router.get( //	Detalha solicitação específica.
  "/:id",
  authMiddleware,
  validateParams(idParamsSchema),
  showRequestController
)
router.post( //Envia solicitação para análise.
  "/:id/submit",
  authMiddleware,
  validateParams(idParamsSchema),
  roleMiddleware([UserRole.COLABORADOR]),
  submitRequestController
)
router.put( //Edita solicitação quando permitido
  "/:id",
  authMiddleware,
  validateParams(idParamsSchema),
  roleMiddleware([UserRole.COLABORADOR]),
  updateRequestController
)
router.post( //Aprova solicitação enviada
  "/:id/approve",
  validateParams(idParamsSchema),
  authMiddleware,
  roleMiddleware([UserRole.GESTOR]),
  approveRequestController
)
router.post(//Rejeita solicitação enviada com justificativa
  "/:id/reject",
  authMiddleware,
  validateParams(idParamsSchema),
  roleMiddleware([UserRole.GESTOR]),
  rejectRequestController
)
router.post(//Marca solicitação aprovada como paga
  "/:id/pay",
  authMiddleware,
  validateParams(idParamsSchema),
  roleMiddleware([UserRole.FINANCEIRO]),
  payRequestController
)

export { router as reimbursementRoutes }