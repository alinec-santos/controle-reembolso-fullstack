import { UserRole } from "@prisma/client"
import { NextFunction, Request, Response } from "express"

export function roleMiddleware(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Usuário não autenticado" }) //depende do middleware anterior 
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Usuário sem permissão" }) //se o cargo do usuario nao estiver na lista permitida , ele recebe um erro 403. Falamos basicamente "eu sei quem vc é mais vc nao tem permissão para estar aqui"
    }

    return next()
  }
}