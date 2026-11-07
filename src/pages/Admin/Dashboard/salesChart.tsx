
import { useEffect, useState } from "react";
import axios from "axios";

import {
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    NativeSelect,
    Skeleton,
    Text,
    VStack,
} from "@chakra-ui/react";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

type Order = {
    id: number;
    createdAt: string;
    status: string;
    totalAmount: number;
};

type MonthlySale = {
    month: string;
    sales: number;
};

type DailySale = {
    label: string;
    sales: number;
};

type SalesRange = "7D" | "30D" | "ANNUAL";

const MONTHS = [
    "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug",
    "Sep", "Oct", "Nov", "Dec",
];

const currentYear = new Date().getFullYear();

const YEARS = Array.from(
    { length: Math.max(5, currentYear - 2024 + 1) },
    (_, index) => currentYear - index
);

const formatCurrency = (value: number) =>
    `Rs. ${value.toLocaleString("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

const formatAxisValue = (value: number) => {
    if (value >= 1_000_000) {
        return `Rs. ${(value / 1_000_000).toFixed(1)}M`;
    }

    if (value >= 1_000) {
        return `Rs. ${(value / 1_000).toFixed(0)}K`;
    }

    return `Rs. ${value}`;
};

const getOrders = (response: any): Order[] => {
    const body = response?.data;

    if (Array.isArray(body)) {
        return body;
    }

    if (Array.isArray(body?.data)) {
        return body.data;
    }

    if (Array.isArray(body?.orders)) {
        return body.orders;
    }

    return [];
};

export default function SalesChart() {
    const [selectedYear, setSelectedYear] = useState(
        String(currentYear)
    );
    const [selectedRange, setSelectedRange] = useState<SalesRange>("ANNUAL");

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const fetchOrders = async () => {
            setLoading(true);
            setError("");

            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    `${backendUrl}/order`,
                    {
                        headers: token
                            ? { Authorization: `Bearer ${token}` }
                            : {},
                    }
                );

                if (!cancelled) {
                    setOrders(getOrders(response));
                }
            } catch (err) {
                console.error("Failed to load sales chart:", err);

                if (!cancelled) {
                    setError("Unable to load sales data. Please try again.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchOrders();

        return () => {
            cancelled = true;
        };
    }, []);

    const isCompletedOrder = (order: Order) =>
        order.status === "CONFIRMED" || order.status === "COMPLETED";

    const monthlySales: MonthlySale[] = MONTHS.map(
        (month, index) => {
            const monthSales = orders
                .filter((order) => {
                    if (!isCompletedOrder(order)) {
                        return false;
                    }

                    const orderDate = new Date(order.createdAt);

                    return (
                        !Number.isNaN(orderDate.getTime()) &&
                        orderDate.getFullYear() === Number(selectedYear) &&
                        orderDate.getMonth() === index
                    );
                })
                .reduce(
                    (total, order) =>
                        total + (Number(order.totalAmount) || 0),
                    0
                );

            return {
                month,
                sales: monthSales,
            };
        }
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const rangeDays = selectedRange === "7D" ? 7 : 30;
    const dailySales: DailySale[] = Array.from(
        { length: rangeDays },
        (_, index) => {
            const date = new Date(today);
            date.setDate(today.getDate() - (rangeDays - 1 - index));

            const sales = orders
                .filter((order) => {
                    if (!isCompletedOrder(order)) {
                        return false;
                    }

                    const orderDate = new Date(order.createdAt);
                    return (
                        !Number.isNaN(orderDate.getTime()) &&
                        orderDate.getFullYear() === date.getFullYear() &&
                        orderDate.getMonth() === date.getMonth() &&
                        orderDate.getDate() === date.getDate()
                    );
                })
                .reduce(
                    (total, order) =>
                        total + (Number(order.totalAmount) || 0),
                    0
                );

            return {
                label: date.toLocaleDateString("en-LK", {
                    day: "2-digit",
                    month: "short",
                }),
                sales,
            };
        }
    );

    const chartData =
        selectedRange === "ANNUAL"
            ? monthlySales.map((item) => ({
                label: item.month,
                sales: item.sales,
            }))
            : dailySales;
    const selectedSales = chartData.reduce(
        (total, item) => total + item.sales,
        0
    );
    const rangeLabel =
        selectedRange === "ANNUAL"
            ? `Annual Sales ${selectedYear}`
            : selectedRange === "7D"
                ? "Sales - Last 7 Days"
                : "Sales - Last 30 Days";

    return (
        <Box
            bg="white"
            rounded="xl"
            borderWidth="1px"
            borderColor="gray.200"
            p={{ base: 3, sm: 4, md: 6 }}
            boxShadow="sm"
            minW={0}
            w="100%"
        >
            <Flex
                justify="space-between"
                align={{ base: "stretch", sm: "center" }}
                mb={5}
                flexDirection={{ base: "column", sm: "row" }}
                gap={3}
            >
                <Box minW={0}>
                    <Heading size="md">
                        Sales Overview
                    </Heading>

                    <Text color="gray.500" fontSize="sm" mt={1}>
                        View completed sales by selected period
                    </Text>
                </Box>

                <NativeSelect.Root width={{ base: "100%", sm: "130px" }}>
                    <NativeSelect.Field
                        value={selectedYear}
                        onChange={(event) =>
                            setSelectedYear(event.target.value)
                        }
                        aria-label="Select sales year"
                    >
                        {YEARS.map((year) => (
                            <option key={year} value={String(year)}>
                                {year}
                            </option>
                        ))}
                    </NativeSelect.Field>

                    <NativeSelect.Indicator />
                </NativeSelect.Root>
            </Flex>

            <HStack
                gap={2}
                mb={4}
                overflowX="auto"
                pb={1}
                width="100%"
            >
                {([
                    ["7D", "7 Days"],
                    ["30D", "30 Days"],
                    ["ANNUAL", "Annual"],
                ] as const).map(([range, label]) => (
                    <Button
                        key={range}
                        size="sm"
                        flex="1"
                        minW={{ base: "100px", sm: "120px" }}
                        variant={
                            selectedRange === range ? "solid" : "outline"
                        }
                        colorPalette="teal"
                        onClick={() => setSelectedRange(range)}
                    >
                        {label}
                    </Button>
                ))}
            </HStack>

            <Box
                bg="teal.50"
                rounded="lg"
                p={3}
                mb={4}
            >
                <Text fontSize="sm" color="gray.600">
                    {rangeLabel}
                </Text>

                <Heading
                    size="lg"
                    color="teal.700"
                    mt={1}
                    overflowWrap="anywhere"
                >
                    {loading ? (
                        <Skeleton h="32px" w="180px" />
                    ) : (
                        formatCurrency(selectedSales)
                    )}
                </Heading>
            </Box>

            {loading ? (
                <VStack align="stretch" gap={3}>
                    <Skeleton h={{ base: "240px", md: "320px" }} />
                    <Text color="gray.500" fontSize="sm">
                        Loading sales data...
                    </Text>
                </VStack>
            ) : error ? (
                <Box
                    bg="red.50"
                    color="red.700"
                    rounded="lg"
                    p={4}
                >
                    <Text fontSize="sm">{error}</Text>
                </Box>
            ) : (
                <Box
                    h={{ base: "260px", sm: "300px", md: "350px" }}
                    w="100%"
                    minW={0}
                    overflowX="auto"
                >
                    <Box
                        h="100%"
                        minW="0"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={chartData}
                                margin={{
                                    top: 10,
                                    right: 8,
                                    left: 8,
                                    bottom: 0,
                                }}
                            >
                                <defs>
                                    <linearGradient
                                        id="monthlySalesGradient"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#0F766E"
                                            stopOpacity={0.3}
                                        />

                                        <stop
                                            offset="95%"
                                            stopColor="#0F766E"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#E2E8F0"
                                />

                                <XAxis
                                    dataKey="label"
                                    tick={{ fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                    interval={
                                        selectedRange === "30D"
                                            ? 4
                                            : "preserveStartEnd"
                                    }
                                />

                                <YAxis
                                    tickFormatter={formatAxisValue}
                                    tick={{ fontSize: 11 }}
                                    tickLine={false}
                                    axisLine={false}
                                    width={75}
                                />

                                <Tooltip
                                    formatter={(value) => [
                                        formatCurrency(Number(value ?? 0)),
                                        "Sales",
                                    ]}
                                    labelFormatter={(label) =>
                                        selectedRange === "ANNUAL"
                                            ? `${label} ${selectedYear}`
                                            : String(label)
                                    }
                                    contentStyle={{
                                        borderRadius: "10px",
                                        border: "1px solid #E2E8F0",
                                        boxShadow:
                                            "0 4px 12px rgba(0,0,0,0.08)",
                                    }}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#0F766E"
                                    strokeWidth={3}
                                    fill="url(#monthlySalesGradient)"
                                    activeDot={{ r: 5 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Box>
                </Box>
            )}

            {!loading && !error && selectedSales === 0 && (
                <Text
                    mt={3}
                    fontSize="sm"
                    color="gray.500"
                    textAlign="center"
                >
                    No completed sales were recorded for {rangeLabel}.
                </Text>
            )}
        </Box>
    );
}
