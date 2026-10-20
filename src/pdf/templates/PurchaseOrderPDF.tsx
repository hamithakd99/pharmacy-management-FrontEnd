
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";

import type { PurchaseOrder } from "@/components/PO/POTable";
import DocumentHeader from "../components/DocumentHeader";
import type { PharmacyDocumentSettings } from "../utils/document.types";
import DocumentFooter from "../components/DocumentFooter";
const styles = StyleSheet.create({
    page: {
        paddingTop: 32,
        paddingHorizontal: 40,
        paddingBottom: 35,
        fontSize: 9,
        fontFamily: "Helvetica",
        color: "#202938",
        backgroundColor: "#FFFFFF",
    },

    titleSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 22,
    },

    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#163A70",
        marginBottom: 5,
    },

    subtitle: {
        fontSize: 9,
        color: "#6B7280",
    },

    documentInfo: {
        backgroundColor: "#F1F5F9",
        padding: 11,
        borderRadius: 5,
        minWidth: 175,
    },

    infoLabel: {
        fontSize: 7,
        color: "#64748B",
        marginBottom: 4,
    },

    orderNumber: {
        fontSize: 11,
        fontWeight: "bold",
        color: "#163A70",
        marginBottom: 6,
    },

    infoValue: {
        fontSize: 9,
        color: "#334155",
    },

    supplierSection: {
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 5,
        padding: 12,
        marginBottom: 22,
    },

    sectionLabel: {
        fontSize: 8,
        fontWeight: "bold",
        color: "#64748B",
        marginBottom: 6,
    },

    supplierName: {
        fontSize: 11,
        fontWeight: "bold",
        color: "#1E293B",
    },

    sectionTitle: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#163A70",
        marginBottom: 10,
    },

    table: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#D8E0EA",
        borderRadius: 3,
    },

    tableHeader: {
        flexDirection: "row",
        alignItems: "center",
        minHeight: 32,
        backgroundColor: "#163A70",
    },

    tableRow: {
        flexDirection: "row",
        alignItems: "center",
        minHeight: 31,
        borderBottomWidth: 1,
        borderBottomColor: "#E2E8F0",
    },

    lastRow: {
        borderBottomWidth: 0,
    },

    cell: {
        paddingVertical: 8,
        paddingHorizontal: 7,
        fontSize: 8,
    },

    headerCell: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 8,
    },

    productId: {
        width: "20%",
    },

    productName: {
        width: "38%",
    },

    brand: {
        width: "24%",
    },

    quantity: {
        width: "18%",
        textAlign: "right",
    },

    alternateRow: {
        backgroundColor: "#F8FAFC",
    },

    summaryContainer: {
        alignItems: "flex-end",
        marginTop: 18,
        marginBottom: 32,
    },

    summaryBox: {
        width: 225,
        padding: 12,
        backgroundColor: "#F1F5F9",
        borderRadius: 5,
        borderLeftWidth: 3,
        borderLeftColor: "#2563EB",
    },

    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 9,
    },

    summaryLastRow: {
        marginBottom: 0,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#CBD5E1",
    },

    summaryLabel: {
        fontSize: 9,
        color: "#475569",
    },

    summaryValue: {
        fontSize: 9,
        fontWeight: "bold",
        color: "#1E293B",
        textAlign: "right",
    },

    signatureSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        marginBottom: 25,
    },

    signature: {
        width: 190,
        paddingTop: 7,
        borderTopWidth: 1,
        borderTopColor: "#94A3B8",
        textAlign: "center",
        fontSize: 8,
        color: "#475569",
    },
});

type Props = {
    purchaseOrder: PurchaseOrder;
    settings: PharmacyDocumentSettings;
};

