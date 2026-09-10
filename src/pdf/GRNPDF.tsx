import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 35,
        fontSize: 9,
        fontFamily: "Helvetica"
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: "#222",
        paddingBottom: 12,
        marginBottom: 18
    },
    pharmacyName: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5
    },
    pharmacyInfo: {
        fontSize: 8,
        color: "#555"
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 18
    },
    infoSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 18
    },
    infoBox: {
        width: "48%"
    },
    label: {
        fontSize: 7,
        color: "#666",
        marginBottom: 2
    },
    value: {
        fontSize: 9,
        marginBottom: 7
    },
    table: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#999"
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        minHeight: 30,
        alignItems: "center"
    },
    tableHeader: {
        backgroundColor: "#eeeeee",
        fontWeight: "bold"
    },
    cell: {
        padding: 5
    },
    productId: {
        width: "10%"
    },
    product: {
        width: "22%"
    },
    brand: {
        width: "13%"
    },
    batch: {
        width: "13%"
    },
    expiry: {
        width: "10%"
    },
    quantity: {
        width: "8%",
        textAlign: "right"
    },
    price: {
        width: "12%",
        textAlign: "right"
    },
    total: {
        width: "12%",
        textAlign: "right"
    },
    summarySection: {
        marginTop: 15,
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
        width: 90,
        textAlign: "right"
    },
    grandTotal: {
        borderTopWidth: 1,
        borderTopColor: "#222",
        paddingTop: 7,
        marginTop: 4
    },
    footer: {
        marginTop: 45,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    signature: {
        width: 170,
        borderTopWidth: 1,
        borderTopColor: "#222",
        paddingTop: 6,
        textAlign: "center",
        fontSize: 8
    }
});

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
    };
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
};

