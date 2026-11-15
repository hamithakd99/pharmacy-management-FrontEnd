
import {
    Badge,
    Box,
    Button,
    Dialog,
    Flex,
    Grid,
    HStack,
    Table,
    Text,
} from "@chakra-ui/react";

import { FiX } from "react-icons/fi";

interface OrderDetailsDialogProps {
    order: any | null;
    open: boolean;
    onClose: () => void;
}

interface GroupedOrderItem {
    id: string;
    product: any;
    productId: number | string;
    stockBatchItemId: number | string | null;
    expiryDate: string | Date | null;
    quantity: number;
    freeIssueQuantity: number;
    sellingPrice: number;
    lineTotal: number;
}

const OrderDetailsDialog = ({
    order,
    open,
    onClose,
}: OrderDetailsDialogProps) => {

    // Currency formatter
    const formatCurrency = (amount: number) =>
        `Rs. ${Number(amount || 0).toLocaleString("en-LK", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;

    // Date formatter
    const formatDate = (
        date: string | Date | null | undefined
    ) => {
        if (!date) return "N/A";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "N/A";
        }

        return parsedDate.toLocaleDateString("en-GB");
    };

    // Customer name
    const getCustomerName = () => {
        if (!order?.customer) {
            return "Walk-in Customer";
        }

        const name = `${order.customer.firstName || ""} ${
            order.customer.lastName || ""
        }`.trim();

        return name || "Registered Customer";
    };

    // Get expiry date
    const getExpiryDate = (item: any) => {
        return (
            item.stockBatchItem?.expiryDate ||
            item.stockBatch?.expiryDate ||
            item.expiryDate ||
            null
        );
    };

    // Group paid and free issue rows belonging to the same batch
    const getGroupedOrderItems = (): GroupedOrderItem[] => {
        const items = order?.items || [];

        const groupedItems = new Map<
            string,
            GroupedOrderItem
        >();

        items.forEach((item: any) => {
            const productId =
                item.productId ?? item.product?.id ?? "unknown";

            const stockBatchItemId =
                item.stockBatchItemId ??
                item.stockBatchItem?.id ??
                null;

            const expiryDate = getExpiryDate(item);

            /*
             * Same product + same stock batch = same display row.
             *
             * If batch ID is unavailable, use product + expiry date.
             * This allows paid and free issue rows to be combined
             * without mixing different expiry dates.
             */
            const groupKey = stockBatchItemId !== null
                ? `${productId}_batch_${stockBatchItemId}`
                : `${productId}_expiry_${
                    expiryDate
                        ? new Date(expiryDate).toISOString()
                        : "unknown"
                }`;

            const quantity = Number(item.quantity || 0);

            const freeIssueQuantity = Number(
                item.freeIssueQuantity || 0
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
                existingItem.quantity += quantity;

                existingItem.freeIssueQuantity +=
                    freeIssueQuantity;

                existingItem.lineTotal += lineTotal;

                // Keep the paid unit price instead of free issue price 0
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

    const groupedItems = getGroupedOrderItems();

    return (
        <Dialog.Root
            open={open}
            onOpenChange={(details) =>
                !details.open && onClose()
            }
            size="xl"
            placement="center"
        >
            <Dialog.Backdrop />

            <Dialog.Positioner>
                <Dialog.Content
                    maxW="950px"
                    maxH="90vh"
                    overflowY="auto"
                >
                    {/* Header */}
                    <Dialog.Header
                        borderBottomWidth="1px"
                        borderColor="gray.100"
                    >
                        <Box>
                            <Dialog.Title>
                                Order Details
                            </Dialog.Title>

                            <Text
                                fontSize="sm"
                                color="gray.500"
                                mt={1}
                            >
                                {order?.orderNumber}
                            </Text>
                        </Box>

                        <Dialog.CloseTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                position="absolute"
                                right={4}
                                top={4}
                            >
                                <FiX />
                            </Button>
                        </Dialog.CloseTrigger>
                    </Dialog.Header>

                    <Dialog.Body py={5}>
                        {order && (
                            <Box>

                                {/* Customer & Order Information */}
                                <Grid
                                    templateColumns={{
                                        base: "1fr",
                                        md: "1fr 1fr",
                                    }}
                                    gap={5}
                                    mb={6}
                                >
                                    {/* Customer */}
                                    <Box>
                                        <Text
                                            fontSize="xs"
                                            color="gray.500"
                                            mb={1}
                                        >
                                            Customer
                                        </Text>

                                        <Text fontWeight="600">
                                            {getCustomerName()}
                                        </Text>

                                        {order.customer?.phone && (
                                            <Text
                                                fontSize="sm"
                                                color="gray.600"
                                            >
                                                {order.customer.phone}
                                            </Text>
                                        )}

                                        {order.customer?.email && (
                                            <Text
                                                fontSize="sm"
                                                color="gray.600"
                                            >
                                                {order.customer.email}
                                            </Text>
                                        )}
                                    </Box>

                                    {/* Order Information */}
                                    <Box>
                                        <Text
                                            fontSize="xs"
                                            color="gray.500"
                                            mb={1}
                                        >
                                            Order Information
                                        </Text>

                                        <Text fontWeight="600">
                                            {order.orderNumber}
                                        </Text>

                                        <Text
                                            fontSize="sm"
                                            color="gray.600"
                                        >
                                            {order.createdAt
                                                ? new Date(
                                                    order.createdAt
                                                ).toLocaleString("en-LK")
                                                : "N/A"}
                                        </Text>

                                        <Text
                                            fontSize="sm"
                                            color="gray.600"
                                        >
                                            Cashier:{" "}
                                            {order.cashier
                                                ? `${order.cashier.firstName || ""} ${
                                                    order.cashier.lastName || ""
                                                }`.trim() ||
                                                order.cashierId
                                                : order.cashierId || "N/A"}
                                        </Text>
                                    </Box>
                                </Grid>

                                {/* Order & Payment Status */}
                                <HStack
                                    gap={3}
                                    mb={5}
                                    flexWrap="wrap"
                                >
                                    <Badge
                                        colorPalette={
                                            order.status === "COMPLETED"
                                                ? "green"
                                                : order.status === "CANCELLED"
                                                ? "red"
                                                : "gray"
                                        }
                                    >
                                        {order.status}
                                    </Badge>

                                    <Badge
                                        colorPalette={
                                            order.paymentStatus === "PAID"
                                                ? "green"
                                                : order.paymentStatus === "PENDING"
                                                ? "orange"
                                                : "blue"
                                        }
                                    >
                                        {order.paymentStatus}
                                    </Badge>

                                    <Text
                                        fontSize="sm"
                                        color="gray.600"
                                    >
                                        Payment Method:{" "}
                                        {order.paymentMethod?.replaceAll(
                                            "_",
                                            " "
                                        ) || "Not selected"}
                                    </Text>
                                </HStack>

                                {/* Order Items Table */}
                                <Box
                                    overflowX="auto"
                                    borderWidth="1px"
                                    borderColor="gray.200"
                                    borderRadius="md"
                                >
                                    <Table.Root
                                        size="sm"
                                        minW="750px"
                                    >
                                        <Table.Header>
                                            <Table.Row bg="gray.50">
                                                <Table.ColumnHeader>
                                                    Product
                                                </Table.ColumnHeader>

                                                <Table.ColumnHeader>
                                                    Expiry Date
                                                </Table.ColumnHeader>

                                                <Table.ColumnHeader>
                                                    Qty
                                                </Table.ColumnHeader>

                                                <Table.ColumnHeader>
                                                    Free Issue
                                                </Table.ColumnHeader>

                                                <Table.ColumnHeader textAlign="end">
                                                    Unit Price
                                                </Table.ColumnHeader>

                                                <Table.ColumnHeader textAlign="end">
                                                    Total
                                                </Table.ColumnHeader>
                                            </Table.Row>
                                        </Table.Header>

                                        <Table.Body>
                                            {groupedItems.length > 0 ? (
                                                groupedItems.map(
                                                    (item) => (
                                                        <Table.Row
                                                            key={item.id}
                                                        >
                                                            {/* Product */}
                                                            <Table.Cell>
                                                                <Text fontWeight="600">
                                                                    {item.product?.name ||
                                                                        "Product"}
                                                                </Text>

                                                                <Text
                                                                    fontSize="xs"
                                                                    color="gray.500"
                                                                >
                                                                    {item.product?.productId ||
                                                                        ""}
                                                                </Text>
                                                            </Table.Cell>

                                                            {/* Expiry Date */}
                                                            <Table.Cell>
                                                                <Text
                                                                    fontSize="sm"
                                                                    color="gray.600"
                                                                    whiteSpace="nowrap"
                                                                >
                                                                    {formatDate(
                                                                        item.expiryDate
                                                                    )}
                                                                </Text>
                                                            </Table.Cell>

                                                            {/* Paid Quantity */}
                                                            <Table.Cell>
                                                                <Text fontWeight="600">
                                                                    {item.quantity}
                                                                </Text>
                                                            </Table.Cell>

                                                            {/* Free Issue Quantity */}
                                                            <Table.Cell>
                                                                <Badge
                                                                    colorPalette={
                                                                        item.freeIssueQuantity > 0
                                                                            ? "green"
                                                                            : "gray"
                                                                    }
                                                                    variant="subtle"
                                                                >
                                                                    {item.freeIssueQuantity}
                                                                </Badge>
                                                            </Table.Cell>

                                                            {/* Unit Price */}
                                                            <Table.Cell textAlign="end">
                                                                {formatCurrency(
                                                                    item.sellingPrice
                                                                )}
                                                            </Table.Cell>

                                                            {/* Line Total */}
                                                            <Table.Cell textAlign="end">
                                                                <Text
                                                                    fontWeight="600"
                                                                    color="blue.700"
                                                                >
                                                                    {formatCurrency(
                                                                        item.lineTotal
                                                                    )}
                                                                </Text>
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    )
                                                )
                                            ) : (
                                                <Table.Row>
                                                    <Table.Cell
                                                        colSpan={6}
                                                        textAlign="center"
                                                        py={6}
                                                    >
                                                        <Text
                                                            color="gray.500"
                                                            fontSize="sm"
                                                        >
                                                            No order items found.
                                                        </Text>
                                                    </Table.Cell>
                                                </Table.Row>
                                            )}
                                        </Table.Body>
                                    </Table.Root>
                                </Box>

                                {/* Order Summary */}
                                <Flex
                                    direction="column"
                                    align="flex-end"
                                    gap={2}
                                    mt={5}
                                >
                                    <HStack
                                        justify="space-between"
                                        w="260px"
                                    >
                                        <Text color="gray.600">
                                            Subtotal
                                        </Text>

                                        <Text>
                                            {formatCurrency(
                                                order.subtotal
                                            )}
                                        </Text>
                                    </HStack>

                                    <HStack
                                        justify="space-between"
                                        w="260px"
                                    >
                                        <Text color="gray.600">
                                            Discount
                                        </Text>

                                        <Text>
                                            {formatCurrency(
                                                order.discountAmount
                                            )}
                                        </Text>
                                    </HStack>

                                    <HStack
                                        justify="space-between"
                                        w="260px"
                                        borderTopWidth="1px"
                                        pt={3}
                                    >
                                        <Text fontWeight="700">
                                            Total
                                        </Text>

                                        <Text
                                            fontWeight="700"
                                            color="blue.600"
                                        >
                                            {formatCurrency(
                                                order.totalAmount
                                            )}
                                        </Text>
                                    </HStack>
                                </Flex>
                            </Box>
                        )}
                    </Dialog.Body>

                    {/* Footer */}
                    <Dialog.Footer>
                        <Button
                            variant="outline"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};

export default OrderDetailsDialog;