export default function PurchaseOrderPDF({
    purchaseOrder,
    settings,
}: Props) {
    const totalQuantity = purchaseOrder.items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const supplierName = purchaseOrder.supplier
        ? `${purchaseOrder.supplier.firstName} ${purchaseOrder.supplier.lastName}`
        : "-";

    const createdDate = new Date(purchaseOrder.createdAt);

    const formattedDate = Number.isNaN(createdDate.getTime())
        ? "-"
        : createdDate.toLocaleDateString("en-GB");

    return (
        <Document>
            <Page size={[684, 792]} style={styles.page}>
                {/* SHARED PHARMACY HEADER */}
                <DocumentHeader settings={settings} />

                {/* PURCHASE ORDER TITLE AND DETAILS */}
                <View style={styles.titleSection}>
                    <View>
                        <Text style={styles.title}>
                            PURCHASE ORDER
                        </Text>

                        <Text style={styles.subtitle}>
                            Supplier order document
                        </Text>
                    </View>

                    <View style={styles.documentInfo}>
                        <Text style={styles.infoLabel}>
                            PURCHASE ORDER NUMBER
                        </Text>

                        <Text style={styles.orderNumber}>
                            {purchaseOrder.orderNumber}
                        </Text>

                        <Text style={styles.infoLabel}>
                            ORDER DATE
                        </Text>

                        <Text style={styles.infoValue}>
                            {formattedDate}
                        </Text>
                    </View>
                </View>

                {/* SUPPLIER */}
                <View style={styles.supplierSection}>
                    <Text style={styles.sectionLabel}>
                        SUPPLIER
                    </Text>

                    <Text style={styles.supplierName}>
                        {supplierName}
                    </Text>
                </View>

                {/* ORDER ITEMS */}
                <Text style={styles.sectionTitle}>
                    Order Items
                </Text>

                <View style={styles.table}>
                    <View style={styles.tableHeader} fixed>
                        <Text
                            style={[
                                styles.cell,
                                styles.headerCell,
                                styles.productId,
                            ]}
                        >
                            Product ID
                        </Text>

                        <Text
                            style={[
                                styles.cell,
                                styles.headerCell,
                                styles.productName,
                            ]}
                        >
                            Product
                        </Text>

                        <Text
                            style={[
                                styles.cell,
                                styles.headerCell,
                                styles.brand,
                            ]}
                        >
                            Brand
                        </Text>

                        <Text
                            style={[
                                styles.cell,
                                styles.headerCell,
                                styles.quantity,
                            ]}
                        >
                            Quantity
                        </Text>
                    </View>

                    {purchaseOrder.items.map((item, index) => (
                        <View
                            key={item.id}
                            wrap={false}
                            style={[
                                styles.tableRow,
                                ...(index % 2 === 1
                                    ? [styles.alternateRow]
                                    : []),
                                ...(index === purchaseOrder.items.length - 1
                                    ? [styles.lastRow]
                                    : []),
                            ]}
                        >
                            <Text
                                style={[
                                    styles.cell,
                                    styles.productId,
                                ]}
                            >
                                {item.product?.productId || "-"}
                            </Text>

                            <Text
                                style={[
                                    styles.cell,
                                    styles.productName,
                                ]}
                            >
                                {item.product?.name || "-"}
                            </Text>

                            <Text
                                style={[
                                    styles.cell,
                                    styles.brand,
                                ]}
                            >
                                {item.product?.brand || "-"}
                            </Text>

                            <Text
                                style={[
                                    styles.cell,
                                    styles.quantity,
                                ]}
                            >
                                {item.quantity}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* TOTALS */}
                <View style={styles.summaryContainer} wrap={false}>
                    <View style={styles.summaryBox}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>
                                Total Products
                            </Text>

                            <Text style={styles.summaryValue}>
                                {purchaseOrder.items.length}
                            </Text>
                        </View>

                        <View
                            style={[
                                styles.summaryRow,
                                styles.summaryLastRow,
                            ]}
                        >
                            <Text style={styles.summaryLabel}>
                                Total Quantity
                            </Text>

                            <Text style={styles.summaryValue}>
                                {totalQuantity}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* SIGNATURES */}
                <View style={styles.signatureSection} wrap={false}>
                    <Text style={styles.signature}>
                        Prepared By
                    </Text>

                    <Text style={styles.signature}>
                        Authorized Signature
                    </Text>
                </View>

                {/* SHARED FOOTER */}
                <DocumentFooter settings={settings} />
            </Page>
        </Document>
    );
}
