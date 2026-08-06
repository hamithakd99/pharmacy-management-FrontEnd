export type StockBatch = {
    id: number;

    batchNumber: string;

    invoiceNumber: string;

    receivedDate: string;

    paymentStatus: string;

    invoiceDiscountAmount: number;

    supplier: {
        id: number;
        firstName: string;
        lastName: string;
    };

    purchaseOrder?: {
        id: number;
        orderNumber: string;
    };

    items: any[];
};