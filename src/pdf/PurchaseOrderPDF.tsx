import {
    Document,
    Page,
    Text,
    View,
    StyleSheet
} from "@react-pdf/renderer";
import type { PurchaseOrder } from "@/components/PO/POTable";

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: "Helvetica"
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#222",
        paddingBottom: 12
    },
    pharmacyName: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 4
    },
    pharmacyInfo: {
        fontSize: 9,
        color: "#555"
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15
    },
    infoSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20
    },
    infoBox: {
        width: "48%"
    },
    label: {
        fontSize: 8,
        color: "#666",
        marginBottom: 3
    },
    value: {
        fontSize: 10,
        marginBottom: 6
    },
    table: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc"
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        minHeight: 28,
        alignItems: "center"
    },
    tableHeader: {
        backgroundColor: "#eeeeee",
        fontWeight: "bold"
    },
    cell: {
        padding: 6
    },
    productId: {
        width: "15%"
    },
    productName: {
        width: "40%"
    },
    brand: {
        width: "25%"
    },
    quantity: {
        width: "20%",
        textAlign: "right"
    },
    summary: {
        marginTop: 20,
        alignItems: "flex-end"
    },
    summaryRow: {
        flexDirection: "row",
        marginBottom: 6
    },
    summaryLabel: {
        width: 130,
        fontWeight: "bold"
    },
    summaryValue: {
        width: 70,
        textAlign: "right"
    },
    status: {
        marginTop: 15,
        fontSize: 10
    },
    footer: {
        marginTop: 50,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    signature: {
        width: 180,
        borderTopWidth: 1,
        borderTopColor: "#222",
        paddingTop: 6,
        textAlign: "center"
    }
});

type Props = {
    purchaseOrder: PurchaseOrder;
};

export default function PurchaseOrderPDF({
    purchaseOrder
}: Props) {
    const totalQuantity = purchaseOrder.items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const supplierName = purchaseOrder.supplier
        ? `${purchaseOrder.supplier.firstName} ${purchaseOrder.supplier.lastName}`
        : "-";

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.pharmacyName}>
                        PHARMACY MANAGEMENT SYSTEM
                    </Text>
                    <Text style={styles.pharmacyInfo}>
                        Pharmacy Address | Contact Number | Email
                    </Text>
                </View>

                <Text style={styles.title}>
                    PURCHASE ORDER
                </Text>

                <View style={styles.infoSection}>
                    <View style={styles.infoBox}>
                        <Text style={styles.label}>
                            PURCHASE ORDER NUMBER
                        </Text>
                        <Text style={styles.value}>
                            {purchaseOrder.orderNumber}
                        </Text>

                        <Text style={styles.label}>
                            CREATED DATE
                        </Text>
                        <Text style={styles.value}>
                            {new Date(
                                purchaseOrder.createdAt
                            ).toLocaleDateString("en-GB")}
                        </Text>

                        <Text style={styles.label}>
                            STATUS
                        </Text>
                        <Text style={styles.value}>
                            {purchaseOrder.status}
                        </Text>
                    </View>

                    <View style={styles.infoBox}>
                        <Text style={styles.label}>
                            SUPPLIER
                        </Text>
                        <Text style={styles.value}>
                            {supplierName}
                        </Text>

                        <Text style={styles.label}>
                            SUPPLIER ID
                        </Text>
                        <Text style={styles.value}>
                            {purchaseOrder.supplierId}
                        </Text>
                    </View>
                </View>

                <View style={styles.table}>
                    <View
                        style={[
                            styles.tableRow,
                            styles.tableHeader
                        ]}
                    >
                        <Text
                            style={[
                                styles.cell,
                                styles.productId
                            ]}
                        >
                            Product ID
                        </Text>

                        <Text
                            style={[
                                styles.cell,
                                styles.productName
                            ]}
                        >
                            Product
                        </Text>

                        <Text
                            style={[
                                styles.cell,
                                styles.brand
                            ]}
                        >
                            Brand
                        </Text>

                        <Text
                            style={[
                                styles.cell,
                                styles.quantity
                            ]}
                        >
                            Quantity
                        </Text>
                    </View>

                    {purchaseOrder.items.map((item) => (
                        <View
                            key={item.id}
                            style={styles.tableRow}
                        >
                            <Text
                                style={[
                                    styles.cell,
                                    styles.productId
                                ]}
                            >
                                {item.product?.productId || "-"}
                            </Text>

                            <Text
                                style={[
                                    styles.cell,
                                    styles.productName
                                ]}
                            >
                                {item.product?.name || "-"}
                            </Text>

                            <Text
                                style={[
                                    styles.cell,
                                    styles.brand
                                ]}
                            >
                                {item.product?.brand || "-"}
                            </Text>

                            <Text
                                style={[
                                    styles.cell,
                                    styles.quantity
                                ]}
                            >
                                {item.quantity}
                            </Text>
                        </View>
                    ))}
                </View>

                <View style={styles.summary}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>
                            Total Products:
                        </Text>

                        <Text style={styles.summaryValue}>
                            {purchaseOrder.items.length}
                        </Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>
                            Total Quantity:
                        </Text>

                        <Text style={styles.summaryValue}>
                            {totalQuantity}
                        </Text>
                    </View>
                </View>

                <Text style={styles.status}>
                    Order Status: {purchaseOrder.status}
                </Text>

                <View style={styles.footer}>
                    <Text style={styles.signature}>
                        Prepared By
                    </Text>

                    <Text style={styles.signature}>
                        Authorized Signature
                    </Text>
                </View>
            </Page>
        </Document>
    );
}