import { useMemo, useState } from "react";
import {
    Box,
    Button,
    Flex,
    HStack,
    SimpleGrid,
    Text,
    VStack
} from "@chakra-ui/react";
import {
    FiArrowUpRight,
    FiCalendar,
    FiShoppingBag,
    FiTrendingUp
} from "react-icons/fi";

interface SalesOrderItem {
    quantity: number;
}

interface SalesOrder {
    id: number;
    createdAt: string;
    status: "DRAFT" | "COMPLETED" | "CANCELLED";
    totalAmount: number;
    items: SalesOrderItem[];
}

interface SalesOverviewProps {
    orders: SalesOrder[];
}

type Range = 7 | 30 | 90;

const SalesOverview = ({ orders }: SalesOverviewProps) => {
    const [range, setRange] = useState<Range>(7);

    const formatCurrency = (amount: number) => {
        return `Rs. ${amount.toLocaleString("en-LK", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })}`;
    };

    const getDateKey = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const chartData = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const salesMap = new Map<
            string,
            {
                sales: number;
                orders: number;
            }
        >();

        for (let i = 0; i < range; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - (range - 1 - i));

            salesMap.set(getDateKey(date), {
                sales: 0,
                orders: 0
            });
        }

        orders
            .filter((order) => order.status === "COMPLETED")
            .forEach((order) => {
                const orderDate = new Date(order.createdAt);
                const key = getDateKey(orderDate);

                const existing = salesMap.get(key);

                if (existing) {
                    existing.sales += Number(order.totalAmount || 0);
                    existing.orders += 1;
                }
            });

        return Array.from(salesMap.entries()).map(([key, value]) => {
            const date = new Date(`${key}T00:00:00`);

            return {
                date,
                label: date.toLocaleDateString("en-LK", {
                    day: "2-digit",
                    month: "short"
                }),
                
                sales: value.sales,
                orders: value.orders
            };
        });
    }, [orders, range]);

    const statistics = useMemo(() => {
        const currentSales = chartData.reduce(
            (total, item) => total + item.sales,
            0
        );

        const currentOrders = chartData.reduce(
            (total, item) => total + item.orders,
            0
        );

        const averageOrderValue =
            currentOrders > 0 ? currentSales / currentOrders : 0;

        const previousStart = new Date();
        previousStart.setHours(0, 0, 0, 0);
        previousStart.setDate(
            previousStart.getDate() - range * 2 + 1
        );

        const previousEnd = new Date();
        previousEnd.setHours(23, 59, 59, 999);
        previousEnd.setDate(
            previousEnd.getDate() - range
        );

        const previousSales = orders
            .filter((order) => {
                if (order.status !== "COMPLETED") {
                    return false;
                }

                const date = new Date(order.createdAt);

                return date >= previousStart && date <= previousEnd;
            })
            .reduce(
                (total, order) =>
                    total + Number(order.totalAmount || 0),
                0
            );

        let growth = 0;

        if (previousSales > 0) {
            growth =
                ((currentSales - previousSales) /
                    previousSales) *
                100;
        } else if (currentSales > 0) {
            growth = 100;
        }

        return {
            currentSales,
            currentOrders,
            averageOrderValue,
            growth
        };
    }, [chartData, orders, range]);

    const maxSales = Math.max(
        ...chartData.map((item) => item.sales),
        1
    );

    const chartWidth = 760;
    const chartHeight = 260;
    const paddingX = 20;
    const paddingY = 25;

    const points = chartData.map((item, index) => {
        const x =
            paddingX +
            (index / Math.max(chartData.length - 1, 1)) *
                (chartWidth - paddingX * 2);

        const y =
            chartHeight -
            paddingY -
            (item.sales / maxSales) *
                (chartHeight - paddingY * 2);

        return {
            ...item,
            x,
            y
        };
    });

    const linePoints = points
        .map((point) => `${point.x},${point.y}`)
        .join(" ");

    const areaPoints = [
        `${paddingX},${chartHeight - paddingY}`,
        ...points.map(
            (point) => `${point.x},${point.y}`
        ),
        `${chartWidth - paddingX},${
            chartHeight - paddingY
        }`
    ].join(" ");

    const labelStep =
        range === 7
            ? 1
            : range === 30
              ? 5
              : 15;

    const getRangeLabel = () => {
        if (range === 7) {
            return "Last 7 Days";
        }

        if (range === 30) {
            return "Last 30 Days";
        }

        return "Last 90 Days";
    };

    return (
        <Box
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="2xl"
            boxShadow="sm"
            overflow="hidden"
        >
            <Box px={{ base: 5, md: 6 }} pt={6}>
                <Flex
                    justify="space-between"
                    align={{
                        base: "flex-start",
                        md: "center"
                    }}
                    direction={{
                        base: "column",
                        md: "row"
                    }}
                    gap={4}
                >
                    <HStack gap={3}>
                        <Flex
                            w="44px"
                            h="44px"
                            align="center"
                            justify="center"
                            borderRadius="xl"
                            bg="blue.50"
                            color="blue.600"
                        >
                            <FiTrendingUp size={21} />
                        </Flex>

                        <Box>
                            <Text
                                fontSize="lg"
                                fontWeight="700"
                                color="gray.800"
                            >
                                Sales Overview
                            </Text>

                            <Text
                                fontSize="sm"
                                color="gray.500"
                                mt={0.5}
                            >
                                Track your sales performance
                                over time
                            </Text>
                        </Box>
                    </HStack>

                    <HStack
                        p="1"
                        bg="gray.100"
                        borderRadius="lg"
                        gap="1"
                    >
                        {[7, 30, 90].map((value) => (
                            <Button
                                key={value}
                                size="sm"
                                variant={
                                    range === value
                                        ? "solid"
                                        : "ghost"
                                }
                                colorPalette={
                                    range === value
                                        ? "blue"
                                        : "gray"
                                }
                                borderRadius="md"
                                onClick={() =>
                                    setRange(
                                        value as Range
                                    )
                                }
                            >
                                {value}D
                            </Button>
                        ))}
                    </HStack>
                </Flex>

                <SimpleGrid
                    columns={{
                        base: 1,
                        sm: 3
                    }}
                    gap={3}
                    mt={6}
                >
                    <Box
                        bg="blue.50"
                        borderRadius="xl"
                        px={4}
                        py={3}
                    >
                        <Text
                            fontSize="xs"
                            color="blue.600"
                            fontWeight="600"
                        >
                            SALES
                        </Text>

                        <Text
                            mt={1}
                            fontSize="lg"
                            fontWeight="700"
                            color="gray.800"
                        >
                            {formatCurrency(
                                statistics.currentSales
                            )}
                        </Text>
                    </Box>

                    <Box
                        bg="green.50"
                        borderRadius="xl"
                        px={4}
                        py={3}
                    >
                        <Text
                            fontSize="xs"
                            color="green.600"
                            fontWeight="600"
                        >
                            ORDERS
                        </Text>

                        <Text
                            mt={1}
                            fontSize="lg"
                            fontWeight="700"
                            color="gray.800"
                        >
                            {statistics.currentOrders.toLocaleString()}
                        </Text>
                    </Box>

                    <Box
                        bg="purple.50"
                        borderRadius="xl"
                        px={4}
                        py={3}
                    >
                        <Text
                            fontSize="xs"
                            color="purple.600"
                            fontWeight="600"
                        >
                            AVG. ORDER
                        </Text>

                        <Text
                            mt={1}
                            fontSize="lg"
                            fontWeight="700"
                            color="gray.800"
                        >
                            {formatCurrency(
                                statistics.averageOrderValue
                            )}
                        </Text>
                    </Box>
                </SimpleGrid>
            </Box>

            <Box
                mt={4}
                px={{ base: 4, md: 6 }}
                pb={5}
            >
                <Flex
                    align="center"
                    justify="space-between"
                    mb={2}
                >
                    <HStack gap={2}>
                        <Flex
                            w="8px"
                            h="8px"
                            borderRadius="full"
                            bg="blue.500"
                        />

                        <Text
                            fontSize="xs"
                            fontWeight="600"
                            color="gray.500"
                        >
                            Sales
                        </Text>
                    </HStack>

                    <HStack gap={1}>
                        <FiCalendar
                            size={13}
                        />

                        <Text
                            fontSize="xs"
                            color="gray.400"
                        >
                            {getRangeLabel()}
                        </Text>
                    </HStack>
                </Flex>

                <Box
                    w="100%"
                    overflow="hidden"
                >
                    <svg
                        width="100%"
                        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                        preserveAspectRatio="none"
                        style={{
                            display: "block",
                            height: "280px"
                        }}
                    >
                        {[0, 1, 2, 3, 4].map(
                            (line) => {
                                const y =
                                    paddingY +
                                    (line / 4) *
                                        (chartHeight -
                                            paddingY *
                                                2);

                                return (
                                    <line
                                        key={line}
                                        x1={paddingX}
                                        x2={
                                            chartWidth -
                                            paddingX
                                        }
                                        y1={y}
                                        y2={y}
                                        stroke="#EDF2F7"
                                        strokeWidth="1"
                                        strokeDasharray="4 5"
                                    />
                                );
                            }
                        )}

                        <polygon
                            points={areaPoints}
                            fill="rgba(49, 130, 206, 0.08)"
                        />

                        <polyline
                            points={linePoints}
                            fill="none"
                            stroke="#3182CE"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {points.map(
                            (point, index) => (
                                <circle
                                    key={index}
                                    cx={point.x}
                                    cy={point.y}
                                    r="5"
                                    fill="white"
                                    stroke="#3182CE"
                                    strokeWidth="3"
                                />
                            )
                        )}
                    </svg>

                    <Flex
                        justify="space-between"
                        px={2}
                        mt={1}
                    >
                        {points.map(
                            (point, index) => {
                                if (
                                    index %
                                        labelStep !==
                                        0 &&
                                    index !==
                                        points.length - 1
                                ) {
                                    return (
                                        <Box
                                            key={
                                                index
                                            }
                                            flex="1"
                                        />
                                    );
                                }

                                return (
                                    <Text
                                        key={
                                            index
                                        }
                                        flex="1"
                                        textAlign={
                                            index ===
                                            0
                                                ? "left"
                                                : index ===
                                                    points.length -
                                                        1
                                                  ? "right"
                                                  : "center"
                                        }
                                        fontSize="10px"
                                        color="gray.400"
                                    >
                                        {
                                            point.label
                                        }
                                    </Text>
                                );
                            }
                        )}
                    </Flex>
                </Box>
            </Box>

            <Box
                borderTop="1px solid"
                borderColor="gray.100"
                px={{ base: 5, md: 6 }}
                py={4}
            >
                <Flex
                    justify="space-between"
                    align={{
                        base: "flex-start",
                        sm: "center"
                    }}
                    direction={{
                        base: "column",
                        sm: "row"
                    }}
                    gap={3}
                >
                    <HStack gap={3}>
                        <Flex
                            w="34px"
                            h="34px"
                            align="center"
                            justify="center"
                            borderRadius="lg"
                            bg={
                                statistics.growth >=
                                0
                                    ? "green.50"
                                    : "red.50"
                            }
                            color={
                                statistics.growth >=
                                0
                                    ? "green.600"
                                    : "red.600"
                            }
                        >
                            <FiArrowUpRight
                                size={17}
                            />
                        </Flex>

                        <VStack
                            align="flex-start"
                            gap={0}
                        >
                            <Text
                                fontSize="sm"
                                fontWeight="600"
                                color={
                                    statistics.growth >=
                                    0
                                        ? "green.600"
                                        : "red.600"
                                }
                            >
                                {statistics.growth >=
                                0
                                    ? "+"
                                    : ""}
                                {statistics.growth.toFixed(
                                    1
                                )}
                                %
                            </Text>

                            <Text
                                fontSize="xs"
                                color="gray.400"
                            >
                                compared with previous
                                period
                            </Text>
                        </VStack>
                    </HStack>

                    <HStack
                        gap={2}
                        color="gray.400"
                    >
                        <FiShoppingBag
                            size={15}
                        />

                        <Text fontSize="xs">
                            {statistics.currentOrders}{" "}
                            completed orders
                        </Text>
                    </HStack>
                </Flex>
            </Box>
        </Box>
    );
};

export default SalesOverview;