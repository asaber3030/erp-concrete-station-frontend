export enum ItemType {
  RAW_MATERIAL = "RAW_MATERIAL",
  SPARE_PART = "SPARE_PART",
  CONSUMABLE = "CONSUMABLE",
  FUEL = "FUEL",
  OTHER = "OTHER",
}

export enum DocumentStatus {
  DRAFT = "DRAFT",
  POSTED = "POSTED",
  CANCELLED = "CANCELLED",
}

export enum Direction {
  IN = "IN",
  OUT = "OUT",
}

export enum TransactionType {
  OPENING_BALANCE = "OPENING_BALANCE",
  PURCHASE_RECEIPT = "PURCHASE_RECEIPT",
  ISSUE = "ISSUE",
  CONSUMPTION = "CONSUMPTION",
  TRANSFER_IN = "TRANSFER_IN",
  TRANSFER_OUT = "TRANSFER_OUT",
  ADJUSTMENT_IN = "ADJUSTMENT_IN",
  ADJUSTMENT_OUT = "ADJUSTMENT_OUT",
  DISPOSAL = "DISPOSAL",
}

export interface Item {
  id: number
  code: string
  name: string
  type: ItemType
  categoryId: number
  categoryName?: string
  unitId: number
  unitName?: string
  minStock: number
  currentStock?: number
  avgCost?: number
  equipmentId?: number | null
  createdAt?: string
  updatedAt?: string
}

export interface Warehouse {
  id: number
  code?: string
  name: string
  location?: string
  is_active?: boolean
}

export interface Equipment {
  id: number
  code: string
  name: string
  type?: string
  status?: string
}

export interface CostCenter {
  id: number
  code: string
  name: string
  description?: string
}

export interface GoodsReceiptItem {
  id?: number
  itemId: number
  itemCode?: string
  itemName?: string
  quantity: number
  unitCost: number
  totalCost?: number
}

export interface GoodsReceipt {
  id: number
  number: string
  date: string
  supplierId: number
  supplierName?: string
  warehouseId: number
  warehouseName?: string
  status: DocumentStatus
  items: GoodsReceiptItem[]
  totalAmount?: number
  createdAt?: string
}

export interface InventoryIssueItem {
  id?: number
  itemId: number
  itemCode?: string
  itemName?: string
  quantity: number
  unitCost?: number
}

export interface InventoryIssue {
  id: number
  number: string
  date: string
  warehouseId: number
  warehouseName?: string
  equipmentId?: number | null
  equipmentName?: string
  costCenterId?: number | null
  costCenterName?: string
  status: DocumentStatus
  items: InventoryIssueItem[]
  createdAt?: string
}

export interface OpeningBalanceItem {
  id?: number
  itemId: number
  itemCode?: string
  itemName?: string
  quantity: number
  unitCost: number
}

export interface OpeningBalance {
  id: number
  number?: string
  date: string
  warehouseId: number
  warehouseName?: string
  status: DocumentStatus
  items: OpeningBalanceItem[]
  createdAt?: string
}

export interface StockAdjustmentItem {
  id?: number
  itemId: number
  itemCode?: string
  itemName?: string
  quantity: number
  type: Direction
  unitCost?: number
}

export interface StockAdjustment {
  id: number
  number?: string
  date: string
  warehouseId: number
  warehouseName?: string
  status: DocumentStatus
  items: StockAdjustmentItem[]
  notes?: string
  createdAt?: string
}

export interface StockCountItem {
  id?: number
  itemId: number
  itemCode?: string
  itemName?: string
  systemQty: number
  countedQty: number
  variance: number
}

export interface StockCount {
  id: number
  number?: string
  date: string
  warehouseId: number
  warehouseName?: string
  status: DocumentStatus
  items: StockCountItem[]
  createdAt?: string
}

export interface MixDesignItem {
  id?: number
  itemId: number
  itemCode?: string
  itemName?: string
  quantity: number
  unitName?: string
}

export interface MixDesign {
  id: number
  code: string
  name: string
  description?: string
  items: MixDesignItem[]
  createdAt?: string
}

export interface ProductionBatch {
  id: number
  batchNumber: string
  date: string
  mixDesignId: number
  mixDesignName?: string
  quantityProduced: number
  notes?: string
  createdAt?: string
}

export interface MaterialConsumptionItem {
  id?: number
  itemId: number
  itemCode?: string
  itemName?: string
  theoreticalQty: number
  actualQty: number
  variance: number
  unitCost?: number
}

export interface MaterialConsumption {
  id: number
  batchId?: number
  batchNumber?: string
  mixDesignId?: number
  date: string
  warehouseId: number
  warehouseName?: string
  status: DocumentStatus
  items: MaterialConsumptionItem[]
  createdAt?: string
}

export interface InventoryTransaction {
  id: number
  transactionType: TransactionType
  direction: Direction
  itemId: number
  itemCode?: string
  itemName?: string
  warehouseId: number
  warehouseName?: string
  quantity: number
  unitCost: number
  totalCost: number
  documentId?: number
  documentType?: string
  date: string
  createdAt?: string
}

export interface ReportFilterParams {
  warehouseId?: number
  itemId?: number
  dateFrom?: string
  dateTo?: string
  page?: number
  per_page?: number
  search?: string
}

export interface CurrentStockReportItem {
  itemId: number
  itemCode: string
  itemName: string
  itemType: ItemType
  warehouseId: number
  warehouseName: string
  currentStock: number
  avgCost: number
  totalValuation: number
  minStock: number
}

export interface StockLedgerReportItem {
  id: number
  date: string
  transactionType: TransactionType
  direction: Direction
  itemId: number
  itemCode: string
  itemName: string
  warehouseId: number
  warehouseName: string
  quantity: number
  unitCost: number
  totalCost: number
  balanceAfter: number
}

export interface InventoryValuationReportItem {
  categoryId: number
  categoryName: string
  warehouseId: number
  warehouseName: string
  totalItems: number
  totalQuantity: number
  totalValuation: number
}

export interface MaterialConsumptionReportItem {
  itemId: number
  itemCode: string
  itemName: string
  totalTheoreticalQty: number
  totalActualQty: number
  varianceQty: number
  totalCost: number
}

export interface EquipmentCostReportItem {
  equipmentId: number
  equipmentCode: string
  equipmentName: string
  totalIssuesCount: number
  totalCost: number
  consumedItems: { itemId: number; itemName: string; quantity: number; cost: number }[]
}

export interface CostCenterUsageReportItem {
  costCenterId: number
  costCenterCode: string
  costCenterName: string
  totalIssuesCount: number
  totalCost: number
  consumedItems: { itemId: number; itemName: string; quantity: number; cost: number }[]
}

export interface IncomingMaterialsReportItem {
  supplierId: number
  supplierName: string
  itemId: number
  itemCode: string
  itemName: string
  totalReceivedQty: number
  avgUnitCost: number
  totalCost: number
}

export interface SparePartsUsageReportItem {
  itemId: number
  itemCode: string
  itemName: string
  equipmentId?: number
  equipmentName?: string
  totalIssuedQty: number
  totalCost: number
  lastIssuedDate: string
}
