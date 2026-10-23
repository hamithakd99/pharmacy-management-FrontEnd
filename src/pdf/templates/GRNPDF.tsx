import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { PharmacyDocumentSettings } from "../utils/document.types";
import DocumentHeader from "../components/DocumentHeader";
import DocumentFooter from "../components/DocumentFooter";

type GRNItem = {
  id: number;
  productId: number;
  purchaseOrderItemId?: number | null;
  receivedQuantity: number;
  buyingPrice: number;
  sellingPrice: number;
  expiryDate: string;
  manufacturingDate?: string | null;
  product?: {
    id: number;
    productId?: string;
    name: string;
    brand?: string | null;
  } | null;
};

type GRNData = {
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
    orderNumber: string;
  } | null;
  items: GRNItem[];
};

type Props = {
  stockBatch: GRNData;
  settings: PharmacyDocumentSettings;
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingHorizontal: 28,
    paddingBottom: 28,
    fontSize: 8,
    fontFamily: "Helvetica",
    color: "#1F2937",
    backgroundColor: "#FFFFFF",
  },
  titleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 10,
    marginBottom: 18,
    paddingBottom: 10,
    borderBottomWidth: 0.7,
    borderBottomColor: "#D1D5DB",
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 8,
    color: "#64748B",
  },
  documentMeta: {
    width: "42%",
    paddingTop: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  metaLabel: {
    width: "38%",
    fontSize: 8,
    color: "#475569",
    paddingRight: 6,
  },
  metaValue: {
    flex: 1,
    fontSize: 8,
    fontWeight: "bold",
    color: "#111827",
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingVertical: 2,
  },
  infoBox: {
    width: "49%",
    paddingTop: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 9,
  },
  label: {
    width: "42%",
    fontSize: 8,
    color: "#475569",
    paddingRight: 8,
  },
  value: {
    flex: 1,
    fontSize: 8,
    fontWeight: "bold",
    color: "#111827",
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 7,
    marginTop: 2,
    paddingTop: 8,
    borderTopWidth: 0.7,
    borderTopColor: "#D1D5DB",
  },
  table: {
    width: "100%",
    marginTop: 2,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#D1D5DB",
    minHeight: 23,
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#E5E7EB",
    borderTopWidth: 0.7,
    borderTopColor: "#9CA3AF",
    borderBottomWidth: 0.7,
    borderBottomColor: "#9CA3AF",
    minHeight: 24,
  },
  cell: {
    paddingHorizontal: 4,
    paddingVertical: 5,
    fontSize: 7,
    color: "#111827",
  },
  headerCell: {
    color: "#111827",
    fontWeight: "bold",
    fontSize: 7,
  },
  /* Keep the existing GRN table columns and widths unchanged. */
  productId: {
    width: "10%",
  },
  product: {
    width: "21%",
  },
  brand: {
    width: "12%",
  },
  batch: {
    width: "12%",
  },
  expiry: {
    width: "10%",
  },
  quantity: {
    width: "7%",
    textAlign: "right",
  },
  price: {
    width: "12%",
    textAlign: "right",
  },
  total: {
    width: "14%",
    textAlign: "right",
  },
  alternateRow: {
    backgroundColor: "#FAFAFA",
  },
  summarySection: {
    marginTop: 12,
    alignItems: "flex-end",
  },
  summaryBox: {
    width: 245,
    padding: 9,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#9CA3AF",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 8,
    color: "#374151",
  },
  summaryValue: {
    fontSize: 8,
    color: "#111827",
    textAlign: "right",
  },
  grandTotal: {
    borderTopWidth: 1,
    borderTopColor: "#CBD5E1",
    paddingTop: 7,
    marginTop: 2,
  },
  grandTotalText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#111827",
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  paymentBadge: {
    alignSelf: "flex-start",
    marginTop: 2,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 2,
  },
  paymentText: {
    fontSize: 7,
    fontWeight: "bold",
  },
  signatureSection: {
    marginTop: 26,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signature: {
    width: "27%",
    borderTopWidth: 0.7,
    borderTopColor: "#6B7280",
    paddingTop: 5,
    textAlign: "center",
    fontSize: 7,
    color: "#374151",
  },
});

const formatDate = (date?: string | null) => {
  if (!date) return "-";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("en-GB");
};

