
import { Badge, Box, Button, Dialog, Flex, Grid, HStack, Table, Text } from "@chakra-ui/react";
import { FiX } from "react-icons/fi";

interface OrderDetailsDialogProps {
    order: any | null;
    open: boolean;
    onClose: () => void;
}

const OrderDetailsDialog = ({ order, open, onClose }: OrderDetailsDialogProps) => {
    const formatCurrency = (amount: number) =>
        `Rs. ${Number(amount || 0).toLocaleString("en-LK", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;

    const getCustomerName = () => {
        if (!order?.customer) return "Walk-in Customer";
        const name = `${order.customer.firstName || ""} ${order.customer.lastName || ""}`.trim();
        return name || "Registered Customer";
    };

    return (
        <Dialog.Root open={open} onOpenChange={(details) => !details.open && onClose()} size="xl" placement="center">
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content maxW="850px" maxH="90vh" overflowY="auto">
                    <Dialog.Header borderBottomWidth="1px" borderColor="gray.100">
                        <Box>
                            <Dialog.Title>Order Details</Dialog.Title>
                            <Text fontSize="sm" color="gray.500" mt={1}>
                                {order?.orderNumber}
                            </Text>
                        </Box>
                        <Dialog.CloseTrigger asChild>
                            <Button variant="ghost" size="sm" position="absolute" right={4} top={4}>
                                <FiX />
                            </Button>
                        </Dialog.CloseTrigger>
                    </Dialog.Header>

                    <Dialog.Body py={5}>
                        {order && (
                            <Box>
                                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={5} mb={6}>
                                    <Box>
                                        <Text fontSize="xs" color="gray.500" mb={1}>Customer</Text>
                                        <Text fontWeight="600">{getCustomerName()}</Text>
                                        {order.customer?.phone && (
                                            <Text fontSize="sm" color="gray.600">{order.customer.phone}</Text>
                                        )}
                                        {order.customer?.email && (
                                            <Text fontSize="sm" color="gray.600">{order.customer.email}</Text>
                                        )}
                                    </Box>

                                    <Box>
                                        <Text fontSize="xs" color="gray.500" mb={1}>Order Information</Text>
                                        <Text fontWeight="600">{order.orderNumber}</Text>
                                        <Text fontSize="sm" color="gray.600">
                                            {new Date(order.createdAt).toLocaleString("en-LK")}
                                        </Text>
                                        <Text fontSize="sm" color="gray.600">
                                            Cashier: {order.cashier
                                                ? `${order.cashier.firstName || ""} ${order.cashier.lastName || ""}`.trim() || order.cashierId
                                                : order.cashierId || "N/A"}
                                        </Text>
                                    </Box>
                                </Grid>

                                <HStack gap={3} mb={5} flexWrap="wrap">
                                    <Badge colorPalette={order.status === "COMPLETED" ? "green" : order.status === "CANCELLED" ? "red" : "gray"}>
                                        {order.status}
                                    </Badge>
                                    <Badge colorPalette={order.paymentStatus === "PAID" ? "green" : order.paymentStatus === "PENDING" ? "orange" : "blue"}>
                                        {order.paymentStatus}
                                    </Badge>
                                    <Text fontSize="sm" color="gray.600">
                                        Payment Method: {order.paymentMethod?.replaceAll("_", " ") || "Not selected"}
                                    </Text>
                                </HStack>

                                <Box overflowX="auto" borderWidth="1px" borderColor="gray.200" borderRadius="md">
                                    <Table.Root size="sm" minW="550px">
                                        <Table.Header>
                                            <Table.Row bg="gray.50">
                                                <Table.ColumnHeader>Product</Table.ColumnHeader>
                                                <Table.ColumnHeader>Qty</Table.ColumnHeader>
                                                <Table.ColumnHeader textAlign="end">Unit Price</Table.ColumnHeader>
                                                <Table.ColumnHeader textAlign="end">Total</Table.ColumnHeader>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {order.items?.map((item: any) => (
                                                <Table.Row key={item.id}>
                                                    <Table.Cell>
                                                        <Text fontWeight="600">{item.product?.name || "Product"}</Text>
                                                        <Text fontSize="xs" color="gray.500">
                                                            {item.product?.productId || ""}
                                                        </Text>
                                                    </Table.Cell>
                                                    <Table.Cell>{item.quantity}</Table.Cell>
                                                    <Table.Cell textAlign="end">{formatCurrency(item.sellingPrice)}</Table.Cell>
                                                    <Table.Cell textAlign="end">{formatCurrency(item.lineTotal)}</Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table.Root>
                                </Box>

                                <Flex direction="column" align="flex-end" gap={2} mt={5}>
                                    <HStack justify="space-between" w="260px">
                                        <Text color="gray.600">Subtotal</Text>
                                        <Text>{formatCurrency(order.subtotal)}</Text>
                                    </HStack>
                                    <HStack justify="space-between" w="260px">
                                        <Text color="gray.600">Discount</Text>
                                        <Text>{formatCurrency(order.discountAmount)}</Text>
                                    </HStack>
                                    <HStack justify="space-between" w="260px" borderTopWidth="1px" pt={3}>
                                        <Text fontWeight="700">Total</Text>
                                        <Text fontWeight="700" color="blue.600">{formatCurrency(order.totalAmount)}</Text>
                                    </HStack>
                                </Flex>
                            </Box>
                        )}
                    </Dialog.Body>

                    <Dialog.Footer>
                        <Button variant="outline" onClick={onClose}>Close</Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};

export default OrderDetailsDialog;