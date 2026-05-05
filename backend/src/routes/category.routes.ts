import { Router } from "express"
import { UserRole } from "@prisma/client"
import { listCategoriesController } from "../modules/category/controllers/list.controller"
import { createCategoryController } from "../modules/category/controllers/create.controller"
import { updateCategoryController } from "../modules/category/controllers/update.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
import { roleMiddleware } from "../middlewares/role.middleware"

const router = Router()

router.get("/", authMiddleware, listCategoriesController)

router.post(
  "/",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN]),
  createCategoryController
)

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN]),
  updateCategoryController
)

export { router as categoryRoutes }