const money = (value: number) =>
  `Rs. ${Number(value || 0).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function GRNPDF({ stockBatch, settings }: Props) {
  const items = stockBatch.items ?? [];

  const totalBuyingValue = items.reduce(
    (total, item) =>
      total +
      Number(item.receivedQuantity || 0) * Number(item.buyingPrice || 0),
    0
  );

  const totalSellingValue = items.reduce(
    (total, item) =>
      total +
      Number(item.receivedQuantity || 0) * Number(item.sellingPrice || 0),
    0
  );

  const discount = Number(stockBatch.invoiceDiscountAmount || 0);
  const finalBuyingValue = totalBuyingValue - discount;

  const supplierName = stockBatch.supplier
    ? `${stockBatch.supplier.firstName} ${stockBatch.supplier.lastName}`
    : "N/A";

  const paymentStatus = stockBatch.paymentStatus || "PENDING";
  const paymentColors =
    paymentStatus === "PAID"
      ? { backgroundColor: "#DCFCE7", color: "#15803D" }
      : { backgroundColor: "#FEF3C7", color: "#B45309" };

  return (
    <Document
      title={`GRN-${stockBatch.batchNumber}`}
      author={settings.pharmacyName}
      subject="Goods Received Note"
    >
      <Page size="A4" orientation="landscape" style={styles.page} wrap>
        <DocumentHeader settings={settings} />

        <View style={styles.titleSection}>
          <View>
            <Text style={styles.title}>GOODS RECEIVED NOTE</Text>
            <Text style={styles.subtitle}>Stock receiving document</Text>
          </View>

          <View style={styles.documentMeta}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>GRN / Batch No:</Text>
              <Text style={styles.metaValue}>{stockBatch.batchNumber}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Received Date:</Text>
              <Text style={styles.metaValue}>
                {formatDate(stockBatch.receivedDate)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>SUPPLIER</Text>
              <Text style={styles.value}>{supplierName}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>PURCHASE ORDER</Text>
              <Text style={styles.value}>
                {stockBatch.purchaseOrder?.orderNumber ?? "-"}
              </Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>SUPPLIER INVOICE NUMBER</Text>
              <Text style={styles.value}>{stockBatch.invoiceNumber || "-"}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>PAYMENT STATUS</Text>
              <View
                style={[
                  styles.paymentBadge,
                  { backgroundColor: paymentColors.backgroundColor },
                ]}
              >
                <Text
                  style={[
                    styles.paymentText,
                    { color: paymentColors.color },
                  ]}
                >
                  {paymentStatus}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>RECEIVED ITEMS</Text>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]} fixed>
            {[
              ["Product ID", styles.productId],
              ["Product", styles.product],
              ["Brand", styles.brand],
              ["Batch", styles.batch],
              ["Expiry", styles.expiry],
              ["Qty", styles.quantity],
              ["Buying Price", styles.price],
              ["Selling Price", styles.price],
              ["Line Total", styles.total],
            ].map(([label, columnStyle], index) => (
              <Text
                key={index}
                style={[
                  styles.cell,
                  styles.headerCell,
                  columnStyle as typeof styles.productId,
                ]}
              >
                {label as string}
              </Text>
            ))}
          </View>

          {items.map((item, index) => {
            const lineTotal =
              Number(item.receivedQuantity || 0) *
              Number(item.buyingPrice || 0);

            return (
              <View
                key={item.id}
                style={[
                  styles.tableRow,
                  ...(index % 2 === 1 ? [styles.alternateRow] : []),
                ]}
                wrap={false}
              >
                <Text style={[styles.cell, styles.productId]}>
                  {item.product?.productId ?? "-"}
                </Text>
                <Text style={[styles.cell, styles.product]}>
                  {item.product?.name ?? "-"}
                </Text>
                <Text style={[styles.cell, styles.brand]}>
                  {item.product?.brand ?? "-"}
                </Text>
                <Text style={[styles.cell, styles.batch]}>
                  {stockBatch.batchNumber}
                </Text>
                <Text style={[styles.cell, styles.expiry]}>
                  {formatDate(item.expiryDate)}
                </Text>
                <Text style={[styles.cell, styles.quantity]}>
                  {item.receivedQuantity}
                </Text>
                <Text style={[styles.cell, styles.price]}>
                  {money(Number(item.buyingPrice))}
                </Text>
                <Text style={[styles.cell, styles.price]}>
                  {money(Number(item.sellingPrice))}
                </Text>
                <Text style={[styles.cell, styles.total]}>
                  {money(lineTotal)}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.summarySection} wrap={false}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Buying Value</Text>
              <Text style={styles.summaryValue}>
                {money(totalBuyingValue)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Invoice Discount</Text>
              <Text style={styles.summaryValue}>{money(discount)}</Text>
            </View>

            <View style={[styles.summaryRow, styles.grandTotal]}>
              <Text style={styles.grandTotalText}>Final Buying Value</Text>
              <Text style={styles.grandTotalText}>
                {money(finalBuyingValue)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Selling Value</Text>
              <Text style={styles.summaryValue}>
                {money(totalSellingValue)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.signatureSection} wrap={false}>
          <Text style={styles.signature}>Received By</Text>
          <Text style={styles.signature}>Checked By</Text>
          <Text style={styles.signature}>Authorised By</Text>
        </View>

        <DocumentFooter settings={settings} />
      </Page>
    </Document>
  );
}
