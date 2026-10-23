import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
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
  cashier?: { firstName?: string; lastName?: string } | null;
  items: {
    id: number;
    quantity: number;
    sellingPrice: number;
    lineTotal: number;
    freeIssue?: number;
    product?: { productId?: string; name?: string } | null;
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

const money = (amount: number) =>
  Number(amount || 0).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value || "-"
    : date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const paymentMethodLabel = (method: OrderInvoice["paymentMethod"]) => {
  switch (method) {
    case "CASH": return "Cash";
    case "CARD": return "Card";
    case "BANK_TRANSFER": return "Bank Transfer";
    case "OTHER": return "Other";
    default: return "-";
  }
};

const paymentStatusLabel = (status: OrderInvoice["paymentStatus"]) => {
  switch (status) {
    case "PAID": return "PAID";
    case "PARTIAL": return "PARTIAL PAYMENT";
    case "REFUNDED": return "REFUNDED";
    default: return "PENDING";
  }
};

const styles = StyleSheet.create({
  page: {
    // Letter page: matches the printer's currently selected Letter paper size.
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
  invoiceTitle: { fontSize: 15, fontWeight: "bold", textAlign: "center", marginBottom: 3 },
  smallMuted: { fontSize: 7, color: "#555555" },
  meta: { width: "36%" },
  metaRow: { flexDirection: "row", marginBottom: 4 },
  metaLabel: { width: "45%", fontSize: 7, color: "#444444" },
  metaValue: { flex: 1, fontSize: 8, fontWeight: "bold" },
  billBox: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  billColumn: { width: "58%" },
  billHeading: { fontSize: 7, fontWeight: "bold", marginBottom: 3 },
  billText: { fontSize: 7.5, marginBottom: 2 },
  table: { width: "100%", marginTop: 2 },
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
  codeCol: { width: "17%", paddingRight: 3 },
  descCol: { width: "34%", paddingRight: 4 },
  qtyCol: { width: "10%", textAlign: "right", paddingRight: 4 },
  unitCol: { width: "17%", textAlign: "right", paddingRight: 4 },
  freeCol: { width: "9%", textAlign: "right", paddingRight: 4 },
  priceCol: { width: "13%", textAlign: "right" },
  cell: { fontSize: 7.2, lineHeight: 1.15 },
  productName: { fontSize: 7.2, lineHeight: 1.15 },
  bottomRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 9 },
  paymentTerms: { width: "55%", fontSize: 7.5 },
  totalBox: { width: "40%", alignItems: "stretch" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  totalLabel: { fontSize: 8 },
  totalValue: { fontSize: 8, textAlign: "right" },
  grandTotal: { borderTopWidth: 0.8, borderTopColor: "#444444", marginTop: 3, paddingTop: 5 },
  grandTotalText: { fontSize: 10, fontWeight: "bold" },
  signatureRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 30 },
  signature: { width: "27%", borderTopWidth: 0.6, borderTopColor: "#555555", paddingTop: 4, textAlign: "center", fontSize: 7 },
  footer: { marginTop: 8 },
});

export default function OrderInvoicePDF({ order, settings }: OrderInvoicePDFProps) {
  const customerName = order.customer
    ? `${order.customer.firstName ?? ""} ${order.customer.lastName ?? ""}`.trim()
    : "Walk-in Customer";

  return (
    <Document title={`Invoice ${order.orderNumber}`} author={settings.pharmacyName} subject="Customer Order Invoice">
      <Page size="LETTER" style={styles.page} wrap>
        <DocumentHeader settings={settings} />

        <View style={styles.titleRow}>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.smallMuted}>Customer Order</Text>
          </View>
          <View style={styles.meta}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Invoice:</Text>
              <Text style={styles.metaValue}>{order.orderNumber}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Date:</Text>
              <Text style={styles.metaValue}>{formatDate(order.createdAt)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.billBox}>
          <View style={styles.billColumn}>
            <Text style={styles.billHeading}>BILL TO</Text>
            <Text style={styles.billText}>{customerName || "Walk-in Customer"}</Text>
            {order.customer?.address ? <Text style={styles.billText}>{order.customer.address}</Text> : null}
            {order.customer?.phone ? <Text style={styles.billText}>Phone: {order.customer.phone}</Text> : null}
            {order.customer?.email ? <Text style={styles.billText}>Email: {order.customer.email}</Text> : null}
          </View>
          {/* <View style={{ width: "36%" }}>
            <Text style={styles.billHeading}>PAYMENT</Text>
            <Text style={styles.billText}>Status: {paymentStatusLabel(order.paymentStatus)}</Text>
            <Text style={styles.billText}>Method: {paymentMethodLabel(order.paymentMethod)}</Text>
          </View> */}
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader} fixed>
            <Text style={styles.codeCol}>Item Code</Text>
            <Text style={styles.descCol}>Description</Text>
            <Text style={styles.qtyCol}>Qty</Text>
            <Text style={styles.unitCol}>Unit Price</Text>
            <Text style={styles.freeCol}>Free</Text>
            <Text style={styles.priceCol}>Price</Text>
          </View>
          {order.items.map((item) => (
            <View key={item.id} style={styles.tableRow} wrap={false}>
              <Text style={[styles.codeCol, styles.cell]}>{item.product?.productId ?? "-"}</Text>
              <Text style={[styles.descCol, styles.productName]}>{item.product?.name ?? "Product"}</Text>
              <Text style={[styles.qtyCol, styles.cell]}>{item.quantity}</Text>
              <Text style={[styles.unitCol, styles.cell]}>{money(item.sellingPrice)}</Text>
              <Text style={[styles.freeCol, styles.cell]}>{Number(item.freeIssue ?? 0)}</Text>
              <Text style={[styles.priceCol, styles.cell]}>{money(item.lineTotal)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.bottomRow} wrap={false}>
          <View style={styles.paymentTerms}>
            <Text>Payment Status: {paymentStatusLabel(order.paymentStatus)}</Text>
            <Text style={{ marginTop: 4 }}>Payment Method: {paymentMethodLabel(order.paymentMethod)}</Text>
          </View>
          <View style={styles.totalBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>LKR {money(order.subtotal)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Discount</Text>
              <Text style={styles.totalValue}>LKR {money(order.discountAmount)}</Text>
            </View>
            <View style={[styles.totalRow, styles.grandTotal]}>
              <Text style={styles.grandTotalText}>TOTAL</Text>
              <Text style={styles.grandTotalText}>LKR {money(order.totalAmount)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.signatureRow} wrap={false}>
          <Text style={styles.signature}>PREPARED BY</Text>
          <Text style={styles.signature}>AUTHORISED BY</Text>
          <Text style={styles.signature}>RECEIVED BY</Text>
        </View>
        <View style={styles.footer}>
          <DocumentFooter settings={settings} />
        </View>
      </Page>
    </Document>
  );
}
