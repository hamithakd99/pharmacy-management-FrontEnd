import { Box, Button, HStack, Table, Text, } from "@chakra-ui/react";
import { FiEdit, FiEye, FiPrinter, FiX, } from "react-icons/fi";

interface OrderCustomer {
    id: number;
    firstName?: string;
    lastName?: string;
    phone?: string;
}

interface OrderItem {
    id: number;
    quantity: number;
}

interface Order {
    id: number;
    orderNumber: string;
    createdAt: string;
    status:
        | "PENDING"
        | "CONFIRMED"
        | "COMPLETED"
        | "CANCELLED";
    totalAmount: number;
    customer?: OrderCustomer | null;
    items: OrderItem[];
}

interface OrderTableProps {
    orders: Order[];
    onViewOrder?: (order: Order) => void;
    onEditOrder?: (order: Order) => void;
    onCancelOrder?: (order: Order) => void;
    onPrintOrder?: (order: Order) => void;
}

const OrderTable = ({
    orders,
    onViewOrder,
    onEditOrder,
    onCancelOrder,
    onPrintOrder,
}: OrderTableProps) => {
    const formatCurrency = (amount: number) => {
        return `Rs. ${Number(amount || 0).toLocaleString(
            "en-LK",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        )}`;
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-LK", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const getCustomerName = (
        customer?: OrderCustomer | null
    ) => {
        if (!customer) {
            return "Walk-in Customer";
        }

        const name =
            `${customer.firstName || ""} ${
                customer.lastName || ""
            }`.trim();

        return name || "Registered Customer";
    };

    const getStatusStyle = (status: Order["status"]) => {
        switch (status) {
            case "PENDING":
                return {
                    bg: "orange.100",
                    color: "orange.700",
                };

            case "CONFIRMED":
                return {
                    bg: "blue.100",
                    color: "blue.700",
                };

            case "COMPLETED":
                return {
                    bg: "green.100",
                    color: "green.700",
                };

            case "CANCELLED":
                return {
                    bg: "red.100",
                    color: "red.700",
                };
        }
    };

    return (
        <Box
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            overflow="hidden"
            bg="white"
        >
            <Box overflowX="auto">
                <Table.Root
                    variant="outline"
                    size="sm"
                    minW="1050px"
                >
                    <Table.Header>
                        <Table.Row bg="gray.50">
                            <Table.ColumnHeader
                                px={4}
                                py={3}
                            >
                                Order Number
                            </Table.ColumnHeader>

                            <Table.ColumnHeader
                                px={4}
                                py={3}
                            >
                                Customer
                            </Table.ColumnHeader>

                            <Table.ColumnHeader
                                px={4}
                                py={3}
                            >
                                Created Date
                            </Table.ColumnHeader>

                            <Table.ColumnHeader
                                px={4}
                                py={3}
                            >
                                Items
                            </Table.ColumnHeader>

                            <Table.ColumnHeader
                                px={4}
                                py={3}
                            >
                                Total
                            </Table.ColumnHeader>

                            <Table.ColumnHeader
                                px={4}
                                py={3}
                            >
                                Status
                            </Table.ColumnHeader>

                            <Table.ColumnHeader
                                px={4}
                                py={3}
                            >
                                Actions
                            </Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {orders.length === 0 ? (
                            <Table.Row>
                                <Table.Cell
                                    colSpan={7}
                                    textAlign="center"
                                    py={10}
                                >
                                    <Text color="gray.400">
                                        No orders found
                                    </Text>
                                </Table.Cell>
                            </Table.Row>
                        ) : (
                            orders.map((order) => {
                                const statusStyle =
                                    getStatusStyle(
                                        order.status
                                    );

                                const totalItems =
                                    order.items.reduce(
                                        (sum, item) =>
                                            sum +
                                            Number(
                                                item.quantity || 0
                                            ),
                                        0
                                    );

                                return (
                                    <Table.Row
                                        key={order.id}
                                        _hover={{
                                            bg: "gray.50",
                                        }}
                                    >
                                        <Table.Cell
                                            px={4}
                                            py={3}
                                        >
                                            <Text fontWeight="600">
                                                {order.orderNumber}
                                            </Text>
                                        </Table.Cell>

                                        <Table.Cell
                                            px={4}
                                            py={3}
                                        >
                                            {getCustomerName(
                                                order.customer
                                            )}
                                        </Table.Cell>

                                        <Table.Cell
                                            px={4}
                                            py={3}
                                        >
                                            {formatDate(
                                                order.createdAt
                                            )}
                                        </Table.Cell>

                                        <Table.Cell
                                            px={4}
                                            py={3}
                                        >
                                            {totalItems}
                                        </Table.Cell>

                                        <Table.Cell
                                            px={4}
                                            py={3}
                                        >
                                            <Text fontWeight="600">
                                                {formatCurrency(
                                                    order.totalAmount
                                                )}
                                            </Text>
                                        </Table.Cell>

                                        <Table.Cell
                                            px={4}
                                            py={3}
                                        >
                                            <Box
                                                display="inline-block"
                                                px={2.5}
                                                py={1}
                                                borderRadius="sm"
                                                bg={
                                                    statusStyle.bg
                                                }
                                                color={
                                                    statusStyle.color
                                                }
                                                fontSize="xs"
                                                fontWeight="600"
                                            >
                                                {order.status}
                                            </Box>
                                        </Table.Cell>

                                        <Table.Cell
                                            px={4}
                                            py={3}
                                        >
                                            <HStack gap={2}>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    colorPalette="blue"
                                                    onClick={() =>
                                                        onViewOrder?.(
                                                            order
                                                        )
                                                    }
                                                >
                                                    
                                                    View
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    // variant="outline"
                                                    colorPalette="orange"
                                                    disabled={
                                                        order.status ===
                                                            "COMPLETED" ||
                                                        order.status ===
                                                            "CANCELLED"
                                                    }
                                                    onClick={() =>
                                                        onEditOrder?.(
                                                            order
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    // variant="outline"
                                                    colorPalette="red"
                                                    disabled={
                                                        order.status ===
                                                        "CANCELLED"
                                                    }
                                                    onClick={() =>
                                                        onCancelOrder?.(
                                                            order
                                                        )
                                                    }
                                                >
                                                    Cancel
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    bg="gray.900"
                                                    color="white"
                                                    _hover={{
                                                        bg: "gray.700",
                                                    }}
                                                    onClick={() =>
                                                        onPrintOrder?.(
                                                            order
                                                        )
                                                    }
                                                >
                                                    Print
                                                </Button>
                                            </HStack>
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            })
                        )}
                    </Table.Body>
                </Table.Root>
            </Box>
        </Box>
    );
};

export default OrderTable;