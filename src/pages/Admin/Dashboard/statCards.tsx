
import { useEffect, useState } from "react";
import axios from "axios";

import {
    Box,
    Flex,
    Grid,
    GridItem,
    Icon,
    Skeleton,
    Stat,
    Text,
    VStack,
} from "@chakra-ui/react";

import {
    MdInventory2,
    MdAttachMoney,
    MdShoppingCart,
    MdWarningAmber,
    MdAccessTimeFilled,
    MdReceiptLong,
} from "react-icons/md";

import type { IconType } from "react-icons";

type StockBatchItem = {
    id: number;
    availableQuantity: number;
    buyingPrice: number;
    expiryDate: string;
};

type Product = {
    id: number;
    isActive?: boolean;
    reorderLevel?: number;
    totalStock?: number;
    stockBatchItems?: StockBatchItem[];
};

type Order = {
    id: number;
    createdAt: string;
    status: string;
    totalAmount: number;
};

type DashboardStats = {
    totalProducts: number;
    inventoryValue: number;
    todaySales: number;
    billsToday: number;
    lowStock: number;
    expiringSoon: number;
};

type DashboardCard = {
    title: string;
    value: string;
    subtitle: string;
    color: string;
    bg: string;
    icon: IconType;
};

const initialStats: DashboardStats = {
    totalProducts: 0,
    inventoryValue: 0,
    todaySales: 0,
    billsToday: 0,
    lowStock: 0,
    expiringSoon: 0,
};

const getArray = <T,>(response: any): T[] => {
    const body = response?.data;

    if (Array.isArray(body)) {
        return body as T[];
    }

    if (Array.isArray(body?.data)) {
        return body.data as T[];
    }

    if (Array.isArray(body?.products)) {
        return body.products as T[];
    }

    if (Array.isArray(body?.orders)) {
        return body.orders as T[];
    }

    return [];
};

const getLocalDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const formatCurrency = (amount: number) =>
    `Rs. ${amount.toLocaleString("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

export default function StatCards() {
    const [stats, setStats] = useState(initialStats);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const fetchDashboardStats = async () => {
            setLoading(true);
            setLoadError(false);

            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const token = localStorage.getItem("token");

            const config = {
                headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : {},
            };

            try {
                const [productsResult, ordersResult] =
                    await Promise.allSettled([
                        axios.get(`${backendUrl}/product/all`, config),
                        axios.get(`${backendUrl}/order`, config),
                    ]);

                if (cancelled) return;

                let products: Product[] = [];
                let orders: Order[] = [];
                let failed = false;

                if (productsResult.status === "fulfilled") {
                    products = getArray<Product>(productsResult.value);
                } else {
                    failed = true;
                    console.error(
                        "Dashboard products request failed:",
                        productsResult.reason
                    );
                }

                if (ordersResult.status === "fulfilled") {
                    orders = getArray<Order>(ordersResult.value);
                } else {
                    failed = true;
                    console.error(
                        "Dashboard orders request failed:",
                        ordersResult.reason
                    );
                }

                const activeProducts = products.filter(
                    (product) => product.isActive !== false
                );

                const now = new Date();
                const todayKey = getLocalDateKey(now);

                const expiryLimit = new Date(now);
                expiryLimit.setDate(expiryLimit.getDate() + 30);

                let inventoryValue = 0;
                let lowStock = 0;
                let expiringSoon = 0;

                for (const product of activeProducts) {
                    const batchItems = product.stockBatchItems ?? [];

                    const totalAvailableStock = batchItems.reduce(
                        (total, item) =>
                            total + Math.max(
                                0,
                                Number(item.availableQuantity) || 0
                            ),
                        0
                    );

                    // Calculate current inventory value using remaining stock.
                    inventoryValue += batchItems.reduce(
                        (total, item) =>
                            total +
                            Math.max(
                                0,
                                Number(item.availableQuantity) || 0
                            ) *
                            Math.max(0, Number(item.buyingPrice) || 0),
                        0
                    );

                    const stockQuantity =
                        batchItems.length > 0
                            ? totalAvailableStock
                            : Number(product.totalStock ?? 0);

                    if (
                        stockQuantity <=
                        Number(product.reorderLevel ?? 10)
                    ) {
                        lowStock++;
                    }

                    for (const item of batchItems) {
                        const quantity = Number(item.availableQuantity) || 0;
                        const expiry = new Date(item.expiryDate);

                        if (
                            quantity > 0 &&
                            !Number.isNaN(expiry.getTime()) &&
                            expiry >= new Date(
                                now.getFullYear(),
                                now.getMonth(),
                                now.getDate()
                            ) &&
                            expiry <= expiryLimit
                        ) {
                            expiringSoon++;
                        }
                    }
                }


                const validOrders = orders.filter(
                    (order) =>
                        order.status === "CONFIRMED" ||
                        order.status === "COMPLETED"
                );

                const todayOrders = validOrders.filter(
                    (order) =>
                        getLocalDateKey(new Date(order.createdAt)) === todayKey
                );

                const todaySales = todayOrders.reduce(
                    (total, order) =>
                        total + (Number(order.totalAmount) || 0),
                    0
                );


                setStats({
                    totalProducts: activeProducts.length,
                    inventoryValue,
                    todaySales,
                    billsToday: todayOrders.length,
                    lowStock,
                    expiringSoon,
                });

                setLoadError(failed);
            } catch (error) {
                if (!cancelled) {
                    console.error("Dashboard stats error:", error);
                    setLoadError(true);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchDashboardStats();

        return () => {
            cancelled = true;
        };
    }, []);

    const cards: DashboardCard[] = [
        {
            title: "Total Products",
            value: stats.totalProducts.toLocaleString("en-LK"),
            subtitle: "Active products",
            color: "blue.500",
            bg: "blue.50",
            icon: MdInventory2,
        },
        {
            title: "Inventory Value",
            value: formatCurrency(stats.inventoryValue),
            subtitle: "Current stock at buying cost",
            color: "green.500",
            bg: "green.50",
            icon: MdAttachMoney,
        },
        {
            title: "Today's Sales",
            value: formatCurrency(stats.todaySales),
            subtitle: "Completed sales today",
            color: "teal.500",
            bg: "teal.50",
            icon: MdShoppingCart,
        },
        {
            title: "Bills Today",
            value: stats.billsToday.toLocaleString("en-LK"),
            subtitle: "Completed bills today",
            color: "purple.500",
            bg: "purple.50",
            icon: MdReceiptLong,
        },
        {
            title: "Low Stock",
            value: stats.lowStock.toLocaleString("en-LK"),
            subtitle: "At or below reorder level",
            color: "orange.500",
            bg: "orange.50",
            icon: MdWarningAmber,
        },
        {
            title: "Expiring Soon",
            value: stats.expiringSoon.toLocaleString("en-LK"),
            subtitle: "Batches expiring in 30 days",
            color: "red.500",
            bg: "red.50",
            icon: MdAccessTimeFilled,
        },
    ];

    return (
        <VStack align="stretch" gap={3}>
            {loadError && (
                <Box
                    bg="orange.50"
                    borderWidth="1px"
                    borderColor="orange.200"
                    rounded="lg"
                    p={3}
                >
                    <Text fontSize="sm" color="orange.800">
                        Some dashboard data could not be loaded. Check the
                        browser console and API responses.
                    </Text>
                </Box>
            )}

            <Grid
                templateColumns={{
                    base: "minmax(0, 1fr)",
                    sm: "repeat(2, minmax(0, 1fr))",
                    xl: "repeat(3, minmax(0, 1fr))",
                    "2xl": "repeat(6, minmax(0, 1fr))",
                }}
                gap={{ base: 3, md: 4, xl: 5 }}
                alignItems="stretch"
            >
                {cards.map((card) => (
                    <GridItem key={card.title} minW={0}>
                        <Box
                            h="100%"
                            minW={0}
                            bg="white"
                            rounded="xl"
                            p={{ base: 3, sm: 4, lg: 5 }}
                            borderWidth="1px"
                            borderColor="gray.200"
                            boxShadow="sm"
                            transition="transform 0.2s, box-shadow 0.2s"
                            _hover={{
                                transform: { base: "none", md: "translateY(-3px)" },
                                boxShadow: { base: "sm", md: "md" },
                            }}
                        >
                            <Flex
                                justify="space-between"
                                align="start"
                                gap={2}
                            >
                                <Box flex="1" minW={0}>
                                    <Text
                                        fontSize="sm"
                                        color="gray.500"
                                        fontWeight="medium"
                                    >
                                        {card.title}
                                    </Text>

                                    {loading ? (
                                        <Skeleton
                                            mt={2}
                                            h="36px"
                                            w="85%"
                                            rounded="md"
                                        />
                                    ) : (
                                        <Stat.Root mt={1}>
                                            <Stat.ValueText
                                                fontSize={{
                                                    base: "xl",
                                                    sm: "2xl",
                                                    lg: "2xl",
                                                    "2xl": "xl",
                                                }}
                                                fontWeight="bold"
                                                lineHeight="1.35"
                                                overflowWrap="anywhere"
                                            >
                                                {card.value}
                                            </Stat.ValueText>
                                        </Stat.Root>
                                    )}

                                    <Text
                                        mt={2}
                                        fontSize="xs"
                                        color="gray.500"
                                        lineHeight="short"
                                    >
                                        {card.subtitle}
                                    </Text>
                                </Box>

                                <Flex
                                    flexShrink={0}
                                    w={{ base: "42px", sm: "48px", lg: "54px" }}
                                    h={{ base: "42px", sm: "48px", lg: "54px" }}
                                    rounded="xl"
                                    bg={card.bg}
                                    align="center"
                                    justify="center"
                                >
                                    <Icon
                                        as={card.icon}
                                        boxSize={{ base: 5, sm: 6 }}
                                        color={card.color}
                                    />
                                </Flex>
                            </Flex>
                        </Box>
                    </GridItem>
                ))}
            </Grid>
        </VStack>
    );
}
