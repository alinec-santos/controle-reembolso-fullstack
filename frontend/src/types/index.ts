// o front precisa entender o formato dos dados que vem do back
export type UserRole = "COLABORADOR" | "GESTOR" | "FINANCEIRO" | "ADMIN"

export type RequestStatus =
  | "RASCUNHO"
  | "ENVIADO"
  | "APROVADO"
  | "REJEITADO"
  | "PAGO"
  | "CANCELADO"

export type RequestAction =
  | "CREATED"
  | "UPDATED"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "PAID"
  | "CANCELED"

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt?: string
  updatedAt?: string
}

export type Category = {
  id: string
  name: string
  active: boolean
  createdAt?: string
  updatedAt?: string
}

export type Attachment = {
  id: string
  requestId: string
  fileName: string
  fileType: string
  fileUrl: string
  createdAt: string
}

export type RequestHistory = {
  id: string
  requestId: string
  userId: string
  action: RequestAction
  observation?: string | null
  createdAt: string
  user?: User
}

export type ReimbursementRequest = {
  id: string
  userId: string
  categoryId: string
  description: string
  amount: number | string
  expenseDate: string
  status: RequestStatus
  rejectionReason?: string | null
  createdAt: string
  updatedAt: string
  user?: User
  category?: Category
  attachments?: Attachment[]
  histories?: RequestHistory[]
}