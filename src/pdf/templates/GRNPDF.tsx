
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
    paddingTop: 28,
    paddingHorizontal: 30,
    paddingBottom: 65,
    fontSize: 8,
    fontFamily: "Helvetica",
    color: "#1F2937",
  },

  title: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    color: "#163A63",
    marginTop: 18,
    marginBottom: 16,
  },

  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  infoBox: {
    width: "48%",
    padding: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 4,
  },

  label: {
    fontSize: 7,
    color: "#64748B",
    marginBottom: 3,
  },

  value: {
    fontSize: 9,
    color: "#1E293B",
    marginBottom: 9,
  },

  table: {
    width: "100%",
    marginTop: 3,
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    minHeight: 29,
    alignItems: "center",
  },

  tableHeader: {
    backgroundColor: "#163A63",
    borderBottomWidth: 0,
    minHeight: 32,
  },

  cell: {
    paddingHorizontal: 4,
    paddingVertical: 7,
    fontSize: 7,
  },

  headerCell: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 7,
  },

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

  summarySection: {
    marginTop: 14,
    alignItems: "flex-end",
  },

  summaryBox: {
    width: 245,
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
    fontSize: 8,
    color: "#475569",
  },

  summaryValue: {
    fontSize: 8,
    color: "#1E293B",
    textAlign: "right",
  },

  grandTotal: {
    borderTopWidth: 1,
    borderTopColor: "#CBD5E1",
    paddingTop: 8,
    marginTop: 2,
  },

  grandTotalText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#163A63",
  },

  paymentBadge: {
    alignSelf: "flex-start",
    marginTop: 3,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },

  paymentText: {
    fontSize: 8,
    fontWeight: "bold",
  },

  signatureSection: {
    marginTop: 35,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  signature: {
    width: 145,
    borderTopWidth: 1,
    borderTopColor: "#64748B",
    paddingTop: 6,
    textAlign: "center",
    fontSize: 7,
    color: "#475569",
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
      Number(item.receivedQuantity || 0) *
        Number(item.buyingPrice || 0),
    0
  );

  const totalSellingValue = items.reduce(
    (total, item) =>
      total +
      Number(item.receivedQuantity || 0) *
        Number(item.sellingPrice || 0),
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
      <Page
        size="A4"
        orientation="landscape"
        style={styles.page}
        wrap
      >
        <DocumentHeader settings={settings} />

        <Text style={styles.title}>GOODS RECEIVED NOTE</Text>

        <View style={styles.infoSection}>
          <View style={styles.infoBox}>
            <Text style={styles.label}>GRN / BATCH NUMBER</Text>
            <Text style={styles.value}>
              {stockBatch.batchNumber}
            </Text>

            <Text style={styles.label}>SUPPLIER</Text>
            <Text style={styles.value}>{supplierName}</Text>

            <Text style={styles.label}>PURCHASE ORDER</Text>
            <Text style={styles.value}>
              {stockBatch.purchaseOrder?.orderNumber ?? "-"}
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.label}>SUPPLIER INVOICE NUMBER</Text>
            <Text style={styles.value}>
              {stockBatch.invoiceNumber}
            </Text>

            <Text style={styles.label}>RECEIVED DATE</Text>
            <Text style={styles.value}>
              {formatDate(stockBatch.receivedDate)}
            </Text>

            <Text style={styles.label}>PAYMENT STATUS</Text>
            <View
              style={[
                styles.paymentBadge,
                paymentColors,
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

        <View style={styles.table}>
          <View
            style={[styles.tableRow, styles.tableHeader]}
            fixed
          >
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
                  ...(index % 2 === 1
                    ? [{ backgroundColor: "#F8FAFC" }]
                    : []),
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
              <Text style={styles.summaryLabel}>
                Total Buying Value
              </Text>
              <Text style={styles.summaryValue}>
                {money(totalBuyingValue)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Invoice Discount
              </Text>
              <Text style={styles.summaryValue}>
                {money(discount)}
              </Text>
            </View>

            <View style={[styles.summaryRow, styles.grandTotal]}>
              <Text style={styles.grandTotalText}>
                Final Buying Value
              </Text>
              <Text style={styles.grandTotalText}>
                {money(finalBuyingValue)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Total Selling Value
              </Text>
              <Text style={styles.summaryValue}>
                {money(totalSellingValue)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.signatureSection} wrap={false}>
          <Text style={styles.signature}>Received By</Text>
          <Text style={styles.signature}>Checked By</Text>
          <Text style={styles.signature}>Authorized Signature</Text>
        </View>

        <DocumentFooter settings={settings} />
      </Page>
    </Document>
  );
}
