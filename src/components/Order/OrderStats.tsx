import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { FiCheckCircle, FiDollarSign, FiShoppingBag, FiClock, FiXCircle, FiRefreshCw, } from "react-icons/fi";

interface OrderStatsProps {
    totalOrders: number;
    pendingOrders: number;
    confirmedOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalSales: number;
}

const OrderStats = ({
    totalOrders,
    pendingOrders,
    confirmedOrders,
    completedOrders,
    cancelledOrders,
    totalSales,
}: OrderStatsProps) => {
    const formatCurrency = (amount: number) => {
        return `Rs. ${Number(amount || 0).toLocaleString("en-LK", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const stats = [
        {
            title: "Total Orders",
            value: totalOrders.toLocaleString(),
            description: "All orders recorded",
            icon: FiShoppingBag,
            iconColor: "blue.600",
            iconBg: "blue.50",
            accent: "blue.500",
        },
        {
            title: "Pending Orders",
            value: pendingOrders.toLocaleString(),
            description: "Waiting for confirmation",
            icon: FiClock,
            iconColor: "orange.600",
            iconBg: "orange.50",
            accent: "orange.500",
        },
        {
            title: "Confirmed Orders",
            value: confirmedOrders.toLocaleString(),
            description: "Orders confirmed",
            icon: FiRefreshCw,
            iconColor: "blue.600",
            iconBg: "blue.50",
            accent: "blue.500",
        },
        {
            title: "Completed Orders",
            value: completedOrders.toLocaleString(),
            description: "Successfully completed",
            icon: FiCheckCircle,
            iconColor: "green.600",
            iconBg: "green.50",
            accent: "green.500",
        },
        {
            title: "Cancelled Orders",
            value: cancelledOrders.toLocaleString(),
            description: "Orders cancelled",
            icon: FiXCircle,
            iconColor: "red.600",
            iconBg: "red.50",
            accent: "red.500",
        },
        {
            title: "Total Sales",
            value: formatCurrency(totalSales),
            description: "From completed orders",
            icon: FiDollarSign,
            iconColor: "purple.600",
            iconBg: "purple.50",
            accent: "purple.500",
        },
    ];

    return (
        <SimpleGrid
            columns={{
                base: 1,
                sm: 2,
                lg: 3,
            }}
            gap={4}
            mb={6}
        >
            {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                    <Box
                        key={stat.title}
                        position="relative"
                        bg="white"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="xl"
                        px={5}
                        py={5}
                        overflow="hidden"
                        boxShadow="sm"
                        _hover={{
                            boxShadow: "md",
                            transform: "translateY(-1px)",
                        }}
                        transition="all 0.2s"
                    >
                        <Box
                            position="absolute"
                            left="0"
                            top="0"
                            bottom="0"
                            w="4px"
                            bg={stat.accent}
                        />

                        <Flex
                            justify="space-between"
                            align="flex-start"
                        >
                            <Box>
                                <Text
                                    fontSize="sm"
                                    fontWeight="500"
                                    color="gray.600"
                                    mb={2}
                                >
                                    {stat.title}
                                </Text>

                                <Text
                                    fontSize="2xl"
                                    fontWeight="700"
                                    color="gray.900"
                                    lineHeight="1.2"
                                >
                                    {stat.value}
                                </Text>

                                <Text
                                    fontSize="xs"
                                    color="gray.500"
                                    mt={2}
                                >
                                    {stat.description}
                                </Text>
                            </Box>

                            <Flex
                                w="44px"
                                h="44px"
                                align="center"
                                justify="center"
                                borderRadius="lg"
                                bg={stat.iconBg}
                                color={stat.iconColor}
                                flexShrink={0}
                            >
                                <Icon size={21} />
                            </Flex>
                        </Flex>
                    </Box>
                );
            })}
        </SimpleGrid>
    );
};

export default OrderStats;