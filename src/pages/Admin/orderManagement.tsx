import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Box, Button, Flex, Heading, HStack, Input, NativeSelect, Spinner, Text, } from "@chakra-ui/react";
import { FiPlus, FiRefreshCw, FiSearch, } from "react-icons/fi";
import OrderStats from "@/components/Order/OrderStats";
import OrderTable from "@/components/Order/OrderTable";
import PaymentDialog from "@/components/Order/PaymentDialog";
import OrderDetailsDialog from "@/components/Order/OrderDetailsDialog";
import { useNavigate } from "react-router-dom";

interface OrderCustomer {
    id: number;
    userId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
}

interface OrderCashier {
    userId: string;
    firstName: string;
    lastName: string;
}

interface OrderProduct {
    id: number;
    productId: string;
    name: string;
}

interface OrderItem {
    id: number;
    productId: number;
    quantity: number;
    sellingPrice: number;
    lineTotal: number;
    product: OrderProduct;
}

interface Order {
    id: number;
    orderNumber: string;
    createdAt: string;
    customerId: number | null;
    customer: OrderCustomer | null;
    cashier: OrderCashier;
    status:
        | "PENDING"
        | "CONFIRMED"
        | "COMPLETED"
        | "CANCELLED";
    paymentStatus:
        | "PENDING"
        | "PAID"
        | "PARTIAL"
        | "REFUNDED";
    paymentMethod:
        | "CASH"
        | "CARD"
        | "BANK_TRANSFER"
        | "OTHER"
        | null;
    subtotal: number;
    discountAmount: number;
    totalAmount: number;
    items: OrderItem[];
}

