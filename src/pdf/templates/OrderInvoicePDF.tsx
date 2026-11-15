
import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import type { PharmacyDocumentSettings } from "../utils/document.types";
import DocumentHeader from "../components/DocumentHeader";
import DocumentFooter from "../components/DocumentFooter";

interface OrderInvoice {
  id: number;
  orderNumber: string;
  createdAt: string;

  customer?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    address?: string;
  } | null;

  cashier?: {
    firstName?: string;
    lastName?: string;
  } | null;

  items: {
    id: number;
    productId?: number;
    stockBatchItemId?: number | null;
    quantity: number;
    sellingPrice: number;
    lineTotal: number;

    // Support both old and new property names
    freeIssue?: number;
    freeIssueQuantity?: number;

    expiryDate?: string | null;

    stockBatchItem?: {
      id?: number;
      expiryDate?: string | null;
    } | null;

    product?: {
      id?: number;
      productId?: string;
      name?: string;
    } | null;
  }[];

  subtotal: number;
  discountAmount: number;
  totalAmount: number;

  paymentStatus: "PENDING" | "PAID" | "PARTIAL" | "REFUNDED";

  paymentMethod:
    | "CASH"
    | "CARD"
    | "BANK_TRANSFER"
    | "CHEQUE"
    | null;
}

interface OrderInvoicePDFProps {
  order: OrderInvoice;
  settings: PharmacyDocumentSettings;
}

interface GroupedInvoiceItem {
  id: string;
  product: OrderInvoice["items"][number]["product"];
  productId: number | string;
  stockBatchItemId: number | null;
  expiryDate: string | null;
  quantity: number;
  freeIssueQuantity: number;
  sellingPrice: number;
  lineTotal: number;
}

// Currency formatter
const money = (amount: number) =>
  Number(amount || 0).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// Date formatter
const formatDate = (value?: string | null) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
};

// Payment method
const paymentMethodLabel = (
  method: OrderInvoice["paymentMethod"]
) => {
  switch (method) {
    case "CASH":
      return "Cash";

    case "CARD":
      return "Card";

    case "BANK_TRANSFER":
      return "Bank Transfer";

    case "CHEQUE":
      return "Cheque";

    default:
      return "-";
  }
};

// Payment status
const paymentStatusLabel = (
  status: OrderInvoice["paymentStatus"]
) => {
  switch (status) {
    case "PAID":
      return "PAID";

    case "PARTIAL":
      return "PARTIAL PAYMENT";

    case "REFUNDED":
      return "REFUNDED";

    default:
      return "PENDING";
  }
};

// Get expiry date
const getExpiryDate = (
  item: OrderInvoice["items"][number]
): string | null => {
  return (
    item.stockBatchItem?.expiryDate ??
    item.expiryDate ??
    null
  );
};

