
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "PARTIAL"
  | "REFUNDED";

export type PaymentMethod =
  | "CASH"
  | "CARD"
  | "BANK_TRANSFER"
  | "OTHER"
  | null;

export interface OrderCustomer {
  id: number;
  userId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  contactNumber?: string;
}

export interface OrderCashier {
  userId: string;
  firstName: string;
  lastName: string;
}

export interface OrderProduct {
  id: number;
  productId: string;
  name: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  sellingPrice: number;
  lineTotal: number;
  product: OrderProduct;
}

export interface Order {
  id: number;
  orderNumber: string;
  createdAt: string;

  customerId: number | null;
  customer: OrderCustomer | null;
  cashier: OrderCashier;

  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;

  subtotal: number;
  discountAmount: number;
  totalAmount: number;

  items: OrderItem[];
}
