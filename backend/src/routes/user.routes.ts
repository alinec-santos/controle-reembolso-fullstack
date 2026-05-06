import { Router } from "express"
import { UserRole } from "@prisma/client"
import { authMiddleware } from "../middlewares/auth.middleware"
import { roleMiddleware } from "../middlewares/role.middleware"
import { createUserController } from "../modules/user/controllers/create-user.controller"
import { listUsersController } from "../modules/user/controllers/list-users.controller"
import { updateUserController } from "../modules/user/controllers/update-user.controller"
const router = Router()

router.post(
  "/",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN]),
  createUserController
)

router.get(
  "/",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN]),
  listUsersController
)

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  updateUserController
)

export { router as userRoutes }