const OrderManagement = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [viewOrder, setViewOrder] = useState<Order | null>(null);
    const [editOrder, setEditOrder] = useState<Order | null>(null);

    const navigate = useNavigate();

    const fetchOrders = async (showRefresh = false) => {
        try {
            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/order`,
                {
                    headers: token
                        ? {
                              Authorization: `Bearer ${token}`,
                          }
                        : {},
                }
            );

            const orderData = response.data?.data ?? [];

            setOrders(
                Array.isArray(orderData)
                    ? orderData
                    : []
            );
        } catch (error) {
            console.error(
                "Failed to fetch orders:",
                error
            );

            setOrders([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filteredOrders = useMemo(() => {
        const searchValue = search
            .trim()
            .toLowerCase();

        return orders.filter((order) => {
            const customerName = order.customer
                ? `${order.customer.firstName ?? ""} ${
                      order.customer.lastName ?? ""
                  }`.trim()
                : "walk-in customer";

            const customerEmail =
                order.customer?.email ?? "";

            const customerPhone =
                order.customer?.phone ?? "";

            const productNames = order.items
                .map((item) =>
                    item.product?.name ?? ""
                )
                .join(" ");

            const matchesSearch =
                !searchValue ||
                order.orderNumber
                    .toLowerCase()
                    .includes(searchValue) ||
                customerName
                    .toLowerCase()
                    .includes(searchValue) ||
                customerEmail
                    .toLowerCase()
                    .includes(searchValue) ||
                customerPhone
                    .toLowerCase()
                    .includes(searchValue) ||
                productNames
                    .toLowerCase()
                    .includes(searchValue);

            const matchesStatus =
                statusFilter === "ALL" ||
                order.status === statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );
        });
    }, [orders, search, statusFilter]);

    const statistics = useMemo(() => {
        const totalOrders = orders.length;

        const pendingOrders = orders.filter(
            (order) =>
                order.status === "PENDING"
        ).length;

        const confirmedOrders = orders.filter(
            (order) =>
                order.status === "CONFIRMED"
        ).length;

        const completedOrders = orders.filter(
            (order) =>
                order.status === "COMPLETED"
        ).length;

        const cancelledOrders = orders.filter(
            (order) =>
                order.status === "CANCELLED"
        ).length;

        const totalSales = orders
            .filter(
                (order) =>
                    order.status === "COMPLETED"
            )
            .reduce(
                (sum, order) =>
                    sum +
                    Number(order.totalAmount || 0),
                0
            );

        return {
            totalOrders,
            pendingOrders,
            confirmedOrders,
            completedOrders,
            cancelledOrders,
            totalSales,
        };
    }, [orders]);

    const handleViewOrder = (order: {
        id: number;
    }) => {
        const fullOrder = orders.find(
            (item) => item.id === order.id
        );

        if (fullOrder) {
            setViewOrder(fullOrder);
        }
    };

    const handleEditOrder = (order: {
        id: number;
    }) => {
        const fullOrder = orders.find(
            (item) => item.id === order.id
        );

        if (fullOrder) {
            setEditOrder(fullOrder);
        }
    };

    const handleClearFilters = () => {
        setSearch("");
        setStatusFilter("ALL");
    };

    if (loading) {
        return (
            <Flex
                minH="calc(100vh - 70px)"
                align="center"
                justify="center"
                direction="column"
                gap={4}
            >
                <Spinner
                    size="xl"
                    color="blue.500"
                />

                <Text color="gray.500">
                    Loading order management...
                </Text>
            </Flex>
        );
    }

    return (
        <Box
            w="100%"
            minH="100vh"
            bg="gray.50"
        >
            <Flex
                justify="space-between"
                align={{
                    base: "flex-start",
                    md: "center",
                }}
                direction={{
                    base: "column",
                    md: "row",
                }}
                gap={4}
                mb={6}
            >
                <Box>
                    <Heading
                        size="lg"
                        color="gray.800"
                        fontWeight="700"
                    >
                        Order Management
                    </Heading>

                    <Text
                        mt={1}
                        fontSize="sm"
                        color="gray.500"
                    >
                        Manage customer orders,
                        sales and order history.
                    </Text>
                </Box>

                <HStack gap={3}>
                    <Button
                        variant="outline"
                        bg="white"
                        borderColor="gray.200"
                        onClick={() =>
                            fetchOrders(true)
                        }
                        loading={refreshing}
                    >
                        <FiRefreshCw />
                        Refresh
                    </Button>

                    <Button
                        colorPalette="blue"
                        onClick={() => navigate("/admin/orders/create")}
                    >
                        <FiPlus />
                        New Order
                    </Button>
                </HStack>
            </Flex>

            <OrderStats
                totalOrders={
                    statistics.totalOrders
                }
                pendingOrders={
                    statistics.pendingOrders
                }
                confirmedOrders={
                    statistics.confirmedOrders
                }
                completedOrders={
                    statistics.completedOrders
                }
                cancelledOrders={
                    statistics.cancelledOrders
                }
                totalSales={
                    statistics.totalSales
                }
            />

            <Box mb={5}>
                <Flex
                    justify="space-between"
                    align={{
                        base: "stretch",
                        md: "center",
                    }}
                    direction={{
                        base: "column",
                        md: "row",
                    }}
                    gap={3}
                >
                    <Box
                        position="relative"
                        w={{
                            base: "100%",
                            md: "420px",
                        }}
                    >
                        <Box
                            position="absolute"
                            left="12px"
                            top="50%"
                            transform="translateY(-50%)"
                            color="gray.400"
                            zIndex={1}
                            pointerEvents="none"
                        >
                            <FiSearch />
                        </Box>

                        <Input
                            pl="38px"
                            bg="white"
                            borderColor="gray.200"
                            placeholder="Search by order number or customer..."
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                        />
                    </Box>

                    <HStack
                        gap={3}
                        flexWrap="wrap"
                    >
                        <NativeSelect.Root
                            width={{
                                base: "100%",
                                sm: "160px",
                            }}
                        >
                            <NativeSelect.Field
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(
                                        event.target.value
                                    )
                                }
                                bg="white"
                                borderColor="gray.200"
                            >
                                <option value="ALL">
                                    All Status
                                </option>

                                <option value="PENDING">
                                    Pending
                                </option>

                                <option value="CONFIRMED">
                                    Confirmed
                                </option>

                                <option value="COMPLETED">
                                    Completed
                                </option>

                                <option value="CANCELLED">
                                    Cancelled
                                </option>
                            </NativeSelect.Field>

                            <NativeSelect.Indicator />
                        </NativeSelect.Root>

                        {(search ||
                            statusFilter !==
                                "ALL") && (
                            <Button
                                variant="outline"
                                bg="white"
                                onClick={
                                    handleClearFilters
                                }
                            >
                                Clear
                            </Button>
                        )}
                    </HStack>
                </Flex>

                <Text
                    mt={4}
                    fontSize="sm"
                    color="gray.600"
                >
                    Showing{" "}
                    <Text
                        as="span"
                        fontWeight="700"
                    >
                        {filteredOrders.length}
                    </Text>{" "}
                    of{" "}
                    <Text
                        as="span"
                        fontWeight="700"
                    >
                        {orders.length}
                    </Text>{" "}
                    orders
                </Text>
            </Box>

            <OrderTable
                orders={filteredOrders}
                onViewOrder={handleViewOrder}
                onEditOrder={handleEditOrder}
            />

            <OrderDetailsDialog
                order={viewOrder}
                open={viewOrder !== null}
                onClose={() =>
                    setViewOrder(null)
                }
            />

            <PaymentDialog
                order={editOrder}
                open={editOrder !== null}
                onClose={() =>
                    setEditOrder(null)
                }
                onSuccess={() =>
                    fetchOrders()
                }
            />
        </Box>
    );
};

export default OrderManagement;