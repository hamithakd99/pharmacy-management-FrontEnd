
import {
    Badge,
    Box,
    Card,
    HStack,
    Table,
    Text,
    VStack,
} from "@chakra-ui/react";

type GRNItem = {
    id: number;
    productId: string;
    productName: string;
    brand?: string | null;
    receivedQuantity: number;
    buyingPrice: number;

    // Existing sellingPrice represents wholesale price
    sellingPrice: number;

    // Optional retail price
    retailPrice?: number | string | null;

    lineBuyingTotal: number;
    lineSellingTotal: number;
};

type GRNHistory = {
    id: number;
    batchNumber: string;
    invoiceNumber: string;
    receivedDate: string;
    paymentStatus: string;
    invoiceDiscountAmount: number;
    totalBuyingValue: number;
    totalSellingValue: number;
    items: GRNItem[];
};

type Props = {
    receivingHistory: GRNHistory[];
};

export default function POReceivingHistory({
    receivingHistory,
}: Props) {
    function formatPrice(
        value: number | string | null | undefined
    ): string {
        if (value === null || value === undefined || value === "") {
            return "—";
        }

        const price = Number(value);

        if (!Number.isFinite(price)) {
            return "—";
        }

        return `Rs. ${price.toLocaleString("en-LK", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    }

    function formatTotal(value: number | null | undefined): string {
        const amount = Number(value ?? 0);

        return amount.toLocaleString("en-LK", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }

    if (!receivingHistory || receivingHistory.length === 0) {
        return (
            <Card.Root mt={6}>
                <Card.Body>
                    <Text color="gray.500" textAlign="center">
                        No GRN history available.
                    </Text>
                </Card.Body>
            </Card.Root>
        );
    }

    return (
        <Box mt={6}>
            <HStack justify="space-between" mb={4}>
                <Text fontSize="lg" fontWeight="bold">
                    GRN / Receiving History
                </Text>

                <Badge
                    colorPalette="blue"
                    px={3}
                    py={1}
                    rounded="full"
                >
                    {receivingHistory.length} GRN
                    {receivingHistory.length !== 1 ? "s" : ""}
                </Badge>
            </HStack>

            <VStack align="stretch" gap={4}>
                {receivingHistory.map((grn) => (
                    <Card.Root key={grn.id} variant="outline">
                        <Card.Header>
                            <HStack
                                justify="space-between"
                                align="start"
                                wrap="wrap"
                            >
                                <Box>
                                    <Text fontWeight="bold" fontSize="md">
                                        Batch: {grn.batchNumber}
                                    </Text>

                                    <Text fontSize="sm" color="gray.600">
                                        Invoice: {grn.invoiceNumber}
                                    </Text>

                                    <Text fontSize="sm" color="gray.600">
                                        Received:{" "}
                                        {new Date(
                                            grn.receivedDate
                                        ).toLocaleDateString("en-GB")}
                                    </Text>
                                </Box>

                                <Badge
                                    colorPalette={
                                        grn.paymentStatus === "PAID"
                                            ? "green"
                                            : "orange"
                                    }
                                >
                                    {grn.paymentStatus}
                                </Badge>
                            </HStack>
                        </Card.Header>

                        <Card.Body overflowX="auto" pt={0}>
                            <Table.Root
                                size="sm"
                                variant="outline"
                                minW="950px"
                            >
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeader>
                                            Product ID
                                        </Table.ColumnHeader>

                                        <Table.ColumnHeader>
                                            Product
                                        </Table.ColumnHeader>

                                        <Table.ColumnHeader>
                                            Brand
                                        </Table.ColumnHeader>

                                        <Table.ColumnHeader textAlign="right">
                                            Received
                                        </Table.ColumnHeader>

                                        <Table.ColumnHeader textAlign="right">
                                            Buying Price
                                        </Table.ColumnHeader>

                                        <Table.ColumnHeader textAlign="right">
                                            Wholesale Price
                                        </Table.ColumnHeader>

                                        <Table.ColumnHeader textAlign="right">
                                            Retail Price
                                        </Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {grn.items.map((item) => (
                                        <Table.Row key={item.id}>
                                            <Table.Cell>
                                                <Text fontWeight="medium">
                                                    {item.productId}
                                                </Text>
                                            </Table.Cell>

                                            <Table.Cell>
                                                {item.productName}
                                            </Table.Cell>

                                            <Table.Cell>
                                                {item.brand || "—"}
                                            </Table.Cell>

                                            <Table.Cell textAlign="right">
                                                <Text fontWeight="bold">
                                                    {item.receivedQuantity}
                                                </Text>
                                            </Table.Cell>

                                            <Table.Cell textAlign="right" whiteSpace="nowrap">
                                                {formatPrice(item.buyingPrice)}
                                            </Table.Cell>

                                            <Table.Cell
                                                textAlign="right"
                                                whiteSpace="nowrap"
                                                fontWeight="medium"
                                            >
                                                {formatPrice(
                                                    item.sellingPrice
                                                )}
                                            </Table.Cell>

                                            <Table.Cell
                                                textAlign="right"
                                                whiteSpace="nowrap"
                                                fontWeight="medium"
                                            >
                                                {formatPrice(
                                                    item.retailPrice
                                                )}
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>

                            <HStack
                                justify="flex-end"
                                gap={6}
                                mt={4}
                                flexWrap="wrap"
                            >
                                <Text fontSize="sm" color="gray.600">
                                    Buying Total:{" "}
                                    <Text
                                        as="span"
                                        fontWeight="bold"
                                        color="gray.800"
                                    >
                                        Rs.{" "}
                                        {formatTotal(grn.totalBuyingValue)}
                                    </Text>
                                </Text>

                                <Text fontSize="sm" color="gray.600">
                                    Selling Total:{" "}
                                    <Text
                                        as="span"
                                        fontWeight="bold"
                                        color="gray.800"
                                    >
                                        Rs.{" "}
                                        {formatTotal(grn.totalSellingValue)}
                                    </Text>
                                </Text>
                            </HStack>
                        </Card.Body>
                    </Card.Root>
                ))}
            </VStack>
        </Box>
    );
}
