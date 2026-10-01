import { Badge, Box, Button, Flex, HStack, Table, Text, VStack, } from "@chakra-ui/react";
import { FiArrowRight, FiCalendar, FiEye, FiShoppingBag, } from "react-icons/fi";

interface OrderCustomer {
    id: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
}

interface OrderItem {
    id: number;
    quantity: number;
    sellingPrice: number;
    lineTotal: number;
    product: {
        id: number;
        productId: string;
        name: string;
    };
}

interface Order {
    id: number;
    orderNumber: string;
    createdAt: string;
    status: "DRAFT" | "COMPLETED" | "CANCELLED";
    paymentStatus: "PENDING" | "PAID" | "PARTIAL" | "REFUNDED";
    paymentMethod?: "CASH" | "CARD" | "BANK_TRANSFER" | "OTHER" | null;
    subtotal: number;
    discountAmount: number;
    totalAmount: number;
    customer?: OrderCustomer | null;
    items: OrderItem[];
}

interface RecentOrdersProps {
    orders: Order[];
    onViewOrder?: (order: Order) => void;
    onViewAll?: () => void;
}

const RecentOrders = ({
    orders,
    onViewOrder,
    onViewAll,
}: RecentOrdersProps) => {
    const formatCurrency = (amount: number) => {
        return `Rs. ${amount.toLocaleString("en-LK", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);

        return date.toLocaleDateString("en-LK", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);

        return date.toLocaleTimeString("en-LK", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getCustomerName = (customer?: OrderCustomer | null) => {
        if (!customer) {
            return "Walk-in Customer";
        }

        const fullName = `${customer.firstName || ""} ${
            customer.lastName || ""
        }`.trim();

        return fullName || "Registered Customer";
    };

    const getPaymentStatusColor = (status: Order["paymentStatus"]) => {
        switch (status) {
            case "PAID":
                return "green";

            case "PARTIAL":
                return "orange";

            case "PENDING":
                return "yellow";

            case "REFUNDED":
                return "purple";

            default:
                return "gray";
        }
    };

    const getOrderStatusColor = (status: Order["status"]) => {
        switch (status) {
            case "COMPLETED":
                return "green";

            case "CANCELLED":
                return "red";

            case "DRAFT":
                return "gray";

            default:
                return "gray";
        }
    };

    return (
        <Box
            bg="white"
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="xl"
            overflow="hidden"
            boxShadow="sm"
        >
            <Flex
                px={{ base: 4, md: 5 }}
                py={4}
                align="center"
                justify="space-between"
                borderBottomWidth="1px"
                borderColor="gray.100"
            >
                <HStack gap={3}>
                    <Flex
                        w="42px"
                        h="42px"
                        align="center"
                        justify="center"
                        borderRadius="lg"
                        bg="blue.50"
                        color="blue.600"
                    >
                        <FiShoppingBag size={20} />
                    </Flex>

                    <Box>
                        <Text
                            fontSize="lg"
                            fontWeight="700"
                            color="gray.800"
                        >
                            Recent Orders
                        </Text>

                        <Text
                            fontSize="sm"
                            color="gray.500"
                            mt={0.5}
                        >
                            Latest customer orders
                        </Text>
                    </Box>
                </HStack>

                <Button
                    variant="ghost"
                    colorPalette="blue"
                    size="sm"
                    onClick={onViewAll}
                    disabled={!onViewAll}
                >
                    View All
                    <FiArrowRight />
                </Button>
            </Flex>

            {orders.length === 0 ? (
                <Flex
                    minH="220px"
                    align="center"
                    justify="center"
                    px={5}
                >
                    <VStack gap={3}>
                        <Flex
                            w="52px"
                            h="52px"
                            align="center"
                            justify="center"
                            borderRadius="full"
                            bg="gray.100"
                            color="gray.500"
                        >
                            <FiShoppingBag size={22} />
                        </Flex>

                        <Box textAlign="center">
                            <Text
                                fontWeight="600"
                                color="gray.700"
                            >
                                No orders yet
                            </Text>

                            <Text
                                fontSize="sm"
                                color="gray.500"
                                mt={1}
                            >
                                Customer orders will appear here.
                            </Text>
                        </Box>
                    </VStack>
                </Flex>
            ) : (
                <Box overflowX="auto">
                    <Table.Root
                        variant="outline"
                        size="sm"
                        minW="850px"
                    >
                        <Table.Header>
                            <Table.Row bg="gray.50">
                                <Table.ColumnHeader
                                    fontSize="xs"
                                    color="gray.500"
                                    textTransform="uppercase"
                                    letterSpacing="wide"
                                    fontWeight="700"
                                >
                                    Order
                                </Table.ColumnHeader>

                                <Table.ColumnHeader
                                    fontSize="xs"
                                    color="gray.500"
                                    textTransform="uppercase"
                                    letterSpacing="wide"
                                    fontWeight="700"
                                >
                                    Customer
                                </Table.ColumnHeader>

                                <Table.ColumnHeader
                                    fontSize="xs"
                                    color="gray.500"
                                    textTransform="uppercase"
                                    letterSpacing="wide"
                                    fontWeight="700"
                                >
                                    Items
                                </Table.ColumnHeader>

                                <Table.ColumnHeader
                                    fontSize="xs"
                                    color="gray.500"
                                    textTransform="uppercase"
                                    letterSpacing="wide"
                                    fontWeight="700"
                                >
                                    Total
                                </Table.ColumnHeader>

                                <Table.ColumnHeader
                                    fontSize="xs"
                                    color="gray.500"
                                    textTransform="uppercase"
                                    letterSpacing="wide"
                                    fontWeight="700"
                                >
                                    Payment
                                </Table.ColumnHeader>

                                <Table.ColumnHeader
                                    fontSize="xs"
                                    color="gray.500"
                                    textTransform="uppercase"
                                    letterSpacing="wide"
                                    fontWeight="700"
                                >
                                    Status
                                </Table.ColumnHeader>

                                <Table.ColumnHeader
                                    fontSize="xs"
                                    color="gray.500"
                                    textTransform="uppercase"
                                    letterSpacing="wide"
                                    fontWeight="700"
                                >
                                    Date
                                </Table.ColumnHeader>

                                <Table.ColumnHeader
                                    textAlign="center"
                                    fontSize="xs"
                                    color="gray.500"
                                    textTransform="uppercase"
                                    letterSpacing="wide"
                                    fontWeight="700"
                                >
                                    Action
                                </Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {orders.map((order) => (
                                <Table.Row
                                    key={order.id}
                                    _hover={{
                                        bg: "gray.50",
                                    }}
                                    transition="background 0.2s"
                                >
                                    <Table.Cell>
                                        <Text
                                            fontWeight="700"
                                            color="blue.600"
                                            fontSize="sm"
                                        >
                                            #{order.orderNumber}
                                        </Text>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <Box>
                                            <Text
                                                fontWeight="600"
                                                color="gray.800"
                                                fontSize="sm"
                                                maxW="170px"
                                                overflow="hidden"
                                                textOverflow="ellipsis"
                                                whiteSpace="nowrap"
                                            >
                                                {getCustomerName(
                                                    order.customer
                                                )}
                                            </Text>

                                            {order.customer?.phone && (
                                                <Text
                                                    fontSize="xs"
                                                    color="gray.500"
                                                    mt={0.5}
                                                >
                                                    {order.customer.phone}
                                                </Text>
                                            )}
                                        </Box>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <HStack gap={2}>
                                            <Flex
                                                w="28px"
                                                h="28px"
                                                align="center"
                                                justify="center"
                                                borderRadius="md"
                                                bg="gray.100"
                                                color="gray.600"
                                            >
                                                <FiShoppingBag
                                                    size={14}
                                                />
                                            </Flex>

                                            <Box>
                                                <Text
                                                    fontWeight="600"
                                                    fontSize="sm"
                                                    color="gray.700"
                                                >
                                                    {order.items.length}{" "}
                                                    {order.items.length === 1
                                                        ? "product"
                                                        : "products"}
                                                </Text>

                                                <Text
                                                    fontSize="xs"
                                                    color="gray.500"
                                                >
                                                    {order.items.reduce(
                                                        (
                                                            total,
                                                            item
                                                        ) =>
                                                            total +
                                                            item.quantity,
                                                        0
                                                    )}{" "}
                                                    units
                                                </Text>
                                            </Box>
                                        </HStack>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <Text
                                            fontWeight="700"
                                            color="gray.800"
                                            fontSize="sm"
                                        >
                                            {formatCurrency(
                                                order.totalAmount
                                            )}
                                        </Text>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <Badge
                                            colorPalette={getPaymentStatusColor(
                                                order.paymentStatus
                                            )}
                                            variant="subtle"
                                            size="sm"
                                            borderRadius="full"
                                            px={2.5}
                                            py={1}
                                        >
                                            {order.paymentStatus}
                                        </Badge>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <Badge
                                            colorPalette={getOrderStatusColor(
                                                order.status
                                            )}
                                            variant="subtle"
                                            size="sm"
                                            borderRadius="full"
                                            px={2.5}
                                            py={1}
                                        >
                                            {order.status}
                                        </Badge>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <HStack gap={2}>
                                            <Flex
                                                w="28px"
                                                h="28px"
                                                align="center"
                                                justify="center"
                                                borderRadius="md"
                                                bg="gray.100"
                                                color="gray.500"
                                            >
                                                <FiCalendar
                                                    size={14}
                                                />
                                            </Flex>

                                            <Box>
                                                <Text
                                                    fontSize="xs"
                                                    fontWeight="600"
                                                    color="gray.700"
                                                >
                                                    {formatDate(
                                                        order.createdAt
                                                    )}
                                                </Text>

                                                <Text
                                                    fontSize="xs"
                                                    color="gray.500"
                                                >
                                                    {formatTime(
                                                        order.createdAt
                                                    )}
                                                </Text>
                                            </Box>
                                        </HStack>
                                    </Table.Cell>

                                    <Table.Cell textAlign="center">
                                        <Button
                                            size="xs"
                                            variant="outline"
                                            colorPalette="blue"
                                            onClick={() =>
                                                onViewOrder?.(order)
                                            }
                                            disabled={!onViewOrder}
                                        >
                                            <FiEye />
                                            View
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Box>
            )}

            {orders.length > 0 && (
                <Flex
                    px={5}
                    py={3}
                    justify="space-between"
                    align="center"
                    borderTopWidth="1px"
                    borderColor="gray.100"
                    bg="gray.50"
                >
                    <Text
                        fontSize="xs"
                        color="gray.500"
                    >
                        Showing latest {orders.length}{" "}
                        {orders.length === 1 ? "order" : "orders"}
                    </Text>

                    <Text
                        fontSize="xs"
                        color="gray.500"
                    >
                        Updated from current order data
                    </Text>
                </Flex>
            )}
        </Box>
    );
};

export default RecentOrders;