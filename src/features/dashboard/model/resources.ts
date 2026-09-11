export type DashboardResourceLink = {
  name: string
  title: string
  path: string
  endpoint: string
  permission: string
}

export const dashboardResourceLinks = [
  { name: "items", title: "الأصناف والمواد", path: "/dashboard/items", endpoint: "/items", permission: "items:read" },
  { name: "goods-receipts", title: "إذونات الاستلام", path: "/dashboard/goods-receipts", endpoint: "/goods-receipts", permission: "goods-receipts:read" },
  { name: "inventory-issues", title: "إذونات الصرف", path: "/dashboard/inventory-issues", endpoint: "/inventory-issues", permission: "inventory-issues:read" },
  { name: "stock-adjustments", title: "التسويات والأرصدة", path: "/dashboard/stock-adjustments", endpoint: "/stock-adjustments", permission: "stock-adjustments:read" },
  { name: "stock-counts", title: "الجرد الفعلي", path: "/dashboard/stock-counts", endpoint: "/stock-counts", permission: "stock-counts:read" },
  { name: "production", title: "الإنتاج والاستهلاك", path: "/dashboard/production", endpoint: "/production-batches", permission: "production:read" },
  { name: "ledger-reports", title: "تقارير دفتر المخزون", path: "/dashboard/ledger-reports", endpoint: "/reports/current-stock", permission: "reports:read" },
  { name: "warehouses", title: "المستودعات والمخازن", path: "/dashboard/warehouses", endpoint: "/warehouses", permission: "warehouses:read" },
  { name: "equipment", title: "المعدات والأسطول", path: "/dashboard/equipment", endpoint: "/equipment", permission: "equipment:read" },
  { name: "materials", title: "المواد", path: "/dashboard/materials", endpoint: "/materials", permission: "materials:read" },
  { name: "categories", title: "التصنيفات", path: "/dashboard/categories", endpoint: "/categories", permission: "categories:read" },
  { name: "units", title: "الوحدات", path: "/dashboard/units", endpoint: "/units", permission: "units:read" },
  { name: "suppliers", title: "الموردون", path: "/dashboard/suppliers", endpoint: "/suppliers", permission: "suppliers:read" },
  { name: "stations", title: "المحطات", path: "/dashboard/stations", endpoint: "/stations", permission: "stations:read" },
  { name: "inventory", title: "المخزون العام", path: "/dashboard/inventory", endpoint: "/inventory", permission: "inventory:read" },
  { name: "stock-movements", title: "حركات المخزون", path: "/dashboard/stock-movements", endpoint: "/stock-movements", permission: "stock-movements:read" },
  { name: "invoices", title: "الفواتير", path: "/dashboard/invoices", endpoint: "/invoices", permission: "invoices:read" },
  { name: "disposals", title: "الإهلاكات", path: "/dashboard/disposals", endpoint: "/disposals", permission: "disposals:read" },
  { name: "settlements", title: "التسويات المالية", path: "/dashboard/settlements", endpoint: "/settlements", permission: "settlements:read" },
  { name: "users", title: "المستخدمون", path: "/dashboard/users", endpoint: "/users", permission: "users:read" },
  { name: "roles", title: "الأدوار", path: "/dashboard/roles", endpoint: "/roles", permission: "roles:read" },
  { name: "permissions", title: "الصلاحيات", path: "/dashboard/permissions", endpoint: "/permissions", permission: "permissions:read" },
  { name: "audit-logs", title: "سجل التدقيق", path: "/dashboard/audit-logs", endpoint: "/audit-logs", permission: "audit-logs:read" },
] satisfies DashboardResourceLink[]
