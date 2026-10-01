import { Box, Circle, Flex, HStack, Progress, Text, VStack } from "@chakra-ui/react";
import { FiCheckCircle, FiClock, FiMinusCircle, FiXCircle } from "react-icons/fi";

interface OrderStatusOverviewProps {
    totalOrders: number;
    completedOrders: number;
    pendingPayments: number;
    partialPayments: number;
    cancelledOrders: number;
}

const OrderStatusOverview = ({
    totalOrders,
    completedOrders,
    pendingPayments,
    partialPayments,
    cancelledOrders
}: OrderStatusOverviewProps) => {
    const getPercentage = (value: number) => {
        if (totalOrders === 0) {
            return 0;
        }

        return Math.round((value / totalOrders) * 100);
    };

    const statuses = [
        {
            label: "Completed",
            count: completedOrders,
            percentage: getPercentage(completedOrders),
            icon: FiCheckCircle,
            color: "green",
            description: "Successfully completed orders"
        },
        {
            label: "Pending Payment",
            count: pendingPayments,
            percentage: getPercentage(pendingPayments),
            icon: FiClock,
            color: "orange",
            description: "Orders waiting for payment"
        },
        {
            label: "Partial Payment",
            count: partialPayments,
            percentage: getPercentage(partialPayments),
            icon: FiMinusCircle,
            color: "purple",
            description: "Orders with partial payment"
        },
        {
            label: "Cancelled",
            count: cancelledOrders,
            percentage: getPercentage(cancelledOrders),
            icon: FiXCircle,
            color: "red",
            description: "Cancelled orders"
        }
    ];

    return (
        <Box
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="2xl"
            boxShadow="sm"
            p={{ base: 5, md: 6 }}
            h="100%"
        >
            <Flex
                justify="space-between"
                align="flex-start"
                gap={4}
            >
                <Box>
                    <Text
                        fontSize="lg"
                        fontWeight="700"
                        color="gray.800"
                    >
                        Order Status
                    </Text>

                    <Text
                        mt={1}
                        fontSize="sm"
                        color="gray.500"
                    >
                        Current order distribution
                    </Text>
                </Box>

                <Box
                    px={3}
                    py={1.5}
                    bg="gray.50"
                    borderRadius="lg"
                >
                    <Text
                        fontSize="xs"
                        color="gray.500"
                        fontWeight="600"
                    >
                        ALL ORDERS
                    </Text>
                </Box>
            </Flex>

            <Flex
                mt={6}
                align="center"
                gap={6}
            >
                <Box
                    position="relative"
                    flexShrink={0}
                    w="125px"
                    h="125px"
                    borderRadius="full"
                    bg="gray.50"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Box
                        position="absolute"
                        inset="9px"
                        borderRadius="full"
                        bg="white"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="column"
                    >
                        <Text
                            fontSize="2xl"
                            fontWeight="750"
                            color="gray.800"
                            lineHeight="1"
                        >
                            {totalOrders}
                        </Text>

                        <Text
                            mt={1}
                            fontSize="xs"
                            color="gray.400"
                        >
                            Orders
                        </Text>
                    </Box>

                    <Box
                        position="absolute"
                        inset="0"
                        borderRadius="full"
                        border="8px solid"
                        borderColor="gray.100"
                    />

                    {totalOrders > 0 && (
                        <>
                            <Box
                                position="absolute"
                                inset="0"
                                borderRadius="full"
                                border="8px solid"
                                borderColor="green.400"
                                clipPath="polygon(0 0, 100% 0, 100% 100%, 0 100%)"
                                transform="rotate(-45deg)"
                            />

                            <Box
                                position="absolute"
                                inset="0"
                                borderRadius="full"
                                border="8px solid"
                                borderColor="transparent"
                                borderRightColor="orange.400"
                                transform="rotate(30deg)"
                            />

                            <Box
                                position="absolute"
                                inset="0"
                                borderRadius="full"
                                border="8px solid"
                                borderColor="transparent"
                                borderTopColor="purple.400"
                                transform="rotate(45deg)"
                            />

                            <Box
                                position="absolute"
                                inset="0"
                                borderRadius="full"
                                border="8px solid"
                                borderColor="transparent"
                                borderLeftColor="red.400"
                                transform="rotate(25deg)"
                            />
                        </>
                    )}
                </Box>

                <VStack
                    align="stretch"
                    gap={3}
                    flex="1"
                >
                    {statuses.map((status) => {
                        const Icon = status.icon;

                        return (
                            <Box key={status.label}>
                                <Flex
                                    justify="space-between"
                                    align="center"
                                    mb={1.5}
                                >
                                    <HStack gap={2}>
                                        <Circle
                                            size="28px"
                                            bg={`${status.color}.50`}
                                            color={`${status.color}.600`}
                                        >
                                            <Icon size={14} />
                                        </Circle>

                                        <Box>
                                            <Text
                                                fontSize="sm"
                                                fontWeight="600"
                                                color="gray.700"
                                            >
                                                {status.label}
                                            </Text>
                                        </Box>
                                    </HStack>

                                    <HStack gap={2}>
                                        <Text
                                            fontSize="sm"
                                            fontWeight="700"
                                            color="gray.800"
                                        >
                                            {status.count}
                                        </Text>

                                        <Text
                                            fontSize="xs"
                                            color="gray.400"
                                            minW="32px"
                                            textAlign="right"
                                        >
                                            {status.percentage}%
                                        </Text>
                                    </HStack>
                                </Flex>

                                <Progress.Root
                                    value={status.percentage}
                                    size="xs"
                                    colorPalette={status.color}
                                    borderRadius="full"
                                    bg="gray.100"
                                >
                                    <Progress.Track>
                                        <Progress.Range />
                                    </Progress.Track>
                                </Progress.Root>
                            </Box>
                        );
                    })}
                </VStack>
            </Flex>

            <Box
                mt={6}
                pt={4}
                borderTop="1px solid"
                borderColor="gray.100"
            >
                <Flex
                    justify="space-between"
                    align="center"
                >
                    <HStack gap={2}>
                        <Circle
                            size="8px"
                            bg="green.400"
                        />

                        <Text
                            fontSize="xs"
                            color="gray.500"
                        >
                            Completed orders
                        </Text>
                    </HStack>

                    <Text
                        fontSize="xs"
                        fontWeight="600"
                        color="gray.600"
                    >
                        {getPercentage(completedOrders)}%
                        of all orders
                    </Text>
                </Flex>
            </Box>
        </Box>
    );
};

export default OrderStatusOverview;