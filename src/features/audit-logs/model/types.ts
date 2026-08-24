export type AuditLog = {
  id: string | number
  userId: string | number
  action: string
  resource: string
  details?: string
  createdAt?: string
}