export default function GRNPDF({
    stockBatch
}: Props) {

    const items = stockBatch.items ?? [];

    const totalBuyingValue = items.reduce(
        (total, item) =>
            total +
            Number(item.receivedQuantity) *
            Number(item.buyingPrice),
        0
    );

    const totalSellingValue = items.reduce(
        (total, item) =>
            total +
            Number(item.receivedQuantity) *
            Number(item.sellingPrice),
        0
    );

    const discount =
        Number(stockBatch.invoiceDiscountAmount ?? 0);

    const finalBuyingValue =
        totalBuyingValue - discount;

    const supplierName =
        `${stockBatch.supplier.firstName} ${stockBatch.supplier.lastName}`;

    const formatDate = (
        date?: string | null
    ) => {
        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "en-GB"
        );
    };

    const money = (value: number) =>
        `Rs. ${value.toFixed(2)}`;

    return (
        <Document
            title={`GRN ${stockBatch.batchNumber}`}
            author="Pharmacy Management System"
            subject="Goods Received Note"
        >
            <Page
                size="A4"
                orientation="landscape"
                style={styles.page}
            >

                <View style={styles.header}>
                    <Text style={styles.pharmacyName}>
                        PHARMACY MANAGEMENT SYSTEM
                    </Text>

                    <Text style={styles.pharmacyInfo}>
                        Pharmacy Address | Contact Number | Email
                    </Text>
                </View>

                <Text style={styles.title}>
                    GOODS RECEIVED NOTE
                </Text>

                <View style={styles.infoSection}>

                    <View style={styles.infoBox}>

                        <Text style={styles.label}>
                            GRN / BATCH NUMBER
                        </Text>

                        <Text style={styles.value}>
                            {stockBatch.batchNumber}
                        </Text>

                        <Text style={styles.label}>
                            INVOICE NUMBER
                        </Text>

                        <Text style={styles.value}>
                            {stockBatch.invoiceNumber}
                        </Text>

                        <Text style={styles.label}>
                            PURCHASE ORDER
                        </Text>

                        <Text style={styles.value}>
                            {stockBatch.purchaseOrder?.orderNumber ?? "-"}
                        </Text>

                    </View>

                    <View style={styles.infoBox}>

                        <Text style={styles.label}>
                            RECEIVED DATE
                        </Text>

                        <Text style={styles.value}>
                            {formatDate(
                                stockBatch.receivedDate
                            )}
                        </Text>

                        <Text style={styles.label}>
                            SUPPLIER
                        </Text>

                        <Text style={styles.value}>
                            {supplierName}
                        </Text>

                        <Text style={styles.label}>
                            PAYMENT STATUS
                        </Text>

                        <Text style={styles.value}>
                            {stockBatch.paymentStatus}
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
                                styles.product
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
                                styles.batch
                            ]}
                        >
                            Batch
                        </Text>

                        <Text
                            style={[
                                styles.cell,
                                styles.expiry
                            ]}
                        >
                            Expiry
                        </Text>

                        <Text
                            style={[
                                styles.cell,
                                styles.quantity
                            ]}
                        >
                            Qty
                        </Text>

                        <Text
                            style={[
                                styles.cell,
                                styles.price
                            ]}
                        >
                            Buying
                        </Text>

                        <Text
                            style={[
                                styles.cell,
                                styles.price
                            ]}
                        >
                            Selling
                        </Text>

                        <Text
                            style={[
                                styles.cell,
                                styles.total
                            ]}
                        >
                            Total
                        </Text>

                    </View>

                    {items.map((item) => {

                        const lineTotal =
                            Number(item.receivedQuantity) *
                            Number(item.buyingPrice);

                        return (
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
                                    {item.product?.productId ?? "-"}
                                </Text>

                                <Text
                                    style={[
                                        styles.cell,
                                        styles.product
                                    ]}
                                >
                                    {item.product?.name ?? "-"}
                                </Text>

                                <Text
                                    style={[
                                        styles.cell,
                                        styles.brand
                                    ]}
                                >
                                    {item.product?.brand ?? "-"}
                                </Text>

                                <Text
                                    style={[
                                        styles.cell,
                                        styles.batch
                                    ]}
                                >
                                    {stockBatch.batchNumber}
                                </Text>

                                <Text
                                    style={[
                                        styles.cell,
                                        styles.expiry
                                    ]}
                                >
                                    {formatDate(
                                        item.expiryDate
                                    )}
                                </Text>

                                <Text
                                    style={[
                                        styles.cell,
                                        styles.quantity
                                    ]}
                                >
                                    {item.receivedQuantity}
                                </Text>

                                <Text
                                    style={[
                                        styles.cell,
                                        styles.price
                                    ]}
                                >
                                    {money(
                                        Number(
                                            item.buyingPrice
                                        )
                                    )}
                                </Text>

                                <Text
                                    style={[
                                        styles.cell,
                                        styles.price
                                    ]}
                                >
                                    {money(
                                        Number(
                                            item.sellingPrice
                                        )
                                    )}
                                </Text>

                                <Text
                                    style={[
                                        styles.cell,
                                        styles.total
                                    ]}
                                >
                                    {money(lineTotal)}
                                </Text>

                            </View>
                        );
                    })}

                </View>

                <View style={styles.summarySection}>

                    <View style={styles.summaryRow}>

                        <Text style={styles.summaryLabel}>
                            Total Buying Value:
                        </Text>

                        <Text style={styles.summaryValue}>
                            {money(totalBuyingValue)}
                        </Text>

                    </View>

                    <View style={styles.summaryRow}>

                        <Text style={styles.summaryLabel}>
                            Invoice Discount:
                        </Text>

                        <Text style={styles.summaryValue}>
                            {money(discount)}
                        </Text>

                    </View>

                    <View
                        style={[
                            styles.summaryRow,
                            styles.grandTotal
                        ]}
                    >

                        <Text style={styles.summaryLabel}>
                            Final Buying Value:
                        </Text>

                        <Text style={styles.summaryValue}>
                            {money(finalBuyingValue)}
                        </Text>

                    </View>

                    <View style={styles.summaryRow}>

                        <Text style={styles.summaryLabel}>
                            Total Selling Value:
                        </Text>

                        <Text style={styles.summaryValue}>
                            {money(totalSellingValue)}
                        </Text>

                    </View>

                </View>

                <View style={styles.footer}>

                    <Text style={styles.signature}>
                        Received By
                    </Text>

                    <Text style={styles.signature}>
                        Checked By
                    </Text>

                    <Text style={styles.signature}>
                        Authorized Signature
                    </Text>

                </View>

            </Page>
        </Document>
    );
}