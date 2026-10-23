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
        paddingTop: 20,
        paddingHorizontal: 28,
        paddingBottom: 28,
        fontSize: 8,
        fontFamily: "Helvetica",
        color: "#202938",
        backgroundColor: "#FFFFFF",
    },
    titleSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginTop: 8,
        marginBottom: 14,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 3,
    },
    subtitle: {
        fontSize: 7,
        color: "#64748B",
    },
    invoiceMeta: {
        width: "38%",
    },
    metaRow: {
        flexDirection: "row",
        marginBottom: 4,
    },
    metaLabel: {
        width: "34%",
        fontSize: 7,
        color: "#475569",
    },
    metaValue: {
        flex: 1,
        fontSize: 8,
        fontWeight: "bold",
        color: "#111827",
    },
    partySection: {
        marginBottom: 14,
    },
    sectionLabel: {
        fontSize: 7,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 3,
    },
    supplierName: {
        fontSize: 8,
        color: "#111827",
        marginBottom: 2,
    },
    supplierDetail: {
        fontSize: 7,
        color: "#374151",
        marginBottom: 2,
    },
    table: {
        width: "100%",
        marginTop: 3,
    },
    tableHeader: {
        flexDirection: "row",
        alignItems: "center",
        minHeight: 22,
        paddingVertical: 5,
        backgroundColor: "#E5E7EB",
        borderTopWidth: 0.7,
        borderBottomWidth: 0.7,
        borderColor: "#9CA3AF",
    },
    tableRow: {
        flexDirection: "row",
        alignItems: "center",
        minHeight: 21,
        paddingVertical: 4,
        borderBottomWidth: 0.5,
        borderBottomColor: "#D1D5DB",
    },
    cell: {
        paddingHorizontal: 4,
        fontSize: 7,
        color: "#111827",
    },
    headerCell: {
        fontSize: 7,
        fontWeight: "bold",
        color: "#111827",
    },
    itemCode: {
        width: "18%",
    },
    description: {
        width: "36%",
        paddingRight: 5,
    },
    brand: {
        width: "17%",
    },
    quantity: {
        width: "10%",
        textAlign: "right",
    },
    unitPrice: {
        width: "9%",
        textAlign: "right",
    },
    freeIssue: {
        width: "5%",
        textAlign: "right",
    },
    price: {
        width: "13%",
        textAlign: "right",
    },
    alternateRow: {
        backgroundColor: "#FAFAFA",
    },
    summaryContainer: {
        alignItems: "flex-end",
        marginTop: 12,
        marginBottom: 20,
    },
    summaryBox: {
        width: "42%",
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 4,
        borderBottomWidth: 0.5,
        borderBottomColor: "#D1D5DB",
    },
    summaryLabel: {
        fontSize: 8,
        color: "#374151",
    },
    summaryValue: {
        fontSize: 8,
        fontWeight: "bold",
        color: "#111827",
        textAlign: "right",
    },
    signatureSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 24,
        marginBottom: 16,
    },
    signature: {
        width: "27%",
        paddingTop: 5,
        borderTopWidth: 0.7,
        borderTopColor: "#6B7280",
        textAlign: "center",
        fontSize: 7,
        color: "#374151",
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
        (total, item) => total + Number(item.quantity || 0),
        0
    );

    const supplierName = purchaseOrder.supplier
        ? `${purchaseOrder.supplier.firstName ?? ""} ${purchaseOrder.supplier.lastName ?? ""}`.trim()
        : "-";

    const createdDate = new Date(purchaseOrder.createdAt);
    const formattedDate = Number.isNaN(createdDate.getTime())
        ? "-"
        : createdDate.toLocaleDateString("en-GB");

    return (
        <Document
            title={`Purchase Order ${purchaseOrder.orderNumber}`}
            author={settings.pharmacyName}
            subject="Purchase Order"
        >
            <Page size={[684, 792]} style={styles.page} wrap>
                <DocumentHeader settings={settings} />

                <View style={styles.titleSection}>
                    <View>
                        <Text style={styles.title}>PURCHASE ORDER</Text>
                        <Text style={styles.subtitle}>Supplier order</Text>
                    </View>

                    <View style={styles.invoiceMeta}>
                        <View style={styles.metaRow}>
                            <Text style={styles.metaLabel}>PO No:</Text>
                            <Text style={styles.metaValue}>
                                {purchaseOrder.orderNumber}
                            </Text>
                        </View>
                        <View style={styles.metaRow}>
                            <Text style={styles.metaLabel}>Date:</Text>
                            <Text style={styles.metaValue}>{formattedDate}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.partySection}>
                    <Text style={styles.sectionLabel}>SUPPLIER</Text>
                    <Text style={styles.supplierName}>{supplierName}</Text>
                    {purchaseOrder.supplier?.email ? (
                        <Text style={styles.supplierDetail}>
                            Email: {purchaseOrder.supplier.email}
                        </Text>
                    ) : null}
                    {purchaseOrder.supplier?.contactNumber ? (
                        <Text style={styles.supplierDetail}>
                            Phone: {purchaseOrder.supplier.contactNumber}
                        </Text>
                    ) : null}
                </View>

                <View style={styles.table}>
                    <View style={styles.tableHeader} fixed>
                        <Text style={[styles.cell, styles.headerCell, styles.itemCode]}>
                            Item Code
                        </Text>
                        <Text style={[styles.cell, styles.headerCell, styles.description]}>
                            Description
                        </Text>
                        <Text style={[styles.cell, styles.headerCell, styles.brand]}>
                            Brand
                        </Text>
                        <Text style={[styles.cell, styles.headerCell, styles.quantity]}>
                            Qty
                        </Text>
                        {/* <Text style={[styles.cell, styles.headerCell, styles.unitPrice]}>
                            Unit Price
                        </Text>
                        <Text style={[styles.cell, styles.headerCell, styles.freeIssue]}>
                            Free
                        </Text>
                        <Text style={[styles.cell, styles.headerCell, styles.price]}>
                            Price
                        </Text> */}
                    </View>

                    {purchaseOrder.items.map((item, index) => (
                        <View
                            key={item.id}
                            wrap={false}
                            style={[
                                styles.tableRow,
                                ...(index % 2 === 1 ? [styles.alternateRow] : []),
                            ]}
                        >
                            <Text style={[styles.cell, styles.itemCode]}>
                                {item.product?.productId || "-"}
                            </Text>
                            <Text style={[styles.cell, styles.description]}>
                                {item.product?.name || "-"}
                            </Text>
                            <Text style={[styles.cell, styles.brand]}>
                                {item.product?.brand || "-"}
                            </Text>
                            <Text style={[styles.cell, styles.quantity]}>
                                {item.quantity}
                            </Text>
                            {/* PurchaseOrder type currently exposes no unit-price/price fields. */}
                            {/* <Text style={[styles.cell, styles.unitPrice]}>-</Text>
                            <Text style={[styles.cell, styles.freeIssue]}>0</Text>
                            <Text style={[styles.cell, styles.price]}>-</Text> */}
                        </View>
                    ))}
                </View>

                <View style={styles.summaryContainer} wrap={false}>
                    <View style={styles.summaryBox}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Total Products</Text>
                            <Text style={styles.summaryValue}>
                                {purchaseOrder.items.length}
                            </Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Total Quantity</Text>
                            <Text style={styles.summaryValue}>{totalQuantity}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.signatureSection} wrap={false}>
                    <Text style={styles.signature}>Prepared By</Text>
                    <Text style={styles.signature}>Authorised By</Text>
                    <Text style={styles.signature}>Received By</Text>
                </View>

                <DocumentFooter settings={settings} />
            </Page>
        </Document>
    );
}
