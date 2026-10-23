import { useCallback, useEffect, useState } from "react";
import {
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    Input,
    NativeSelect,
    Spinner,
    Text,
} from "@chakra-ui/react";
import {
    FiPlus,
    FiRefreshCw,
    FiSearch,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import OrderStats from "@/components/Order/OrderStats";
import OrderTable from "@/components/Order/OrderTable";
import OrderDetailsDialog from "@/components/Order/OrderDetailsDialog";

import api from "@/api/axios";
import OrderInvoicePDF from "@/pdf/templates/OrderInvoicePDF";
import DocumentPreviewDialog from "@/components/Documents/DocumentPreviewDialog";
import type { PaginationInfo } from "@/components/Pagination";
import Pagination from "@/components/Pagination";
import type { Order } from "@/types/order";



const initialPagination: PaginationInfo = {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
};

interface OrderStatistics {
    totalOrders: number;
    pendingOrders: number;
    confirmedOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalSales: number;
}

const initialStatistics: OrderStatistics = {
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalSales: 0,
};

const OrderManagement = () => {
    const navigate = useNavigate();

    // Orders and pagination
    const [orders, setOrders] = useState<Order[]>([]);
    const [pagination, setPagination] =
        useState<PaginationInfo>(initialPagination);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);

    // Loading states
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Search and filters
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    // Dialog states
    const [viewOrder, setViewOrder] = useState<Order | null>(null);
    const [printOrder, setPrintOrder] = useState<Order | null>(null);
    const [invoicePreviewOpen, setInvoicePreviewOpen] = useState(false);
    const [statistics, setStatistics] = useState<OrderStatistics>(initialStatistics);

    // =====================================================
    // FETCH ORDERS
    // =====================================================

    const fetchOrders = useCallback(
        async (showRefresh = false) => {
            try {
                if (showRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                const response = await api.get("/order", {
                    params: {
                        page,
                        limit,
                        search: search.trim(),
                        status:
                            statusFilter === "ALL"
                                ? ""
                                : statusFilter,
                    },
                });

                const result = response.data;
                const orderData = result?.data ?? [];

                setOrders(
                    Array.isArray(orderData) ? orderData : []
                );

                if (result?.pagination) {
                    setPagination(result.pagination);
                }

                setStatistics(result?.stats ?? initialStatistics);
            } catch (error) {
                console.error(
                    "Failed to fetch orders:",
                    error
                );

                toast.error("Failed to load orders.");
                setOrders([]);
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [page, limit, search, statusFilter]
    );

    useEffect(() => {
        void fetchOrders();
    }, [fetchOrders]);

    // =====================================================
    // SEARCH AND FILTERS
    // =====================================================

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const handleStatusChange = (value: string) => {
        setStatusFilter(value);
        setPage(1);
    };

    const handleLimitChange = (value: number) => {
        setLimit(value);
        setPage(1);
    };

    const handleClearFilters = () => {
        setSearch("");
        setStatusFilter("ALL");
        setPage(1);
    };

    // =====================================================
    // STATISTICS
    // These currently use the loaded page's records.
    // =====================================================

    // const statistics = useMemo(() => {
    //     const totalOrders = orders.length;

    //     const pendingOrders = orders.filter(
    //         (order) => order.status === "PENDING"
    //     ).length;

    //     const confirmedOrders = orders.filter(
    //         (order) => order.status === "CONFIRMED"
    //     ).length;

    //     const completedOrders = orders.filter(
    //         (order) => order.status === "COMPLETED"
    //     ).length;

    //     const cancelledOrders = orders.filter(
    //         (order) => order.status === "CANCELLED"
    //     ).length;

    //     const totalSales = orders
    //         .filter(
    //             (order) =>
    //                 order.status === "CONFIRMED" ||
    //                 order.status === "COMPLETED"
    //         )
    //         .reduce(
    //             (sum, order) =>
    //                 sum + Number(order.totalAmount || 0),
    //             0
    //         );

    //     return {
    //         totalOrders,
    //         pendingOrders,
    //         confirmedOrders,
    //         completedOrders,
    //         cancelledOrders,
    //         totalSales,
    //     };
    // }, [orders]);

    // =====================================================
    // VIEW ORDER
    // =====================================================

    const handleViewOrder = (order: Order) => {
        setViewOrder(order);
    };

    // =====================================================
    // PRINT ORDER
    // =====================================================

    const handlePrintOrder = (order: { id: number }) => {
        const fullOrder = orders.find(
            (item) => item.id === order.id
        );

        if (!fullOrder) {
            toast.error("Order details not found.");
            return;
        }

        setPrintOrder(fullOrder);
        setInvoicePreviewOpen(true);
    };

    // =====================================================
    // CONFIRM ORDER
    // =====================================================

    const handleConfirmOrder = async (
        order: {
            id: number;
            orderNumber: string;
        }
    ) => {
        try {
            await api.patch(
                `/order/${order.id}/status`,
                {
                    status: "CONFIRMED",
                }
            );

            toast.success(
                `Order ${order.orderNumber} confirmed successfully.`
            );

            await fetchOrders(true);
        } catch (error: any) {
            console.error(
                "Confirm Order Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to confirm order."
            );

            throw error;
        }
    };

    // =====================================================
    // CANCEL ORDER
    // =====================================================

    const handleCancelOrder = async (
        order: {
            id: number;
            orderNumber: string;
        }
    ) => {
        try {
            await api.patch(
                `/order/${order.id}/cancel`,
                {}
            );

            toast.success(
                `Order ${order.orderNumber} cancelled successfully.`
            );

            await fetchOrders(true);
        } catch (error: any) {
            console.error(
                "Cancel Order Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to cancel order."
            );

            throw error;
        }
    };

    // =====================================================
    // LOADING SCREEN
    // =====================================================

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

    // =====================================================
    // MAIN UI
    // =====================================================

    return (
        <Box
            w="100%"
            minH="100vh"
            bg="gray.50"
        >
            {/* PAGE HEADER */}

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
                        Manage customer orders, sales and order history.
                    </Text>
                </Box>

                <HStack gap={3}>
                    <Button
                        variant="outline"
                        bg="white"
                        borderColor="gray.200"
                        onClick={() => void fetchOrders(true)}
                        loading={refreshing}
                        disabled={refreshing}
                    >
                        <FiRefreshCw />
                        Refresh
                    </Button>

                    <Button
                        colorPalette="blue"
                        onClick={() => {
                            const user = JSON.parse(
                                localStorage.getItem("user") || "{}"
                            );

                            const createOrderPath =
                                user.role === "CASHIER"
                                    ? "/cashier/orders/create"
                                    : "/admin/orders/create";

                            navigate(createOrderPath);
                        }}
                    >
                        <FiPlus />
                        New Order
                    </Button>
                </HStack>
            </Flex>

            {/* STATISTICS */}

            <OrderStats
                totalOrders={statistics.totalOrders}
                pendingOrders={statistics.pendingOrders}
                confirmedOrders={statistics.confirmedOrders}
                completedOrders={statistics.completedOrders}
                cancelledOrders={statistics.cancelledOrders}
                totalSales={statistics.totalSales}
            />

            {/* SEARCH AND STATUS FILTER */}

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
                            placeholder="Search order number, customer or product..."
                            value={search}
                            onChange={(event) =>
                                handleSearchChange(
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
                                    handleStatusChange(
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

                        {(search || statusFilter !== "ALL") && (
                            <Button
                                variant="outline"
                                bg="white"
                                onClick={handleClearFilters}
                            >
                                Clear
                            </Button>
                        )}
                    </HStack>
                </Flex>

                {/* RESULTS COUNT */}

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
                        {pagination.total === 0
                            ? 0
                            : (page - 1) * limit + 1}
                        {"–"}
                        {Math.min(
                            page * limit,
                            pagination.total
                        )}
                    </Text>
                    {" "}of{" "}
                    <Text
                        as="span"
                        fontWeight="700"
                    >
                        {pagination.total}
                    </Text>
                    {" "}orders
                </Text>
            </Box>

            {/* ORDERS TABLE */}

            <OrderTable
                orders={orders}
                onViewOrder={handleViewOrder}
                onConfirmOrder={handleConfirmOrder}
                onCancelOrder={handleCancelOrder}
                onPrintOrder={handlePrintOrder}
            />

            {/* COMMON PAGINATION */}

            <Pagination
                pagination={pagination}
                onPageChange={setPage}
                onLimitChange={handleLimitChange}
            />

            {/* ORDER DETAILS */}

            <OrderDetailsDialog
                order={viewOrder}
                open={viewOrder !== null}
                onClose={() => setViewOrder(null)}
            />

            {/* INVOICE PREVIEW */}

            <DocumentPreviewDialog
                open={invoicePreviewOpen}
                onClose={() => {
                    setInvoicePreviewOpen(false);
                    setPrintOrder(null);
                }}
                title="Order Invoice Preview"
                fileName={`${printOrder?.orderNumber ?? "Order-Invoice"
                    }.pdf`}
                renderDocument={(settings) =>
                    printOrder ? (
                        <OrderInvoicePDF
                            order={printOrder}
                            settings={settings}
                        />
                    ) : (
                        <></>
                    )
                }
            />
        </Box>
    );
};

export default OrderManagement;
