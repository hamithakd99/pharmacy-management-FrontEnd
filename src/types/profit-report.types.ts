
import type { PaginationInfo } from "@/components/Pagination";

export interface ProfitItem {
    orderItemId: number;
    productId: number;
    productCode: string | null;
    productName: string;
    stockBatchItemId: number | null;

    paidQuantity: number;
    freeIssueQuantity: number;
    totalQuantity: number;

    sellingPrice: number;
    buyingPrice: number;

    sellingAmount: number;
    buyingCost: number;

    allocatedDiscount: number;
    netSales: number;

    grossProfit: number;
    netProfit: number;
    profitMargin: number;
}

export interface ProfitOrder {
    orderId: number;
    orderNumber: string;
    createdAt: string;
    status: string;
    customerName: string;

    subtotal: number;
    discountAmount: number;
    totalAmount: number;

    totalSellingAmount: number;
    totalBuyingCost: number;

    totalPaidQuantity: number;
    totalFreeIssueQuantity: number;
    totalQuantity: number;

    netProfit: number;
    profitMargin: number;

    items: ProfitItem[];
}

export interface ProfitSummary {
    totalOrders: number;
    totalSales: number;
    totalSellingAmount: number;
    totalBuyingCost: number;
    totalDiscount: number;
    totalNetProfit: number;
    totalPaidQuantity: number;
    totalFreeIssueQuantity: number;
    overallProfitMargin: number;
}

export interface ReportResponse {
    success: boolean;
    message: string;
    data: ProfitOrder[];
    summary: ProfitSummary;
    pagination: PaginationInfo;
}

export interface ChartItem {
    date: string;
    sales: number;
    profit: number;
}
