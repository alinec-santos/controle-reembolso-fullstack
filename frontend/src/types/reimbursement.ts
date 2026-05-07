export type Attachment = {
  id: string
  requestId: string
  fileName: string
  fileType: string
  fileUrl: string
  createdAt: string
}

export type History = {
  id: string
  requestId: string
  userId: string
  action: string
  observation?: string | null
  createdAt: string
  user?: {
    id: string
    name: string
    email: string
    role: string
  }
}

export type Reimbursement = {
  id: string
  description: string
  amount: number
  expenseDate: string
  status: string
  rejectionReason?: string | null
  createdAt: string
  updatedAt: string
  category?: { id: string; name: string }
  user?: { id: string; name: string; email: string; role: string }
  attachments?: Attachment[]
  histories?: History[]
}