// Group paid and free issue allocations into one invoice row
const groupInvoiceItems = (
  items: OrderInvoice["items"]
): GroupedInvoiceItem[] => {
  const groupedItems = new Map<
    string,
    GroupedInvoiceItem
  >();

  items.forEach((item) => {
    const productId =
      item.productId ??
      item.product?.id ??
      item.product?.productId ??
      "unknown";

    const stockBatchItemId =
      item.stockBatchItemId ??
      item.stockBatchItem?.id ??
      null;

    const expiryDate = getExpiryDate(item);

    /*
     * Same product + same batch = one invoice row.
     *
     * If batch ID is not available, use product + expiry date.
     * Different batches remain separate.
     */
    const groupKey =
      stockBatchItemId !== null
        ? `${productId}_batch_${stockBatchItemId}`
        : `${productId}_expiry_${
            expiryDate
              ? new Date(expiryDate).toISOString()
              : "unknown"
          }`;

    const quantity = Number(item.quantity || 0);

    const freeIssueQuantity = Number(
      item.freeIssueQuantity ??
      item.freeIssue ??
      0
    );

    const sellingPrice = Number(
      item.sellingPrice || 0
    );

    const lineTotal = Number(
      item.lineTotal ??
      quantity * sellingPrice
    );

    const existingItem = groupedItems.get(groupKey);

    if (existingItem) {
      // Add paid quantity
      existingItem.quantity += quantity;

      // Add free issue quantity
      existingItem.freeIssueQuantity += freeIssueQuantity;

      // Add paid line total only
      existingItem.lineTotal += lineTotal;

      // Preserve the paid unit price
      if (
        existingItem.sellingPrice === 0 &&
        sellingPrice > 0
      ) {
        existingItem.sellingPrice = sellingPrice;
      }
    } else {
      groupedItems.set(groupKey, {
        id: groupKey,
        product: item.product,
        productId,
        stockBatchItemId,
        expiryDate,
        quantity,
        freeIssueQuantity,
        sellingPrice,
        lineTotal,
      });
    }
  });

  return Array.from(groupedItems.values());
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingHorizontal: 25,
    paddingBottom: 24,
    fontFamily: "Helvetica",
    fontSize: 8,
    color: "#222222",
    backgroundColor: "#FFFFFF",
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 7,
    marginBottom: 10,
  },

  invoiceTitle: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 3,
  },

  smallMuted: {
    fontSize: 7,
    color: "#555555",
  },

  meta: {
    width: "36%",
  },

  metaRow: {
    flexDirection: "row",
    marginBottom: 4,
  },

  metaLabel: {
    width: "45%",
    fontSize: 7,
    color: "#444444",
  },

  metaValue: {
    flex: 1,
    fontSize: 8,
    fontWeight: "bold",
  },

  billBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  billColumn: {
    width: "58%",
  },

  billHeading: {
    fontSize: 7,
    fontWeight: "bold",
    marginBottom: 3,
  },

  billText: {
    fontSize: 7.5,
    marginBottom: 2,
  },

  table: {
    width: "100%",
    marginTop: 2,
  },

  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8E8E8",
    borderTopWidth: 0.8,
    borderBottomWidth: 0.8,
    borderColor: "#555555",
    paddingVertical: 5,
    paddingHorizontal: 3,
    fontSize: 7,
    fontWeight: "bold",
  },

  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 19,
    paddingVertical: 3,
    paddingHorizontal: 3,
    borderBottomWidth: 0.35,
    borderBottomColor: "#B8B8B8",
  },

  codeCol: {
    width: "14%",
    paddingRight: 3,
  },

  descCol: {
    width: "27%",
    paddingRight: 4,
  },

  expiryCol: {
    width: "15%",
    paddingRight: 3,
  },

  qtyCol: {
    width: "8%",
    textAlign: "right",
    paddingRight: 4,
  },

  unitCol: {
    width: "16%",
    textAlign: "right",
    paddingRight: 4,
  },

  freeCol: {
    width: "7%",
    textAlign: "right",
    paddingRight: 4,
  },

  priceCol: {
    width: "13%",
    textAlign: "right",
  },

  cell: {
    fontSize: 7.2,
    lineHeight: 1.15,
  },

  productName: {
    fontSize: 7.2,
    lineHeight: 1.15,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 9,
  },

  paymentTerms: {
    width: "55%",
    fontSize: 7.5,
  },

  totalBox: {
    width: "40%",
    alignItems: "stretch",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },

  totalLabel: {
    fontSize: 8,
  },

  totalValue: {
    fontSize: 8,
    textAlign: "right",
  },

  grandTotal: {
    borderTopWidth: 0.8,
    borderTopColor: "#444444",
    marginTop: 3,
    paddingTop: 5,
  },

  grandTotalText: {
    fontSize: 10,
    fontWeight: "bold",
  },

  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },

  signature: {
    width: "27%",
    borderTopWidth: 0.6,
    borderTopColor: "#555555",
    paddingTop: 4,
    textAlign: "center",
    fontSize: 7,
  },

  footer: {
    marginTop: 8,
  },
});

