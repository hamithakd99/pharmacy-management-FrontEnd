
import { useEffect, useState } from "react";
import axios from "axios";

import {
    Box,
    Flex,
    Heading,
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

    const monthlySales: MonthlySale[] = MONTHS.map(
        (month, index) => {
            const monthSales = orders
                .filter((order) => {
                    if (order.status !== "CONFIRMED") {
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

    const annualSales = monthlySales.reduce(
        (total, month) => total + month.sales,
        0
    );

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
                        Monthly Sales
                    </Heading>

                    <Text color="gray.500" fontSize="sm" mt={1}>
                        Completed sales revenue by month
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

            <Box
                bg="teal.50"
                rounded="lg"
                p={3}
                mb={4}
            >
                <Text fontSize="sm" color="gray.600">
                    Total sales in {selectedYear}
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
                        formatCurrency(annualSales)
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
                        minW={{ base: "450px", md: "0" }}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={monthlySales}
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
                                    dataKey="month"
                                    tick={{ fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                    interval="preserveStartEnd"
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
                                        `${label} ${selectedYear}`
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

            {!loading && !error && annualSales === 0 && (
                <Text
                    mt={3}
                    fontSize="sm"
                    color="gray.500"
                    textAlign="center"
                >
                    No completed sales were recorded for {selectedYear}.
                </Text>
            )}
        </Box>
    );
}
