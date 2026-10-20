
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
  } | null;

  cashier?: {
    firstName?: string;
    lastName?: string;
  } | null;

  items: {
    id: number;
    quantity: number;
    sellingPrice: number;
    lineTotal: number;
    product?: {
      productId?: string;
      name?: string;
    } | null;
  }[];

  subtotal: number;
  discountAmount: number;
  totalAmount: number;

  paymentStatus: "PENDING" | "PAID" | "PARTIAL" | "REFUNDED";
  paymentMethod: "CASH" | "CARD" | "BANK_TRANSFER" | "OTHER" | null;
}

interface OrderInvoicePDFProps {
  order: OrderInvoice;
  settings: PharmacyDocumentSettings;
}

const formatCurrency = (amount: number) =>
  `Rs. ${Number(amount || 0).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date: string) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date || "-";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

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
    case "OTHER":
      return "Other";
    default:
      return "Not specified";
  }
};

const getPaymentStatus = (
  status: OrderInvoice["paymentStatus"]
) => {
  switch (status) {
    case "PAID":
      return {
        label: "PAID",
        color: "#15803D",
        backgroundColor: "#DCFCE7",
        description: "Payment completed",
      };

    case "PARTIAL":
      return {
        label: "PENDING",
        color: "#B45309",
        backgroundColor: "#FEF3C7",
        description: "Outstanding balance",
      };

    case "REFUNDED":
      return {
        label: "REFUNDED",
        color: "#B91C1C",
        backgroundColor: "#FEE2E2",
        description: "Payment refunded",
      };

    case "PENDING":
    default:
      return {
        label: "PENDING",
        color: "#B45309",
        backgroundColor: "#FEF3C7",
        description: "Payment outstanding",
      };
  }
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingHorizontal: 34,
    paddingBottom: 65,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#1F2937",
    backgroundColor: "#FFFFFF",
  },

  titleSection: {
    marginTop: 18,
    marginBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  invoiceTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#163A63",
    marginBottom: 5,
  },

  invoiceSubtitle: {
    fontSize: 8,
    color: "#64748B",
  },

  invoiceMeta: {
    alignItems: "flex-end",
  },

  metaLabel: {
    color: "#64748B",
    fontSize: 8,
    marginBottom: 3,
  },

  metaValue: {
    color: "#1E293B",
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 6,
  },

  section: {
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#163A63",
    marginBottom: 8,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#DCE5EF",
  },

  customerBox: {
    padding: 11,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 4,
  },

  customerName: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 5,
  },

  customerDetail: {
    fontSize: 8,
    color: "#475569",
    marginBottom: 3,
  },

  table: {
    width: "100%",
    marginTop: 4,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#163A63",
    color: "#FFFFFF",
    paddingVertical: 8,
    paddingHorizontal: 6,
    fontSize: 8,
    fontWeight: "bold",
  },

  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    alignItems: "center",
  },

  alternateRow: {
    backgroundColor: "#F8FAFC",
  },

  productColumn: {
    width: "39%",
    paddingRight: 5,
  },

  qtyColumn: {
    width: "12%",
    textAlign: "center",
  },

  priceColumn: {
    width: "23%",
    textAlign: "right",
    paddingRight: 5,
  },

  totalColumn: {
    width: "26%",
    textAlign: "right",
  },

  productName: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#1E293B",
  },

  productCode: {
    fontSize: 7,
    color: "#64748B",
    marginTop: 3,
  },

  cellText: {
    fontSize: 8,
    color: "#334155",
  },

  summaryContainer: {
    marginTop: 14,
    alignItems: "flex-end",
  },

  summaryBox: {
    width: "48%",
    padding: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 4,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
  },

  summaryLabel: {
    fontSize: 9,
    color: "#475569",
  },

  summaryValue: {
    fontSize: 9,
    color: "#1E293B",
    textAlign: "right",
  },

  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#CBD5E1",
    paddingTop: 8,
    marginTop: 2,
  },

  grandTotalLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#163A63",
  },

  grandTotalValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#163A63",
  },

  paymentBox: {
    marginTop: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: "#DCE5EF",
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
  },

  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  paymentTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#163A63",
  },

  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 4,
  },

  statusText: {
    fontSize: 8,
    fontWeight: "bold",
  },

  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  paymentLabel: {
    fontSize: 8,
    color: "#64748B",
  },

  paymentValue: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#334155",
  },

  paymentDescription: {
    fontSize: 8,
    color: "#64748B",
    marginTop: 4,
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

  const payment = getPaymentStatus(order.paymentStatus);

  return (
    <Document
      title={`Invoice ${order.orderNumber}`}
      author={settings.pharmacyName}
      subject="Customer Order Invoice"
    >
      <Page size={[684, 792]} style={styles.page} wrap>
        <DocumentHeader settings={settings} />

        <View style={styles.titleSection}>
          <View>
            <Text style={styles.invoiceTitle}>SALES INVOICE</Text>
            <Text style={styles.invoiceSubtitle}>
              Customer order invoice
            </Text>
          </View>

          <View style={styles.invoiceMeta}>
            <Text style={styles.metaLabel}>Invoice Number</Text>
            <Text style={styles.metaValue}>
              {order.orderNumber}
            </Text>

            <Text style={styles.metaLabel}>Invoice Date</Text>
            <Text style={styles.metaValue}>
              {formatDate(order.createdAt)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            BILL TO
          </Text>

          <View style={styles.customerBox}>
            <Text style={styles.customerName}>
              {customerName || "Walk-in Customer"}
            </Text>

            {order.customer?.phone ? (
              <Text style={styles.customerDetail}>
                Phone: {order.customer.phone}
              </Text>
            ) : null}

            {order.customer?.email ? (
              <Text style={styles.customerDetail}>
                Email: {order.customer.email}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            ORDER ITEMS
          </Text>

          <View style={styles.table}>
            <View style={styles.tableHeader} fixed>
              <Text style={styles.productColumn}>Product</Text>
              <Text style={styles.qtyColumn}>Qty</Text>
              <Text style={styles.priceColumn}>Unit Price</Text>
              <Text style={styles.totalColumn}>Line Total</Text>
            </View>

            {order.items.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.tableRow,
                  ...(index % 2 === 1
                    ? [styles.alternateRow]
                    : []),
                ]}
                wrap={false}
              >
                <View style={styles.productColumn}>
                  <Text style={styles.productName}>
                    {item.product?.name ?? "Product"}
                  </Text>

                  {item.product?.productId ? (
                    <Text style={styles.productCode}>
                      Code: {item.product.productId}
                    </Text>
                  ) : null}
                </View>

                <Text style={[styles.qtyColumn, styles.cellText]}>
                  {item.quantity}
                </Text>

                <Text style={[styles.priceColumn, styles.cellText]}>
                  {formatCurrency(item.sellingPrice)}
                </Text>

                <Text style={[styles.totalColumn, styles.cellText]}>
                  {formatCurrency(item.lineTotal)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.summaryContainer} wrap={false}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(order.subtotal)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={styles.summaryValue}>
                - {formatCurrency(order.discountAmount)}
              </Text>
            </View>

            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>
                Invoice Total
              </Text>
              <Text style={styles.grandTotalValue}>
                {formatCurrency(order.totalAmount)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.paymentBox} wrap={false}>
          <View style={styles.paymentHeader}>
            <Text style={styles.paymentTitle}>
              PAYMENT INFORMATION
            </Text>

            <View
              style={[
                styles.statusBadge,
                { backgroundColor: payment.backgroundColor },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: payment.color },
                ]}
              >
                {payment.label}
              </Text>
            </View>
          </View>

          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>
              Payment Method
            </Text>
            <Text style={styles.paymentValue}>
              {paymentMethodLabel(order.paymentMethod)}
            </Text>
          </View>

          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>
              Invoice Total
            </Text>
            <Text style={styles.paymentValue}>
              {formatCurrency(order.totalAmount)}
            </Text>
          </View>

          <Text style={styles.paymentDescription}>
            {payment.description}
          </Text>
        </View>

        <DocumentFooter settings={settings} />
      </Page>
    </Document>
  );
}