export default function OrderInvoicePDF({
  order,
  settings,
}: OrderInvoicePDFProps) {
  const customerName = order.customer
    ? `${order.customer.firstName ?? ""} ${
        order.customer.lastName ?? ""
      }`.trim()
    : "Walk-in Customer";

  // Combine paid and free issue records
  const groupedItems = groupInvoiceItems(
    order.items || []
  );

  return (
    <Document
      title={`Invoice ${order.orderNumber}`}
      author={settings.pharmacyName}
      subject="Customer Order Invoice"
    >
      <Page
        size="LETTER"
        style={styles.page}
        wrap
      >
        <DocumentHeader settings={settings} />

        {/* Invoice Header */}
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.invoiceTitle}>
              INVOICE
            </Text>

            <Text style={styles.smallMuted}>
              Customer Order
            </Text>
          </View>

          <View style={styles.meta}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>
                Invoice:
              </Text>

              <Text style={styles.metaValue}>
                {order.orderNumber}
              </Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>
                Date:
              </Text>

              <Text style={styles.metaValue}>
                {formatDate(order.createdAt)}
              </Text>
            </View>
          </View>
        </View>

        {/* Bill To */}
        <View style={styles.billBox}>
          <View style={styles.billColumn}>
            <Text style={styles.billHeading}>
              BILL TO
            </Text>

            <Text style={styles.billText}>
              {customerName || "Walk-in Customer"}
            </Text>

            {order.customer?.address ? (
              <Text style={styles.billText}>
                {order.customer.address}
              </Text>
            ) : null}

            {order.customer?.phone ? (
              <Text style={styles.billText}>
                Phone: {order.customer.phone}
              </Text>
            ) : null}

            {order.customer?.email ? (
              <Text style={styles.billText}>
                Email: {order.customer.email}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.table}>
          <View
            style={styles.tableHeader}
            fixed
          >
            <Text style={styles.codeCol}>
              Item Code
            </Text>

            <Text style={styles.descCol}>
              Description
            </Text>

            <Text style={styles.expiryCol}>
              Expiry Date
            </Text>

            <Text style={styles.qtyCol}>
              Qty
            </Text>

            <Text style={styles.freeCol}>
              Free
            </Text>
            
            <Text style={styles.unitCol}>
              Unit Price
            </Text>


            <Text style={styles.priceCol}>
              Price
            </Text>
          </View>

          {groupedItems.map((item) => (
            <View
              key={item.id}
              style={styles.tableRow}
              wrap={false}
            >
              {/* Item Code */}
              <Text
                style={[
                  styles.codeCol,
                  styles.cell,
                ]}
              >
                {item.product?.productId ?? "-"}
              </Text>

              {/* Description */}
              <Text
                style={[
                  styles.descCol,
                  styles.productName,
                ]}
              >
                {item.product?.name ?? "Product"}
              </Text>

              {/* Expiry Date */}
              <Text
                style={[
                  styles.expiryCol,
                  styles.cell,
                ]}
              >
                {formatDate(item.expiryDate)}
              </Text>

              {/* Paid Quantity */}
              <Text
                style={[
                  styles.qtyCol,
                  styles.cell,
                ]}
              >
                {item.quantity}
              </Text>

              {/* Free Issue Quantity */}
              <Text
                style={[
                  styles.freeCol,
                  styles.cell,
                ]}
              >
                {item.freeIssueQuantity}
              </Text>

              {/* Unit Price */}
              <Text
                style={[
                  styles.unitCol,
                  styles.cell,
                ]}
              >
                {money(item.sellingPrice)}
              </Text>

              {/* Line Total */}
              <Text
                style={[
                  styles.priceCol,
                  styles.cell,
                ]}
              >
                {money(item.lineTotal)}
              </Text>
            </View>
          ))}
        </View>

        {/* Payment & Summary */}
        <View
          style={styles.bottomRow}
          wrap={false}
        >
          <View style={styles.paymentTerms}>
            <Text>
              Payment Status:{" "}
              {paymentStatusLabel(order.paymentStatus)}
            </Text>

            <Text style={{ marginTop: 4 }}>
              Payment Method:{" "}
              {paymentMethodLabel(order.paymentMethod)}
            </Text>
          </View>

          <View style={styles.totalBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Subtotal
              </Text>

              <Text style={styles.totalValue}>
                LKR {money(order.subtotal)}
              </Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Discount
              </Text>

              <Text style={styles.totalValue}>
                LKR {money(order.discountAmount)}
              </Text>
            </View>

            <View
              style={[
                styles.totalRow,
                styles.grandTotal,
              ]}
            >
              <Text style={styles.grandTotalText}>
                TOTAL
              </Text>

              <Text style={styles.grandTotalText}>
                LKR {money(order.totalAmount)}
              </Text>
            </View>
          </View>
        </View>

        {/* Signatures */}
        <View
          style={styles.signatureRow}
          wrap={false}
        >
          <Text style={styles.signature}>
            PREPARED BY
          </Text>

          <Text style={styles.signature}>
            AUTHORISED BY
          </Text>

          <Text style={styles.signature}>
            RECEIVED BY
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <DocumentFooter settings={settings} />
        </View>
      </Page>
    </Document>
  );
}
