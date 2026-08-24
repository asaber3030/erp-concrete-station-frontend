export type DashboardResourceLink = {
  name: string
  title: string
  path: string
  endpoint: string
  permission: string
}

export const dashboardResourceLinks = [
  { name: "materials", title: "المواد", path: "/dashboard/materials", endpoint: "/materials", permission: "materials:read" },
  { name: "categories", title: "التصنيفات", path: "/dashboard/categories", endpoint: "/categories", permission: "categories:read" },
  { name: "units", title: "الوحدات", path: "/dashboard/units", endpoint: "/units", permission: "units:read" },
  { name: "suppliers", title: "الموردون", path: "/dashboard/suppliers", endpoint: "/suppliers", permission: "suppliers:read" },
  { name: "stations", title: "المحطات", path: "/dashboard/stations", endpoint: "/stations", permission: "stations:read" },
  { name: "inventory", title: "المخزون", path: "/dashboard/inventory", endpoint: "/inventory", permission: "inventory:read" },
  { name: "stock-movements", title: "حركات المخزون", path: "/dashboard/stock-movements", endpoint: "/stock-movements", permission: "stock-movements:read" },
  { name: "invoices", title: "الفواتير", path: "/dashboard/invoices", endpoint: "/invoices", permission: "invoices:read" },
  { name: "disposals", title: "الإهلاكات", path: "/dashboard/disposals", endpoint: "/disposals", permission: "disposals:read" },
  { name: "settlements", title: "التسويات", path: "/dashboard/settlements", endpoint: "/settlements", permission: "settlements:read" },
  { name: "users", title: "المستخدمون", path: "/dashboard/users", endpoint: "/users", permission: "users:read" },
  { name: "roles", title: "الأدوار", path: "/dashboard/roles", endpoint: "/roles", permission: "roles:read" },
  { name: "permissions", title: "الصلاحيات", path: "/dashboard/permissions", endpoint: "/permissions", permission: "permissions:read" },
  { name: "audit-logs", title: "سجل التدقيق", path: "/dashboard/audit-logs", endpoint: "/audit-logs", permission: "audit-logs:read" },
] satisfies DashboardResourceLink[]
