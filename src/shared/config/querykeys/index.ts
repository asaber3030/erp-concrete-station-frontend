import type { MaterialQueryParams } from "#/features/materials/model/types"

export const queryKeys = {
  session: ["session"] as const,
  resource: (resource: string, filters?: Record<string, unknown>) =>
    ["resource", resource, filters ?? {}] as const,
  analytics: (stationId: string, month: string) =>
    ["analytics", "station", stationId, month] as const,

  materials: (filters?: MaterialQueryParams) => ["materials", filters ?? {}] as const,
  material: (id: number) => ["materials", id] as const,

}
