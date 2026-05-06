
//Como o Express não conhece naturalmente a propriedade req.user, precisei estender a interface Request para o TypeScript aceitar essa propriedade de forma tipada
import { UserRole } from "@prisma/client"

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        name: string
        email: string
        role: UserRole
      }
    }
  }
}